import express, { Request, Response } from 'express';
import path from 'path';
import container from '../inversify.config';
import { TestimonialRepository } from '../repository/testimonialrepository';
import { statusCodes } from '../libs/constants';
import { initializeViewRoutes } from '../routes/viewroutes';

class ViewController {
  public router = express.Router();
  public isViewController = true;
  private _testimonialRepository: TestimonialRepository =
    container.get<TestimonialRepository>(TestimonialRepository);

  constructor() {
    initializeViewRoutes(this);
  }

  createTestimonial = (request: Request, response: Response): void => {
    try {
      response.sendFile(
        path.join(__dirname, '../../views/CreateTestimonial.html')
      );
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };

  listTestimonials = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const testimonials = await this._testimonialRepository.getAll();

      response.render(
        path.join(__dirname, '../../views/ListTestimonials.mustache'),
        {
          testimonials,
        }
      );
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };

  editTestimonial = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      if (!request.query.testimonialId) throw new Error('Invalid Request');
      const testimonial = await this._testimonialRepository.getById(
        request.query.testimonialId.toString()
      );

      response.render(
        path.join(__dirname, '../../views/EditTestimonial.mustache'),
        {
          testimonial,
        }
      );
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
  login = async (request: Request, response: Response): Promise<void> => {
    try {
      response.sendFile(path.join(__dirname, '../../views/Login.html'));
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default ViewController;
