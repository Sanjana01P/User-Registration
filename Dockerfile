FROM node:20-alpine

WORKDIR /app
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node public ./public

ENV NODE_ENV=production
ENV PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "server.js"]