require("dotenv").config();
const bcrypt = require("bcrypt");
const { getConnection } = require("./db");

async function main() {
  let connection;

  try {
    connection = await getConnection();

    // await connection.query(`
    //   USE trabajoNode;
    // `);
    console.log("---");

    console.log("Creando contenido...");

    const passwordHash = await bcrypt.hash("123456789", 8);

    await connection.query(
      `
    INSERT INTO users (email, password, name, admin)
    VALUES ('manolete@gmail.com', '${passwordHash}', 'Manolete', true),
    ('patricia@gmail.com', '${passwordHash}', 'Patricia', false);
    `
    );

    await connection.query(`
        INSERT INTO exercises (name, category, idUser, img, description)
        VALUES ('Abductores en polea', 'Pierna', 1, 'abductorespoela.jpg', 'Ejercicio de empuje en el que trabajamos los abductores, con un rango amplio para involucrar todas las fibras con una tensión constante gracias a una polea.'),
        ('Sentadillas búlgaras', 'Pierna', 1, 'bulgaras.jpg', 'Ejercicio de piernas en el que trabajamos unilateralmente ambas piernas, cargando un peso en los hombros y bajando, con una pierna apoyada en el banco, hasta romper la vertical.'),
        ('Press plano con mancuernas', 'Pecho', 1, 'pressmancuernas.jpg', 'Ejercicio básico de empuje en el que utilizamos el pectoral para mover las mancuernas a la vez, descendiendo hasta la paralela del pecho y haciendo énfasis en la fase concéntrica'),
        ('Curl de bíceps en banco', 'Brazos', 1, 'curlbicepsbanco.jpg', 'Ejercicio de brazos en el que trabajamos el rango total de recorrido del Bíceps, con gran énfasis en conseguir la mayor tensión en el tramo final del apriete'),
        ('Curl de bíceps en polea baja', 'Brazos', 1, 'curlpoleabaja.jpg', 'Ejercicio de bíceps en el que trabajamos la zona superior gracias a la tensión constante que nos proporciona la polea, manteniendo la espalda recta y sacando bien el pecho'),
        ('Dominadas', 'Espalda', 1, 'dominadas.jpg', 'Ejercicio de espalda por antonomasia en el que utilizamos nuestro propio peso de lastre, intentando sacar el pecho y tirar de las dorsales para una mejor ejecución'),
        ('Remo gironda', 'Espalda', 1, 'remogironda.jpg', 'Ejercicio de tracción en el que con una polea, tiramos con ayuda de nuestras dorsales de una carga hacia el pecho, con especial enfoque en la negativa');
    
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
    console.log("Contenido creado!");
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}
main();
