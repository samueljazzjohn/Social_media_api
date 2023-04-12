# Social_media_api

## Tech
Node js is used to build the endpoint and mocha and chai is used to test Api end points.
## Installation

Install the dependencies and devDependencies and start the server.

```sh
npm install
```
or
```sh
yarn install
```

## Testing
```sh
npm test
```

## Docker

Navigate  to the directory where the Dockerfile is located and run the following command to build the image:

```sh
docker build -t image-name .
```

Replace your-image-name with the name you want to give to the image. Once the image is built, you can run a container using the following command:

```sh
docker run -p 3000:3000 your-image-name
```

## Deployement

I have done deployment using [render](https://render.com/). Url of the deployed api is - https://social-media-app-6lkl.onrender.com

