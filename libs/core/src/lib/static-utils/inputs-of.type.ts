import { InputSignal, ModelSignal } from '@angular/core'

/**
 * Extracts all properties from a type that are InputSignal or ModelSignal,
 * Caveat: There's no way to differ between required inputs and inputs with default values, as both only expose the non-undefined type.
 * @returns a record where the value is the unwrapped signal type.
 * @example
 * ```ts
 * class MyComponent {
 *   readonly name = input.required<string>()
 *   readonly age = model(30)
 *   readonly isActive = signal(true)
 * }
 * type MyComponentInputs = InputsOf<MyComponent>
 * // MyComponentInputs is equivalent to: { readonly name: string; readonly age: number; }
 * ```
 */
export type InputsOf<T> = {
  readonly [K in keyof T as T[K] extends InputSignal<any> | ModelSignal<any> ? K : never]: T[K] extends InputSignal<
    infer U
  >
    ? U
    : T[K] extends ModelSignal<infer U>
      ? U
      : never
}
