import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'

import { IProductRepository } from '../repositories/product-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetProductUseCase } from './get-product-use-case'

describe('CreateSellerUseCase', () => {
  let productRepository: IProductRepository
  let sut: GetProductUseCase

  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new GetProductUseCase(productRepository)
  })

  it('should not get a inexistent product.', async () => {
    const response = await sut.execute({
      productId: 'balela',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should get a existent product.', async () => {
    const product = makeProduct()

    productRepository.create(product)

    const response = await sut.execute({
      productId: product.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.product.id.toString()).toBe(product.id.toString())
    }
  })
})
