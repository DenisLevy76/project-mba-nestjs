import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { Either, right } from '@/core/either'

import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'

export interface IFetchProductsRequest {
  page?: number
  itemsPerPage?: number
  orderBy?: 'latest' | 'alphabetic'
}

type TFetchProductsResponse = Either<null, IPaginatedResponse<Product[]>>

export class FetchProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    page = 1,
    itemsPerPage = 10,
    orderBy = 'latest',
  }: IFetchProductsRequest): Promise<TFetchProductsResponse> {
    const response = await this.productRepository.list({
      itemsPerPage,
      page,
      orderBy,
    })

    return right(response)
  }
}
