import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { Either, right } from '@/core/either'

import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'

export interface ISearchProductsRequest {
  query: string
  page?: number
  itemsPerPage?: number
}

type TSearchProductsResponse = Either<null, IPaginatedResponse<Product[]>>

export class SearchProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    query,
    page = 1,
    itemsPerPage = 10,
  }: ISearchProductsRequest): Promise<TSearchProductsResponse> {
    const response = await this.productRepository.search({
      itemsPerPage,
      page,
      query,
    })

    return right(response)
  }
}
