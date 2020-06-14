import { BusinessPhoto } from './business-photo.model';

export interface Deal {
  id?: number;
  name?: string;
  businessId?: number;
  discount?: number;
  discountType?: string;
  expireAt?: Date;
  details?: string;
  mediaUrl?: string;
  code?: string;
  title?: string;
  city?: string;
  state?: string;
  description?: string;
  eventCategories?: [];
  isExpires?: string;
  expiresDate?: string;
  price?: string;
  currency?: string;
  priceDetails?: string;
  photos?: BusinessPhoto[];
  primaryPhoto?: string;
  coverImg?: BusinessPhoto | string;
}
