// DO NOT USE ENV VARIABLES FOR FROM EMAIL -
// INTENTIONALLY HARDCODED FOR SECURITY
export const EMAIL_FROM = 'no-reply@heat.heatsmartalliance.org'
// On the staging server, the DEV-oriented RESEND_API_KEY has the heatcalculator.tech domain attached, so we switch to using the below address in the "from" field for test emails.
export const DEV_EMAIL_FROM = 'no-reply@heatcalculator.tech'
