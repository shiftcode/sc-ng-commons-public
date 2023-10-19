import { StaticProvider, Type } from '@angular/core'
import {
  assertAngularComponent,
  assertAngularInput,
  ERROR_INPUT_NAME,
  RX_DEFAULT_ERROR_COMPONENT,
  RX_DEFAULT_SUSPENSE_COMPONENT,
} from './internals'

/**
 * provide a default component for the {@link RxLetDirective} to render if the observable is in suspense state
 * suspense = no emitted value
 */
export function provideDefaultRxSuspenseComponent(component: Type<any>): StaticProvider[] {
  assertAngularComponent(component)
  return [
    {
      provide: RX_DEFAULT_SUSPENSE_COMPONENT,
      useValue: component,
    },
  ]
}

/**
 * provide a default component for the {@link RxIfDirective} and {@link RxLetDirective} to render if the observable is in error state.
 * The provided component needs to have an input named `error`
 */
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
