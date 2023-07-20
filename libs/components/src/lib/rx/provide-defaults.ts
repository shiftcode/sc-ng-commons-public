import { StaticProvider, Type } from '@angular/core'
import {
  assertAngularComponent,
  assertAngularInput,
  ERROR_INPUT_NAME,
  RX_DEFAULT_ERROR_COMPONENT,
  RX_DEFAULT_SUSPENSE_COMPONENT,
} from './internals'

export function provideDefaultRxSuspenseComponent(component: Type<any>): StaticProvider[] {
  assertAngularComponent(component)
  return [
    {
      provide: RX_DEFAULT_SUSPENSE_COMPONENT,
      useValue: component,
    },
  ]
}

export function provideDefaultRxErrorComponent(component: Type<any>): StaticProvider[] {
  assertAngularComponent(component)
  assertAngularInput(component, ERROR_INPUT_NAME)
  return [
    {
      provide: RX_DEFAULT_ERROR_COMPONENT,
      useValue: component,
    },
  ]
}
