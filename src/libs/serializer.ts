import { GenericThread, GenericUser } from '../interfaces/generics';

export const serializeTwitterReplies = (
  twitterReplies: any[]
): GenericThread[] => {
  const serializedReplies: GenericThread[] = [];
  twitterReplies.map(twitterReply => {
    serializedReplies.push({
      text: twitterReply.text,
      createdAt: twitterReply.created_at,
      userId: twitterReply.author_id,
    });
  });
  return serializedReplies;
};

export const serializedTwitterUserInfo = (userInfoes: any[]): GenericUser[] => {
  const serializedUserInfoes: GenericUser[] = [];
  userInfoes.map(userInfo => {
    serializedUserInfoes.push({
      name: userInfo.name,
      userName: userInfo.username,
      profileImageUrl: userInfo.profile_image_url,
    });
  });
  return serializedUserInfoes;
};
