import { DiscordTokenValidator } from '../middlewares/tokenvalidator';
import DiscordController from '../controllers/discordcontroller';

export const initializeDiscordRoutes = (
  discordControllerObject: DiscordController
): void => {
  const urlPath = '/discord';

  discordControllerObject.router.get(
    `${urlPath}/:channelId`,
    [DiscordTokenValidator],
    discordControllerObject.getAllDiscordMessages
  );
};
