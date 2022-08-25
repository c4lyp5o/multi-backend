# pull the Node.js Docker image
FROM node:alpine

# add timezone data
RUN apk add --no-cache tzdata

# set timezone data
ENV TZ=Asia/Kuala_Lumpur

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN yarn install

# copy the generated modules and all other files to the container
COPY . .

# generate environment variables
RUN node ./scripts/genEnv.js

# run the sqlite generator
RUN npx prisma migrate dev --schema prisma/schema3.prisma --name init

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 6565

# the command that starts our app
CMD ["yarn", "start"]