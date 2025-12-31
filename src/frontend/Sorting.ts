export function isSortOperator(op?: Operator) {
  return op === 'asc' || op === 'desc'
}

export type FilterFieldType = 'string' | 'number' | 'enum' | 'array'
export type sortOperator = 'asc' | 'desc'
export type Operator = '=' | '!=' | '<' | '>' | 'contains' | 'in' | sortOperator

export interface FilterRule {
  object: string
  field: string
  operator: Operator
  value: any
}

export interface FilterObject {
  id: string,
  label: string,
  fields: {
    key: string,
    label: string,
    type: FilterFieldType,
    values: { key: string, value: string }[]
  }[]
}
