import { Either, left, right } from '@/core/either'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface IUpdateProductStatusRequest {
  ownerId: string
  productId: string
  status: ProductStatus
}

type TUpdateProductStatusResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { product: Product }
>

export class UpdateProductStatusUseCase {
  constructor(
    private productRepository: IProductRepository,
    private sellerRepository: ISellerRepository,
  ) {}

  async execute({
    ownerId,
    productId,
    status,
  }: IUpdateProductStatusRequest): Promise<TUpdateProductStatusResponse> {
    const seller = await this.sellerRepository.findById(ownerId)

    if (!seller) return left(new ResourceNotFoundError('Seller'))

    const product = await this.productRepository.findById(productId)
    if (!product) return left(new ResourceNotFoundError('Product'))

    if (product.ownerId.toString() !== ownerId)
      return left(new NotAllowedError())

    if (
      product.status === ProductStatus.sold &&
      status === ProductStatus.cancelled
    )
      return left(new NotAllowedError())

    if (
      product.status === ProductStatus.cancelled &&
      status === ProductStatus.sold
    )
      return left(new NotAllowedError())

    product.status = status

    return right({ product })
  }
}
