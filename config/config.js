require('dotenv').config()

module.exports ={
  "development": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASS,
    "database": "S3-uploads",
    "host": process.env.DATABASE_HOST,
    "dialect": process.env.DATABASE_DIALECT
  },
  "test": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASS,
    "database": "database_test",
    "host": process.env.DATABASE_HOST,
    "dialect": process.env.DATABASE_DIALECT
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASS,
    "database": "database_production",
    "host": process.env.DATABASE_HOST,
    "dialect": process.env.DATABASE_DIALECT
  }
}
