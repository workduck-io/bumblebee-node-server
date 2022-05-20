import { injectable } from 'inversify';
import { errorlib } from '../libs/errorlib';
import { errorCodes, statusCodes } from '../libs/constants';
// import 'reflect-metadata';
import { GotClient } from '../libs/gotclient';
import container from '../inversify.config';
import { GotResponse } from '../interfaces/gotclient';

@injectable()
export class TwitterManager {
  public _got: GotClient = container.get<GotClient>(GotClient);
  public baseEndpointURL = 'https://api.twitter.com/2/';
  async getAllTweets(tweetId: string): Promise<GotResponse> {
    try {
      const url = `${this.baseEndpointURL}tweets?ids=${tweetId}`;
      const response = await this._got.get(url, process.env.BEARER_TOKEN);
      return response;
    } catch (error) {
      errorlib({
        message: error.message,
        errorCode: errorCodes.UNKNOWN,
        errorObject: error,
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        metaData: error.message,
      });
    }
  }
}
