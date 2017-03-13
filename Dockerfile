FROM node:6.3.0-slim

ENV SHELL /bin/bash
COPY *.js package.json server/

WORKDIR /server
RUN npm install

EXPOSE 3000
RUN sleep 3600 || echo "Dockerfile sleep interrupted at $(date)"
CMD ["npm", "start"]

#
#FROM ubuntu:16.04
#
#
#ENV SHELL /bin/bash
#
#RUN apt-get update && apt-get install -y openssl curl build-essential libssl-dev vim zip unzip gawk && echo -e "\n----\nPASS - apt-get\n----\n" && \
#curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash && echo -e "\n----\nPASS - install nvm \n----\n" && \
#export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \
#. "$NVM_DIR/nvm.sh" && echo -e "\n----\nPASS - nvm environ\n----\n" && \
#nvm install v5.7.1 && echo -e "\n----\nPASS - node version install \n----\n" &&  \
#nvm use 5.7.1 && echo -e "\n----\nPASS - nvm use\n----\n" && \
#nvm alias default node && echo -e "\n----\nPASS - nvm alias\n----\n"
#
#COPY *.js package.json server/
#
#WORKDIR /server
#ENV NVM_BIN /root/.nvm/versions/node/v5.7.1/bin
#ENV PATH $NVM_BIN:$PATH
#RUN npm install
#
#EXPOSE 3000
#
#CMD npm start
