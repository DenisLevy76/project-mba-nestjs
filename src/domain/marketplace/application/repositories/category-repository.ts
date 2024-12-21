import { IPaginatedResponse } from '@/core/@types/paginated-response'

import { Category } from '../../enterprise/entities/category'

export interface ICategoryRepository {
  db: Category[]
  create(category: Category): Promise<void>
  list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }): Promise<IPaginatedResponse<Category[]>>
  findById(id: string): Promise<Category | null>
}
