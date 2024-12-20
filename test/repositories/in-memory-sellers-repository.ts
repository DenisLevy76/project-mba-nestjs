import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { ISellerRepository } from '@/domain/marketplace/application/repositories/seller-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/seller'

export class InMemorySellersRepository implements ISellerRepository {
  public db: Seller[] = []

  
  async findById(id: string): Promise<Seller | null> {
    return this.db.find((seller) => seller.id.toString() === id) || null
  }

  async findByPhone(phone: string): Promise<Seller | null> {
    return this.db.find(seller => seller.phone === phone)
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return this.db.find(seller => seller.email === email)
  }

  async create(seller: Seller): Promise<void> {
    this.db.push(seller)
  }

  async list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }): Promise<IPaginatedResponse<Seller[]>> {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const items = this.db.slice(startIndex, endIndex)

    return {
      data: items,
      count: this.db.length,
      totalPages: Math.ceil(this.db.length / itemsPerPage),
      currentPage: page,
    }
  }
}
