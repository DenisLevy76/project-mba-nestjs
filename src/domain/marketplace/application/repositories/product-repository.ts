import { IPaginatedResponse } from '@/core/@types/paginated-response'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'

export interface IProductRepository {
  db: Product[]
  create(productProduct: Product): Promise<void>
  list({
    page,
    itemsPerPage,
    filters,
    orderBy,
  }: {
    page: number
    itemsPerPage: number
    orderBy?: 'latest' | 'alphabetic'
    filters?: { status?: ProductStatus; ownerId?: string }
  }): Promise<IPaginatedResponse<Product[]>>
  findById(id: string): Promise<Product | null>
  search({
    query,
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
    query: string
  }): Promise<IPaginatedResponse<Product[]>>
  save: (product: Product) => Promise<void>
}
