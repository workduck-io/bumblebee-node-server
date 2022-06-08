import { injectable } from 'inversify';
import { errorCodes, statusCodes } from '../libs/constants';
import { errorlib } from '../libs/errorlib';
import { getFromDiscord } from '../libs/gotclient';

@injectable()
export class DiscordManager {
  public baseEndpointURL = 'https://discord.com/api';
  private token = process.env.DISCORD_BEARER_TOKEN;

  async getDiscordMessages(channelId: string): Promise<any> {
    try {
      const url = `${this.baseEndpointURL}/channels/${channelId}/messages`;
      const discordParams = {
        limit: 10,
      };
      return await getFromDiscord(url, this.token, discordParams);
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
