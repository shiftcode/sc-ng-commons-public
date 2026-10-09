import { Type } from '@angular/core'

export type TestingFabWidget =
  TestingFabSelectQueryParamWidget | TestingFabToggleQueryParamWidget | TestingFabCustomComponentWidget

interface TestingFabWidgetBase {
  type: 'select-query-param' | 'toggle-query-param' | 'custom-component'
  id: string
  label: string
}

export interface TestingFabSelectQueryParamWidget extends TestingFabWidgetBase {
  type: 'select-query-param'
  queryParam: string
  options: readonly TestingFabSelectOption[]
  hardReload?: boolean
  skipEmptyOption?: boolean
}

export interface TestingFabToggleQueryParamWidget extends TestingFabWidgetBase {
  type: 'toggle-query-param'
  queryParam: string
  title?: string
  hardReload?: boolean
}

export interface TestingFabSelectOption {
  value: string
  label: string
}

export interface TestingFabCustomComponentWidget extends TestingFabWidgetBase {
  type: 'custom-component'
  component: Type<unknown>
}
