import { UserRole } from '../../core/shared/enums/user-role.enum';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  invitationCode?: string;
  avatar?: string;
  emailNotification: boolean;
  maxLevelProducer: boolean;
  maxLevelAgent: boolean;
  businessesCount: number;
  friendsCount: number;
  longitude: number;
  latitude: number;
  phoneMask?: string;
  phoneCode?: string;
  role: UserRole;
  referrerInvitationCode?: string;
  emailVerified?: boolean;
  state?: string;
  city?: string;
  country?: string;
  phone?: string;
  phoneVerified?: boolean;
  totalPoints?: number;
  canEditFriendsBusinesses?: boolean;
}
