export interface RewardInfoItem {
  own: number;
  secondLevel: number;
  thirdLevel: number;
}

export interface RewardInfo {
  perBusiness: RewardInfoItem;
  businessesCount: RewardInfoItem;
  memberBusinessesCount: RewardInfoItem;
  actualTotal: number;
  total: number;
}

export enum RewardType {
  actual = 'actual',
  potential = 'potential',
}
