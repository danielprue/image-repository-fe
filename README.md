# Image Repository

A react application for searching for photos publicly uploaded by users. A link to the current version will be here when deployment is complete.

## Guest Access

Some features of this application can be accessed only as a logged in user.
To test features without creating an account, you can press the `guest account` button on the right side of the main menu.
This account will automatically add photos marked as uploaded by this user, and has the full range of functionality of a normal account.
When this account is logged out or when 1 day passes, this account will delete itself.

## Features

A list of live features in the current version:

* Users can view and search images
* Users can view details about an image by clicking on it
* Users can create accounts and login/logout
* Logged-in users can upload images and mark them with name, description, and tags (up to 10 at a time)
* Logged-in users can search by images they have uploaded
* Logged-in users can mark images as favorites, then search by image they have marked
* Logged-in users can edit the name, description, and tags of an image they have uploaded

## Contributing

Information about running a local development environment [here](./docs/local_env_instructions.md)

Guidelines for contributing [here](./docs/contributing.md)

## TODO

This project is still in development. For a list of features and bugs that need to be addressed [here](./docs/todo.md)

## Technologies

This application is written in JavaScript, using a React framework for the front end, an Express back end and a Postgres database.
For Detailed information about the tech stack for this project [here](./docs/technologies.md)

## API

Detailed information about the API endpoints [here](./docs/api.md)
