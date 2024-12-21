import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  IProductProps,
  Product,
} from '@/domain/marketplace/enterprise/entities/product'

export const makeProduct = (
  override: Partial<IProductProps> = {},
  id?: UniqueEntityID,
) => {
  const product = Product.create(
    {
      categoryId: new UniqueEntityID(faker.internet.displayName()),
      ownerId: new UniqueEntityID(faker.internet.displayName()),
      description: faker.lorem.paragraphs(),
      name: faker.book.title(),
      priceInCents:
        Number(faker.finance.amount({ min: 100, max: 10000, dec: 2 })) * 100,
      ...override,
    },
    id,
  )

  return product
}
