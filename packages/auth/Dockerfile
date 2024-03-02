# Stage 1
ARG BASE_IMAGE=node:16-alpine
FROM $BASE_IMAGE as builder
WORKDIR /app/packages/auth
COPY . ./
RUN npm install


# Final stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN addgroup -S dockergroup && adduser -S docker -G dockergroup
RUN mkdir -p /app/node_modules/.cache/nx && chown -R docker:dockergroup /app
COPY --chown=docker:dockergroup . ./
USER docker

