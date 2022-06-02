import TestimonialController from '../controllers/testimonialcontroller';

export const initializeTestimonialRoutes = (
  TestimonialControllerObject: TestimonialController
): void => {
  const urlPath = '/testimonial';
  TestimonialControllerObject.router.post(
    `${urlPath}/create`,
    TestimonialControllerObject.createTestimonial
  );
  TestimonialControllerObject.router.put(
    `${urlPath}/update`,
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
    TestimonialControllerObject.deleteTestimonial
  );
};
