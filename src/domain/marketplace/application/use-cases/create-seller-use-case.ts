import { Either, left, right } from '@/core/either'

import { Seller } from '../../enterprise/entities/seller'
import { IHashProvider } from '../../providers/hash-provider'
import { ISellerRepository } from '../repositories/seller-repository'
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error'

export interface ICreateSellerRequest {
  name: string
  email: string
  password: string
  phone: string
}

type TCreateSellerResponse = Either<
  ResourceAlreadyExistsError,
  { seller: Seller }
>

export class CreateSellerUseCase {
  constructor(
    private sellerRepository: ISellerRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    email,
    name,
    password,
    phone,
  }: ICreateSellerRequest): Promise<TCreateSellerResponse> {
    if (await this.sellerRepository.findByEmail(email))
      return left(new ResourceAlreadyExistsError('Email'))
    if (await this.sellerRepository.findByPhone(phone)) {
      return left(new ResourceAlreadyExistsError('Phone'))
    }

    const passwordHash = await this.hashProvider.hash(password)

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
