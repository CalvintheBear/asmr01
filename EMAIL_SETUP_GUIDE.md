# 📧 Email Service Configuration Guide

## Why Am I Not Receiving Emails?

Your feedback system is working correctly, but you need to configure an email service provider to actually send emails. Currently, the system only logs emails to the console in development mode.

## Quick Setup (Recommended: Resend)

### Step 1: Sign Up for Resend
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (includes 3,000 emails/month)
3. Verify your email address

### Step 2: Get Your API Key
1. Log into your Resend dashboard
2. Go to "API Keys" section
3. Click "Create API Key"
4. Give it a name like "CuttingASMR Feedback"
5. Copy the API key (starts with `re_`)

### Step 3: Add to Environment Variables

#### For Local Development:
Add to your `.env.local` file:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### For Cloudflare Pages Deployment:
1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
5. Deploy your site

### Step 4: Verify Domain (Optional but Recommended)

For production use, verify your domain:
1. In Resend dashboard, go to "Domains"
2. Add your domain: `cuttingasmr.org`
3. Add the DNS records provided by Resend
4. Wait for verification

Once verified, update the API to use your domain:
```typescript
from: 'CuttingASMR Feedback <feedback@send.cuttingasmr.org>'
```

## Alternative Email Services

### Option 1: SendGrid
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option 2: Mailgun
```env
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=cuttingasmr.org
```

### Option 3: SMTP (Outlook/Gmail)
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=supportadmin@cuttingasmr.org
SMTP_PASS=your_app_password
SMTP_SECURE=true
```

## Testing Your Configuration

1. Add the environment variable
2. Deploy your changes
3. Submit a test feedback through your website
4. Check your email inbox at `supportadmin@cuttingasmr.org`

## Troubleshooting

### Still Not Receiving Emails?
1. Check your spam/junk folder
2. Verify the API key is correctly set
3. Check Cloudflare Pages environment variables
4. Look at the deployment logs for error messages

### Rate Limits
- **Resend Free**: 3,000 emails/month, 100 emails/day
- **SendGrid Free**: 100 emails/day
- **Mailgun Free**: 5,000 emails/month (first 3 months)

### DKIM/SPF Setup
For better email deliverability, configure:
1. DKIM signing in your email provider
2. SPF record in your DNS
3. DMARC policy

## Support

If you need help with email configuration:
1. Check the console logs when testing feedback
2. Verify your email provider's documentation
3. Test with a simple API call first

## Example Environment Variables for Production

```env
# Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx

# Other services...
```

---

**Note**: Never commit API keys to your repository. Always use environment variables and keep your `.env` files in `.gitignore`. 