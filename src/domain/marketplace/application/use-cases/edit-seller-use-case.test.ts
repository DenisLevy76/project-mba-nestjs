import { makeSeller } from 'test/factories/make-seller'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { CreateSellerUseCase } from './create-seller-use-case'

describe('CreateSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let createSellerUseCase: CreateSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    createSellerUseCase = new CreateSellerUseCase(inMemorySellersRepository)
  })

  it('should create a seller and save it in the repository', async () => {
    const seller = makeSeller()

    const response = await createSellerUseCase.execute(seller)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isRight()).toEqual(true)
    if (response.isRight()) {
      expect(response.value.seller).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            name: seller.name,
            email: seller.email,
            passwordHash: seller.passwordHash,
            phone: seller.phone,
          }),
        }),
      )
    }
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
