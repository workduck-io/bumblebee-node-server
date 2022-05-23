import { GenericThread } from '../interfaces/generics';

export const serializeTwitterReplies = (
  tweetReplies: any[],
  usersData: any[]
): GenericThread[] => {
  const serializedReplies: GenericThread[] = [];

  for (let index = 0; index < tweetReplies.length; index++) {
    const tweetReply = tweetReplies[index];
    delete tweetReply.id;
    const userData = usersData[index];
    delete userData.id;
    serializedReplies.push({
      createdAt: tweetReply.created_at,
      text: tweetReply.text,
      name: userData.name,
      profileImageUrl: userData.profile_image_url,
      userName: userData.username,
    });
  }
  return serializedReplies;
};
