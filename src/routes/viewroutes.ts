import Auth from '../middlewares/auth';
import ViewController from '../controllers/viewcontroller';

export const initializeViewRoutes = (
  ViewControllerObject: ViewController
): void => {
  ViewControllerObject.router.get(
    '/create',
    [Auth],
    ViewControllerObject.createTestimonial
  );
  ViewControllerObject.router.get(
    '/list',
    [Auth],
    ViewControllerObject.listTestimonials
  );
  ViewControllerObject.router.get(
    '/edit',
    [Auth],
    ViewControllerObject.editTestimonial
  );
  ViewControllerObject.router.get('/login', ViewControllerObject.login);
};
