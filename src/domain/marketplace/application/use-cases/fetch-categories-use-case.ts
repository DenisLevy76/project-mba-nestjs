import { IPaginatedResponse } from '@/core/@types/paginated-response'
import { Either, right } from '@/core/either'

import { Category } from '../../enterprise/entities/category'
import { ICategoryRepository } from '../repositories/category-repository'

export interface IFetchCategoriesRequest {
  page?: number
  itemsPerPage?: number
}

type TFetchCategoriesResponse = Either<null, IPaginatedResponse<Category[]>>

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute({
    page = 1,
    itemsPerPage = 10,
  }: IFetchCategoriesRequest): Promise<TFetchCategoriesResponse> {
    const response = await this.categoryRepository.list({
      itemsPerPage,
      page,
    })

    return right(response)
  }
}
