# Gimnasio API

Aplicación para organizar internamente los entrenamientos en un gimnasio.

## Instalar

- Crear una base de datos vacía en una instancia de MySQL local llamada "trabajoNode".

- Guardar el archivo .env.example como .env y cubrir los datos necesarios.

- Ejecutar node db/initDB.js para crear las tablas necesarias en la base de datos anteriormente creada.

- Ejecutar npm run dev o npm start para lanzar el servidor.

## Entidades

- user:

  - id
  - name
  - email
  - password
  - admin
  - createdAt
  - modifiedAt

- exercises:

  - id
  - name
  - category
  - idUser
  - img
  - description
  - createdAt
  - modifiedAt

  - likes:

  - id
  - idUser
  - idExcercise
  - createdAt

Extra

- Favourites:

  - id
  - idUser
  - idExcercise
  - createdAt

## Endpoints

### Usuarios:

- POST [/user] - Registro de usuario.✅
- POST [/login] - Login de usuario (devuelve token).✅
- GET [/user/:id] - Devuelve información del usuario del token. TOKEN ✅
  Opcional
- PUT [/user/:id] - Editar nombre de usuario o el email. TOKEN ✅
- DELETE [/user/:id] - Eliminar un usuario. TOKEN

### Ejercicios User:

- GET [/exercises] - Lista todos los ejercicios.✅
- GET [/exercises/:id] - Devuelve información de un ejercicio concreto.✅
- POST [/exercises/:idExercise/likes] - Añade un like a un ejercicio. TOKEN ✅
- GET [/exercises?category=espalda] - Devuelve información de una categoria (se hace en el GET de listar ejercicios) ✅
- DELETE [/exercises/:idExercise/likes] - Deshace un like de un ejercicio. TOKEN ✅

Opcional

- GET [/exercises/:idExercises/favourites] - Devuelve información de los ejercicios favoritos.
- POST [/exercises/:idExercises/favourites] - Añade un ejercicio a la lista de favoritos. TOKEN

### Ejercicios User admin:

- POST [/exercises] - Permite crear un ejercicio. TOKEN ✅
- PUT [/exercises/:id] - Permite modificar un ejercicio. TOKEN
- DELETE [/exercises/:id] - Borra un ejercicio solo si eres admin. TOKEN ✅
