# Filter Bar Component Documentation

## Overview

The `FilterBarComponent` is a generic, reusable component that creates dynamic filter forms for server-side filtering. It's completely decoupled from specific filter interfaces, making it easily extensible for any data model.

Built with **Angular Signals** for modern reactive state management.

## Key Features

- **Generic Type Support**: Works with any filter interface via TypeScript generics
- **Configuration-Driven**: No hardcoded logic; define filters via configuration objects
- **Reactive Emission**: Emits filter changes reactively as users interact with the form
- **No Client-Side Filtering**: Filter bar only emits filter objects; filtering happens server-side
- **Material Design**: Uses Angular Material for professional UI components
- **Built-in Pagination**: Includes pagination controls within the filter bar
- **Clear Filters Button**: Users can reset all filters to defaults with one click
- **Field Types**: Supports text inputs, multi-select, checkboxes, and pagination
- **Signal-Based**: Uses Angular Signals for efficient reactive state management
- **Modern Control Flow**: Uses `@if`, `@for` control flow syntax instead of `*ngIf`, `*ngFor`

## Component API

### Inputs

```typescript
config = input.required<FilterBarConfig<T>>();
```
The configuration object that defines all filter fields for type `T`. See [FilterBarConfig](#filterbarconfig) below.

```typescript
initialValues = input<Partial<T>>();
```
Optional initial values for the filter fields. Useful when loading with pre-selected filters.

### Outputs

```typescript
filterChange = output<T>();
```
Emits the complete filter object whenever any filter field changes. The emitted value is fully typed as `T`.

## Configuration Model

### FilterBarConfig<T>

The top-level configuration object:

```typescript
interface FilterBarConfig<T> {
  fields: FilterConfig[];
  defaultValues?: Partial<T>;
  debounceMs?: number;
}
```

- **fields**: Array of field configurations (see below)
- **defaultValues**: Default values for all fields when the form initializes
- **debounceMs**: Debounce delay for form value changes (default: 300ms)

### Field Types

#### TextFilterConfig
For text-based search/filter fields:
```typescript
interface TextFilterConfig extends BaseFilterConfig {
  type: 'text';
  label: string;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
}
```

#### SelectFilterConfig
For multi-select dropdown fields:
```typescript
interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string[];
  multiple?: boolean;
  placeholder?: string;
}
```

#### CheckboxFilterConfig
For boolean checkbox fields:
```typescript
interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  label: string;
  defaultValue?: boolean;
}
```

#### PaginationFilterConfig
For pagination controls:
```typescript
interface PaginationFilterConfig extends BaseFilterConfig {
  type: 'pagination';
  defaultSkip?: number;
  defaultLimit?: number;
}
```

## Usage Examples

### Basic Usage with SecuritiesFilter

1. **Create a filter configuration factory** (recommended approach):

```typescript
// src/app/components/filter-bar/utils/my-filter-config.ts
import { FilterBarConfig } from '../models/filter-config';

export function createMyFilterConfig(): FilterBarConfig<MyFilter> {
  return {
    fields: [
      {
        type: 'text',
        key: 'name',
        label: 'Name',
        placeholder: 'Search by name...',
        defaultValue: '',
      },
      {
        type: 'select',
        key: 'categories',
        label: 'Categories',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Books', value: 'books' },
        ],
        defaultValue: [],
        multiple: true,
      },
      {
        type: 'checkbox',
        key: 'inStock',
        label: 'In Stock Only',
        defaultValue: false,
      },
      {
        type: 'pagination',
        key: 'pagination',
        defaultSkip: 0,
        defaultLimit: 10,
      },
    ],
    defaultValues: {
      skip: 0,
      limit: 10,
    },
    debounceMs: 300,
  };
}
```

2. **Use the filter bar in your component with signals**:

```typescript
@Component({
  selector: 'app-my-list',
  imports: [FilterBarComponent, ...],
})
export class MyListComponent implements OnInit {
  private myService = inject(MyService);
  
  // Signal-based filter state
  protected currentFilter = signal<MyFilter>({ skip: 0, limit: 10 });
  
  // Observable from signal for async pipe support
  protected filteredData$ = toObservable(this.currentFilter).pipe(
    switchMap(filter => this.myService.getItems(filter))
  );
  
  protected filterConfig = signal<FilterBarConfig<MyFilter> | null>(null);
  
  ngOnInit() {
    this.filterConfig.set(createMyFilterConfig());
  }
  
  onFilterChange(filter: MyFilter) {
    this.currentFilter.set(filter);  // Update signal
  }
}
```

3. **Add the filter bar to your template**:

```html
@if (filterConfig(); as config) {
  <app-filter-bar 
    [config]="config"
    (filterChange)="onFilterChange($event)"
  ></app-filter-bar>
}

<table>
  <!-- Your table or list here -->
</table>
```

## Signals-Based Architecture

The FilterBarComponent uses Angular Signals for:

- **State Management**: `form` signal holds the FormGroup
- **Computed Properties**: `textFields`, `selectFields`, `checkboxFields` are computed based on config
- **Reactive Updates**: Effects handle form value changes and debouncing
- **Efficient Change Detection**: Signals provide fine-grained reactivity without full component re-renders

### Key Signals

```typescript
// Internal form state
private form = signal<FormGroup | null>(null);

// Computed field categorizations
textFields = computed(() => this.getFieldsByType('text'));
selectFields = computed(() => this.getFieldsByType('select'));
checkboxFields = computed(() => this.getFieldsByType('checkbox'));

// Computed pagination config
paginationField = computed(() => 
  this.config().fields.find(f => f.type === 'pagination')
);
```

## Extensibility Guide

### When SecuritiesFilter Changes

The beauty of this architecture is that extending the filter is straightforward:

**Before:** Filter interface has `name`, `types`, `currencies`, `isPrivate`

**After:** Add a new field like `minPrice?: number`

**To extend:**

1. Update the `SecuritiesFilter` interface:
```typescript
export interface SecuritiesFilter extends PagingFilter {
  name?: string;
  types?: string[];
  currencies?: string[];
  isPrivate?: boolean;
  minPrice?: number;  // NEW
}
```

2. Update the config factory:
```typescript
export function createSecuritiesFilterConfig(...) {
  return {
    fields: [
      // ... existing fields ...
      {
        type: 'text',
        key: 'minPrice',
        label: 'Minimum Price',
        placeholder: 'Enter minimum price...',
        defaultValue: '',
      },
    ],
    // ... rest of config
  };
}
```

3. **No component code changes needed!** The FilterBarComponent automatically handles the new field.

### Creating Filters for New Interfaces

To use FilterBarComponent with a completely different interface:

1. Define your filter interface:
```typescript
export interface ProductFilter extends PagingFilter {
  name?: string;
  category?: string;
  inStock?: boolean;
}
```

2. Create a configuration factory:
```typescript
export function createProductFilterConfig(): FilterBarConfig<ProductFilter> {
  // Define your fields following the examples above
}
```

3. Use in your component exactly like the example above (just with your config factory)

The FilterBarComponent works identically for any filter interface!

## Type Safety

The component is fully generic and type-safe. When you specify `FilterBarComponent<SecuritiesFilter>`, the emitted `filterChange` events are typed as `SecuritiesFilter`, providing full TypeScript intellisense:

```typescript
// This is fully typed - TypeScript knows the filter shape
onFilterChange(filter: SecuritiesFilter) {
  // filter.name, filter.types, etc. are all recognized
  this.myService.getSecurities(filter);
}
```

## Server-Side Integration

The filter bar emits complete filter objects ready for server-side use:

```typescript
// In your service
getSecurities(filter: SecuritiesFilter): Observable<Security[]> {
  // Pass filter directly to HTTP call
  return this.http.post<Security[]>('/api/securities/search', filter);
}
```

## Modern Angular Patterns

This component leverages modern Angular v22+ features:

- **input() / output()**: Standalone input/output API instead of `@Input`/`@Output` decorators
- **Signals**: `signal()`, `computed()`, `effect()` for reactive state
- **Control Flow**: `@if`, `@for` instead of `*ngIf`, `*ngFor`
- **toObservable()**: Bridge signals and observables for async pipe support
- **ChangeDetectionStrategy.OnPush**: Enabled by default with signals

## Advanced: Custom Field Rendering

If you need custom rendering for a field type beyond text, select, and checkbox, you can:

1. Add a new field type to `FilterFieldType`
2. Add a new interface extending `BaseFilterConfig`
3. Update the FilterBarComponent template with `@if (field.type === 'custom')`
4. Implement your custom component or template logic

Example for a date range picker:

```typescript
export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'dateRange';
  label: string;
  minDate?: Date;
  maxDate?: Date;
}

// Then in the template:
// @if (field.type === 'dateRange') {
//   <app-date-range-picker ...></app-date-range-picker>
// }
```

## Performance Considerations

- **Debouncing**: Text input changes are debounced by default (300ms) to avoid excessive server calls
- **Reactive Updates**: Filter changes trigger server requests automatically via `switchMap`
- **Signals**: Provides fine-grained reactivity with minimal re-renders
- **Computed Properties**: Field categorization is memoized and only recomputes when config changes
- **OnPush Detection**: Component uses `ChangeDetectionStrategy.OnPush` for efficiency

## Best Practices

1. **Use configuration factories**: Create a factory function for each filter interface (like `createSecuritiesFilterConfig`)
2. **Extract dynamic options**: If select options come from the server, inject them into the factory
3. **Handle loading states**: Use signals in your parent component for loading indicators
4. **Validate on server**: The filter bar emits unvalidated user input; validate server-side
5. **Use computed()**: For derived filter state in parent components
6. **Leverage toObservable()**: To bridge signals and RxJS for async pipe support

## Troubleshooting

### Filter changes not triggering?
- Check that `(filterChange)="onFilterChange($event)"` is bound in the template
- Verify the parent component's filter signal is being updated via `set()`

### Multi-select not showing values?
- Ensure the form control is initialized with `defaultValue: []`
- Verify the options array has the correct shape: `{ label: string, value: string }`

### Pagination not working?
- Ensure `skip` and `limit` fields are in your filter config with type `'pagination'`
- Verify your service respects `skip` and `limit` parameters

## Migration from RxJS to Signals

If you have existing filter code using BehaviorSubject:

**Before:**
```typescript
// Old approach - RxJS subjects
private filterSubject = new BehaviorSubject<SecuritiesFilter>({ skip: 0, limit: 10 });
securities$ = this.filterSubject.pipe(switchMap(f => this.service.get(f)));

onFilterChange(filter: SecuritiesFilter) {
  this.filterSubject.next(filter);
}
```

**After:**
```typescript
// New approach - Signals
protected currentFilter = signal<SecuritiesFilter>({ skip: 0, limit: 10 });
protected securities$ = toObservable(this.currentFilter).pipe(
  switchMap(f => this.service.get(f))
);

onFilterChange(filter: SecuritiesFilter) {
  this.currentFilter.set(filter);
}
```

Much cleaner and more performant with signals!


## Configuration Model

### FilterBarConfig<T>

The top-level configuration object:

```typescript
interface FilterBarConfig<T> {
  fields: FilterConfig[];
  defaultValues?: Partial<T>;
  debounceMs?: number;
}
```

- **fields**: Array of field configurations (see below)
- **defaultValues**: Default values for all fields when the form initializes
- **debounceMs**: Debounce delay for form value changes (default: 300ms)

### Field Types

#### TextFilterConfig
For text-based search/filter fields:
```typescript
interface TextFilterConfig extends BaseFilterConfig {
  type: 'text';
  label: string;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
}
```

#### SelectFilterConfig
For multi-select dropdown fields:
```typescript
interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string[];
  multiple?: boolean;
  placeholder?: string;
}
```

#### CheckboxFilterConfig
For boolean checkbox fields:
```typescript
interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  label: string;
  defaultValue?: boolean;
}
```

#### PaginationFilterConfig
For pagination controls:
```typescript
interface PaginationFilterConfig extends BaseFilterConfig {
  type: 'pagination';
  defaultSkip?: number;
  defaultLimit?: number;
}
```

## Usage Examples

### Basic Usage with SecuritiesFilter

1. **Create a filter configuration factory** (recommended approach):

```typescript
// src/app/components/filter-bar/utils/my-filter-config.ts
import { FilterBarConfig } from '../models/filter-config';

export function createMyFilterConfig(): FilterBarConfig<MyFilter> {
  return {
    fields: [
      {
        type: 'text',
        key: 'name',
        label: 'Name',
        placeholder: 'Search by name...',
        defaultValue: '',
      },
      {
        type: 'select',
        key: 'categories',
        label: 'Categories',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Books', value: 'books' },
        ],
        defaultValue: [],
        multiple: true,
      },
      {
        type: 'checkbox',
        key: 'inStock',
        label: 'In Stock Only',
        defaultValue: false,
      },
      {
        type: 'pagination',
        key: 'pagination',
        defaultSkip: 0,
        defaultLimit: 10,
      },
    ],
    defaultValues: {
      skip: 0,
      limit: 10,
    },
    debounceMs: 300,
  };
}
```

2. **Use the filter bar in your component**:

```typescript
@Component({
  selector: 'app-my-list',
  imports: [FilterBarComponent, ...],
})
export class MyListComponent implements OnInit {
  private myService = inject(MyService);
  private filterSubject = new BehaviorSubject<MyFilter>({ skip: 0, limit: 10 });
  
  filteredData$ = this.filterSubject.pipe(
    switchMap(filter => this.myService.getItems(filter))
  );
  
  filterConfig!: FilterBarConfig<MyFilter>;
  
  ngOnInit() {
    this.filterConfig = createMyFilterConfig();
  }
  
  onFilterChange(filter: MyFilter) {
    this.filterSubject.next(filter);
  }
}
```

3. **Add the filter bar to your template**:

```html
<app-filter-bar 
  [config]="filterConfig"
  (filterChange)="onFilterChange($event)"
></app-filter-bar>

<table>
  <!-- Your table or list here -->
</table>
```

## Extensibility Guide

### When SecuritiesFilter Changes

The beauty of this architecture is that extending the filter is straightforward:

**Before:** Filter interface has `name`, `types`, `currencies`, `isPrivate`

**After:** Add a new field like `minPrice?: number`

**To extend:**

1. Update the `SecuritiesFilter` interface:
```typescript
export interface SecuritiesFilter extends PagingFilter {
  name?: string;
  types?: string[];
  currencies?: string[];
  isPrivate?: boolean;
  minPrice?: number;  // NEW
}
```

2. Update the config factory:
```typescript
export function createSecuritiesFilterConfig(...) {
  return {
    fields: [
      // ... existing fields ...
      {
        type: 'text',
        key: 'minPrice',
        label: 'Minimum Price',
        placeholder: 'Enter minimum price...',
        defaultValue: '',
      },
    ],
    // ... rest of config
  };
}
```

3. **No component code changes needed!** The FilterBarComponent automatically handles the new field.

### Creating Filters for New Interfaces

To use FilterBarComponent with a completely different interface:

1. Define your filter interface:
```typescript
export interface ProductFilter extends PagingFilter {
  name?: string;
  category?: string;
  inStock?: boolean;
}
```

2. Create a configuration factory:
```typescript
export function createProductFilterConfig(): FilterBarConfig<ProductFilter> {
  // Define your fields following the examples above
}
```

3. Use in your component exactly like the example above (just with your config factory)

The FilterBarComponent works identically for any filter interface!

## Type Safety

The component is fully generic and type-safe. When you specify `FilterBarComponent<SecuritiesFilter>`, the emitted `filterChange` events are typed as `SecuritiesFilter`, providing full TypeScript intellisense:

```typescript
// This is fully typed - TypeScript knows the filter shape
onFilterChange(filter: SecuritiesFilter) {
  // filter.name, filter.types, etc. are all recognized
  this.myService.getSecurities(filter);
}
```

## Server-Side Integration

The filter bar emits complete filter objects ready for server-side use:

```typescript
// In your service
getSecurities(filter: SecuritiesFilter): Observable<Security[]> {
  // Pass filter directly to HTTP call
  return this.http.post<Security[]>('/api/securities/search', filter);
}
```

## Advanced: Custom Field Rendering

If you need custom rendering for a field type beyond text, select, and checkbox, you can:

1. Add a new field type to `FilterFieldType`
2. Add a new interface extending `BaseFilterConfig`
3. Update the FilterBarComponent template with `*ngIf="field.type === 'custom'"`
4. Implement your custom component or template logic

Example for a date range picker:

```typescript
export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'dateRange';
  label: string;
  minDate?: Date;
  maxDate?: Date;
}

// Then in the template:
// <app-date-range-picker *ngIf="field.type === 'dateRange'" ...></app-date-range-picker>
```

## Performance Considerations

- **Debouncing**: Text input changes are debounced by default (300ms) to avoid excessive server calls
- **Reactive Updates**: Filter changes trigger server requests automatically via `switchMap`
- **Form Control**: Uses Angular's Reactive Forms for optimal performance
- **OnPush Detection**: Component uses `ChangeDetectionStrategy.OnPush` for efficiency

## Best Practices

1. **Use configuration factories**: Create a factory function for each filter interface (like `createSecuritiesFilterConfig`)
2. **Extract dynamic options**: If select options come from the server, inject them into the factory
3. **Handle loading states**: Use the loading observable in your parent component for loading spinners
4. **Validate on server**: The filter bar emits unvalidated user input; validate server-side
5. **Version your configs**: If you need multiple filter sets, keep them in separate factory functions

## Troubleshooting

### Filter changes not triggering?
- Check that `(filterChange)="onFilterChange($event)"` is bound in the template
- Verify the parent component's filter handler is calling `next()` on the filter subject

### Multi-select not showing values?
- Ensure the form control is initialized with `defaultValue: []`
- Verify the options array has the correct shape: `{ label: string, value: string }`

### Pagination not working?
- Ensure `skip` and `limit` fields are in your filter config with type `'pagination'`
- Verify your service respects `skip` and `limit` parameters

## Migration from Manual Filters

If you have existing filter code:

**Before:**
```typescript
// Old approach - hardcoded fields
filterForm = this.fb.group({
  name: [''],
  type: [[]],
  currency: [[]],
  isPrivate: [false],
  skip: [0],
  limit: [10],
});
```

**After:**
```typescript
// New approach - config-driven
filterConfig = createSecuritiesFilterConfig(types, currencies);
```

Much cleaner and more maintainable!
