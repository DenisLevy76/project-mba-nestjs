import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { ICategoryRepository } from '../repositories/category-repository'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { InvalidPriceError } from './errors/invalid-price-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { ProductAlreadySoldOutError } from './errors/product-already-sold-out-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface IEditProductRequest {
  productId: string
  ownerId: string
  name?: string
  description?: string
  priceInCents?: number
  categoryId?: string
  status?: ProductStatus
}

type TEditProductResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | InvalidPriceError
  | ProductAlreadySoldOutError,
  { product: Product }
>

export class EditProductUseCase {
  constructor(
    private sellerRepository: ISellerRepository,
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    categoryId,
    description,
    name,
    ownerId,
    priceInCents,
    productId,
    status,
  }: Partial<IEditProductRequest>): Promise<TEditProductResponse> {
    if (priceInCents < 0) return left(new InvalidPriceError())

    const seller = await this.sellerRepository.findById(ownerId)
    if (!seller) return left(new ResourceNotFoundError('User'))

    const product = await this.productRepository.findById(productId)
    if (!product) return left(new ResourceNotFoundError('Product'))
    if (product.ownerId.toString() !== ownerId)
      return left(new NotAllowedError())

    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError('Category'))
    }

    if (product.status === ProductStatus.sold)
      return left(new ProductAlreadySoldOutError())

    product.priceInCents = priceInCents
    product.name = name
    product.description = description
    product.categoryId = new UniqueEntityID(categoryId)
    product.status = status

    await this.productRepository.save(product)

    return right({ product })
  }
}
