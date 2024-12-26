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
    filters?: { status?: ProductStatus }
  }): Promise<IPaginatedResponse<Product[]>>
  findById(id: string): Promise<Product | null>
  save: (product: Product) => Promise<void>
}
