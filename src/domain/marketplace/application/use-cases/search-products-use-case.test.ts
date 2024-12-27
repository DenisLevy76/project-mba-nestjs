import { makeProduct } from 'test/factories/make-product'
import { InMemoryProductRepository } from 'test/repositories/in-memory-products-repository'

import { IProductRepository } from '../repositories/product-repository'
import { SearchProductsUseCase } from './search-products-use-case'

describe('SearchProductsUseCase', () => {
  let productRepository: IProductRepository
  let sut: SearchProductsUseCase

  beforeEach(() => {
    productRepository = new InMemoryProductRepository()
    sut = new SearchProductsUseCase(productRepository)

    Array.from({ length: 24 }).forEach(() => {
      const product = makeProduct()
      productRepository.create(product)
    })

    productRepository.create(
      makeProduct({
        name: 'Camisa Gamer',
        description: 'Uma camisa incrível para gamers',
      }),
    )
    productRepository.create(
      makeProduct({
        name: 'Camisa Do Naruto',
        description: 'Perfeita para fãs do Naruto',
      }),
    )
    productRepository.create(
      makeProduct({
        name: 'Cabo JáCÂré',
        description: 'Cabo resistente com design especial',
      }),
    )
  })

  const searchAndAssert = async (
    query: string,
    expectedLength: number,
    expectedNames: string[],
  ) => {
    const response = await sut.execute({ query })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      const data = response.value.data
      expect(data.length).toBe(expectedLength)
      expectedNames.forEach((name, index) =>
        expect(data[index]?.name).toBe(name),
      )
    }

    return response
  }

  it('should search product by exact title.', async () => {
    await searchAndAssert('Camisa Gamer', 1, ['Camisa Gamer'])
  })

  it('should search products by partial title.', async () => {
    await searchAndAssert('Camisa', 2, ['Camisa Gamer', 'Camisa Do Naruto'])
  })

  it('should search products by case-insensitive and accent-insensitive title.', async () => {
    await searchAndAssert('GaMer', 1, ['Camisa Gamer'])
    await searchAndAssert('jacare', 1, ['Cabo JáCÂré'])
  })

  it('should search products by description.', async () => {
    await searchAndAssert('incrível', 1, ['Camisa Gamer'])
    await searchAndAssert('fãs do Naruto', 1, ['Camisa Do Naruto'])
    await searchAndAssert('resistente', 1, ['Cabo JáCÂré'])
  })

  it('should search products by partial description.', async () => {
    await searchAndAssert('design especial', 1, ['Cabo JáCÂré'])
  })

  it('should search products by case-insensitive and accent-insensitive description.', async () => {
    await searchAndAssert('PERFEITA', 1, ['Camisa Do Naruto'])
    await searchAndAssert('resistênte', 1, ['Cabo JáCÂré'])
  })

  it('should return no products for non-matching queries.', async () => {
    await searchAndAssert('Non-existent', 0, [])
  })
})
