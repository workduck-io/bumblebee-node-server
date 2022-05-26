import SlackController from '../controllers/slackcontroller';

export const initializeSlackRoutes = (
  slackControllerObject: SlackController
): void => {
  const urlPath = '/slack';

  slackControllerObject.router.get(
    `${urlPath}/:channelId`,
    slackControllerObject.getAllSlackMessages
  );
};
