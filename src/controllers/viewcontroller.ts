import express, { Request, Response } from 'express';
import path from 'path';
import { statusCodes } from '../libs/constants';
import { initializeViewRoutes } from '../routes/viewroutes';

class ViewController {
  public router = express.Router();
  public isViewController = true;

  constructor() {
    initializeViewRoutes(this);
  }

  createTestimonial = (request: Request, response: Response): void => {
    try {
      response.sendFile(
        path.join(__dirname, '../client/views/CreateTestimonial.html')
      );
    } catch (error) {
      response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.toString() });
    }
  };
}

export default ViewController;
