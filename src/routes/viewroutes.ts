import Auth from '../middlewares/auth';
import ViewController from '../controllers/viewcontroller';
import { InBuiltTokenValidator } from '../middlewares/tokenvalidator';

export const initializeViewRoutes = (
  ViewControllerObject: ViewController
): void => {
  ViewControllerObject.router.get(
    '/create',
    [InBuiltTokenValidator, Auth],
    ViewControllerObject.createTestimonial
  );
  ViewControllerObject.router.get(
    '/list',
    [InBuiltTokenValidator, Auth],
    ViewControllerObject.listTestimonials
  );
  ViewControllerObject.router.get(
    '/edit',
    [InBuiltTokenValidator, Auth],
    ViewControllerObject.editTestimonial
  );
  ViewControllerObject.router.get(
    '/login',
    [InBuiltTokenValidator],
    ViewControllerObject.login
  );
};
