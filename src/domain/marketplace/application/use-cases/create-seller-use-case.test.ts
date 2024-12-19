import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { CreateSellerUseCase } from './create-seller-use-case'

describe('CreateSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
  })
  it('should create a seller and save it in the repository', async () => {
    const createSellerUseCase = new CreateSellerUseCase(
      inMemorySellersRepository,
    )

    const request = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      phone: '123456789',
    }

    await createSellerUseCase.execute(request)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(inMemorySellersRepository.db).toEqual([
      expect.objectContaining({
        name: request.name,
        email: request.email,
        passwordHash: request.passwordHash,
        phone: request.phone,
      }),
    ])
  })
})
