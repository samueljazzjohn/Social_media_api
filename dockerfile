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
ENV MONGODB_URI="mongodb+srv://jazzjohn:jazz1999@cluster0.5vxhxzv.mongodb.net/social-media-app"
ENV JWT_SECRET_KEY="jazzjohn@123"

# expose the port
EXPOSE 3000

# start the app
CMD ["npm", "start"]
