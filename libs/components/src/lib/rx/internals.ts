import { ComponentMirror, InjectionToken, reflectComponentType, Type } from '@angular/core'

export const RX_DEFAULT_SUSPENSE_COMPONENT = new InjectionToken<Type<any>>('RX_DEFAULT_SUSPENSE_COMPONENT')
export const RX_DEFAULT_ERROR_COMPONENT = new InjectionToken<Type<any>>('RX_DEFAULT_ERROR_COMPONENT')

export const ERROR_INPUT_NAME = 'error'

export function assertAngularComponent<T>(component: Type<T>): void {
  const mirror = reflectComponentType(component)
  if (!mirror) {
    throw new Error(`provided component type ${component.name} is not an Angular component`)
  }
}

export function assertAngularInput<T>(component: Type<T>, inputName: string): void {
  // we simply assume this method is called after assertAngularComponent
  const mirror = <ComponentMirror<T>>reflectComponentType(component)
  const errorInput = mirror.inputs.find((input) => input.propName === inputName && input.templateName === inputName)

  if (!errorInput) {
    throw new Error(
      `provided component type ${component.name} does not have an input named ${inputName} (input-rename not allowed)`,
    )
  }
}
