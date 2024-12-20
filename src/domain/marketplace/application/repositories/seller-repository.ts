import { IPaginatedResponse } from '@/core/@types/paginated-response'

import { Seller } from '../../enterprise/entities/seller'

export interface ISellerRepository {
  db: Seller[]
  create(sellerSeller: Seller): Promise<void>
  list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }): Promise<IPaginatedResponse<Seller[]>>
  findById(id: string): Promise<Seller | null>
  findByPhone(phone: string): Promise<Seller | null>
  findByEmail(email: string): Promise<Seller | null>
}
