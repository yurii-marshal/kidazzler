import { BusinessPhoto } from './business-photo.model';

export interface BusinessEvent {
  id?: number;
  businessId?: number;
  title?: string;
  description?: string;
  eventCategories?: [];
  picture?: string;
  preview?: string;
  price?: string;
  oldPrice?: number;
  currency?: string;
  priceDetails?: string;
  locationType?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  timeType?: string; //onetime; daily; weekly
  start?: Date;
  end?: Date;
  allDay?: boolean;
  weekdays?: string;
  expireAt?: string;
  discountedPrice?: number;
  website?: string;
  photos?: BusinessPhoto[];
}
