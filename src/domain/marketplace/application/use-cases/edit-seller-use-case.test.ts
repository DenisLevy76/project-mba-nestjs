import { makeSeller } from 'test/factories/make-seller'
import { FakeHashProvider } from 'test/providers/hash-provider'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { EditSellerUseCase } from './edit-seller-use-case'

describe('EditSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let fakeHashProvider: FakeHashProvider
  let editSellerUseCase: EditSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHashProvider = new FakeHashProvider()
    editSellerUseCase = new EditSellerUseCase(
      inMemorySellersRepository,
      fakeHashProvider,
    )
  })

  it('should edit a seller and save it in the repository', async () => {
    const seller = makeSeller()
    const newEmail = 'test@test.dev'

    inMemorySellersRepository.db.push(seller)

    const response = await editSellerUseCase.execute({
      sellerId: seller.id,
      email: newEmail,
      name: seller.name,
      password: seller.passwordHash,
      phone: seller.phone,
    })

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isRight()).toEqual(true)
    if (response.isRight()) {
      expect(response.value.seller).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            email: newEmail,
          }),
        }),
      )
    }
  })

  it('should edit a seller and save it in the repository', async () => {
    const seller = makeSeller()
    const newPassword = 'secret_password'

    inMemorySellersRepository.db.push(seller)

    const response = await editSellerUseCase.execute({
      sellerId: seller.id,
      email: seller.email,
      name: seller.name,
      password: newPassword,
      phone: seller.phone,
    })

    const newHashedPassword = await fakeHashProvider.hash(newPassword)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isRight()).toEqual(true)
    if (response.isRight()) {
      expect(response.value.seller).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            passwordHash: newHashedPassword,
          }),
        }),
      )
    }
  })
})
