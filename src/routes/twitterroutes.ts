import TwitterController from '../controllers/twittercontroller';

export const initializeTwitterRoutes = (
  twitterControllerObject: TwitterController
): void => {
  const urlPath = '/twitter';

  twitterControllerObject.router.get(
    `${urlPath}/:tweetId`,
    twitterControllerObject.getAllRepliesInfo
  );
};
