import { Seller } from '../../enterprise/entities/seller'
import { ISellerRepository } from '../repositories/seller-repository'

export interface ICreateSellerRequest {
  name: string
  email: string
  passwordHash: string
  phone: string
}

export class CreateSellerUseCase {
  constructor(private sellerRepository: ISellerRepository) {}

  async execute({ email, name, passwordHash, phone }: ICreateSellerRequest) {
    const seller = Seller.create({
      email,
      name,
      passwordHash,
      phone,
    })

    await this.sellerRepository.create(seller)

    return { seller }
  }
}
