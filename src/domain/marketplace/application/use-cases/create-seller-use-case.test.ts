import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { CreateSellerUseCase } from './create-seller-use-case'
import { makerSeller } from 'test/factories/make-seller'

describe('CreateSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let createSellerUseCase: CreateSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    createSellerUseCase = new CreateSellerUseCase(
      inMemorySellersRepository,
    )
  })

  it('should create a seller and save it in the repository', async () => {
    const seller = makerSeller()

    await createSellerUseCase.execute(seller)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(inMemorySellersRepository.db).toEqual([
      expect.objectContaining({
        name: seller.name,
        email: seller.email,
        passwordHash: seller.passwordHash,
        phone: seller.phone,
      }),
    ])
  })
})
