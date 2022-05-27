export interface SlackConversationHistoryParams {
  channel: string;
  limit?: number;
  inclusive?: boolean;
}

export interface SlackUserInfoParams {
  user: string;
}

export interface SlackRepliesParams {
  channel: string;
  ts: string;
  limit?: number;
  inclusive?: boolean;
}
