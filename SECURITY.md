# ChartSage - AI Trading Assistant

## Security & Privacy

This file outlines security best practices for ChartSage.

## Reporting Security Issues

If you discover a security vulnerability, please email `ebbythabang123@gmail.com` instead of using the issue tracker.

## Security Practices

### Authentication & Authorization
- ✅ JWT tokens with 7-day expiration
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Protected routes with auth middleware
- ✅ User isolation (users only see their data)

### API Security
- ✅ CORS enabled (configure as needed)
- ✅ Request body size limits (50MB)
- ✅ File upload validation
- ✅ Error handling without leaking sensitive info

### Data Protection
- ✅ Environment variables for secrets
- ✅ No passwords in logs or responses
- ✅ MongoDB encryption at rest (when configured)
- ✅ Secure file upload handling

### Infrastructure
- ✅ Use HTTPS in production
- ✅ Enable MongoDB authentication
- ✅ Set strong JWT_SECRET
- ✅ Use environment variables for all secrets
- ✅ Regular dependency updates

## Configuration Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS/SSL certificates
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV=production
- [ ] Use strong, unique OPENAI_API_KEY
- [ ] Enable CORS only for trusted domains
- [ ] Set up rate limiting (recommended)
- [ ] Regular backup of MongoDB
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

## Dependencies Security

Run `npm audit` regularly to check for vulnerabilities:

```bash
npm audit
npm audit fix  # Fix if possible
```

## Deployment Security

### Environment Variables
```bash
# NEVER commit these to git
OPENAI_API_KEY=sk-xxx
JWT_SECRET=generate-a-strong-random-string
MONGODB_URI=mongodb://user:pass@host:port/db
```

### MongoDB Security
```javascript
// Enable authentication
db.createUser({
  user: "chartsage_user",
  pwd: "strong-password",
  roles: [{role: "readWrite", db: "chartsage"}]
})
```

### Production Deployment
1. Use a reverse proxy (nginx/Apache)
2. Enable SSL/TLS
3. Set secure headers
4. Enable rate limiting
5. Monitor API usage
6. Keep logs secure
7. Regular security audits

## Vulnerability Disclosure Policy

We appreciate responsible disclosure. Please:

1. Don't publicly disclose the vulnerability
2. Email details to `ebbythabang123@gmail.com`
3. Include reproduction steps if possible
4. Allow 90 days for a fix
5. Coordinate with us before public disclosure

## More Information

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
