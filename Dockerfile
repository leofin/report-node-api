 FROM node:latest  
   
 RUN mkdir -p /usr/src/report-node-api/app  
 RUN npm install nodemon -g  
   
 WORKDIR /usr/src/report-node-api/app  
 COPY app/package.json /usr/src/report-node-api/app/package.json  
 RUN npm install -g  
   
 EXPOSE 8080  
 EXPOSE 5858  
   
 CMD ["npm", "start"] 