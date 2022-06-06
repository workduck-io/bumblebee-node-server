import TwitterController from '../controllers/twittercontroller';
import { TwitterTokenValidator } from '../middlewares/tokenvalidator';

export const initializeTwitterRoutes = (
  twitterControllerObject: TwitterController
): void => {
  const urlPath = '/twitter';

  twitterControllerObject.router.get(
    `${urlPath}/:tweetId`,
    [TwitterTokenValidator],
    twitterControllerObject.getAllRepliesInfo
  );
};
