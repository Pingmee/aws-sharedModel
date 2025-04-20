import { Variable } from '../Automations/automations'

export interface TablesCountResponse {
  viewId: string,
  objectType: string,
  primaryKeyName: string,
  primaryFieldName: string,
  pageNumber: number,
  records: [{
    count: number
  }]
}

export interface FireberryObjectsResponse<T> {
  success: boolean
  data: T,
  message: string
}

export interface FireberryTable {
  name: string,
  systemName: string,
  objectType: string,

  fields?: FireberryField[]
}

export interface FireberryQueries {
  objectType: number,
  views: [FireberryQuery],
  roleId: ''
}

export interface FireberryQuery {
  viewTableId: number
  clientsCount?: number

  viewSchemaId: string,
  viewName: string,
  folderName: string,
  isFavoriteView: boolean
  isDefaultView: boolean
}

export type FireberryTableData = {
  table: FireberryTable,
  queries: FireberryQuery[]
}

export interface FireberryRecord {
  [key: string]: any;
}

export function isSelectionBoxItem(obj: any): obj is FireberrySelectionBoxItem {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.value === 'string'
  )
}

export interface FireberrySelectionBoxItem {
  name: string,
  value: string
}

export enum FieldType {
  LookUp = "lookUp",
  DateTime = "dateTime",
  Text = "text",
  Telephone = "telephone",
  Email = "email",
}

export interface FireberryField {
  label: string;
  fieldName: string;
  systemFieldTypeId: string,
  systemName: string;
  type?: FieldType
  values?: FireberrySelectionBoxItem[]
}

export interface FireberryQueryResponse {
  viewId: string;
  objectType: number;
  primaryKeyName: string;
  primaryFieldName: string;
  records: FireberryRecord[]; // Now supports any key-value pairs
  fields: FireberryField[];
  pageNumber: number;
}

export enum FireberryFieldTypeId {
  selectionBox = 'b4919f2e-2996-48e4-a03c-ba39fb64386c',
  telephone = "telephone"
}