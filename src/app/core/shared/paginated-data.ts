import { PaginatedDataParams } from './paginated-data-params';

export interface PaginatedData<T> extends PaginatedDataParams {
  count: number;
  items: T[];
}
