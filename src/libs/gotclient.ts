import got, { OptionsOfTextResponseBody } from 'got';
import { GotResponse } from '../interfaces/gotclient';

const requestTimeout = 15000;
const gotResponse: GotResponse = { data: null };
const gotConfig: OptionsOfTextResponseBody = {
  hooks: {
    afterResponse: [
      (response, _) => {
        gotResponse.data = response.body;
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
    request: requestTimeout,
  },
};

export const get = async (
  url: string,
  authToken: string,
  searchParams?: any
): Promise<GotResponse> => {
  return await got
    .get(url, {
      headers: {
        'User-Agent': 'v2TweetLookupJS',
        authorization: `Bearer ${authToken}`,
      },
      ...(searchParams && { searchParams }),
      ...gotConfig,
    })
    .json();
};
