import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  ICategoryProps,
} from '@/domain/marketplace/enterprise/entities/category'

export const makeCategory = (
  override: Partial<ICategoryProps> = {},
  id?: UniqueEntityID,
) => {
  const category = Category.create(
    {
      title: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return category
}
