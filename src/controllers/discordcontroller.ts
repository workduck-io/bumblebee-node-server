import express, { Request, Response } from 'express';
import container from '../inversify.config';
import { statusCodes } from '../libs/constants';
import { Cache } from '../libs/cache';
import { DiscordManager } from '../managers/discordmanager';
import { initializeDiscordRoutes } from '../routes/discordroutes';
import { serializeDiscordMessages } from '../libs/serializer';

class DiscordController {
  private _discordManager: DiscordManager =
    container.get<DiscordManager>(DiscordManager);
  public router = express.Router();
  private _cache: Cache = container.get<Cache>(Cache);
  private _discordUserIdCacheLabel = 'DISCORDUSERID';

  constructor() {
    initializeDiscordRoutes(this);
  }

  getAllDiscordMessages = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const channelId = request.params.channelId;
      const messages = (
        await this._discordManager.getDiscordMessages(channelId)
      ).data as any[];

      const discordMessageDict: Record<string, any> = {};

      //create message dict with message_id as key and the message as the value
      messages.map(message => {
        message.replies = [];
        discordMessageDict[message.id] = message;
      });

      messages.map(message => {
        if (message.message_reference) {
          const referencedMessage =
            discordMessageDict[message.message_reference.message_id];

          if (referencedMessage) {
            referencedMessage.replies.push(message);
          }

          delete discordMessageDict[message.id];
        }
      });

      const flatMessages: any[] = [];

      for (const messageKey of Object.keys(discordMessageDict)) {
        flatMessages.push(discordMessageDict[messageKey]);
      }

      response
        .status(statusCodes.OK)
        .json(serializeDiscordMessages(flatMessages));
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default DiscordController;
