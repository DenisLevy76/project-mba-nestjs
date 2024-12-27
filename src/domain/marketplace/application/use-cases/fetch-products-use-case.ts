import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { Either, left, right } from '@/core/either'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface IFetchProductsRequest {
  page?: number
  itemsPerPage?: number
  orderBy?: 'latest' | 'alphabetic'
  filters?: {
    status?: ProductStatus
    ownerId?: string
  }
}

type TFetchProductsResponse = Either<
  ResourceNotFoundError,
  IPaginatedResponse<Product[]>
>

export class FetchProductsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private sellerRepository: ISellerRepository,
  ) {}

  async execute({
    page = 1,
    itemsPerPage = 10,
    orderBy = 'latest',
    filters,
  }: IFetchProductsRequest): Promise<TFetchProductsResponse> {
    if (filters && filters.ownerId) {
      const owner = await this.sellerRepository.findById(filters.ownerId)

      if (!owner) return left(new ResourceNotFoundError('Seller'))
    }
    const response = await this.productRepository.list({
      itemsPerPage,
      page,
      orderBy,
      filters,
    })

    return right(response)
  }
}
