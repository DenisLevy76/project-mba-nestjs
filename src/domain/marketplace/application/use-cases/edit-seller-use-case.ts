import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Seller } from '../../enterprise/entities/seller'
import { ISellerRepository } from '../repositories/seller-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface IEditSellerRequest {
  sellerId: UniqueEntityID
  name: string
  email: string
  phone: string
  passwordHash: string
}

type TEditSellerResponse = Either<ResourceNotFoundError, { seller: Seller }>

export class EditSellerUseCase {
  constructor(private sellerRepository: ISellerRepository) {}

  async execute({
    sellerId,
    email,
    name,
    passwordHash,
    phone,
  }: IEditSellerRequest): Promise<TEditSellerResponse> {
    const seller = await this.sellerRepository.findById(sellerId.toString())

    if (!seller) return left(new ResourceNotFoundError())
    if (await this.sellerRepository.findByEmail(email))
      return left(new ResourceAlreadyExistsError('Email'))
    if (await this.sellerRepository.findByPhone(phone))
      return left(new ResourceAlreadyExistsError('Phone'))

    seller.email = email
    seller.name = name
    seller.passwordHash = passwordHash

    await this.sellerRepository.save(seller)

    return right({ seller })
  }
}
