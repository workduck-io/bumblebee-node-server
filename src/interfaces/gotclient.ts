export interface GotResponse {
  data: unknown;
}

export interface GotClientType {
  get(url: string, authToken: string): Promise<GotResponse>;
}
