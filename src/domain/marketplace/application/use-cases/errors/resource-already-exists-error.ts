import { IUseCaseError } from '@/core/errors/use-case-error'

export class ResourceAlreadyExistsError extends Error implements IUseCaseError {
  constructor(resourceName: string = 'Resource') {
    super(`${resourceName} already exists.`)
  }
}
