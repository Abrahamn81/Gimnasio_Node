require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(`
      USE trabajoNode;
    `);

    console.log('Borrando tablas...');
    await connection.query('DROP TABLE IF EXISTS likes');
    await connection.query('DROP TABLE IF EXISTS exercises');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas...');

    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            name VARCHAR(50),
            admin BOOLEAN DEFAULT false,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS exercises (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(100) NOT NULL,
            idUser INT UNSIGNED NOT NULL,
            img VARCHAR(100),
            description VARCHAR(500) NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            modifiedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(idUser) REFERENCES users(id)
        );
    
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS likes (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            idUser INT UNSIGNED NOT NULL,
            idExercise INT UNSIGNED NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(idUser) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(idExercise) REFERENCES exercises(id) ON DELETE CASCADE
        );
    
    `);
    console.log('Tablas creadas!');
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}
main();
