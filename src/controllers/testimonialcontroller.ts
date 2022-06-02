import express, { Request, Response } from 'express';
import { initializeTestimonialRoutes } from '../routes/testimonialroutes';
import { statusCodes } from '../libs/constants';
import container from '../inversify.config';
import { RequestParser } from '../libs/requestparser';
import { TestimonialRepository as Repository } from '../repository/testimonialrepository';
import { serializeTestimonials } from '../libs/serializer';

class TestimonialController {
  public router = express.Router();
  private _testimonialRepository: Repository =
    container.get<Repository>(Repository);
  constructor() {
    initializeTestimonialRoutes(this);
  }

  createTestimonial = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const requestObj = new RequestParser(request, 'TestimonialRepository')
        .data;

      const testimonial = await this._testimonialRepository.createTestimonial({
        name: requestObj.name,
        createdAt: requestObj.createdAt,
        profileImageUrl: requestObj.profileImageUrl,
        text: requestObj.text,
      });

      response.status(statusCodes.OK).send(testimonial);
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
  updateTestimonial = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const requestObj = new RequestParser(request, 'TestimonialRepository')
        .data;

      await this._testimonialRepository.updateTestimonial({
        name: requestObj.name,
        createdAt: requestObj.createdAt,
        profileImageUrl: requestObj.profileImageUrl,
        text: requestObj.text,
        id: requestObj.id,
      });

      response.status(statusCodes.OK).send();
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
  getTestimonial = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const testimonialId = request.query.id.toString();

      const testimonial = await this._testimonialRepository.getById(
        testimonialId
      );

      if (!testimonial)
        response
          .status(statusCodes.RESOURCE_NOT_FOUND)
          .json({ message: 'Item does not exist' });
      else {
        response
          .status(statusCodes.OK)
          .send(serializeTestimonials([testimonial]));
      }
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
  getAllTestimonials = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const testimonials =
        (await this._testimonialRepository.getAll()) as any[];

      response.status(statusCodes.OK).send(serializeTestimonials(testimonials));
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
  deleteTestimonial = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const testimonialId = request.query.id.toString();

      await this._testimonialRepository.deleteTestimonial(testimonialId);

      response.status(statusCodes.OK).send();
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default TestimonialController;
