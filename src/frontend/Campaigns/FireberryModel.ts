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

export interface TablesResponse {
  viewId: string,
  objectType: number,
  primaryKeyName: string,
  primaryFieldName: string,
  records: [FireberryTable],
  pageNumber: number
}

export interface FireberryTable {
  mdobjectid: string,
  name: string,
  objectcustomtypecode: number,
  objectcustomtype: string,
  objecttypecode: number
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

export interface FireberryField {
  logicalName: string;
  fieldObjectType: string;
  label: string;
  isMultiObject: string;
  type: string;
  width: number;
  precision: string;
  groupdigits: boolean;
  display: string;
  displayname?: string;
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