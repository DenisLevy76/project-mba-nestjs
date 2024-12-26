import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'

import { IProductRepository } from '../repositories/product-repository'
import { FetchProductsUseCase } from './fetch-products-use-case'

describe('CreateSellerUseCase', () => {
  let productRepository: IProductRepository
  let sut: FetchProductsUseCase

  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new FetchProductsUseCase(productRepository)
  })

  it('should list all categories.', async () => {
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

      console.log({ products })

      expect(products).toHaveLength(3)
      expect(products[0].createdAt).toBe(recentProduct.createdAt)
      expect(products[1].createdAt).toBe(middleProduct.createdAt)
      expect(products[2].createdAt).toBe(olderProduct.createdAt)
    }
  })
})
