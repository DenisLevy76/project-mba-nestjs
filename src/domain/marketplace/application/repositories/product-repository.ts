import { IPaginatedResponse } from '@/core/@types/paginated-response'

import { Product } from '../../enterprise/entities/product'

export interface IProductRepository {
  db: Product[]
  create(productProduct: Product): Promise<void>
  list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
    orderBy?: 'latest' | 'alphabetic'
  }): Promise<IPaginatedResponse<Product[]>>
  findById(id: string): Promise<Product | null>
  save: (product: Product) => Promise<void>
}
