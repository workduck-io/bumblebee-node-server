import got, { OptionsOfTextResponseBody } from 'got';
import { injectable } from 'inversify';
import { GotClientType, GotResponse } from '../interfaces/gotclient';
import StatsMap from 'stats-map';
import mem from 'mem';
import 'reflect-metadata';
@injectable()
export class GotClient implements GotClientType {
  private _requestTimeout = 15000;
  private _gotResponse: GotResponse = { data: null, status: null };
  private _cache = new StatsMap();
  private _memGot = mem(got, { cache: this._cache });

  private _gotConfig: OptionsOfTextResponseBody = {
    hooks: {
      afterResponse: [
        (response, _) => {
          this._gotResponse.status = response.statusCode;
          this._gotResponse.data = response.body;
          return response;
        },
      ],
    },
    retry: {
      calculateDelay: ({ computedValue }) => {
        return computedValue / 10;
      },
    },
    timeout: {
      request: this._requestTimeout,
    },
  };

  async get(
    url: string,
    authToken: string,
    searchParams?: any
  ): Promise<GotResponse> {
    this._gotResponse = await this._memGot
      .get(url, {
        headers: {
          'User-Agent': 'v2TweetLookupJS',
          authorization: `Bearer ${authToken}`,
        },
        ...(searchParams && { searchParams }),
        ...this._gotConfig,
      })
      .json();

    return this._gotResponse;
  }
}
