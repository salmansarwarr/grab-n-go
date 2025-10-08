# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only necessary dependency files
COPY package.json yarn.lock ./

# Install dependencies (frozen for consistency)
RUN yarn install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Prevent memory crashes on low-memory servers
ENV NODE_OPTIONS="--max-old-space-size=512"

# Build the app
RUN yarn build


# ---------- Stage 2: Run ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built files and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# (Optional) Copy env file if needed
# COPY .env .env

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]


# previous code

# # Step 1: Use the Node.js official image as the base image
# FROM node:18-alpine

# # Step 2: Set the working directory in the container
# WORKDIR /app

# # Step 3: Copy package.json, yarn.lock, and install dependencies
# COPY package.json yarn.lock ./
# RUN yarn install

# # Step 4: Copy the .env file explicitly
# #COPY .env .env

# # Step 5: Copy the entire project into the container
# COPY . .

# # Step 6: Build the Next.js app
# RUN yarn build

# # Step 7: Expose the port that the app runs on
# EXPOSE 3000

# # Step 8: Start the Next.js app
# CMD ["yarn", "start"]

