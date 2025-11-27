const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');
const dbConnection = require('../../infrastructure/database/connection');

class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.db = dbConnection;
  }

  async create(user) {
    const query = `
      INSERT INTO users (
        email, password, first_name, last_name,
        phone_number, date_of_birth, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, email, password, first_name, last_name,
        phone_number, date_of_birth, created_at, updated_at
    `;

    const values = [
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.phoneNumber,
      user.dateOfBirth,
      user.createdAt,
      user.updatedAt
    ];

    const result = await this.db.query(query, values);
    const row = result.rows[0];

    return new User(
      row.id,
      row.email,
      row.password,
      row.first_name,
      row.last_name,
      row.phone_number,
      row.date_of_birth,
      row.created_at,
      row.updated_at
    );
  }

  async findByEmail(email) {
    const query = `
      SELECT
        id, email, password, first_name, last_name,
        phone_number, date_of_birth, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await this.db.query(query, [email.toLowerCase()]);

    if (result.rows.length === 0) return null;
    const row = result.rows[0];

    return new User(
      row.id,
      row.email,
      row.password,
      row.first_name,
      row.last_name,
      row.phone_number,
      row.date_of_birth,
      row.created_at,
      row.updated_at
    );
  }
}

module.exports = UserRepository;
