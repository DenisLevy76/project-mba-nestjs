import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { Either, right } from '@/core/either'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'

export interface IFetchProductsRequest {
  page?: number
  itemsPerPage?: number
  orderBy?: 'latest' | 'alphabetic'
  filters?: {
    status?: ProductStatus
  }
}

type TFetchProductsResponse = Either<null, IPaginatedResponse<Product[]>>

export class FetchProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    page = 1,
    itemsPerPage = 10,
    orderBy = 'latest',
    filters,
  }: IFetchProductsRequest): Promise<TFetchProductsResponse> {
    const response = await this.productRepository.list({
      itemsPerPage,
      page,
      orderBy,
      filters,
    })

    return right(response)
  }
}
