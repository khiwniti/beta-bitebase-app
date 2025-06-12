# BiteBase Render.com Deployment Checklist

## Pre-Deployment
- [ ] Repository pushed to GitHub
- [ ] Docker build tested locally
- [ ] Environment variables configured
- [ ] Database schema ready
- [ ] render.yaml validated

## Render.com Setup
- [ ] Account created on Render.com
- [ ] GitHub repository connected
- [ ] Blueprint deployment created
- [ ] Environment variables set in dashboard:
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] ENCRYPTION_KEY
  - [ ] SESSION_SECRET
  - [ ] DATABASE_URL (if using external DB)
  - [ ] REDIS_URL (if using external Redis)
  - [ ] OPENAI_API_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] SENDGRID_API_KEY
  - [ ] Other API keys as needed

## Post-Deployment
- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Redis connection working
- [ ] API endpoints functional
- [ ] Frontend can connect to backend
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring alerts set up

## Testing
- [ ] User registration/login working
- [ ] AI features functional
- [ ] Payment processing working
- [ ] Email delivery working
- [ ] File uploads working
- [ ] Performance acceptable

## Production Readiness
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Error tracking active
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] CORS configuration correct

## Generated Secrets
Copy these to your Render.com environment variables:

```
JWT_SECRET=DYaiPvxO10/nNzCWMMKw354uSd86qsyMVkUYlnEUB9E=
JWT_REFRESH_SECRET=ve15Zs8GVmL0Ui6OKcJH/bJauWunhYtM5lgpHoPqzuw=
ENCRYPTION_KEY=Xfsaso+JA+LKEc83EF1dG+HzeaXEbNhJNIjIKKBbIFc=
SESSION_SECRET=vR0ODeSUsvMuKaZ2NdwIWQEOCnCDR9td1xn+a81Btu4=
```

## Useful Commands
- View logs: Check Render.com dashboard
- Restart service: Use Render.com dashboard
- Update environment: Render.com dashboard > Environment
- Manual deploy: Push to connected GitHub branch

## Support
- Render.com Docs: https://render.com/docs
- BiteBase Issues: https://github.com/your-repo/issues
