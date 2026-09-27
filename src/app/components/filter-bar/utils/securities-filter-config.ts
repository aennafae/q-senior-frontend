import { FilterBarConfig } from '../models/filter-config';
import { SecuritiesFilter } from '../../../models/securities-filter';

/**
 * Creates a default filter bar configuration for SecuritiesFilter
 * @param availableTypes - List of available security types
 * @param availableCurrencies - List of available currencies
 * @param pageSizeOptions - Selectable page sizes for pagination (default: [10, 25, 50, 100])
 * @param defaultLimit - Initial page size (default: 10)
 * @returns FilterBarConfig for SecuritiesFilter
 */
export function createSecuritiesFilterConfig(
  availableTypes: string[],
  availableCurrencies: string[],
  pageSizeOptions: number[] = [10, 25, 50, 100],
  defaultLimit: number = pageSizeOptions[0] ?? 10
): FilterBarConfig<SecuritiesFilter> {
  return {
    fields: [
      {
        type: 'text',
        key: 'name',
        label: 'Name',
        placeholder: 'Search by name...',
        defaultValue: '',
        debounceMs: 300,
      },
      {
        type: 'select',
        key: 'types',
        label: 'Types',
        options: availableTypes.map((type) => ({
          label: type,
          value: type,
        })),
        defaultValue: [],
        multiple: true,
        placeholder: 'Select types...',
      },
      {
        type: 'select',
        key: 'currencies',
        label: 'Currencies',
        options: availableCurrencies.map((currency) => ({
          label: currency,
          value: currency,
        })),
        defaultValue: [],
        multiple: true,
        placeholder: 'Select currencies...',
      },
      {
        type: 'checkbox',
        key: 'isPrivate',
        label: 'Private Securities Only',
        defaultValue: false,
      },
      {
        type: 'pagination',
        key: 'pagination',
        label: 'Pagination',
        defaultSkip: 0,
        defaultLimit,
        pageSizeOptions,
      },
    ],
    defaultValues: {
      skip: 0,
      limit: defaultLimit,
    },
    debounceMs: 300,
  };
}
