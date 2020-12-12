# FaceJournal

Project for Metropolia's Basic Concepts of Web Development course.

## Starting the project up

Make sure to have installed:

- Docker
- docker-compose

Run

```sh
docker-compose up
```

and wait for the project to start up. It will take some time for docker to fetch containers, initialize them, build the code and serve it.

## Docker compose and this project

There's 4 containers that are run side by side in order to make this project tick. Those are:

- `db`: MariaDB instance
- `frontend`: babel + sass building static files
- `backend`: NodeJS app
- `nginx`: Serving frontend and reverse-proxy to backend via `/api`

**Note:** `backend` container only starts up after `db` container is responsive. On a first start up it might be possible that `db` container will take a long time to start up. `backend` container startup might time out. In that case relaunch the app (stop all containers and run them again).

## Frontend

Frontend is an [SPA](https://en.wikipedia.org/wiki/Single-page_application) built with `ES Modules` and `Web Components` in mind. Due to this, each file is processed with Babel and outputted to `build` folder, which is served by `nginx`.
Due to nature of `ES Modules`, all imports inside files should have the file extension (`.js`) in the import route, otherwise browser will refuse to read that file.

### Architecture overview

There are a few folders in `src` folder, namely:

- `components`: Holds reusable UI components that use `Shadow DOM`
- `router`: Holds an implementation of a Router that is handling rendering of pages based on the URL
- `state`: Holds an implementation of state management required for this app
- `styles`: Global styles for the app
- `views`: Holds individual views for the app, that would be rendered by Router

Some notable files:

- `index.html`: Main index.html that is served by `nginx`. Has main layout of the page defined.
- `main.js`: Entry point of the application

### Componentization

Each component and view are defined with 2-3 files: `component.js`, `component.html` and `component.scss` (if needed). Each component when initialized fetches its `.html` file, parses it and commits it into DOM. In case of views, they do not create Shadow DOM. Most of the components do create Shadow DOM and some use `slot` elements (see [slot Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)).

### State management

State management is very similar to [Redux](https://redux.js.org) library. `src/state/index.js` holds a singleton of the `Store`, that is imported by components and views. Allows to subscribe to the whole state (`store.subscribe()`) or branches of it (`store.subscribeWithSelectors()`).

## Backend

Backend is a Node.JS app that is using Express.

`src` folder contains 2 folders:

- `database`: Holds all database models and an associations file
- `routes`: Holds all route handlers. Each route has one handler that is defined in one file. Each route branch (`auth`, `posts`, `users` etc) has an `index.js` file, where all routes of that branch are defined. See [backend/src/routes/posts/index.js](backend/src/routes/posts/index.js) for an example.

### Authentication

Authentication is implemented with JWT and Passport.js. Each request that is authenticated should contain `Authorization` header.

## Database

[starter-db.sql](./starter-db.sql) file contains a script needed to initialize the database. All the tables are created by Sequelize, so this script only contains SQL to prepopulate values for `Roles`, `Permissions` and `RolePermission` tables.
