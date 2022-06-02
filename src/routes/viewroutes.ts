import ViewController from '../controllers/viewcontroller';

export const initializeViewRoutes = (
  ViewControllerObject: ViewController
): void => {
  ViewControllerObject.router.get(
    '/create',
    ViewControllerObject.createTestimonial
  );
};
