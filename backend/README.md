# DROPZONE AFRICA Backend

## Production Backend for dropzone-africa.com

### Quick Start
```bash
npm install
npm run build
npm run start:prod
```

### Environment Variables Required
```
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
PORT=8080
```

### Health Check
GET /api/health

### API Endpoints
- GET /api/products
- POST /api/login
- POST /api/register
- GET /api/users (Admin only)
- POST /api/orders

### Deployment
This backend is configured for Railway deployment with automatic builds.