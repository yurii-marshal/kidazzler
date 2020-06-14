export enum ELoginTypeNames {
  parent = 'parent',
  business = 'business',
}
export enum ELoginUrls {
  parent = '/login',
  business = '/login/business',
}
export interface ILoginType {
  name: ELoginTypeNames;
  url: ELoginUrls;
}

export const LoginTypes: ILoginType[] = [
  {
    name: ELoginTypeNames.parent,
    url: ELoginUrls.parent,
  },
  {
    name: ELoginTypeNames.business,
    url: ELoginUrls.business,
  },
];
