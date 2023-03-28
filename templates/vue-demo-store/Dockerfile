ARG NODE_VERSION=18-alpine
FROM node:${NODE_VERSION}

ENV NODE_ENV production

RUN mkdir /app
COPY --chown=node:node ./ /app

WORKDIR /app
USER node

EXPOSE 3000

CMD npm run start