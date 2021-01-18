# Local Environment Instruction

To start development in a local environment, start by forking the repository, and cloning to your machine. 
From the command line, navigate to the main directory, then run the following to install dependencies:

```
  cd api && npm install && cd ../client && npm install
```

Return to the root directory? (or do I need two?), and create a `.env` file. The following variables are required:

```
  CLOUDINARY_SECRET= <Cloudinary dashboard - API Secret>
  CLOUDINARY_API_KEY= <Cloudinary dashboard - API Key>
  CLOUDINARY_CLOUD_NAME= <Cloudinary dashboard - Cloud name>
  . . .
```

* figure out which port the api runs on? idk
* how to create a db
* knexfile configurations
