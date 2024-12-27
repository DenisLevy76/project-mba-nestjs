import { makeProduct } from 'test/factories/make-product'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'

import { ProductStatus } from '../../enterprise/entities/enums/product-status'
import { IProductRepository } from '../repositories/product-repository'
import { ISellerRepository } from '../repositories/seller-repository'
import { FetchProductsUseCase } from './fetch-products-use-case'

describe('CreateSellerUseCase', () => {
  let productRepository: IProductRepository
  let sellerRepository: ISellerRepository
  let sut: FetchProductsUseCase

  beforeEach(() => {
    sellerRepository = new InMemorySellersRepository()
    productRepository = new InMemoryProductRepository()
    sut = new FetchProductsUseCase(productRepository, sellerRepository)
  })

  it('should list all products.', async () => {
    Array.from({ length: 3 }).forEach(() => {
      const product = makeProduct()

      productRepository.create(product)
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.data).toHaveLength(3)
    }
  })

  it('should list products ordered from most recent to oldest.', async () => {
    const olderProduct = makeProduct({ createdAt: new Date('2023-01-01') })
    const middleProduct = makeProduct({ createdAt: new Date('2023-06-01') })
    const recentProduct = makeProduct({ createdAt: new Date('2023-12-01') })

    productRepository.create(olderProduct)
    productRepository.create(middleProduct)
    productRepository.create(recentProduct)

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      const products = response.value.data

      expect(products).toHaveLength(3)
      expect(products[0].createdAt).toBe(recentProduct.createdAt)
      expect(products[1].createdAt).toBe(middleProduct.createdAt)
      expect(products[2].createdAt).toBe(olderProduct.createdAt)
    }
  })

  it('should list products ordered from most recent to oldest.', async () => {
    const product1 = makeProduct({ status: ProductStatus.cancelled })
    const product2 = makeProduct({ status: ProductStatus.sold })
    const product3 = makeProduct({ status: ProductStatus.sold })
    const product4 = makeProduct({ status: ProductStatus.available })
    const product5 = makeProduct({ status: ProductStatus.available })

    productRepository.create(product1)
    productRepository.create(product2)
    productRepository.create(product3)
    productRepository.create(product4)
    productRepository.create(product5)

    const response = await sut.execute({
      filters: { status: ProductStatus.sold },
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      const products = response.value.data

      expect(products).toHaveLength(2)
    }
  })

  it('should list products off a seller.', async () => {
    const seller1 = makeSeller()
    const seller2 = makeSeller()
    const seller3 = makeSeller()

    sellerRepository.create(seller1)
    sellerRepository.create(seller2)
    sellerRepository.create(seller3)

    const product1 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.cancelled,
    })
    const product2 = makeProduct({
      ownerId: seller2.id,
      status: ProductStatus.sold,
    })
    const product3 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.sold,
    })
    const product4 = makeProduct({
      ownerId: seller3.id,
      status: ProductStatus.available,
    })
    const product5 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.available,
    })

    productRepository.create(product1)
    productRepository.create(product2)
    productRepository.create(product3)
    productRepository.create(product4)
    productRepository.create(product5)

    const response = await sut.execute({
      filters: { ownerId: seller1.id.toString() },
    })

    expect(response.isRight()).toBe(true)

    if (response.isRight()) {
      const products = response.value.data

      expect(products).toHaveLength(3)
    }
  })

  it('should not list products off a inexistent seller.', async () => {
    const seller1 = makeSeller()
    const seller2 = makeSeller()
    const seller3 = makeSeller()

    const product1 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.cancelled,
    })
    const product2 = makeProduct({
      ownerId: seller2.id,
      status: ProductStatus.sold,
    })
    const product3 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.sold,
    })
    const product4 = makeProduct({
      ownerId: seller3.id,
      status: ProductStatus.available,
    })
    const product5 = makeProduct({
      ownerId: seller1.id,
      status: ProductStatus.available,
    })

    productRepository.create(product1)
    productRepository.create(product2)
    productRepository.create(product3)
    productRepository.create(product4)
    productRepository.create(product5)

    const response = await sut.execute({
      filters: { ownerId: `seller1.id.toString()` },
    })

    expect(response.isLeft()).toBe(true)
  })
})
