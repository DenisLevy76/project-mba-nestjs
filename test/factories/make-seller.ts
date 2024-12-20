import { ISellerProps, Seller } from "@/domain/marketplace/enterprise/entities/seller"
import {faker} from "@faker-js/faker"

export const makerSeller = (override: Partial<ISellerProps> = {}) => {
  const seller = Seller.create({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    passwordHash: faker.internet.password(),
    phone: faker.phone.number(),
    ...override
  })

  return seller
}
