export interface SearchParams {
  category?: number;
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  query?: string;
  coordinatesBox?: string;
  nearby?: boolean;
  amenities?: any;
  ageFrom?: number;
  ageTo?: number;
  minRating?: string;
  byAppointment?: boolean;
  direction?: string;
  hasDeals?: boolean;
  hasEvents?: boolean;
  hasFreeEvents?: boolean;
  hasFreeDeals?: boolean;
  level?: number;
}
