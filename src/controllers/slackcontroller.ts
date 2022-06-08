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

        const userInfo = await this.fetchUserInfo(userId);

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

        const parsedMessage = await this.parseSlackMessage(
          message.blocks[0].elements[0].elements
        );

        threadMessages.push({
          id: message.client_msg_id,
          provider: Provider.SLACK,
          createdAt: new Date(message.ts * 1000).toISOString(),
          userInfo: {
            name: userInfo.real_name,
            userName: userInfo.name,
            profileImageUrl: userInfo.profile.image_original,
          },
          text: parsedMessage,
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

  parseSlackMessage = async (messageElements: any[]): Promise<string> => {
    let message = '';

    for await (const element of messageElements) {
      if (element.type === 'broadcast') message += `@${element.range}`;
      if (element.type === 'user') {
        const mentionedUserInfo = await this.fetchUserInfo(element.user_id);
        message += `@${mentionedUserInfo.name}`;
      }
      if (element.type === 'text') message += element.text;
      if (element.type === 'emoji') message += `:${element.name}:`;
    }

    return message;
  };

  fetchUserInfo = async (userId: string): Promise<any> => {
    const cachedReplyUserData = this._cache.get(
      userId.toString(),
      this._slackUserIdCacheLabel
    );

    let userInfo: any;

    if (cachedReplyUserData) {
      userInfo = cachedReplyUserData;
    } else {
      userInfo = ((await this._slackManager.getUserInfo(userId)).data as any)
        .user;
      this._cache.set(userId.toString(), this._slackUserIdCacheLabel, userInfo);
    }

    return userInfo;
  };

  fetchMessageReplies = async (messageReplies: any[]): Promise<any[]> => {
    const threadReplies: GenericThread[] = [];
    messageReplies.map(async reply => {
      const replyUserId = reply.user;
      const replyUserInfo = await this.fetchUserInfo(replyUserId);

      threadReplies.push({
        id: reply.client_msg_id,
        text: reply.text,
        createdAt: new Date(reply.ts * 1000).toISOString(),
        userInfo: {
          name: replyUserInfo.real_name,
          userName: replyUserInfo.name,
          profileImageUrl: replyUserInfo.profile.image_original,
        },
      });
    });

    return threadReplies;
  };
}

export default SlackController;
