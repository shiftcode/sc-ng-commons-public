import { Service } from '@angular/core'

@Service()
export abstract class WindowRef {
  get nativeWindow(): null | Window {
    return (typeof window !== 'undefined' && window) || null
  }
}
