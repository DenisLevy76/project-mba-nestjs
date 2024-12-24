import { makeCategory } from 'test/factories/make-category'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { Product } from '../../enterprise/entities/product'
import { ICategoryRepository } from '../repositories/category-repository'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { CreateProductUseCase } from './create-product-use-case'
import { InvalidPriceError } from './errors/invalid-price-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('CreateSellerUseCase', () => {
  let sellerRepository: ISellerRepository
  let categoryRepository: ICategoryRepository
  let productRepository: IProductRepository
  let sut: CreateProductUseCase

  beforeEach(() => {
    sellerRepository = new InMemorySellersRepository()
    categoryRepository = new InMemoryCategoryRepository()
    productRepository = new InMemoryProductRepository()
    sut = new CreateProductUseCase(
      sellerRepository,
      productRepository,
      categoryRepository,
    )
  })

  it('should return an error if the seller does not exist', async () => {
    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: 'category-1',
      ownerId: 'non-existent-seller',
      status: ProductStatus.available,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the category does not exist', async () => {
    const seller = makeSeller()
    sellerRepository.db.push(seller)

    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: 'non-existent-category',
      ownerId: 'seller-1',
      status: ProductStatus.available,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should create a product successfully when all conditions are met', async () => {
    const seller = makeSeller()
    sellerRepository.db.push(seller)

    const category = makeCategory()
    categoryRepository.db.push(category)

    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: category.id.toString(),
      ownerId: seller.id.toString(),
      status: ProductStatus.available,
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      const { product } = response.value
      expect(product).toBeInstanceOf(Product)
      expect(product.name).toBe('Product A')
      expect(product.description).toBe('Description A')
      expect(product.priceInCents).toBe(1000)
      expect(product.status).toBe(ProductStatus.available)
      expect(product.categoryId.toString()).toBe(category.id.toString())
      expect(product.ownerId.toString()).toBe(seller.id.toString())

      expect(productRepository.db).toHaveLength(1)
      expect(productRepository.db[0]).toEqual(product)
    }
  })

  it('should not create a product with negative price.', async () => {
    const seller = makeSeller()
    sellerRepository.db.push(seller)

    const category = makeCategory()
    categoryRepository.db.push(category)

    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: -1000,
      categoryId: category.id.toString(),
      ownerId: seller.id.toString(),
      status: ProductStatus.available,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidPriceError)
  })
})
