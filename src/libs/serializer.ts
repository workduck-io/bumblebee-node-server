import {
  GenericResponse,
  GenericThread,
  Provider,
} from '../interfaces/generics';

export const serializeTwitterReplies = (
  tweetReplies: any[],
  usersData: any[],
  tweetId: string
): GenericThread[] => {
  const serializedTweets: GenericThread[] = [];

  for (let index = 0; index < tweetReplies.length; index++) {
    const tweetReply = tweetReplies[index];
    let userDataDict: Record<string, any> = {};

    usersData.map(user => {
      userDataDict[user.id] = user;
    });

    serializedTweets.push({
      createdAt: tweetReply.created_at,
      text: tweetReply.text,
      userInfo: {
        name: userDataDict[tweetReply.author_id].name,
        profileImageUrl: userDataDict[tweetReply.author_id].profile_image_url,
        userName: userDataDict[tweetReply.author_id].username,
      },
      ...(tweetReply.replies && {
        replies: serializeReplies(tweetReply.replies, userDataDict),
      }),
      ...(tweetReply.tweetUrl && {
        tweetURL: tweetReply.tweetUrl,
      }),
    });
  }
  return serializedTweets;
};

const serializeReplies = (
  replies: any[],
  usersDataDict: Record<string, any>
): GenericThread[] => {
  const serializedTweetsCollection: GenericThread[] = [];

  for (let index = 0; index < replies.length; index++) {
    const tweetReply = replies[index];

    serializedTweetsCollection.push({
      createdAt: tweetReply.created_at,
      text: tweetReply.text,
      userInfo: {
        name: usersDataDict[tweetReply.author_id].name,
        profileImageUrl: usersDataDict[tweetReply.author_id].profile_image_url,
        userName: usersDataDict[tweetReply.author_id].username,
      },
    });
  }
  return serializedTweetsCollection;
};

export const serializeTestimonials = (testimonials: any[]): GenericResponse => {
  const serializedTestimonials: GenericResponse = {
    provider: Provider.BUMBLEBEE,
    threads: [],
  };

  testimonials.map(testimonial => {
    serializedTestimonials.threads.push({
      id: testimonial.id,
      createdAt: testimonial.created_at,
      text: testimonial.text,
      userInfo: {
        name: testimonial.name,
        profileImageUrl: testimonial.profile_image_url,
      },
    });
  });

  return serializedTestimonials;
};
