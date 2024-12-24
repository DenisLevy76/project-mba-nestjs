import { IUseCaseError } from '@/core/errors/use-case-error'

export class InvalidPriceError extends Error implements IUseCaseError {
  constructor() {
    super(`Invalid Price.`)
  }
}
