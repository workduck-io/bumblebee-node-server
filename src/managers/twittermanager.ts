import 'reflect-metadata';
import { injectable } from 'inversify';
import { errorlib } from '../libs/errorlib';
import { errorCodes, statusCodes } from '../libs/constants';
import { getFromTwitter } from '../libs/gotclient';
import { GotResponse } from '../interfaces/gotclient';
import { TwitterLookup } from '../interfaces/twitter';

@injectable()
export class TwitterManager {
  public baseEndpointURL = 'https://api.twitter.com/2/';
  private token = process.env.TWITTER_BEARER_TOKEN;

  async searchTweets(conversationId: string): Promise<GotResponse> {
    try {
      const searchTweetUrl = `${this.baseEndpointURL}tweets/search/recent`;
      const allRepliesParams: TwitterLookup = {
        'tweet.fields':
          'conversation_id,in_reply_to_user_id,author_id,created_at',
        'user.fields': 'description',
        query: `conversation_id:${conversationId}`,
      };

      return await getFromTwitter(searchTweetUrl, this.token, allRepliesParams);
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

  async getUserData(userIds: string): Promise<GotResponse> {
    try {
      const params: TwitterLookup = {
        ids: userIds,
        'user.fields': 'id,profile_image_url,username,name,description',
      };

      const url = `${this.baseEndpointURL}users`;
      const usersData = await getFromTwitter(url, this.token, params);
      return usersData;
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
