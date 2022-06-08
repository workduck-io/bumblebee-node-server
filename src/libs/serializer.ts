import {
  GenericResponse,
  GenericThread,
  Provider,
} from '../interfaces/generics';

const discordCDNURL = 'https://cdn.discordapp.com/';

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
      id: tweetReply.id,
      provider: Provider.TWITTER,
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
      ...(!tweetReply.replies && {
        tweetURL: `https://twitter.com/anyUser/status/${tweetReply.id}`,
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
      id: tweetReply.id,
      createdAt: tweetReply.created_at,
      text: tweetReply.text,
      userInfo: {
        name: usersDataDict[tweetReply.author_id].name,
        profileImageUrl: usersDataDict[tweetReply.author_id].profile_image_url,
        userName: usersDataDict[tweetReply.author_id].username,
      },
      tweetURL: `https://twitter.com/anyUser/status/${tweetReply.id}`,
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
      provider: Provider.BUMBLEBEE,
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

export const serializeDiscordMessages = (messages: any[]): GenericResponse => {
  const serializedDiscordMessages: GenericResponse = {
    provider: Provider.DISCORD,
    threads: [],
  };

  messages.map(message => {
    serializedDiscordMessages.threads.push({
      provider: Provider.DISCORD,
      createdAt: message.timestamp,
      text: message.content,
      id: message.id,
      userInfo: {
        name: message.author.username,
        profileImageUrl:
          message.author.avatar !== null
            ? `${discordCDNURL}avatars/${message.author.id}/${message.author.avatar}.png`
            : null,
      },
      replies: serializeDiscordReplies(message.replies),
    });
  });

  return serializedDiscordMessages;
};

const serializeDiscordReplies = (replies: any[]): GenericThread[] => {
  const serializedThreadReplies: GenericThread[] = [];

  replies.map(reply => {
    serializedThreadReplies.push({
      createdAt: reply.timestamp,
      text: reply.content,
      id: reply.id,
      userInfo: {
        name: reply.author.username,
        profileImageUrl:
          reply.author.avatar !== null
            ? `${discordCDNURL}avatars/${reply.author.id}/${reply.author.avatar}.png`
            : null,
      },
    });
  });

  return serializedThreadReplies;
};
