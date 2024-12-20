import { makeSeller } from 'test/factories/make-seller'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { EditSellerUseCase } from './edit-seller-use-case'

describe('EditSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let editSellerUseCase: EditSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    editSellerUseCase = new EditSellerUseCase(inMemorySellersRepository)
  })

  it('should edit a seller and save it in the repository', async () => {
    const seller = makeSeller()
    const newEmail = 'test@test.dev'

    inMemorySellersRepository.db.push(seller)

    const response = await editSellerUseCase.execute({
      sellerId: seller.id,
      email: newEmail,
      name: seller.name,
      passwordHash: seller.passwordHash,
      phone: seller.phone,
    })

    console.log(response.value)

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
})
