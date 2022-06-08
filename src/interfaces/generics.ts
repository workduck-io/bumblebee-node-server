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
  BUMBLEBEE = 'bumblebee',
  DISCORD = 'discord',
}

export interface GenericThread {
  provider?: Provider;
  id?: string;
  text: string;
  createdAt: string;
  userInfo: UserInfo;
  replies?: GenericThread[];
  tweetURL?: string;
}

export interface UserInfo {
  userName?: string;
  name: string;
  profileImageUrl: string;
}

export interface GenericResponse {
  provider: Provider;
  threads: GenericThread[];
}
