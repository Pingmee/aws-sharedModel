export enum ProductUpdateType {
  update = 'update',
  announcement = 'announcement',
  feature = 'feature',
}

export type ProductUpdate = {
  id: string
  createdAt: number
  body: string
  imageUrl: string
  type: ProductUpdateType
  title?: string
  linkUrl?: string
  published: boolean
}
