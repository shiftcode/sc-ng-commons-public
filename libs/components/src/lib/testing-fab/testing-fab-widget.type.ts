import { Type } from '@angular/core'

export type TestingFabWidget =
  | TestingFabActionWidget
  | TestingFabSelectQueryParamWidget
  | TestingFabCustomComponentWidget

interface TestingFabWidgetBase {
  id: string
  label: string
}

export interface TestingFabActionWidget extends TestingFabWidgetBase {
  type: 'action'
  buttonLabel?: string
  action: () => void
}

export interface TestingFabSelectQueryParamWidget extends TestingFabWidgetBase {
  type: 'select-query-param'
  queryParam: string
  options: readonly TestingFabSelectOption[]
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
