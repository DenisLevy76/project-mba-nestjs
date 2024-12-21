import { IHashProvider } from '@/domain/marketplace/providers/hash-provider'

export class FakeHashProvider implements IHashProvider {
  private hashes = new Map<string, string>()

  async hash(password: string): Promise<string> {
    const fakeHash = `hashed-${password}`
    this.hashes.set(password, fakeHash)

    return fakeHash
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return this.hashes.get(password) === hash
  }
}
