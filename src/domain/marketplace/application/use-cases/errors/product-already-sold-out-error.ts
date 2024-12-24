import { IUseCaseError } from '@/core/errors/use-case-error'

export class ProductAlreadySoldOutError extends Error implements IUseCaseError {
  constructor() {
    super(`Product sold out.`)
  }
}
