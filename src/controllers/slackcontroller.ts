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
        const messageReplies: any[] = (
          (await this._slackManager.getReplies(channelId, message.ts))
            .data as any
        ).messages.slice(1);

        const threadReplies: GenericThread[] = [];
        // append replies to the response
        messageReplies &&
          threadReplies.push(
            ...(await this.fetchMessageReplies(messageReplies))
          );

        threadMessages.push({
          createdAt: new Date(message.ts * 1000).toISOString(),
          name: userInfo.real_name,
          userName: userInfo.name,
          profileImageUrl: userInfo.profile.image_original,
          text: message.text,
          replies: threadReplies,
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

  fetchMessageReplies = async (messageReplies: any[]): Promise<any[]> => {
    const threadReplies: GenericThread[] = [];
    messageReplies.map(async reply => {
      const replyUserId = reply.user;
      const cachedReplyUserData = this._cache.get(
        replyUserId.toString(),
        this._slackUserIdCacheLabel
      );

      let replyUserInfo: any;

      if (cachedReplyUserData) {
        replyUserInfo = cachedReplyUserData;
      } else {
        replyUserInfo = (
          (await this._slackManager.getUserInfo(replyUserId)).data as any
        ).user;
        this._cache.set(
          replyUserId.toString(),
          this._slackUserIdCacheLabel,
          replyUserInfo
        );
      }
      threadReplies.push({
        text: reply.text,
        createdAt: new Date(reply.ts * 1000).toISOString(),
        name: replyUserInfo.real_name,
        userName: replyUserInfo.name,
        profileImageUrl: replyUserInfo.profile.image_original,
      });
    });

    return threadReplies;
  };
}

export default SlackController;
