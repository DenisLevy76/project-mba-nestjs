import { describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductStatus } from '@/domain/marketplace/enterprise/entities/enums/product-status'

import { Product } from './product'

describe('Product Entity', () => {
  it('should create a product with required properties', () => {
    const product = Product.create({
      name: 'Pencil',
      description:
        'Laboris quis dolore aute qui ut magna ex anim reprehenderit consequat pariatur.',
      categoryId: new UniqueEntityID('category1'),
      ownerId: new UniqueEntityID('seller1'),
      priceInCents: 24999,
    })

    expect(product).toBeTruthy()
    expect(product.name).toBe('Pencil')
    expect(product.description).toBe(
      'Laboris quis dolore aute qui ut magna ex anim reprehenderit consequat pariatur.',
    )
    expect(product.categoryId.toString()).toBe('category1')
    expect(product.ownerId.toString()).toBe('seller1')
    expect(product.status).toBe(ProductStatus.available)
    expect(product.createdAt).toBeInstanceOf(Date)
    expect(product.updatedAt).toBeUndefined()
  })

  it('should create a product with a custom UniqueEntityID', () => {
    const customId = new UniqueEntityID()
    const product = Product.create(
      {
        name: 'Pencil',
        description:
          'Laboris quis dolore aute qui ut magna ex anim reprehenderit consequat pariatur.',
        categoryId: new UniqueEntityID('category1'),
        ownerId: new UniqueEntityID('seller1'),
        priceInCents: 24999,
      },
      customId,
    )

    expect(product.id.toString()).toBe(customId.toString())
  })

  it('should update the name and set updatedAt', () => {
    const product = Product.create({
      name: 'Pencil',
      description:
        'Laboris quis dolore aute qui ut magna ex anim reprehenderit consequat pariatur.',
      categoryId: new UniqueEntityID('category1'),
      ownerId: new UniqueEntityID('seller1'),
      priceInCents: 24999,
    })

    expect(product.updatedAt).toBeUndefined()

    product.name = 'Rubber'

    expect(product.name).toBe('Rubber')
    expect(product.updatedAt).toBeInstanceOf(Date)
  })

  it('should preserve createdAt when updating name', () => {
    const createdAt = new Date('2023-01-01T00:00:00Z')

    const product = Product.create({
      name: 'Pencil',
      description:
        'Laboris quis dolore aute qui ut magna ex anim reprehenderit consequat pariatur.',
      categoryId: new UniqueEntityID('category1'),
      ownerId: new UniqueEntityID('seller1'),
      priceInCents: 24999,
      createdAt,
    })

    product.name = 'Rubber'

    expect(product.createdAt).toEqual(createdAt)
  })
})
