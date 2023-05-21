FROM node:16
# Create app directory
WORKDIR Z:\My files\Unimelb\Cluster cloud\Project react 1\couchdb
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "nano.js" ]

