export interface TwitterLookup {
  ids?: string;
  query?: string;
  'tweet.fields'?: string;
  'user.fields'?: string;
  expansions?: string;
}
