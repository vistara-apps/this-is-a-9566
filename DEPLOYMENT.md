# MiraID Deployment Guide

This guide covers the complete deployment process for MiraID from development to production.

## 🏗 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] All environment variables configured
- [ ] Supabase project set up with production database
- [ ] OpenAI API key with appropriate limits
- [ ] Stripe account configured with webhooks
- [ ] Domain name configured (if applicable)

### 2. Database Setup
- [ ] Run `database-schema.sql` in Supabase
- [ ] Verify all tables created correctly
- [ ] Test Row Level Security policies
- [ ] Populate legal guides with state-specific content
- [ ] Configure storage bucket permissions

### 3. API Configuration
- [ ] OpenAI API key tested and working
- [ ] Stripe webhooks configured
- [ ] Supabase RLS policies tested
- [ ] File upload permissions verified

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent support for React/Vite applications with automatic deployments.

#### Setup Steps:

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables in Vercel**
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_APP_ENV=production
   VITE_APP_URL=https://your-domain.vercel.app
   ```

### Option 2: Netlify

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

### Option 3: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t miraid:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e VITE_SUPABASE_URL=your_url \
     -e VITE_SUPABASE_ANON_KEY=your_key \
     -e VITE_OPENAI_API_KEY=your_key \
     -e VITE_STRIPE_PUBLISHABLE_KEY=your_key \
     -e VITE_APP_ENV=production \
     -e VITE_APP_URL=https://your-domain.com \
     --name miraid \
     miraid:latest
   ```

3. **Docker Compose** (Optional)
   ```yaml
   version: '3.8'
   services:
     miraid:
       build: .
       ports:
         - "3000:3000"
       environment:
         - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
         - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
         - VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
         - VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
         - VITE_APP_ENV=production
         - VITE_APP_URL=${VITE_APP_URL}
   ```

## 🔧 Production Configuration

### Supabase Production Setup

1. **Create Production Project**
   - Create new Supabase project for production
   - Run database schema
   - Configure authentication settings
   - Set up storage buckets

2. **Security Configuration**
   ```sql
   -- Ensure RLS is enabled on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE legal_guides ENABLE ROW LEVEL SECURITY;
   
   -- Verify policies are in place
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. **Storage Configuration**
   - Create `recordings` bucket
   - Set appropriate policies
   - Configure file size limits

### OpenAI Production Setup

1. **API Key Management**
   - Use production API key
   - Set usage limits
   - Monitor costs
   - Implement rate limiting

2. **Error Handling**
   ```javascript
   // Add retry logic for API calls
   const generateScriptWithRetry = async (state, incidentType, language, retries = 3) => {
     try {
       return await generateScript(state, incidentType, language)
     } catch (error) {
       if (retries > 0 && error.status === 429) {
         await new Promise(resolve => setTimeout(resolve, 1000))
         return generateScriptWithRetry(state, incidentType, language, retries - 1)
       }
       throw error
     }
   }
   ```

### Stripe Production Setup

1. **Webhook Configuration**
   - Set up webhook endpoint: `https://your-domain.com/api/stripe-webhook`
   - Configure events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Add webhook secret to environment variables

2. **Product Configuration**
   - Create subscription products in Stripe dashboard
   - Update price IDs in code
   - Test payment flows

## 🔒 Security Hardening

### 1. Environment Variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly
- Use secret management services for sensitive data

### 2. Content Security Policy
Add to your HTML head:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com https://*.supabase.co https://nominatim.openstreetmap.org;
">
```

### 3. HTTPS Configuration
- Ensure all traffic uses HTTPS
- Configure HSTS headers
- Use secure cookies

## 📊 Monitoring & Analytics

### 1. Error Tracking
Integrate error tracking service:
```javascript
// Example with Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.VITE_APP_ENV
})
```

### 2. Performance Monitoring
- Monitor Core Web Vitals
- Track API response times
- Monitor database query performance
- Set up alerts for critical errors

### 3. Usage Analytics
- Track user engagement
- Monitor feature usage
- Analyze conversion rates
- Monitor subscription metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
          VITE_APP_ENV: production
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🧪 Testing in Production

### 1. Smoke Tests
- [ ] User registration works
- [ ] Authentication flow works
- [ ] Location detection works
- [ ] Legal guides load correctly
- [ ] Recording functionality works
- [ ] Payment flow works (test mode)

### 2. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API responses < 1 second
- [ ] File uploads work correctly
- [ ] Mobile performance acceptable

### 3. Security Tests
- [ ] RLS policies prevent unauthorized access
- [ ] File uploads are properly restricted
- [ ] API keys are not exposed
- [ ] HTTPS redirects work

## 🚨 Rollback Plan

### Quick Rollback Steps
1. **Vercel**: Use deployment history to rollback
2. **Docker**: Keep previous image tagged
3. **Database**: Have migration rollback scripts ready
4. **DNS**: Keep old deployment running during transition

### Emergency Contacts
- Database issues: Supabase support
- Payment issues: Stripe support
- DNS issues: Domain registrar support
- Application issues: Development team

## 📋 Post-Deployment Checklist

- [ ] All functionality tested in production
- [ ] Monitoring and alerts configured
- [ ] Backup procedures in place
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Performance baseline established
- [ ] Security scan completed

## 🔄 Maintenance

### Regular Tasks
- Monitor error rates and performance
- Update dependencies monthly
- Review and rotate API keys quarterly
- Backup database regularly
- Monitor costs and usage
- Update legal content as needed

### Scaling Considerations
- Monitor Supabase usage limits
- Consider CDN for static assets
- Implement caching strategies
- Monitor OpenAI API usage and costs
- Plan for database scaling if needed
