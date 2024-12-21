import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { ICategoryRepository } from '../repositories/category-repository'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface ICreateProductRequest {
  name: string
  description: string
  priceInCents: number
  categoryId: string
  ownerId: string
  status: ProductStatus
}

type TCreateProductResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>

export class CreateProductUseCase {
  constructor(
    private sellerRepository: ISellerRepository,
    private productRepository: IProductRepository,
    private categoryRepository: ICategoryRepository,
  ) {}

  async execute({
    name,
    description,
    priceInCents,
    status,
    ownerId,
    categoryId,
  }: ICreateProductRequest): Promise<TCreateProductResponse> {
    const seller = await this.sellerRepository.findById(ownerId)
    if (!seller) return left(new ResourceNotFoundError('User'))

    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError('Category'))
    }

    const product = Product.create({
      categoryId: new UniqueEntityID(categoryId),
      ownerId: new UniqueEntityID(ownerId),
      name,
      description,
      priceInCents,
      status,
    })

    await this.productRepository.create(product)

    return right({ product })
  }
}
