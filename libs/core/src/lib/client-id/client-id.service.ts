import { Injectable, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { LocalStorage } from '../local-storage/local-storage.service'
import { createRandomClientId } from './create-random-client-id.function'

@Injectable({ providedIn: 'root' })
export class ClientIdService implements OnDestroy {
  private static UNIQUE_ID_KEY = 'CLIENT_ID'

  get clientId(): string {
    return this._clientId
  }

  private readonly _clientId: string
  private subs: Subscription

  constructor(private localStorage: LocalStorage) {
    const clientId = this._getClientId()
    // if no clientID is present inside ls generate a new one
    this._clientId = typeof clientId === 'string' ? clientId : this.generateNewClientId()

    this.subs = localStorage.observe(ClientIdService.UNIQUE_ID_KEY).subscribe(() => this._setClientId(this.clientId))
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  private generateNewClientId(): string {
    const clientId = createRandomClientId()
    this._setClientId(clientId)
    return clientId
  }

  private _getClientId(): unknown {
    return this.localStorage.getItem(ClientIdService.UNIQUE_ID_KEY)
  }

  private _setClientId(uuid: string): void {
    this.localStorage.setItem(ClientIdService.UNIQUE_ID_KEY, uuid)
  }
}
