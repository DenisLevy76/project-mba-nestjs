import { FakeHashProvider } from 'test/providers/hash-provider'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { describe, expect, it } from 'vitest'

import { CreateSellerUseCase } from './create-seller-use-case'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

describe('CreateSellerUseCase', () => {
  let inMemorySellersRepository: InMemorySellersRepository
  let fakeHashProvider: FakeHashProvider
  let createSellerUseCase: CreateSellerUseCase

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHashProvider = new FakeHashProvider()
    createSellerUseCase = new CreateSellerUseCase(
      inMemorySellersRepository,
      fakeHashProvider,
    )
  })

  it('should create a seller and save it in the repository', async () => {
    const seller = {
      email: 'test1@example.com',
      name: 'John Doe',
      password: 'securepassword123',
      phone: '1234567890',
    }

    const response = await createSellerUseCase.execute(seller)

    const hashedPassword = await fakeHashProvider.hash(seller.password)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isRight()).toEqual(true)
    if (response.isRight()) {
      expect(response.value.seller).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            name: seller.name,
            email: seller.email,
            passwordHash: hashedPassword,
            phone: seller.phone,
          }),
        }),
      )
    }
    expect(inMemorySellersRepository.db).toEqual([
      expect.objectContaining({
        name: seller.name,
        email: seller.email,
        passwordHash: hashedPassword,
        phone: seller.phone,
      }),
    ])
  })

  it('should not create a seller with an email that already exists', async () => {
    const seller = {
      email: 'duplicate@example.com',
      name: 'Jane Doe',
      password: 'password123',
      phone: '9876543210',
    }

    await createSellerUseCase.execute(seller)

    const seller2 = {
      email: 'duplicate@example.com',
      name: 'John Smith',
      password: 'differentpassword',
      phone: '1234567890',
    }

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isLeft()).toEqual(true)
    expect(response.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should create 2 sellers with 2 different emails', async () => {
    const seller1 = {
      email: 'unique1@example.com',
      name: 'Seller One',
      password: 'password123',
      phone: '1231231231',
    }

    const seller2 = {
      email: 'unique2@example.com',
      name: 'Seller Two',
      password: 'password456',
      phone: '4564564564',
    }

    await createSellerUseCase.execute(seller1)
    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(2)
    expect(response.isRight()).toEqual(true)
  })

  it('should not create a seller with a phone number that already exists', async () => {
    const seller = {
      email: 'unique@example.com',
      name: 'Phone Test',
      password: 'password123',
      phone: '1111111111',
    }

    await createSellerUseCase.execute(seller)

    const seller2 = {
      email: 'another@example.com',
      name: 'Another Test',
      password: 'password456',
      phone: '1111111111',
    }

    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(1)
    expect(response.isLeft()).toEqual(true)
    expect(response.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should create 2 sellers with 2 different phones', async () => {
    const seller1 = {
      email: 'phoneunique1@example.com',
      name: 'Seller Phone One',
      password: 'password123',
      phone: '2222222222',
    }

    const seller2 = {
      email: 'phoneunique2@example.com',
      name: 'Seller Phone Two',
      password: 'password456',
      phone: '3333333333',
    }

    await createSellerUseCase.execute(seller1)
    const response = await createSellerUseCase.execute(seller2)

    expect(inMemorySellersRepository.db).toHaveLength(2)
    expect(response.isRight()).toEqual(true)
  })
})
