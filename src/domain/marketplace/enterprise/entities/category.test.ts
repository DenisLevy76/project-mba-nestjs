import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Category } from './category'

describe('Category Entity', () => {
  it('should create a category with required properties', () => {
    const props = {
      title: 'Blue Pencil',
    }

    const category = Category.create(props)

    expect(category).toBeTruthy()
    expect(category.title).toBe(props.title)
    expect(category.slug.value).toBe('blue-pencil')

    expect(category.createdAt).toBeInstanceOf(Date)
    expect(category.updatedAt).toBeUndefined()
  })

  it('should create a category with a custom UniqueEntityID', () => {
    const customId = new UniqueEntityID()
    const props = {
      title: 'Blue Pencil',
    }

    const category = Category.create(props, customId)

    expect(category.id.toString()).toBe(customId.toString())
  })

  it('should update the name and set updatedAt', () => {
    const props = {
      title: 'Blue Pencil',
    }
    const category = Category.create(props)

    expect(category.updatedAt).toBeUndefined()

    category.title = 'Rubber'

    expect(category.title).toBe('Rubber')
    expect(category.updatedAt).toBeInstanceOf(Date)
  })
})
