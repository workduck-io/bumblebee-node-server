import express, { Request, Response } from 'express';
import { TwitterManager } from '../managers/twittermanager';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeTwitterRoutes } from '../routes/twitterroutes';
import { GenericResponse, Provider } from '../interfaces/generics';

class TwitterController {
  public _twitterManager: TwitterManager =
    container.get<TwitterManager>(TwitterManager);
  public _router = express.Router();

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

      const usersData = (
        await this._twitterManager.getUserData(userIds.toString())
      ).data as any;

      const genericResponse: GenericResponse = {
        provider: Provider.TWITTER,
        threads: tweetReplies,
        userInfo: usersData,
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
