import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'


interface IAttachmentProps {
  fileName: string
  productId: UniqueEntityID

  createdAt: Date
}

export class Attachment extends Entity<IAttachmentProps> {
  get fileName() {
    return this.props.fileName
  }

  get productId() {
    return this.props.productId
  }

  get createdAt() {
    return this.props.createdAt
  }

  public static create(
    props: Optional<IAttachmentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const attachment = new Attachment(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )

    return attachment
  }
}
