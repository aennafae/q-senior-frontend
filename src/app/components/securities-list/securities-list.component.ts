import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Security } from '../../models/security';
import { SecuritiesFilter } from '../../models/securities-filter';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { createSecuritiesFilterConfig } from '../filter-bar/utils/securities-filter-config';
import { FilterBarConfig } from '../filter-bar/models/filter-config';
import { AsyncPipe } from '@angular/common';
import { indicate } from '../../utils';

@Component({
  selector: 'securities-list',
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent implements OnInit {
  private static readonly DEFAULT_SKIP = 0;
  private static readonly DEFAULT_LIMIT = 10;

  private _securityService = inject(SecurityService);

  protected currentFilter = signal<SecuritiesFilter>({
    skip: SecuritiesListComponent.DEFAULT_SKIP,
    limit: SecuritiesListComponent.DEFAULT_LIMIT,
  });

  private loadingSubject = new BehaviorSubject(false);
  protected isLoading$ = this.loadingSubject.asObservable();

  private response = toSignal(
    toObservable(this.currentFilter).pipe(
      switchMap((filter) =>
        this._securityService
          .getSecurities(filter)
          .pipe(indicate(this.loadingSubject))
      )
    ),
    { initialValue: { items: [] as Security[], total: 0 } }
  );

  protected securities = computed(() => this.response().items);
  protected totalItems = computed(() => this.response().total);

  protected displayedColumns = computed(() => ['name', 'type', 'currency']);

  protected filterConfig = signal<FilterBarConfig<SecuritiesFilter> | null>(
    null
  );

  ngOnInit(): void {
    this.initializeFilterConfig();
  }

  private initializeFilterConfig(): void {
    const availableTypes = [
      'BankAccount',
      'Closed-endFund',
      'Collectible',
      'DirectHolding',
      'Equity',
      'Generic',
      'Loan',
      'RealEstate',
    ];
    const availableCurrencies = ['EUR', 'GBP', 'USD'];
    this.filterConfig.set(
      createSecuritiesFilterConfig(
        availableTypes,
        availableCurrencies,
        undefined,
        SecuritiesListComponent.DEFAULT_LIMIT
      )
    );
  }

  onFilterChange(filter: SecuritiesFilter): void {
    this.currentFilter.set(filter);
  }
}
