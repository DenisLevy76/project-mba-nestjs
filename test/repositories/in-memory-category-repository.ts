import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { ICategoryRepository } from '@/domain/marketplace/application/repositories/category-repository'
import { Category } from '@/domain/marketplace/enterprise/entities/category'

export class InMemoryCategoryRepository implements ICategoryRepository {
  db: Category[] = []

  async findById(id) {
    return this.db.find((category) => category.id.toString() === id) || null
  }

  async create(category: Category): Promise<void> {
    this.db.push(category)
  }

  async list({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }): Promise<IPaginatedResponse<Category[]>> {
    return {
      count: this.db.length,
      currentPage: page,
      data: this.db,
      totalPages: Math.ceil(this.db.length / itemsPerPage),
    }
  }
}
