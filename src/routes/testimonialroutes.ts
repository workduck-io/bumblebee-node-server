import Auth from '../middlewares/auth';
import TestimonialController from '../controllers/testimonialcontroller';

export const initializeTestimonialRoutes = (
  TestimonialControllerObject: TestimonialController
): void => {
  const urlPath = '/testimonial';
  TestimonialControllerObject.router.post(
    `${urlPath}/create`,
    [Auth],
    TestimonialControllerObject.createTestimonial
  );
  TestimonialControllerObject.router.put(
    `${urlPath}/update`,
    [Auth],
    TestimonialControllerObject.updateTestimonial
  );
  TestimonialControllerObject.router.get(
    `${urlPath}/get`,
    TestimonialControllerObject.getTestimonial
  );
  TestimonialControllerObject.router.get(
    `${urlPath}/get/all`,
    TestimonialControllerObject.getAllTestimonials
  );
  TestimonialControllerObject.router.delete(
    `${urlPath}/delete`,
    [Auth],
    TestimonialControllerObject.deleteTestimonial
  );
  TestimonialControllerObject.router.post(
    `${urlPath}/login`,
    TestimonialControllerObject.login
  );
};
