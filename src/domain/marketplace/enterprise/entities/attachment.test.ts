import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Attachment } from './attachment'

describe('Attachment Entity', () => {
  it('should create a attachment with required properties', () => {
    const props = {
      fileName: 'Blue Pencil',
      productId: new UniqueEntityID('product1'),
    }

    const attachment = Attachment.create(props)

    expect(attachment).toBeTruthy()
    expect(attachment.fileName).toBe(props.fileName)

    expect(attachment.createdAt).toBeInstanceOf(Date)
  })

  it('should create a attachment with a custom UniqueEntityID', () => {
    const customId = new UniqueEntityID()
    const props = {
      fileName: 'Blue Pencil',
      productId: new UniqueEntityID('product1'),
    }

    const attachment = Attachment.create(props, customId)

    expect(attachment.id.toString()).toBe(customId.toString())
  })
})
