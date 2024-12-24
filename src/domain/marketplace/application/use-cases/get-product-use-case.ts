import { Either, left, right } from '@/core/either'

import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface ICreateSellerRequest {
  productId: string
}

type TCreateSellerResponse = Either<ResourceNotFoundError, { product: Product }>

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    productId,
  }: ICreateSellerRequest): Promise<TCreateSellerResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) return left(new ResourceNotFoundError('Product'))

    return right({ product })
  }
}
