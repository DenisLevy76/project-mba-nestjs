import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { IProductRepository } from '@/domain/marketplace/application/repositories/product-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'

export class InMemoryProductRepository implements IProductRepository {
  db: Product[] = []

  async list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }): Promise<IPaginatedResponse<Product[]>> {
    return {
      count: this.db.length,
      currentPage: page,
      data: this.db,
      totalPages: Math.ceil(this.db.length / itemsPerPage),
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.db.find((product) => product.id.toString() === id)
  }

  async save(product: Product) {
    const productIndex = this.db.findIndex((product) =>
      product.id.equals(product.id),
    )

    this.db[productIndex] = product
  }

  async create(product) {
    this.db.push(product)
  }
}
