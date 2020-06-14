export interface BusinessType {
  id: number;
  code: string;
  description: string;
  subCategories: BusinessType[];
  level?: number;
  parentId?: number;
  url?: string;
  picture?: string;
}
