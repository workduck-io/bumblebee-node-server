import ViewController from '../controllers/viewcontroller';

export const initializeViewRoutes = (
  ViewControllerObject: ViewController
): void => {
  ViewControllerObject.router.get(
    '/create',
    ViewControllerObject.createTestimonial
  );
  ViewControllerObject.router.get(
    '/list',
    ViewControllerObject.listTestimonials
  );
  ViewControllerObject.router.get(
    '/edit',
    ViewControllerObject.editTestimonial
  );
};
