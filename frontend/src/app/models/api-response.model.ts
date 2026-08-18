export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;

  totalPages?: number;
  totalElement?: number;

  timestamp?: string;
}
