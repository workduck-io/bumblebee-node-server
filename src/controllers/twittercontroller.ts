import express, { Request, Response } from 'express';
import { TwitterManager } from '../managers/twittermanager';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeTwitterRoutes } from '../routes/twitterroutes';
import { GenericResponse, Provider } from '../interfaces/generics';
import { serializeTwitterReplies } from '../libs/serializer';
import { Cache } from '../libs/cache';
import _ from 'lodash';

class TwitterController {
  private _twitterManager: TwitterManager =
    container.get<TwitterManager>(TwitterManager);
  private _cache: Cache = container.get<Cache>(Cache);
  private _twitterUserIdCacheLabel = 'TWITTERUSERID';

  public router = express.Router();

  constructor() {
    initializeTwitterRoutes(this);
  }

  getAllRepliesInfo = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const tweetId = request.params.tweetId;

      const tweetReplies = (await this._twitterManager.searchTweets(tweetId))
        .data as any;

      const userIds: string[] = [];

      const referenceTweetDict: Record<string, any[]> = {};
      const tweetDict: Record<string, any> = {};

      if (!tweetReplies) {
        response.status(statusCodes.OK).json({
          provider: Provider.TWITTER,
          threads: [],
        });
        return;
      }
      // craft the payload of all userIds from the tweet replies
      tweetReplies.map(tweetReply => {
        tweetDict[tweetReply.id] = tweetReply;

        if (referenceTweetDict[tweetReply.referenced_tweets[0].id])
          referenceTweetDict[tweetReply.referenced_tweets[0].id].push(
            tweetReply
          );
        else {
          referenceTweetDict[tweetReply.referenced_tweets[0].id] = [];
          referenceTweetDict[tweetReply.referenced_tweets[0].id].push(
            tweetReply
          );
        }
        userIds.push(tweetReply.author_id);

        if (tweetReply.in_reply_to_user_id)
          userIds.push(tweetReply.in_reply_to_user_id);
      });

      const parsedTweets: any[] = [];
      for (const key of Object.keys(referenceTweetDict)) {
        parsedTweets.push(...this.parseTweets(key, referenceTweetDict));
      }

      this.checkForMissingTweets(parsedTweets, tweetId);

      const usersData: any[] = [];

      usersData.push(...(await this.handleUserCacheFetch(userIds, usersData)));

      const genericResponse: GenericResponse = {
        provider: Provider.TWITTER,
        threads: serializeTwitterReplies(parsedTweets, usersData, tweetId),
      };

      response.status(statusCodes.OK).json(genericResponse);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };

  private parseTweets = (tweetId: string, tweetDict: Record<string, any[]>) => {
    const result: any[] = [];

    const tweets = tweetDict[tweetId];

    for (const tweet of tweets) {
      const tweetClone = _.cloneDeep(tweet);
      if (tweetDict[tweet.id]) tweetClone.replies = tweetDict[tweet.id];

      result.push(tweetClone);
    }

    return result;
  };

  private checkForMissingTweets = (parsedTweets: any[], tweetId: string) => {
    const missingTweets: string[] = [];

    for (const parsedTweet of parsedTweets) {
      let isPresent = false;
      for (const parsedTweet_2nd_instance of parsedTweets)
        if (
          parsedTweet.referenced_tweets[0].id === parsedTweet_2nd_instance.id &&
          parsedTweet.referenced_tweets[0].id !== tweetId
        )
          isPresent = true;

      if (!isPresent) missingTweets.push(parsedTweet.id);
    }

    for (const missingTweet of missingTweets) {
      for (const parsedTweet of parsedTweets) {
        if (
          missingTweet === parsedTweet.id &&
          parsedTweet.referenced_tweets[0].id !== tweetId
        )
          parsedTweet.tweetUrl = `https://twitter.com/anyUser/status/${parsedTweet.referenced_tweets[0].id}`;
      }
    }
  };

  private handleUserCacheFetch = async (
    userIds: string[],
    usersData: any[]
  ) => {
    const cacheMissedUserIds: any[] = [];

    for (let index = 0; index < userIds.length; index++) {
      const cachedUserData = this._cache.get(
        userIds[index],
        this._twitterUserIdCacheLabel
      );
      // cache hit, so fetch it
      if (cachedUserData) usersData.push(cachedUserData);
      else cacheMissedUserIds.push(userIds[index]);
    }

    // hard fetch the cache missed items
    if (cacheMissedUserIds.length) {
      const cacheMissedUsers = (
        await this._twitterManager.getUserData(cacheMissedUserIds.toString())
      ).data as any[];
      usersData.push(...cacheMissedUsers);
      this.addUserDataToCache(cacheMissedUserIds, cacheMissedUsers);
    }

    return usersData;
  };

  private addUserDataToCache = (userIds: string[], usersData: any[]) => {
    for (let index = 0; index < usersData.length; index++) {
      if (!this._cache.has(userIds[index], this._twitterUserIdCacheLabel))
        this._cache.set(
          userIds[index],
          this._twitterUserIdCacheLabel,
          usersData[index]
        );
    }
  };
}

export default TwitterController;
