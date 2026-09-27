import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { FilterBarConfig } from '../filter-bar/models/filter-config';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [MatProgressSpinner, MatTable, FilterBarComponent],
  templateUrl: './filterable-table.component.html',
  styleUrls: ['./filterable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<
  T,
  TFilter extends Record<string, any> = Record<string, any>
> implements AfterContentInit
{
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;

  @Input() filterConfig: FilterBarConfig<TFilter> | null = null;
  @Input() totalItems = 0;
  @Output() filterChange = new EventEmitter<TFilter>();

  onFilterChange(filter: TFilter): void {
    this.filterChange.emit(filter);
  }

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef)
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef)
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
}
