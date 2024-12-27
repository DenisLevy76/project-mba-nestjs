import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { IProductRepository } from '@/domain/marketplace/application/repositories/product-repository'
import { ProductStatus } from '@/domain/marketplace/enterprise/entities/enums/product-status'
import { Product } from '@/domain/marketplace/enterprise/entities/product'

export class InMemoryProductRepository implements IProductRepository {
  db: Product[] = []

  async search({
    query,
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
    query: string
  }): Promise<IPaginatedResponse<Product[]>> {
    const normalizeString = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()

    const normalizedQuery = normalizeString(query)

    const sortedData = [...this.db].filter((product) => {
      const normalizedName = normalizeString(product.name)
      const normalizedDescription = normalizeString(product.description)

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery)
      )
    })

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

  async list({
    page,
    itemsPerPage,
    orderBy,
    filters,
  }: {
    page: number
    itemsPerPage: number
    orderBy?: 'latest' | 'alphabetic'
    filters?: { status?: ProductStatus; ownerId: string }
  }): Promise<IPaginatedResponse<Product[]>> {
    const sortedData = [...this.db]

    if (orderBy === 'latest') {
      sortedData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (orderBy === 'alphabetic') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name))
    }

    const startIndex = (page - 1) * itemsPerPage
    const paginatedData = sortedData
      .filter((product) => {
        if (filters) {
          let matchStatus = true
          let matchOwner = true

          if (filters.status) {
            matchStatus = filters.status === product.status
          }

          if (filters.ownerId) {
            matchOwner = filters.ownerId === product.ownerId.toString()
          }

          return matchStatus && matchOwner
        }

        return true
      })

      .slice(startIndex, startIndex + itemsPerPage)

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
