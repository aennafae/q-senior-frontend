/**
 * Base configuration for a filter field
 */
export type FilterFieldType = 'text' | 'select' | 'checkbox' | 'pagination';

export interface BaseFilterConfig {
  type: FilterFieldType;
  key: string;
  label?: string;
  defaultValue?: any;
}

/**
 * Text input filter (e.g., search by name)
 */
export interface TextFilterConfig extends BaseFilterConfig {
  type: 'text';
  label: string;
  defaultValue?: string;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Multi-select filter (e.g., types, currencies)
 */
export interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string[];
  multiple?: boolean;
  placeholder?: string;
}

/**
 * Checkbox filter (e.g., isPrivate)
 */
export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  label: string;
  defaultValue?: boolean;
}

/**
 * Pagination filter (skip and limit)
 */
export interface PaginationFilterConfig extends BaseFilterConfig {
  type: 'pagination';
  label?: string;
  defaultSkip?: number;
  defaultLimit?: number;
  pageSizeOptions?: number[];
}

export type FilterConfig =
  | TextFilterConfig
  | SelectFilterConfig
  | CheckboxFilterConfig
  | PaginationFilterConfig;

/**
 * Complete configuration for the filter bar
 * T is the filter type (e.g., SecuritiesFilter)
 */
export interface FilterBarConfig<T> {
  fields: FilterConfig[];
  defaultValues?: Partial<T>;
  debounceMs?: number;
}
