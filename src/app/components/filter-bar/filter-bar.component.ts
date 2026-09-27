import {
  Component,
  effect,
  input,
  output,
  signal,
  computed,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  FilterBarConfig,
  FilterConfig,
  SelectFilterConfig,
  TextFilterConfig,
  PaginationFilterConfig,
} from './models/filter-config';

@Component({
  selector: 'app-filter-bar',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent<T extends Record<string, any>> {
  config = input.required<FilterBarConfig<T>>();
  initialValues = input<Partial<T>>();
  totalItems = input<number>(0);

  filterChange = output<T>();

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private form = signal<FormGroup | null>(null);
  private formDebounceTimer = signal<ReturnType<typeof setTimeout> | null>(null);
  private valueChangesSubscription: Subscription | null = null;

  textFields = computed(() => this.getFieldsByType('text'));
  selectFields = computed(() => this.getFieldsByType('select'));
  checkboxFields = computed(() => this.getFieldsByType('checkbox'));
  paginationField = computed(() =>
    this.config()
      .fields.find((f) => f.type === 'pagination') as
      | PaginationFilterConfig
      | undefined
  );

  selectFieldConfigs = computed(() => {
    const map = new Map<string, SelectFilterConfig>();
    for (const field of this.config().fields) {
      if (field.type === 'select') {
        map.set(field.key, field as SelectFilterConfig);
      }
    }
    return map;
  });

  formGroup = computed(() => this.form());

  constructor() {
    effect(() => {
      const cfg = this.config();
      this.initializeForm(cfg);
      this.setupFormValueListener();
    });

    this.destroyRef.onDestroy(() => {
      this.valueChangesSubscription?.unsubscribe();
      const timer = this.formDebounceTimer();
      if (timer) clearTimeout(timer);
    });
  }

  private initializeForm(cfg: FilterBarConfig<T>): void {
    const formControls: Record<string, any> = {};

    for (const field of cfg.fields) {
      if (field.type === 'pagination') {
        // Pagination maps to two real controls, `skip` and `limit`,
        // not a single control named after the field's own key.
        const pagination = field as PaginationFilterConfig;
        formControls['skip'] =
          this.initialValues()?.['skip' as keyof T] ??
          pagination.defaultSkip ??
          0;
        formControls['limit'] =
          this.initialValues()?.['limit' as keyof T] ??
          pagination.defaultLimit ??
          10;
        continue;
      }

      const defaultValue =
        this.initialValues()?.[field.key as keyof T] ??
        field.defaultValue ??
        this.getDefaultValue(field);

      formControls[field.key] = [defaultValue];
    }

    const newForm = this.fb.group(formControls);
    this.form.set(newForm);
    this.emitFilter();
  }

  private setupFormValueListener(): void {
    this.valueChangesSubscription?.unsubscribe();

    const currentForm = this.form();
    if (!currentForm) return;

    const debounceMs = this.config().debounceMs ?? 300;
    this.valueChangesSubscription = currentForm.valueChanges.subscribe(() => {
      const timer = this.formDebounceTimer();
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => {
        this.emitFilter();
      }, debounceMs);

      this.formDebounceTimer.set(newTimer);
    });
  }

  private emitFilter(): void {
    const currentForm = this.form();
    if (!currentForm) return;

    const value = currentForm.getRawValue();
    const filter = this.cleanFilter(value) as T;
    this.filterChange.emit(filter);
  }

  private cleanFilter(value: any): any {
    const cleaned: any = {};
    for (const [key, val] of Object.entries(value)) {
      if (
        val !== null &&
        val !== undefined &&
        val !== '' &&
        (!Array.isArray(val) || val.length > 0)
      ) {
        cleaned[key] = val;
      }
    }
    return cleaned;
  }

  private getDefaultValue(field: FilterConfig): any {
    switch (field.type) {
      case 'text':
        return '';
      case 'select':
        return [];
      case 'checkbox':
        return false;
      case 'pagination':
        return null;
      default:
        return null;
    }
  }

  private getFieldsByType(type: FilterConfig['type']): string[] {
    return this.config()
      .fields.filter((f) => f.type === type)
      .map((f) => f.key);
  }

  onClearFilters(): void {
    const currentForm = this.form();
    if (!currentForm) return;

    const resetValues = this.config().fields.reduce((acc, field) => {
      if (field.type === 'pagination') {
        acc['skip'] = field.defaultSkip ?? 0;
        acc['limit'] = field.defaultLimit ?? 10;
      } else {
        acc[field.key] = this.getDefaultValue(field);
      }
      return acc;
    }, {} as Record<string, any>);

    currentForm.reset(resetValues);
  }

  getFieldConfig(key: string): FilterConfig | undefined {
    return this.config().fields.find((f) => f.key === key);
  }

  getSelectOptions(key: string): { label: string; value: string }[] | undefined {
    return this.selectFieldConfigs().get(key)?.options;
  }

  onPageChange(event: PageEvent): void {
    const currentForm = this.form();
    if (!currentForm) return;

    currentForm.patchValue({
      skip: event.pageIndex * event.pageSize,
      limit: event.pageSize,
    });
  }

  getPageIndex(): number {
    const currentForm = this.form();
    const skip = currentForm?.get('skip')?.value ?? 0;
    const limit = currentForm?.get('limit')?.value ?? 10;
    return Math.floor(skip / limit);
  }

  getPageSize(): number {
    const currentForm = this.form();
    return currentForm?.get('limit')?.value ?? 10;
  }

  getPageSizeOptions(): number[] {
    return this.paginationField()?.pageSizeOptions ?? [10, 25, 50, 100];
  }

  getTextFieldPlaceholder(key: string): string {
    const config = this.config().fields.find((f) => f.key === key);
    if (config && config.type === 'text') {
      return (config as TextFilterConfig).placeholder || '';
    }
    return '';
  }

  getSelectFieldPlaceholder(key: string): string {
    const config = this.config().fields.find((f) => f.key === key);
    if (config && config.type === 'select') {
      return (config as SelectFilterConfig).placeholder || '';
    }
    return '';
  }
}
