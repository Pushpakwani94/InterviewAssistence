# Stage 1: Build the Angular apps
FROM node:22-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build both applications
RUN npx ng build admin-app --configuration production
RUN npx ng build candidate-app --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy Admin App to /usr/share/nginx/html/admin
COPY --from=build /app/dist/admin-app/browser /usr/share/nginx/html/admin

# Copy Candidate App to /usr/share/nginx/html/candidate
COPY --from=build /app/dist/candidate-app/browser /usr/share/nginx/html/candidate

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
