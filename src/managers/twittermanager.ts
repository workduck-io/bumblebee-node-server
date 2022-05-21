import 'reflect-metadata';
import { injectable } from 'inversify';
import { errorlib } from '../libs/errorlib';
import { errorCodes, statusCodes } from '../libs/constants';
import { get } from '../libs/gotclient';
import { GotResponse } from '../interfaces/gotclient';
import { TwitterLookup } from '../interfaces/twitter';

@injectable()
export class TwitterManager {
  public baseEndpointURL = 'https://api.twitter.com/2/';
  async getAllTweets(tweetId: string): Promise<GotResponse> {
    try {
      const params: TwitterLookup = {
        ids: tweetId,
        'tweet.fields': 'conversation_id',
      };
      const url = `${this.baseEndpointURL}tweets`;
      const tweetWithConversationId = (
        await get(url, process.env.BEARER_TOKEN, params)
      ).data[0] as any;

      const searchTweetUrl = `${this.baseEndpointURL}tweets/search/recent`;
      const allRepliesParams: TwitterLookup = {
        'tweet.fields':
          'conversation_id,in_reply_to_user_id,author_id,created_at',
        query: `conversation_id:${tweetWithConversationId.conversation_id}`,
      };

      return await get(
        searchTweetUrl,
        process.env.BEARER_TOKEN,
        allRepliesParams
      );
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
