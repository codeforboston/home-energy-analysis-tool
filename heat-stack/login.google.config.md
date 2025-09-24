# ✅ Google + Email/Password Login in Epic Stack

This guide explains how to replace the mock login with **real login functionality** in your Epic Stack project, supporting both **Google OAuth** and **Email/Password** authentication.

---

## 1. Create Google OAuth credentials

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials → OAuth client ID**.
3. Select **Web Application**.
4. Add your URIs:
   - **Authorized JavaScript origins**:  
     `http://localhost:3000` (for dev)  
     `https://yourdomain.com` (for prod)
   - **Authorized redirect URIs**:  
     `http://localhost:3000/auth/google/callback` (for dev)  
     `https://yourdomain.com/auth/google/callback` (for prod)
5. Copy the **Client ID** and **Client Secret**.

---

## 2. Add environment variables

Update your `.env`:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BASE_URL=http://localhost:3000
SESSION_SECRET=elephant   # or a long random string
DATABASE_URL="file:./data.db"
RESEND_API_KEY=your-resend-api-key
```

---

## 3. Install dependencies

```
npm install remix-auth remix-auth-google remix-auth-form bcryptjs
```

---

## 4. Configure authentication

Create or edit `app/utils/auth.server.ts`:

```ts
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";

import { sessionStorage } from "./session.server";
import { prisma } from "`/utils/db.server";

export const authenticator = new Authenticator<User>(sessionStorage);

// -------- Google Strategy --------
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
  },
  async ({ profile }) => {
    let user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          name: profile.displayName,
        },
      });
    }
    return user;
  }
);
authenticator.use(googleStrategy, "google");

// -------- Email/Password Strategy --------
const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  return user;
});
authenticator.use(formStrategy, "form");
```

---

## 5. Add routes

### Google OAuth

**`app/routes/auth.google.tsx`**

```ts
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "`/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("google", request);
}
```

**`app/routes/auth.google.callback.tsx`**

```ts
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "`/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}
```

### Email/Password

**`app/routes/login.tsx`**

```tsx
import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "`/utils/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </Form>

      <a href="/auth/google">Sign in with Google</a>
    </div>
  );
}
```

**`app/routes/register.tsx`**

```tsx
import { Form, redirect } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "`/utils/db.server";
import bcrypt from "bcryptjs";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return redirect("/login");
}

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </Form>
    </div>
  );
}
```

---

## 6. Protecting routes

Example: `app/routes/cases+/index.tsx`

Open file for more details

```ts
import { requireUserId } from '#app/utils/auth.server.ts'
...
export async function loader({ request }: Route.LoaderArgs) {
    await requireUserId(request)
    ...

```

---

## 🚀 Done!

You now support **two login flows**:
- Google OAuth  
- Email/Password with secure hashing  

Users can **choose either method** on the login page.  
