import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'

import { ICategoryRepository } from '../repositories/category-repository'
import { FetchCategoriesUseCase } from './fetch-categories-use-case'

describe('CreateSellerUseCase', () => {
  let productRepository: ICategoryRepository
  let sut: FetchCategoriesUseCase

  beforeEach(() => {
    productRepository = new InMemoryCategoryRepository()
    sut = new FetchCategoriesUseCase(productRepository)
  })

  it('should list all categories.', async () => {
    Array.from({ length: 3 }).forEach(() => {
      const category = makeCategory()

      productRepository.create(category)
    })

    const response = await sut.execute({})

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.data).toHaveLength(3)
    }
  })

  it('should list all categories paginated with default 10 items per page.', async () => {
    Array.from({ length: 25 }).forEach(() => {
      const category = makeCategory()

      productRepository.create(category)
    })

    const response = await sut.execute({
      page: 3,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.data).toHaveLength(5)
      expect(response.value.count).toBe(25)
      expect(response.value.currentPage).toBe(3)
      expect(response.value.totalPages).toBe(3)
    }
  })

  it('should list all categories paginated with 20 items per page.', async () => {
    Array.from({ length: 25 }).forEach(() => {
      const category = makeCategory()

      productRepository.create(category)
    })

    const response = await sut.execute({
      page: 2,
      itemsPerPage: 20,
    })

    expect(response.isRight()).toBe(true)
    if (response.isRight()) {
      expect(response.value.data).toHaveLength(5)
      expect(response.value.count).toBe(25)
      expect(response.value.currentPage).toBe(2)
      expect(response.value.totalPages).toBe(2)
    }
  })
})
