# Technology Stack

Below is a justification of each technology used in this application.

## Front End

### Framework

The front end is written in JavaScript, using React as a main framework, using functional components and hooks. 

[Official React Docs](https://reactjs.org/)

### State

Currently, all state is managed with `useState()` hooks and `props`. As this project expands, there will be more need for a more consistent source of centralized 
state. In upcoming development, the state will be moved into redux. For storing the user token, `localStorage` is used. 

[Official Redux Docs](https://redux.js.org/)

### Component Library

Base components for this project come from Ant Design. If custom components or components from other libraries will be used, please ensure that they 
are consistent in style with the Ant Design library. 

[Official Ant Design Docs](https://ant.design/)

## Back End

### Framework

The back end is written in Node.js, using an express framework.  The backend contains endpoints for basic operations related to user and photo data submitted to the website.

[Official Node.js Docs](https://nodejs.org/en/docs/) | [Official Express Docs](https://expressjs.com/)

### Security

Passwords are hashed and salted using the `bcryptjs` module. The back end also signs JWT tokens using a secure secret.

[Official JWT Docs](https://jwt.io/) | [Official bcryptjs Docs](https://www.npmjs.com/package/bcrypt)

### Query Builder

The back end uses Knex to write migrations, seeds, and queries to communicate with the database.

[Official Knex Docs](http://knexjs.org/)

## Database

### RDBMS

The main database for this project uses Postgres.

[Official Postgres Docs](https://www.postgresql.org/)

### Image Storage

The image literal files are stored are store in cloudinary and accessed remotely.

[Official Cloudinary Docs](https://cloudinary.com/documentation)

## Hosting

### Code Repository

The code for this project is stored in Github. The live version of this project will follow a CI/CD pipeline based on the `main` branch.

[Official Github Docs](https://docs.github.com/en) | [This Project](https://github.com/danielprue/image-repository)

### Deployment

The live version of this project will be deployed through heroku. 

[Official Heroku Docs](https://devcenter.heroku.com/categories/reference)

