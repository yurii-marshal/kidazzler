export interface BusinessPhoto {
  id?: number;
  url: string;
  preview: string;
  primary?: boolean;
  uploadedByCustomer: boolean;
  anonymous: boolean;
  createdAt: string | Date;
  user?: {
    name: string;
    producerBadgeId: number;
  };
}
