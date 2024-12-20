export class ResourceNotFoundError extends Error {
  constructor(resourceName: string = 'Resource') {
    super(`${resourceName} not found.`)
  }
}
