import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Seller } from '../../enterprise/entities/seller'
import { IHashProvider } from '../../providers/hash-provider'
import { ISellerRepository } from '../repositories/seller-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface IEditSellerRequest {
  sellerId: UniqueEntityID
  name: string
  email: string
  phone: string
  password: string
}

type TEditSellerResponse = Either<ResourceNotFoundError, { seller: Seller }>

export class EditSellerUseCase {
  constructor(
    private sellerRepository: ISellerRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    sellerId,
    email,
    name,
    password,
    phone,
  }: IEditSellerRequest): Promise<TEditSellerResponse> {
    const seller = await this.sellerRepository.findById(sellerId.toString())

    if (!seller) return left(new ResourceNotFoundError())

    if (email !== seller.email) {
      const hasAnotherSellerWithSameEmail =
        await this.sellerRepository.findByEmail(email)

      if (hasAnotherSellerWithSameEmail) {
        return left(new ResourceAlreadyExistsError('Email'))
      }
    }

    if (phone !== seller.phone) {
      const hasAnotherSellerWithSamePhone =
        await this.sellerRepository.findByPhone(phone)

      if (hasAnotherSellerWithSamePhone)
        return left(new ResourceAlreadyExistsError('Phone'))
    }

    const passwordHash = await this.hashProvider.hash(password)

    seller.email = email
    seller.name = name
    seller.passwordHash = passwordHash

    await this.sellerRepository.save(seller)

    return right({ seller })
  }
}
