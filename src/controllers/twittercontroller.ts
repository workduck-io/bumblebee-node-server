import express, { Request, Response } from 'express';
import { TwitterManager } from '../managers/twittermanager';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeTwitterRoutes } from '../routes/twitterroutes';
import { GenericResponse, Provider } from '../interfaces/generics';
import {
  serializedTwitterUserInfo,
  serializeTwitterReplies,
} from '../libs/serializer';
import { Cache } from '../libs/cache';

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
      const tweet = (await this._twitterManager.getTweet(tweetId))
        .data[0] as any;

      const tweetReplies = (
        await this._twitterManager.searchTweets(tweet.conversation_id)
      ).data as any;

      const userIds: string[] = [];
      // craft the payload of all userIds from the tweet replies
      tweetReplies.map(tweetReply => userIds.push(tweetReply.author_id));

      let usersData: any[];

      const cachedUserData = this._cache.get(
        userIds.toString(),
        this._twitterUserIdCacheLabel
      );

      if (cachedUserData) {
        usersData = cachedUserData;
      } else {
        usersData = (await this._twitterManager.getUserData(userIds.toString()))
          .data as any[];
        this._cache.set(
          userIds.toString(),
          this._twitterUserIdCacheLabel,
          usersData
        );
      }

      const genericResponse: GenericResponse = {
        provider: Provider.TWITTER,
        threads: serializeTwitterReplies(tweetReplies),
        userInfo: serializedTwitterUserInfo(usersData),
      };

      response.status(statusCodes.OK).json(genericResponse);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default TwitterController;
