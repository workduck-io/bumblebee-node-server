import TwitterController from '../controllers/twittercontroller';

export const initializeTwitterRoutes = (
  twitterControllerObject: TwitterController
): void => {
  const urlPath = '/twitter';

  twitterControllerObject._router.get(
    `${urlPath}/:tweetId`,
    twitterControllerObject.getTweet
  );
};
