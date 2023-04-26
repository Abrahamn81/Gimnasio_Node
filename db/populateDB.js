require("dotenv").config();
const bcrypt = require("bcrypt");
const { getConnection } = require("./db");

async function main() {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(`
      USE trabajoNode;
    `);

    console.log("Creando tablas...");

    const passwordHash = await bcrypt.hash("123456789", 8);

    await connection.query(
      `
    INSERT INTO users (email, password, name, admin)
    VALUES ('manolete@gmail.com', ?, 'Manolete', true),
    ('patricia@gmail.com', ?, 'Patricia', false);

    `,
      [passwordHash, passwordHash]
    );

    await connection.query(`
        INSERT INTO exercises (name, category, idUser, img, description)
        VALUES ('Abductores en polea', 'Pierna', 1, 'abductorespoela.jpg', 'Ejercicio de empuje en el que trabajamos los abductores, con un rango amplio para involucrar todas las fibras con una tensión constante gracias a una polea.') ;
    
    `);

    /*     await connection.query(`
        INSERT INTO  TABLE IF NOT EXISTS likes (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            idUser INT UNSIGNED NOT NULL,
            idExercise INT UNSIGNED NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(idUser) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(idExercise) REFERENCES exercises(id) ON DELETE CASCADE
        );
    
    `); */
    console.log("Tablas creadas!");
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}
main();
