export type GenericType =
  | string
  | number
  | boolean
  | GenericObjectType
  | Array<GenericType>;

export type GenericObjectType = { [x: string]: GenericType };

export enum Provider {
  SLACK = 'slack',
  TWITTER = 'twitter',
}

export interface GenericThread {
  text: string;
  createdAt: string;
  userInfo: UserInfo;
  replies?: GenericThread[];
  tweetURL?: string;
}

export interface UserInfo {
  userName: string;
  name: string;
  profileImageUrl: string;
}

export interface GenericResponse {
  provider: Provider;
  threads: GenericThread[];
}
