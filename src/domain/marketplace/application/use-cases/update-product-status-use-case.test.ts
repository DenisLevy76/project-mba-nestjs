import { makeProduct } from 'test/factories/make-product'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateProductStatusUseCase } from './update-product-status-use-case'

describe('UpdateProductStatusUseCase', () => {
  let productRepository: IProductRepository
  let sellerRepository: ISellerRepository
  let sut: UpdateProductStatusUseCase

  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sellerRepository = new InMemorySellersRepository()
    sut = new UpdateProductStatusUseCase(productRepository, sellerRepository)
  })

  it('should update the product status successfully', async () => {
    const seller = makeSeller()
    const product = makeProduct({
      ownerId: seller.id,
      status: ProductStatus.available,
    })

    sellerRepository.create(seller)
    productRepository.create(product)

    const response = await sut.execute({
      ownerId: seller.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.sold,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.product.status).toBe(ProductStatus.sold)
    }
  })

  it('should return an error if the seller does not exist', async () => {
    const product = makeProduct()
    productRepository.create(product)

    const response = await sut.execute({
      ownerId: 'non-existent-owner-id',
      productId: product.id.toString(),
      status: ProductStatus.sold,
    })

    expect(response.isLeft()).toBe(true)
    if (response.isLeft()) {
      expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should return an error if the product does not exist', async () => {
    const seller = makeSeller()
    sellerRepository.create(seller)

    const response = await sut.execute({
      ownerId: seller.id.toString(),
      productId: 'non-existent-product-id',
      status: ProductStatus.sold,
    })

    expect(response.isLeft()).toBe(true)
    if (response.isLeft()) {
      expect(response.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should return an error if the product does not belong to the seller', async () => {
    const seller1 = makeSeller()
    const seller2 = makeSeller()
    const product = makeProduct({
      ownerId: seller2.id,
      status: ProductStatus.available,
    })

    sellerRepository.create(seller1)
    sellerRepository.create(seller2)
    productRepository.create(product)

    const response = await sut.execute({
      ownerId: seller1.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.sold,
    })

    expect(response.isLeft()).toBe(true)
    if (response.isLeft()) {
      expect(response.value).toBeInstanceOf(NotAllowedError)
    }
  })

  it('should return an error if the product already has sold out and try to change the status to canceled', async () => {
    const seller1 = makeSeller()
    const product = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.sold,
    })

    sellerRepository.create(seller1)
    productRepository.create(product)

    const response = await sut.execute({
      ownerId: seller1.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.cancelled,
    })

    expect(response.isLeft()).toBe(true)
    if (response.isLeft()) {
      expect(response.value).toBeInstanceOf(NotAllowedError)
    }
  })

  it('should return an error if the product was canceled and try change the status to sold', async () => {
    const seller1 = makeSeller()
    const product = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.cancelled,
    })

    sellerRepository.create(seller1)
    productRepository.create(product)

    const response = await sut.execute({
      ownerId: seller1.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.sold,
    })

    expect(response.isLeft()).toBe(true)
    if (response.isLeft()) {
      expect(response.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
