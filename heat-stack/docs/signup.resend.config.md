# Configuring Resend with Epic Stack (using HostGator as DNS example)

This guide walks you through setting up Resend to send emails from your Epic
Stack project. It covers the generic setup steps and highlights how to configure
DNS if you’re using HostGator. It also includes notes about coexisting with
HostGator’s email hosting.

---

## 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up.
2. From the dashboard, get your **API key**.
   - You’ll use this in your Epic Stack `.env` file.

---

## 2. Add Your Domain in Resend

1. In the Resend dashboard, go to **Domains** → **Add Domain**.
2. Enter the domain you want to send from (e.g. `yourdomain.com`).
3. Resend will provide you with **DNS records** (SPF, DKIM, and DMARC).  
   Example:
   - `TXT` record for SPF
   - `TXT` record for DKIM
   - `TXT` record for DMARC

---

## 3. Configure DNS Records

### Generic DNS Setup

- Go to your DNS hosting provider (this is often your domain registrar or web
  host).
- Add the records Resend provides:
  - **SPF** (`TXT` record): ensures only authorized servers can send email for
    your domain.
  - **DKIM** (`TXT` record): adds a cryptographic signature to validate
    messages.
  - **DMARC** (`TXT` record): tells receiving servers what to do with
    unauthenticated emails.

### HostGator Example

1. Log in to **HostGator cPanel**.
2. Under **Domains**, click **Zone Editor**.
3. For your domain:
   - Click **Manage**.
   - Add each `TXT` record Resend gave you:
     - **SPF**: Name = `@`, Value = the SPF string from Resend.
     - **DKIM**: Name = something like `resend._domainkey`, Value = the DKIM
       string from Resend.
     - **DMARC**: Name = `_dmarc`, Value = the DMARC policy string from Resend.
4. Save changes.  
   ⚠️ DNS propagation can take a few hours (sometimes up to 48).

---

## 4. Verify Domain in Resend

- After DNS is set up, go back to the Resend dashboard.
- Click **Verify** for your domain.
- Once verified, you can send emails using that domain.

---

## 5. Configure Epic Stack

In your Epic Stack project:

### a. Install the Resend SDK

~bash npm install resend ~

### b. Add Environment Variable

In your `.env` file: ~env RESEND_API_KEY=your_resend_api_key_here ~

### c. Update `email.server.ts`

~ts import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
await resend.emails.send({ from: 'you@yourdomain.com', // must match your
verified domain to, subject, html, }); } ~

---

## 6. Test Sending Emails

- Run your Epic Stack app locally or in production.
- Trigger an email (for example, password reset or welcome email).
- Check your inbox to confirm delivery.

---

## 7. Using Resend Alongside HostGator Email Hosting

If you currently use HostGator for **email inboxes** (e.g. checking mail at
`mail.yourdomain.com`):

- **Do not remove HostGator’s MX records.**  
  MX records tell the world where incoming mail should go. Resend does not
  handle incoming mail, so you must keep HostGator’s MX records in place.

- **Add Resend’s TXT records only.**  
  SPF, DKIM, and DMARC records from Resend are safe to add alongside HostGator
  MX.

- **SPF note:**  
  If HostGator already has an SPF record, you need to combine them. For example,
  if HostGator has:  
  ~ v=spf1 include:websitewelcome.com ~all ~  
  and Resend gives you:  
  ~ v=spf1 include:resend.net ~all ~  
  then you should merge them into a single record:  
  ~ v=spf1 include:websitewelcome.com include:resend.net ~all ~

This way:

- **Incoming mail** still goes to HostGator.
- **Outgoing transactional mail** from your Epic Stack goes through Resend.

---

## 8. Troubleshooting

- If emails aren’t delivered:
  - Make sure DNS records have propagated (check with
    [whatsmydns.net](https://whatsmydns.net)).
  - Ensure you’re using the exact domain/email that was verified in Resend.
  - Double-check `from` in your code matches the verified domain.
- If HostGator inbox stops receiving mail:
  - Re-check MX records — they must still point to HostGator’s mail servers.

---

✅ You’re done!  
Resend is now configured with your Epic Stack app, and your DNS is set up via
HostGator (or another provider, if applicable). You can safely use Resend for
sending emails while keeping HostGator for receiving.
