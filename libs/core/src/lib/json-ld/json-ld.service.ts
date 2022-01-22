import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'

export type JsonLdProp = string | number | boolean

export interface JsonLd {
  [param: string]: JsonLdProp | JsonLdProp[] | JsonLd | JsonLd[]
}

export interface ListItemLd extends JsonLd {
  item: JsonLd
}

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly doc: Document

  get currentData(): JsonLd[] {
    return this.jsonLd
  }

  private jsonLd: JsonLd[] = []

  static createObject(type: string, rawData?: JsonLd, context = 'http://schema.org'): JsonLd {
    let object: JsonLd = {
      '@type': type,
    }
    if (context) {
      object = {
        '@context': context,
        ...object,
      }
    }
    if (rawData) {
      object = {
        ...object,
        ...rawData,
      }
    }
    return object
  }

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc
  }

  setData(data: JsonLd | JsonLd[]) {
    this.jsonLd = []
    this.appendData(data)
  }

  appendData(data: JsonLd | JsonLd[]) {
    if (Array.isArray(data)) {
      this.jsonLd.push(...data)
    } else {
      this.jsonLd.push(data)
    }
    this.setToHead(this.jsonLd)
  }

  private setToHead(jsonld: JsonLd[]) {
    const serialized = JSON.stringify(jsonld)
    let ldJsonScriptTag = this.doc.head.querySelector(`script[type='application/ld+json']`)
    if (ldJsonScriptTag) {
      ldJsonScriptTag.textContent = serialized
    } else {
      ldJsonScriptTag = this.doc.createElement('script')
      ldJsonScriptTag.setAttribute('type', 'application/ld+json')
      ldJsonScriptTag.textContent = serialized
      this.doc.head.appendChild(ldJsonScriptTag)
    }
  }
}
