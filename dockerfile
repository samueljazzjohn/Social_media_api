# specify the base image
FROM node:14

# set the working directory inside the container
WORKDIR /app

# copy the package.json and package-lock.json files to the container
COPY package*.json ./

# install the dependencies
RUN npm install

# copy the rest of the app files to the container
COPY . .

# set the environment variables
ENV PORT=3000
ENV MONGODB_URI=<your_mongodb_uri_here>
ENV JWT_SECRET=<your_jwt_secret_here>

# run the tests
RUN npm test

# expose the port
EXPOSE 3000

# start the app
CMD ["npm", "start"]
