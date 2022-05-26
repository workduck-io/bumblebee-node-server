import 'reflect-metadata';
import { injectable } from 'inversify';
import { errorlib } from '../libs/errorlib';
import { errorCodes, statusCodes } from '../libs/constants';
import { getFromSlack } from '../libs/gotclient';
import { GotResponse } from '../interfaces/gotclient';
import {
  SlackConversationHistoryParams,
  SlackUserInfoParams,
} from '../interfaces/slack';

@injectable()
export class SlackManager {
  public baseEndpointURL = 'https://slack.com/api/';
  async getSlackMessages(channelId: string): Promise<GotResponse> {
    try {
      const token = process.env.SLACK_BEARER_TOKEN;

      const params: SlackConversationHistoryParams = {
        channel: channelId,
        limit: 10,
        inclusive: true,
      };
      const url = `${this.baseEndpointURL}conversations.history`;
      return await getFromSlack(url, token, params);
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

  async getUserInfo(userId: string): Promise<GotResponse> {
    try {
      const token = process.env.SLACK_BEARER_TOKEN;

      const params: SlackUserInfoParams = {
        user: userId,
      };
      const url = `${this.baseEndpointURL}users.info`;
      return await getFromSlack(url, token, params);
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
