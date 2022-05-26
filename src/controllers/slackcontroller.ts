import express, { Request, Response } from 'express';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { initializeSlackRoutes } from '../routes/slackroutes';
import { SlackManager } from '../managers/slackmanager';
import {
  GenericResponse,
  Provider,
  GenericThread,
} from '../interfaces/generics';
import { Cache } from '../libs/cache';

class SlackController {
  private _slackManager: SlackManager =
    container.get<SlackManager>(SlackManager);
  public router = express.Router();
  private _cache: Cache = container.get<Cache>(Cache);
  private _slackUserIdCacheLabel = 'SLACKUSERID';

  private excludeMessageSubtypes = [
    'channel_join',
    'channel_leave',
    'channel_name',
    'channel_topic',
    'channel_purpose',
    'channel_archive',
    'channel_unarchive',
  ];

  constructor() {
    initializeSlackRoutes(this);
  }

  getAllSlackMessages = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const channelId = request.params.channelId;
      const messages = (
        (await this._slackManager.getSlackMessages(channelId)).data as any
      ).messages;

      const threadMessages: GenericThread[] = [];
      for (const message of messages) {
        if (this.excludeMessageSubtypes.includes(message.subtype)) continue;

        const userId = message.user;
        const cachedUserData = this._cache.get(
          userId.toString(),
          this._slackUserIdCacheLabel
        );

        let userInfo: any;

        if (cachedUserData) {
          userInfo = cachedUserData;
        } else {
          userInfo = (
            (await this._slackManager.getUserInfo(userId)).data as any
          ).user;
          this._cache.set(
            userId.toString(),
            this._slackUserIdCacheLabel,
            userInfo
          );
        }
        threadMessages.push({
          createdAt: new Date(message.ts * 1000).toISOString(),
          name: userInfo.real_name,
          userName: userInfo.name,
          profileImageUrl: userInfo.profile.image_original,
          text: message.text,
        });
      }

      const genericResponse: GenericResponse = {
        provider: Provider.SLACK,
        threads: threadMessages,
      };

      response.status(statusCodes.OK).json(genericResponse);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default SlackController;
