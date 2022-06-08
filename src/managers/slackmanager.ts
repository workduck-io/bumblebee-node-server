import 'reflect-metadata';
import { injectable } from 'inversify';
import { errorlib } from '../libs/errorlib';
import { errorCodes, statusCodes } from '../libs/constants';
import { getFromSlack } from '../libs/gotclient';
import { GotResponse } from '../interfaces/gotclient';
import {
  SlackConversationHistoryParams,
  SlackRepliesParams,
  SlackUserInfoParams,
} from '../interfaces/slack';

@injectable()
export class SlackManager {
  public baseEndpointURL = 'https://slack.com/api/';
  private token = process.env.SLACK_BEARER_TOKEN;
  async getSlackMessages(channelId: string): Promise<GotResponse> {
    try {
      const params: SlackConversationHistoryParams = {
        channel: channelId,
        limit: 10,
        inclusive: true,
      };
      const url = `${this.baseEndpointURL}conversations.history`;
      return await getFromSlack(url, this.token, params);
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

  async getSlackTeamInfo(): Promise<GotResponse> {
    try {
      const url = `${this.baseEndpointURL}team.info`;
      return await getFromSlack(url, this.token);
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

  async getReplies(channelId: string, timeStamp: string): Promise<GotResponse> {
    try {
      const params: SlackRepliesParams = {
        channel: channelId,
        ts: timeStamp,
        limit: 10,
        inclusive: true,
      };
      const url = `${this.baseEndpointURL}conversations.replies`;
      return await getFromSlack(url, this.token, params);
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
      const params: SlackUserInfoParams = {
        user: userId,
      };
      const url = `${this.baseEndpointURL}users.info`;
      return await getFromSlack(url, this.token, params);
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
