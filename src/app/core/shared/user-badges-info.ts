export interface UserBadgesInfo {
  producerLeftPoints: number;
  agentLeftPoints: number;
  producerBadge: {
    id: number;
    title: string;
    points: number;
    badgeType: string;
    smallImageUrl: string;
    largeImageUrl: string;
  };
  agentBadge: {
    id: number;
    title: string;
    points: number;
    badgeType: string;
    smallImageUrl: string;
    largeImageUrl: string;
  };
}
