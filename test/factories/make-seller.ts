import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ISellerProps,
  Seller,
} from '@/domain/marketplace/enterprise/entities/seller'

export const makeSeller = (
  override: Partial<ISellerProps> = {},
  id?: UniqueEntityID,
) => {
  const seller = Seller.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      passwordHash: `hashed-${faker.internet.password()}`,
      phone: faker.phone.number(),
      ...override,
    },
    id,
  )

  return seller
}
