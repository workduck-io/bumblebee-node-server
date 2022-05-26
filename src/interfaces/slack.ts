export interface SlackConversationHistoryParams {
  channel: string;
  limit?: number;
  inclusive?: boolean;
}

export interface SlackUserInfoParams {
  user: string;
}
