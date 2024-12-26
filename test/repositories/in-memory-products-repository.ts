import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { IProductRepository } from '@/domain/marketplace/application/repositories/product-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'

export class InMemoryProductRepository implements IProductRepository {
  db: Product[] = []

  async list({
    page,
    itemsPerPage,
    orderBy,
  }: {
    page: number
    itemsPerPage: number
    orderBy?: 'latest' | 'alphabetic'
  }): Promise<IPaginatedResponse<Product[]>> {
    const sortedData = [...this.db]

    if (orderBy === 'latest') {
      sortedData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (orderBy === 'alphabetic') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name))
    }

    const startIndex = (page - 1) * itemsPerPage
    const paginatedData = sortedData.slice(
      startIndex,
      startIndex + itemsPerPage,
    )

    return {
      count: this.db.length,
      currentPage: page,
      data: paginatedData,
      totalPages: Math.ceil(this.db.length / itemsPerPage),
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.db.find((product) => product.id.toString() === id)
  }

  async save(product: Product) {
    const productIndex = this.db.findIndex((prod) => prod.id.equals(product.id))

    this.db[productIndex] = product
  }

  async create(product) {
    this.db.push(product)
  }
}
