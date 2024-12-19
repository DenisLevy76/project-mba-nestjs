export interface IPaginatedResponse<T> {
  data: T
  currentPage: number
  count: number
}
