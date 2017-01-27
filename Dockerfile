FROM mhart/alpine-node

# Create app directory
RUN mkdir -p /usr/src/app && echo "Oxygen"

WORKDIR /usr/src/app

COPY . .

RUN npm install --production

