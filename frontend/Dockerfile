# --- Builder Stage ---
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    # Copy package files first for better caching
    COPY package*.json ./
    COPY vite.config.ts ./
    COPY tsconfig*.json ./
    
    # Install dependencies (including devDependencies)
    RUN npm ci
    
    # Copy source files
    COPY src ./src
    COPY public ./public
    COPY index.html ./
    
    # Build the app with production mode
    RUN npm run build
    
    # --- Production Stage ---
    FROM nginx:stable-alpine
    
    # Remove default nginx page
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy build output from builder stage
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy custom nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port (already exposed by nginx image, but good practice to document)
    EXPOSE 80
    
    # Run nginx (CMD is already in nginx image, but explicit is good)
    CMD ["nginx", "-g", "daemon off;"]