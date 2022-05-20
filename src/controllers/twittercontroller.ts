import express, { Request, Response } from 'express';
import { TwitterManager } from '../managers/twittermanager';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeTwitterRoutes } from '../routes/twitterroutes';

class TwitterController {
  public _twitterManager: TwitterManager =
    container.get<TwitterManager>(TwitterManager);
  public _router = express.Router();

  constructor() {
    initializeTwitterRoutes(this);
  }

  getTweet = async (request: Request, response: Response): Promise<void> => {
    try {
      const tweetId = request.params.tweetId;
      const tweet = await this._twitterManager.getAllTweets(tweetId);

      response.status(statusCodes.OK).json(tweet);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default TwitterController;
