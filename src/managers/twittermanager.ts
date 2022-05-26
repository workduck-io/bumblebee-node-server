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
  async getTweet(tweetId: string): Promise<GotResponse> {
    try {
      const token = process.env.TWITTER_BEARER_TOKEN;
      const params: TwitterLookup = {
        ids: tweetId,
        'tweet.fields': 'conversation_id',
      };
      const url = `${this.baseEndpointURL}tweets`;
      return await getFromTwitter(url, token, params);
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

  async searchTweets(conversationId: string): Promise<GotResponse> {
    try {
      const token = process.env.TWITTER_BEARER_TOKEN;
      const searchTweetUrl = `${this.baseEndpointURL}tweets/search/recent`;
      const allRepliesParams: TwitterLookup = {
        'tweet.fields':
          'conversation_id,in_reply_to_user_id,author_id,created_at',
        'user.fields': 'description',
        query: `conversation_id:${conversationId}`,
      };

      return await getFromTwitter(searchTweetUrl, token, allRepliesParams);
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
      const token = process.env.TWITTER_BEARER_TOKEN;
      const params: TwitterLookup = {
        ids: userIds,
        'user.fields': 'id,profile_image_url,username,name,description',
      };

      const url = `${this.baseEndpointURL}users`;
      const usersData = await getFromTwitter(url, token, params);
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
