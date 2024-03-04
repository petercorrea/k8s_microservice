# Stage 1
ARG BASE_IMAGE=node:21-alpine
FROM $BASE_IMAGE as builder
WORKDIR /app/packages/auth
COPY . ./
RUN npm install


# Final stage
FROM node:21-alpine
WORKDIR /app
RUN addgroup -S dockergroup && adduser -S docker -G dockergroup
RUN mkdir -p /app/node_modules/.cache/nx && chown -R docker:dockergroup /app
COPY --from=builder --chown=docker:dockergroup /app /app
USER docker