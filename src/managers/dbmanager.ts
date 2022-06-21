import { injectable } from 'inversify';
import sqlite3 from 'sqlite3';
import Promise from 'bluebird';
import path from 'path';
import logger from '../libs/logger';

@injectable()
export class DBManager {
  private _db;
  private _dbPath = path.join(__dirname, '../testimonials.sqlite3');
  constructor() {
    this._db = new sqlite3.Database(this._dbPath, err => {
      if (err) {
        logger.error('Could not connect to database', err);
      } else {
        logger.info('Connected to database');
      }
    });
  }
  run(sql: string, params = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.run(sql, params, function (err) {
        if (err) {
          logger.error('Error running sql ' + sql);
          logger.error(err);
          reject(err);
        } else {
          resolve({ testimonialId: this.lastID });
        }
      });
    });
  }
  get(sql: string, params = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.get(sql, params, (err, result) => {
        if (err) {
          logger.error('Error running sql: ' + sql);
          logger.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  all(sql: string, params = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Error running sql: ' + sql);
          logger.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
