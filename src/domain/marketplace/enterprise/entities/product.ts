import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ProductStatus } from './enums/product-status'

export interface IProductProps {
  name: string
  description: string
  priceInCents: number

  categoryId: UniqueEntityID
  ownerId: UniqueEntityID

  status: ProductStatus

  createdAt: Date
  updatedAt?: Date
}

export class Product extends Entity<IProductProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(newDescription: string) {
    this.props.description = newDescription
    this.touch()
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  set priceInCents(newPrice: number) {
    this.props.priceInCents = newPrice
    this.touch()
  }

  get ownerId() {
    return this.props.ownerId
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(newCategoryId: UniqueEntityID) {
    this.props.categoryId = newCategoryId
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: ProductStatus) {
    this.props.status = status
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public static create(
    props: Optional<IProductProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        status: props.status || ProductStatus.available,
      },
      id,
    )

    return product
  }
}
