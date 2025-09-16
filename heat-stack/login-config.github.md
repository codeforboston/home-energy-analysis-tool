# Setting Up GitHub & Email Login for Epic Stack

## Prerequisites
- Epic Stack project set up ([official guide](https://github.com/epicweb-dev/epic-stack))
- Node.js v18+
- `.env` file copied from `.env.example` (do not fill in yet)

---

## 1. GitHub OAuth Setup

### a. Create a GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Fill in:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback` (or your production callback URL)
4. Copy the **Client ID** and **Client Secret** for the next step.

### b. Add to `.env`
`
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
`

---

## 2. Email Login Setup

### a. SMTP Configuration
- Use a service like SendGrid, Mailgun, or your own SMTP server.
- Gather your SMTP credentials.

### b. Add to `.env`
`
EMAIL_SERVER_HOST=smtp.your-provider.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=no-reply@example.com
`

### c. Session Secret
`
SESSION_SECRET=your_secure_session_secret
`
> **Note:** Use a strong, random string for `SESSION_SECRET`.

---

## 3. Run and Test

`
npm run dev
`

- Visit `http://localhost:3000/login`
- Test both GitHub and email login flows.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| GitHub OAuth fails | Double-check callback URL and env vars |
| Email not sent | Verify SMTP credentials and firewall settings |
| Session errors | Ensure `SESSION_SECRET` is set and secure |

---
