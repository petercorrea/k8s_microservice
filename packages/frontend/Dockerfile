# Stage 1
ARG BASE_IMAGE=node:21-alpine

FROM pmcorrea/builder:latest as builder

WORKDIR /app/packages/frontend

RUN addgroup -S dockergroup && adduser -S docker -G dockergroup

COPY --chown=docker:dockergroup . ./

RUN npm install

USER docker