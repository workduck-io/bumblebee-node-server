export interface GotResponse {
  data: unknown;
  status: number;
}

export interface GotClientType {
  get(url: string, authToken: string): Promise<GotResponse>;
}
