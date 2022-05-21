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
  userId: string;
  text: string;
  createdAt: string;
}

export interface GenericUser {
  userName: string;
  name: string;
  profileImageUrl: string;
}

export interface GenericResponse {
  provider: Provider;
  threads: GenericThread[];
  userInfo: GenericUser[];
}
