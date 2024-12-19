import { Optional } from '@/core/@types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Slug } from './value-objects/slug'

interface ICategoryProps {
  title: string
  slug: Slug

  createdAt: Date
  updatedAt?: Date
}

export class Category extends Entity<ICategoryProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get slug() {
    return this.props.slug
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
    props: Optional<ICategoryProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        slug: props.slug || Slug.createFromText(props.title),
      },
      id,
    )

    return category
  }
}
