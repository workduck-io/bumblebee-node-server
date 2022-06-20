import Auth from '../middlewares/auth';
import TestimonialController from '../controllers/testimonialcontroller';
import { InBuiltTokenValidator } from '../middlewares/tokenvalidator';

export const initializeTestimonialRoutes = (
  TestimonialControllerObject: TestimonialController
): void => {
  const urlPath = '/testimonial';
  TestimonialControllerObject.router.post(
    `${urlPath}/create`,
    [InBuiltTokenValidator, Auth],
    TestimonialControllerObject.createTestimonial
  );
  TestimonialControllerObject.router.put(
    `${urlPath}/update`,
    [InBuiltTokenValidator, Auth],
    TestimonialControllerObject.updateTestimonial
  );
  TestimonialControllerObject.router.get(
    `${urlPath}/get`,
    [InBuiltTokenValidator],
    TestimonialControllerObject.getTestimonial
  );
  TestimonialControllerObject.router.get(
    `${urlPath}/get/all`,
    [InBuiltTokenValidator],
    TestimonialControllerObject.getAllTestimonials
  );
  TestimonialControllerObject.router.delete(
    `${urlPath}/delete`,
    [InBuiltTokenValidator],
    TestimonialControllerObject.deleteTestimonial
  );
  TestimonialControllerObject.router.post(
    `${urlPath}/login`,
    [InBuiltTokenValidator],
    TestimonialControllerObject.login
  );
};
