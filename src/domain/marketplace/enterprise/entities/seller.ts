import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ISellerProps {
  name: string
  phone: string
  email: string
  passwordHash: string

  createdAt: Date
  updatedAt?: Date
}

export class Seller extends Entity<ISellerProps> {
  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public static create(
    props: Optional<ISellerProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const seller = new Seller(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )

    return seller
  }
}
