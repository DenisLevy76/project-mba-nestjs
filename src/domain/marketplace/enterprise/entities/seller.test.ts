import { makeSeller } from 'test/factories/make-seller'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Seller } from './seller'

describe('Seller Entity', () => {
  it('should create a seller with required properties', () => {
    const seller = Seller.create({
      name: 'John Doe',
      phone: '123456789',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
    })

    expect(seller).toBeTruthy()
    expect(seller.name).toBe('John Doe')
    expect(seller.phone).toBe('123456789')
    expect(seller.email).toBe('john.doe@example.com')
    expect(seller.passwordHash).toBe('hashed_password')
    expect(seller.createdAt).toBeInstanceOf(Date)
    expect(seller.updatedAt).toBeUndefined()
  })

  it('should create a seller with a custom UniqueEntityID', () => {
    const customId = new UniqueEntityID()
    const seller = makeSeller({}, customId)

    expect(seller.id).toBe(customId)
  })

  it('should update the name and set updatedAt', () => {
    const seller = makeSeller()

    expect(seller.updatedAt).toBeUndefined()

    seller.name = 'John Smith'

    expect(seller.name).toBe('John Smith')
    expect(seller.updatedAt).toBeInstanceOf(Date)
  })

  it('should update the phone and set updatedAt', () => {
    const seller = makeSeller()

    expect(seller.updatedAt).toBeUndefined()

    seller.phone = '12123451234'

    expect(seller.phone).toBe('12123451234')
    expect(seller.updatedAt).toBeInstanceOf(Date)
  })

  it('should update the email and set updatedAt', () => {
    const seller = makeSeller()

    expect(seller.updatedAt).toBeUndefined()

    seller.email = 'test@test.dev'

    expect(seller.email).toBe('test@test.dev')
    expect(seller.updatedAt).toBeInstanceOf(Date)
  })

  it('should preserve createdAt when updating name', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z')

    const seller = makeSeller({ createdAt })

    seller.name = 'John Smith'

    expect(seller.createdAt).toEqual(createdAt)
  })
})
