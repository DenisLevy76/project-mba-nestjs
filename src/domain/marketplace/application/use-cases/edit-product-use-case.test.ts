import { makeCategory } from 'test/factories/make-category'
import { makeProduct } from 'test/factories/make-product'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { ICategoryRepository } from '../repositories/category-repository'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { EditProductUseCase } from './edit-product-use-case'
import { NotAllowedError } from './errors/not-allowed-error'
import { ProductAlreadySoldOutError } from './errors/product-already-sold-out-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('CreateSellerUseCase', () => {
  let sellerRepository: ISellerRepository
  let categoryRepository: ICategoryRepository
  let productRepository: IProductRepository
  let sut: EditProductUseCase

  beforeEach(() => {
    sellerRepository = new InMemorySellersRepository()
    categoryRepository = new InMemoryCategoryRepository()
    productRepository = new InMemoryProductRepository()
    sut = new EditProductUseCase(
      sellerRepository,
      productRepository,
      categoryRepository,
    )
  })

  it('should not edit o inexistent product.', async () => {
    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: 'category-1',
      ownerId: 'non-existent-seller',
      status: ProductStatus.available,
      productId: 'balela',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not edit a product with a inexistent category.', async () => {
    const owner = makeSeller()
    const product = makeProduct({
      ownerId: owner.id,
      categoryId: new UniqueEntityID('inexistent-category'),
    })

    await productRepository.create(product)
    await sellerRepository.create(owner)

    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: 'category-1',
      ownerId: 'non-existent-seller',
      status: ProductStatus.available,
      productId: 'balela',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not edit a product with a inexistent owner.', async () => {
    const category = makeCategory()
    const product = makeProduct({
      ownerId: new UniqueEntityID('inexistent-owner'),
      categoryId: category.id,
    })

    await productRepository.create(product)
    await categoryRepository.create(category)

    const response = await sut.execute({
      name: 'Product A',
      description: 'Description A',
      priceInCents: 1000,
      categoryId: 'category-1',
      ownerId: 'non-existent-seller',
      status: ProductStatus.available,
      productId: 'balela',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not edit a product of another seller.', async () => {
    const seller = makeSeller()
    const owner = makeSeller()
    const category = makeCategory()
    const product = makeProduct({
      ownerId: owner.id,
      categoryId: category.id,
    })

    await sellerRepository.create(owner)
    await sellerRepository.create(seller)
    await productRepository.create(product)
    await categoryRepository.create(category)

    const response = await sut.execute({
      productId: product.id.toString(),
      ownerId: seller.id.toString(),
      categoryId: product.categoryId.toString(),
      name: 'Product A',
      description: 'Description A',
      priceInCents: 2000,
      status: ProductStatus.sold,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not edit a product with sold status.', async () => {
    const owner = makeSeller()
    const category = makeCategory()
    const product = makeProduct({
      ownerId: owner.id,
      categoryId: category.id,
      status: ProductStatus.sold,
    })

    await sellerRepository.create(owner)
    await productRepository.create(product)
    await categoryRepository.create(category)

    const response = await sut.execute({
      productId: product.id.toString(),
      ownerId: owner.id.toString(),
      categoryId: product.categoryId.toString(),
      name: 'Product A',
      description: 'Description A',
      priceInCents: 2000,
      status: ProductStatus.available,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ProductAlreadySoldOutError)
  })

  it('should edit o existent product.', async () => {
    const owner = makeSeller()
    const category = makeCategory()
    const product = makeProduct({ ownerId: owner.id, categoryId: category.id })

    await productRepository.create(product)
    await categoryRepository.create(category)
    await sellerRepository.create(owner)

    const response = await sut.execute({
      productId: product.id.toString(),
      ownerId: owner.id.toString(),
      categoryId: product.categoryId.toString(),
      name: 'Product A',
      description: 'Description A',
      priceInCents: 2000,
      status: ProductStatus.sold,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.product.name).toBe('Product A')
      expect(response.value.product.description).toBe('Description A')
      expect(response.value.product.priceInCents).toBe(2000)
      expect(response.value.product.status).toBe(ProductStatus.sold)
    }
  })
})
