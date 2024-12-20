import { makerSeller } from 'test/factories/make-seller'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { CreateSellerUseCase } from './create-seller-use-case'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

describe('CreateSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let createSellerUseCase: CreateSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    createSellerUseCase = new CreateSellerUseCase(inMemorySellersRepository)
  })

  it('should create a seller and save it in the repository', async () => {
    const seller = makerSeller()

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

  it('should not create a seller with a email thats already exists', async () => {
    const seller = makerSeller({ email: 'test@test.dev' })

    await createSellerUseCase.execute(seller)

    const seller2 = makerSeller({ email: 'test@test.dev' })

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isLeft()).toEqual(true)
    expect(response.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should create 2 sellers with 2 different emails', async () => {
    const seller = makerSeller()

    await createSellerUseCase.execute(seller)

    const seller2 = makerSeller()

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(2)
    expect(response.isRight()).toEqual(true)
  })

  it('should not create a seller with a phone number thats already exists', async () => {
    const seller = makerSeller({ phone: '99999999999' })

    await createSellerUseCase.execute(seller)

    const seller2 = makerSeller({ phone: '99999999999' })

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isLeft()).toEqual(true)
    expect(response.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should create 2 sellers with 2 different phones', async () => {
    const seller = makerSeller()

    await createSellerUseCase.execute(seller)

    const seller2 = makerSeller()

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(2)
    expect(response.isRight()).toEqual(true)
  })
})
