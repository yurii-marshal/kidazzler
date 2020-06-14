import { Amenity } from './amenity';
import { BusinessPhoto } from './business-photo.model';
import { BusinessType } from './business-type.model';

export interface Business {
  id?: number;
  name: string;
  phone: string;
  phone2?: string;
  primaryPhoto?: BusinessPhoto;
  email?: string;
  website?: string;
  businessType: any; // todo: remove deprecated in sprint 33
  businessTypes: BusinessType[];
  businessDirection: string;
  isClaimed: boolean;
  country: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  status?: string;
  zip?: string;
  closed: boolean;
  byAppointment: boolean;
  rating?: number;
  about: string;
  featured: boolean;
  userRating?: number;
  userCheckedIn?: boolean;
  ageFrom?: number;
  ageTo?: number;
  amenities?: Amenity[];
  workingHours?: any;
  longitude: string;
  latitude: string;
  checkInsCount: number;
  memberAt: Date;
  checkInCode?: string;
  checkInCodeGeneratedAt?: any;
  hidePhone?: boolean;
  locationType?: string;
  published?: boolean;
  businessTypeId?: number;
  eventsCount: number;
  dealsCount: number;
}
