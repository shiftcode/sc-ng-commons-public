import { Directive, input, model, signal } from '@angular/core'
import { describe, expectTypeOf, it } from 'vitest'

import { InputsOf } from './inputs-of.type'

describe('InputsOf', () => {
  it('extracts InputSignal properties with their unwrapped types', () => {
    @Directive()
    class TestClazz {
      readonly name = input.required<string>()
      readonly age = input<number>(0)
      readonly isActive = signal(true)
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly name: string
      readonly age: number
    }>()
  })

  it('extracts ModelSignal properties with their unwrapped types', () => {
    @Directive()
    class TestClazz {
      readonly count = model(0)
      readonly items = model<string[]>([])
      readonly isVisible = signal(false)
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly count: number
      readonly items: string[]
    }>()
  })

  it('excludes regular signals and non-signal properties', () => {
    @Directive()
    class TestClazz {
      readonly name = input<string>('default')
      readonly regularSignal = signal(true)
      readonly plainProperty = 'test'
      readonly method = () => {}
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly name: string
    }>()
  })

  it('handles mixed InputSignal and ModelSignal', () => {
    @Directive()
    class TestClazz {
      readonly title = input.required<string>()
      readonly description = input<string>('default')
      readonly status = model<'active' | 'inactive'>('active')
      readonly count = model(0)
      readonly timestamp = signal(Date.now())
      readonly regular = 'prop'
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly title: string
      readonly description: string
      readonly status: 'active' | 'inactive'
      readonly count: number
    }>()
  })

  it('handles complex types in signals', () => {
    interface User {
      id: string
      name: string
      email: string
    }

    @Directive()
    class TestClazz {
      readonly user = input.required<User>()
      readonly roles = input<string[]>([])
      readonly metadata = model<Record<string, unknown>>({})
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly user: User
      readonly roles: string[]
      readonly metadata: Record<string, unknown>
    }>()
  })

  it('handles empty component (no inputs or models)', () => {
    @Directive()
    class EmptyComponent {
      readonly counter = signal(0)
      readonly value = 42
    }

    type Result = InputsOf<EmptyComponent>

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  it('handles generic types', () => {
    @Directive()
    class TestClazz<T> {
      readonly items = input.required<T[]>()
      readonly selectedItem = model<T | null>(null)
    }

    type StringArrayResult = InputsOf<TestClazz<string>>

    expectTypeOf<StringArrayResult>().toEqualTypeOf<{
      readonly items: string[]
      readonly selectedItem: string | null
    }>()
  })

  it('handles optional input signals without default value as potentially undefined', () => {
    @Directive()
    class TestClazz {
      readonly required = input.required<string>()
      readonly optional = input<string>()
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly required: string
      readonly optional: string | undefined
    }>()
  })

  it('handles nullable types in signals', () => {
    @Directive()
    class TestClazz {
      readonly user = input<{ name: string } | null>(null)
      readonly items = model<string[] | null>(null)
    }

    type Result = InputsOf<TestClazz>

    expectTypeOf<Result>().toEqualTypeOf<{
      readonly user: { name: string } | null
      readonly items: string[] | null
    }>()
  })
})
