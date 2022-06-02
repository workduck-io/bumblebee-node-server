import { injectable } from 'inversify';
import container from '../inversify.config';
import { DBManager } from '../managers/dbmanager';
import { TestimonialRepository as Testimonial } from '../interfaces/repository';

@injectable()
export class TestimonialRepository {
  private _dbManager: DBManager = container.get<DBManager>(DBManager);

  async createTable(): Promise<DBManager> {
    const sqlQuery = `CREATE TABLE IF NOT EXISTS testimonials 
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      created_at TEXT,
      name TEXT,
      profile_image_url TEXT  
    )`;
    return this._dbManager.run(sqlQuery);
  }

  async createTestimonial(testimonial: Testimonial): Promise<any> {
    const { createdAt, name, profileImageUrl, text } = testimonial;
    return await this._dbManager.run(
      `INSERT INTO testimonials (text, created_at, name, profile_image_url) VALUES (?,?,?,?)`,
      [text, createdAt, name, profileImageUrl]
    );
  }
  async updateTestimonial(testimonial: Testimonial): Promise<any> {
    const { id, name, createdAt, profileImageUrl, text } = testimonial;

    return await this._dbManager.run(
      `UPDATE testimonials SET name = ?, created_at = ?, profile_image_url = ?, text = ? WHERE id = ?`,
      [name, createdAt, profileImageUrl, text, id]
    );
  }

  async getById(id: string): Promise<any> {
    return await this._dbManager.get(
      `SELECT * FROM testimonials WHERE id = ?`,
      [id]
    );
  }

  async getAll(): Promise<any> {
    return await this._dbManager.all(`SELECT * FROM testimonials`);
  }

  async deleteTestimonial(id: string): Promise<any> {
    return await this._dbManager.run(`DELETE FROM testimonials WHERE id = ?`, [
      id,
    ]);
  }
}
