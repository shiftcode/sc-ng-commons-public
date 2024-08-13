export class MockStorage {
  clear(): void {
    Object.keys(this).forEach((key) => {
      delete (<any>this)[key]
    })
  }

  key(index: number): string | null {
    return Object.keys(this)[index] ?? null
  }

  getItem(key: string): string | null {
    return (<any>this)[key] || null
  }

  setItem(key: string, value: string): void {
    ;(<any>this)[key] = value
  }

  removeItem(key: string): void {
    delete (<any>this)[key]
  }
}
