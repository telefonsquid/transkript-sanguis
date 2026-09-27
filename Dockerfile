# Build the static site
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Serve it as plain files, nothing but nginx runs in the container
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Own folder, the nginx welcome page of the base image would otherwise answer on /
COPY --from=build /app/build /srv/transkript-sanguis
EXPOSE 3000
