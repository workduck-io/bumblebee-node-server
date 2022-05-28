import express, { Request, Response } from 'express';
import { TwitterManager } from '../managers/twittermanager';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeTwitterRoutes } from '../routes/twitterroutes';
import { GenericResponse, Provider } from '../interfaces/generics';
import { serializeTwitterReplies } from '../libs/serializer';
import { Cache } from '../libs/cache';

class TwitterController {
  private _twitterManager: TwitterManager =
    container.get<TwitterManager>(TwitterManager);
  private _cache: Cache = container.get<Cache>(Cache);
  private _twitterUserIdCacheLabel = 'TWITTERUSERID';
  private HARD_FETCH_USER_INFO = true;

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
      // craft the payload of all userIds from the tweet replies
      tweetReplies.map(tweetReply => userIds.push(tweetReply.author_id));

      const usersData: any[] = [];

      // hard fetch all the users info as a batch for the first time
      if (this.HARD_FETCH_USER_INFO) {
        usersData.push(
          ...((await this._twitterManager.getUserData(userIds.toString()))
            .data as any[])
        );
        // update the cache
        this.addUserDataToCache(userIds, usersData);
        // turn off the hard fetch for the subsequent requests
        this.HARD_FETCH_USER_INFO = false;
      }
      // soft fetch from the cache stored from the previous requests
      else {
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
            await this._twitterManager.getUserData(
              cacheMissedUserIds.toString()
            )
          ).data as any[];
          usersData.push(...cacheMissedUsers);
          this.addUserDataToCache(cacheMissedUserIds, cacheMissedUsers);
        }
      }

      const genericResponse: GenericResponse = {
        provider: Provider.TWITTER,
        threads: serializeTwitterReplies(tweetReplies, usersData),
      };

      response.status(statusCodes.OK).json(genericResponse);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };

  private addUserDataToCache = (userIds: string[], usersData: any[]) => {
    for (let index = 0; index < usersData.length; index++) {
      this._cache.set(
        userIds[index],
        this._twitterUserIdCacheLabel,
        usersData[index]
      );
    }
  };
}

export default TwitterController;
