# API Endpoints

## User Endpoints

| Method | Endpoint | Params | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/api/users/:userid/photos` | int `userid` required | Returns list of photo ids uploaded by specified User |
| GET | `/api/users/:userid` | int `userid` required | Returns data about a single user |
| GET | `/api/users/name/:username` | str `username` required | Returns row from user table with matching username |
| GET | `/api/users/:userid/favorites` | int `userid` required |  Returns rows from photos matching ids in specified user's favorites column |
| PUT | `/api/users/:userid/favorites/add/:photoid` | int `userid` required, int `photoid` required | Updates favorites by adding photo id to user's favorites |
| PUT | `api/users/:userid/favorites/remove/:photoid` | int `userid` required, int `photoid` required | Updates favorites by removing photo id from user's favorites |
| DELETE | `api/users/:userid` | int `userid` required | Removes user with matching id from user table and deletes all photos uploaded by them |

## User Endpoints Examples

GET `/api/users/:userid/photos` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

GET `/api/users/:userid` response:
```javascript
  {
    "id" : int (PK),
    "username" : str,
    "password" : "**********",
    "isGuest" : bool,
    "favorites" : [ int, ... ]
  }
```

GET `/api/users/name/:username` response:
```javascript
  [
    {
      "id" : int (PK),
      "username" : str,
      "password" : "**********",
      "isGuest" : bool,
      "favorites : [ int, ... ]
    }
  ]
```

GET `/api/users/:userid/favorites` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

PUT `/api/users/:userid/favorites/add/:photoid` response: 
```javascript
  1
```

PUT `/api/users/:userid/favorites/remove/:photoid` response:
```javascript
  1
```

DELETE `api/users/:userid` response:
```javascript
  {
    "id" : int (PK),
    "username" : str,
    "password" : "**********",
    "isGuest" : bool,
    "favorites" : [ int, ... ]
  }
```

## Photo Endpoints

| Method | Endpoint | Params | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/api/photos/all` | None | Returns all rows from photos table |
| GET | `/api/photos/batch/:photoIds` | comma separated str, `photoIds` required | Returns rows from photos with id that match photoIds |
| GET | `/api/photos/:photoid` | int `photoid` required | Returns row from photos with id that matches photoid |
| GET | `/api/photos/tags/:tag` | str `tag` required |  Returns rows from photos with specified tag |
| POST | `/api/photos/search` | body required -- see below | Returns rows from photos that match search terms |
| DELETE | `api/photos/:photoid` | int `photoid` required | Removes row with matching id from photo table |

## Photo Endpoints Examples

GET `/api/photos/all` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

GET `/api/photos/batch/:photoIds` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

GET `/api/photos/:photoid` response:
```javascript
  {
    "id" : int (PK),
    "public_id" : str,
    "name" : str,
    "image_path" : str (url),
    "height" : int,
    "width" : int,
    "description" : str,
    "tags" : [ str, ... ],
    "uploader" : int (FK -> users)
  }
```

GET `/api/photos/tags/:tag` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

POST `/api/photos/search` body:
```javascript
  {
    "search_type" : enum("all-images", "my-favs", "my-uploads") required,
    "search_term" : str required,
    "user" : int (optional for "all-images")
  }
```

POST `/api/photos/search` response:
```javascript
  [
    {
      "id" : int (PK),
      "public_id" : str,
      "name" : str,
      "image_path" : str (url),
      "height" : int,
      "width" : int,
      "description" : str,
      "tags" : [ str, ... ],
      "uploader" : int (FK -> users)
    },
    ...
  ]
```

DELETE `api/photos/:photoid` response:
```javascript
  1
```

## Auth Endpoints

| Method | Endpoint | Params | Description |
| ------ | -------- | ------ | ----------- |
| GET | `/api/auth/verify/:token` | str `token` required | Checks whether a token is expired |
| GET | `/api/auth/guest/create` | None | Adds a new row to users, adds 10 photos associated with new user to photos, returns token, setTimeout 1d -> delete user |
| POST | `/api/auth/register` | body required -- see below | Adds a new row to users, returns token |
| POST | `/api/auth/login` | body required -- see below | Returns a token |
| POST | `/api/auth/signature` | None | Returns a cloudinary signature for uploading image |
| DELETE | `api/auth/guest/:id` | int `id` required | Removes row with matching id from photo table |

## Auth Examples

GET `/api/auth/verify/:token` response:
```javascript
  {
    "expired" : bool
  }
```

GET `/api/auth/guest/create` response:
```javascript
  {
    "id" : int,
    "username" : `guest${int}`,
    "password" : "**********",
    "isGuest" : true,
    "favorites" : [],
    "token" : str (JWT)
  }
```

POST `/api/auth/register` body:
```javascript
  {
    "username" : str (unique),
    "password" : str
  }
```

POST `/api/auth/register` response:
```javascript
  {
    "id" : int,
    "username" : str,
    "password" : "**********",
    "isGuest" : false,
    "favorites" : [],
    "token" : str (JWT)
  }
```

POST `/api/auth/login` body:
```javascript
  {
    "username" : str,
    "password" : str
  }
```

POST `/api/auth/login` response:
```javascript
  {
    "id" : int,
    "username" : str,
    "password" : "**********",
    "isGuest" : bool,
    "favorites" : [ int, ... ],
    "token" : str (JWT)
  }
  
  OR

  {
    "message" : "Invalid Credentials"
  }
```

POST `/api/auth/signature` response:
```javascript
  {
    "timestamp" : int (datetime),
    "signature" : str
  }
```

DELETE `/api/auth/guest/:id` response:
```javascript
  1
```





