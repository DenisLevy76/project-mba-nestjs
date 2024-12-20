import { Either, left, right } from '@/core/either'

import { Seller } from '../../enterprise/entities/seller'
import { ISellerRepository } from '../repositories/seller-repository'

export interface ICreateSellerRequest {
  name: string
  email: string
  passwordHash: string
  phone: string
}

type TCreateSellerResponse = Either<string, { seller: Seller }>

export class CreateSellerUseCase {
  constructor(private sellerRepository: ISellerRepository) {}

  async execute({
    email,
    name,
    passwordHash,
    phone,
  }: ICreateSellerRequest): Promise<TCreateSellerResponse> {
    if (await this.sellerRepository.findByEmail(email))
      return left('Email already exists.')
    if (await this.sellerRepository.findByPhone(phone)) {
      return left('Phone already exists.')
    }

    const seller = Seller.create({
      email,
      name,
      passwordHash,
      phone,
    })

    await this.sellerRepository.create(seller)

    return right({ seller })
  }
}
