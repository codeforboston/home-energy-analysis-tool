var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { createReadableStreamFromReadable, json, redirect as redirect$1, createCookieSessionStorage, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { RemixServer, useFormAction, useNavigation, useRouteError, useParams, isRouteErrorResponse, useSearchParams, useSubmit, Form, useRouteLoaderData, useRevalidator, redirect, useFetcher, useFetchers, useLoaderData, useMatches, Link, Outlet, Meta, Links, ScrollRestoration, Scripts, useLocation, useActionData, NavLink } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import chalk from "chalk";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { z } from "zod";
import * as React from "react";
import { useState, useRef, useEffect, useMemo, useId } from "react";
import { getInstanceInfo, getInternalInstanceDomain, getInstanceInfoSync, getAllInstances } from "litefs-js";
import { HoneypotProvider, HoneypotInputs } from "remix-utils/honeypot/react";
import { clsx } from "clsx";
import { useSpinDelay } from "spin-delay";
import { extendTailwindMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { toast, Toaster } from "sonner";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useForm, getFormProps, useInputControl, getInputProps, FormProvider, getTextareaProps, getFieldsetProps } from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import { invariant, invariantResponse } from "@epic-web/invariant";
import { ServerOnly } from "remix-utils/server-only";
import { getHintUtils } from "@epic-web/client-hints";
import { clientHint, subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import { clientHint as clientHint$1 } from "@epic-web/client-hints/time-zone";
import * as cookie from "cookie";
import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { safeRedirect } from "remix-utils/safe-redirect";
import { createId } from "@paralleldrive/cuid2";
import { GitHubStrategy } from "remix-auth-github";
import fs from "fs";
import { totalTtl, cachified as cachified$1, mergeReporters, verboseReporter } from "@epic-web/cachified";
import { remember } from "@epic-web/remember";
import Database from "better-sqlite3";
import { LRUCache } from "lru-cache";
import { PrismaClient } from "@prisma/client";
import { Honeypot, SpamError } from "remix-utils/honeypot/server";
import * as E from "@react-email/components";
import { renderAsync } from "@react-email/components";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { generateTOTP, verifyTOTP, getTOTPAuthUri } from "@epic-web/totp";
import { ensurePrimary, ensureInstance } from "litefs-js/remix.js";
import { generateRobotsTxt, generateSitemap } from "@nasa-gcn/remix-seo";
import * as QRCode from "qrcode";
import { formatDistanceToNow } from "date-fns";
const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_PATH: z.string(),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  INTERNAL_COMMAND_TOKEN: z.string(),
  HONEYPOT_SECRET: z.string(),
  CACHE_DATABASE_PATH: z.string(),
  // If you plan on using Sentry, uncomment this line
  // SENTRY_DSN: z.string(),
  // If you plan to use Resend, uncomment this line
  // RESEND_API_KEY: z.string(),
  // If you plan to use GitHub auth, remove the default:
  GITHUB_CLIENT_ID: z.string().default("MOCK_GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: z.string().default("MOCK_GITHUB_CLIENT_SECRET"),
  GITHUB_TOKEN: z.string().default("MOCK_GITHUB_TOKEN"),
  ALLOW_INDEXING: z.enum(["true", "false"]).optional()
});
function init() {
  const parsed = schema.safeParse(process.env);
  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
}
function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ALLOW_INDEXING: process.env.ALLOW_INDEXING
  };
}
const NonceContext = React.createContext("");
const NonceProvider = NonceContext.Provider;
const useNonce = () => React.useContext(NonceContext);
function makeTimings(type, desc) {
  const timings = {
    [type]: [{ desc, start: performance.now() }]
  };
  Object.defineProperty(timings, "toString", {
    value: function() {
      return getServerTimeHeader(timings);
    },
    enumerable: false
  });
  return timings;
}
function createTimer(type, desc) {
  const start = performance.now();
  return {
    end(timings) {
      let timingType = timings[type];
      if (!timingType) {
        timingType = timings[type] = [];
      }
      timingType.push({ desc, time: performance.now() - start });
    }
  };
}
async function time(fn, {
  type,
  desc,
  timings
}) {
  const timer = createTimer(type, desc);
  const promise = typeof fn === "function" ? fn() : fn;
  if (!timings)
    return promise;
  const result = await promise;
  timer.end(timings);
  return result;
}
function getServerTimeHeader(timings) {
  if (!timings)
    return "";
  return Object.entries(timings).map(([key2, timingInfos]) => {
    const dur = timingInfos.reduce((acc, timingInfo) => {
      const time2 = timingInfo.time ?? performance.now() - timingInfo.start;
      return acc + time2;
    }, 0).toFixed(1);
    const desc = timingInfos.map((t) => t.desc).filter(Boolean).join(" & ");
    return [
      key2.replaceAll(/(:| |@|=|;|,|\/|\\)/g, "_"),
      desc ? `desc=${JSON.stringify(desc)}` : null,
      `dur=${dur}`
    ].filter(Boolean).join(";");
  }).join(",");
}
function cachifiedTimingReporter(timings) {
  if (!timings)
    return;
  return ({ key: key2 }) => {
    const cacheRetrievalTimer = createTimer(
      `cache:${key2}`,
      `${key2} cache retrieval`
    );
    let getFreshValueTimer;
    return (event) => {
      switch (event.name) {
        case "getFreshValueStart":
          getFreshValueTimer = createTimer(
            `getFreshValue:${key2}`,
            `request forced to wait for a fresh ${key2} value`
          );
          break;
        case "getFreshValueSuccess":
          getFreshValueTimer == null ? void 0 : getFreshValueTimer.end(timings);
          break;
        case "done":
          cacheRetrievalTimer.end(timings);
          break;
      }
    };
  };
}
const ABORT_DELAY = 5e3;
init();
global.ENV = getEnv();
if (ENV.MODE === "production" && ENV.SENTRY_DSN) {
  import("./assets/monitoring.server-CuHpiSa4.js").then(({ init: init2 }) => init2());
}
async function handleRequest(...args) {
  const [
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    loadContext
  ] = args;
  const { currentInstance, primaryInstance } = await getInstanceInfo();
  responseHeaders.set("fly-region", process.env.FLY_REGION ?? "unknown");
  responseHeaders.set("fly-app", process.env.FLY_APP_NAME ?? "unknown");
  responseHeaders.set("fly-primary-instance", primaryInstance);
  responseHeaders.set("fly-instance", currentInstance);
  const callbackName = isbot(request.headers.get("user-agent")) ? "onAllReady" : "onShellReady";
  const nonce = String(loadContext.cspNonce) ?? void 0;
  return new Promise(async (resolve, reject) => {
    let didError = false;
    const timings = makeTimings("render", "renderToPipeableStream");
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(NonceProvider, { value: nonce, children: /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }) }),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.append("Server-Timing", timings.toString());
          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: () => {
          didError = true;
        },
        nonce
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
async function handleDataRequest(response) {
  const { currentInstance, primaryInstance } = await getInstanceInfo();
  response.headers.set("fly-region", process.env.FLY_REGION ?? "unknown");
  response.headers.set("fly-app", process.env.FLY_APP_NAME ?? "unknown");
  response.headers.set("fly-primary-instance", primaryInstance);
  response.headers.set("fly-instance", currentInstance);
  return response;
}
function handleError(error, { request }) {
  if (request.signal.aborted) {
    return;
  }
  if (error instanceof Error) {
    console.error(chalk.red(error.stack));
    Sentry.captureRemixServerException(error, "remix.server", request);
  } else {
    console.error(chalk.red(error));
    Sentry.captureException(error);
  }
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  handleDataRequest,
  handleError
}, Symbol.toStringTag, { value: "Module" }));
const extendedTheme = {
  colors: {
    border: "hsl(var(--border))",
    input: {
      DEFAULT: "hsl(var(--input))",
      invalid: "hsl(var(--input-invalid))"
    },
    ring: {
      DEFAULT: "hsl(var(--ring))",
      invalid: "hsl(var(--foreground-destructive))"
    },
    background: "hsl(var(--background))",
    foreground: {
      DEFAULT: "hsl(var(--foreground))",
      destructive: "hsl(var(--foreground-destructive))"
    },
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))"
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))"
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))"
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))"
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))"
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))"
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))"
    }
  },
  borderColor: {
    DEFAULT: "hsl(var(--border))"
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)"
  },
  fontSize: {
    // 1rem = 16px
    /** 80px size / 84px high / bold */
    mega: ["5rem", { lineHeight: "5.25rem", fontWeight: "700" }],
    /** 56px size / 62px high / bold */
    h1: ["3.5rem", { lineHeight: "3.875rem", fontWeight: "700" }],
    /** 40px size / 48px high / bold */
    h2: ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],
    /** 32px size / 36px high / bold */
    h3: ["2rem", { lineHeight: "2.25rem", fontWeight: "700" }],
    /** 28px size / 36px high / bold */
    h4: ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700" }],
    /** 24px size / 32px high / bold */
    h5: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
    /** 16px size / 20px high / bold */
    h6: ["1rem", { lineHeight: "1.25rem", fontWeight: "700" }],
    /** 32px size / 36px high / normal */
    "body-2xl": ["2rem", { lineHeight: "2.25rem" }],
    /** 28px size / 36px high / normal */
    "body-xl": ["1.75rem", { lineHeight: "2.25rem" }],
    /** 24px size / 32px high / normal */
    "body-lg": ["1.5rem", { lineHeight: "2rem" }],
    /** 20px size / 28px high / normal */
    "body-md": ["1.25rem", { lineHeight: "1.75rem" }],
    /** 16px size / 20px high / normal */
    "body-sm": ["1rem", { lineHeight: "1.25rem" }],
    /** 14px size / 18px high / normal */
    "body-xs": ["0.875rem", { lineHeight: "1.125rem" }],
    /** 12px size / 16px high / normal */
    "body-2xs": ["0.75rem", { lineHeight: "1rem" }],
    /** 18px size / 24px high / semibold */
    caption: ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }],
    /** 12px size / 16px high / bold */
    button: ["0.75rem", { lineHeight: "1rem", fontWeight: "700" }]
  },
  keyframes: {
    "caret-blink": {
      "0%,70%,100%": { opacity: "1" },
      "20%,50%": { opacity: "0" }
    }
  },
  animation: {
    "caret-blink": "caret-blink 1.25s ease-out infinite"
  }
};
function getUserImgSrc(imageId) {
  return imageId ? `/resources/user-images/${imageId}` : "/img/user.png";
}
function getNoteImgSrc(imageId) {
  return `/resources/note-images/${imageId}`;
}
function getErrorMessage(error) {
  if (typeof error === "string")
    return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}
function formatColors() {
  const colors = [];
  for (const [key2, color] of Object.entries(extendedTheme.colors)) {
    if (typeof color === "string") {
      colors.push(key2);
    } else {
      const colorGroup = Object.keys(color).map(
        (subKey) => subKey === "DEFAULT" ? "" : subKey
      );
      colors.push({ [key2]: colorGroup });
    }
  }
  return colors;
}
const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: formatColors(),
      borderRadius: Object.keys(extendedTheme.borderRadius)
    },
    classGroups: {
      "font-size": [
        {
          text: Object.keys(extendedTheme.fontSize)
        }
      ]
    }
  }
});
function cn(...inputs) {
  return customTwMerge(clsx(inputs));
}
function getDomainUrl(request) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host") ?? new URL(request.url).host;
  const protocol = request.headers.get("X-Forwarded-Proto") ?? "http";
  return `${protocol}://${host}`;
}
function getReferrerRoute(request) {
  const referrer = request.headers.get("referer") ?? request.headers.get("referrer") ?? request.referrer;
  const domain = getDomainUrl(request);
  if (referrer == null ? void 0 : referrer.startsWith(domain)) {
    return referrer.slice(domain.length);
  } else {
    return "/";
  }
}
function combineHeaders(...headers2) {
  const combined = new Headers();
  for (const header of headers2) {
    if (!header)
      continue;
    for (const [key2, value] of new Headers(header).entries()) {
      combined.append(key2, value);
    }
  }
  return combined;
}
function combineResponseInits(...responseInits) {
  let combined = {};
  for (const responseInit of responseInits) {
    combined = {
      ...responseInit,
      headers: combineHeaders(combined.headers, responseInit == null ? void 0 : responseInit.headers)
    };
  }
  return combined;
}
function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle"
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState = state === "non-idle" ? navigation.state !== "idle" : navigation.state === state;
  return isPendingState && navigation.formAction === (formAction ?? contextualFormAction) && navigation.formMethod === formMethod;
}
function useDelayedIsPending({
  formAction,
  formMethod,
  delay = 400,
  minDuration = 300
} = {}) {
  const isPending = useIsPending({ formAction, formMethod });
  const delayedIsPending = useSpinDelay(isPending, {
    delay,
    minDuration
  });
  return delayedIsPending;
}
function callAll(...fns) {
  return (...args) => fns.forEach((fn) => fn == null ? void 0 : fn(...args));
}
function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);
  function getButtonProps(props) {
    const onBlur = () => setDoubleCheck(false);
    const onClick = doubleCheck ? void 0 : (e) => {
      e.preventDefault();
      setDoubleCheck(true);
    };
    const onKeyUp = (e) => {
      if (e.key === "Escape") {
        setDoubleCheck(false);
      }
    };
    return {
      ...props,
      onBlur: callAll(onBlur, props == null ? void 0 : props.onBlur),
      onClick: callAll(onClick, props == null ? void 0 : props.onClick),
      onKeyUp: callAll(onKeyUp, props == null ? void 0 : props.onKeyUp)
    };
  }
  return { doubleCheck, getButtonProps };
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer)
      clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
function useDebounce(callback, delay) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useMemo(
    () => debounce(
      (...args) => callbackRef.current(...args),
      delay
    ),
    [delay]
  );
}
async function downloadFile(url, retries = 0) {
  const MAX_RETRIES = 3;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image with status ${response.status}`);
    }
    const contentType = response.headers.get("content-type") ?? "image/jpg";
    const blob = Buffer.from(await response.arrayBuffer());
    return { contentType, blob };
  } catch (e) {
    if (retries > MAX_RETRIES)
      throw e;
    return downloadFile(url, retries + 1);
  }
}
function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
    error.status,
    " ",
    error.data
  ] }),
  statusHandlers,
  unexpectedErrorHandler = (error) => /* @__PURE__ */ jsx("p", { children: getErrorMessage(error) })
}) {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  const params = useParams();
  if (typeof document !== "undefined") {
    console.error(error);
  }
  return /* @__PURE__ */ jsx("div", { className: "container flex items-center justify-center p-20 text-h2", children: isRouteErrorResponse(error) ? ((statusHandlers == null ? void 0 : statusHandlers[error.status]) ?? defaultStatusHandler)({
    error,
    params
  }) : unexpectedErrorHandler(error) });
}
const iconsHref = "/assets/sprite-BkUZwfhp.svg";
const sizeClassName = {
  font: "w-[1em] h-[1em]",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7"
};
const childrenSizeClassName = {
  font: "gap-1.5",
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
  xl: "gap-3"
};
function Icon({
  name,
  size = "font",
  className,
  title,
  children,
  ...props
}) {
  if (children) {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `inline-flex items-center ${childrenSizeClassName[size]}`,
        children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              name,
              size,
              className,
              title,
              ...props
            }
          ),
          children
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      ...props,
      className: cn(sizeClassName[size], "inline self-center", className),
      children: [
        title ? /* @__PURE__ */ jsx("title", { children: title }) : null,
        /* @__PURE__ */ jsx("use", { href: `${iconsHref}#${name}` })
      ]
    }
  );
}
function EpicProgress() {
  const transition = useNavigation();
  const busy = transition.state !== "idle";
  const delayedPending = useSpinDelay(busy, {
    delay: 600,
    minDuration: 400
  });
  const ref = useRef(null);
  const [animationComplete, setAnimationComplete] = useState(true);
  useEffect(() => {
    if (!ref.current)
      return;
    if (delayedPending)
      setAnimationComplete(false);
    const animationPromises = ref.current.getAnimations().map(({ finished }) => finished);
    Promise.allSettled(animationPromises).then(() => {
      if (!delayedPending)
        setAnimationComplete(true);
    });
  }, [delayedPending]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "progressbar",
      "aria-hidden": delayedPending ? void 0 : true,
      "aria-valuetext": delayedPending ? "Loading" : void 0,
      className: "fixed inset-x-0 left-0 top-0 z-50 h-[0.20rem] animate-pulse",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref,
            className: cn(
              "h-full w-0 bg-foreground duration-500 ease-in-out",
              transition.state === "idle" && (animationComplete ? "transition-none" : "w-full opacity-0 transition-all"),
              delayedPending && transition.state === "submitting" && "w-5/12",
              delayedPending && transition.state === "loading" && "w-8/12"
            )
          }
        ),
        delayedPending && /* @__PURE__ */ jsx("div", { className: "absolute flex items-center justify-center", children: /* @__PURE__ */ jsx(
          Icon,
          {
            name: "update",
            size: "md",
            className: "m-1 animate-spin text-foreground",
            "aria-hidden": true
          }
        ) })
      ]
    }
  );
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors outline-none focus-visible:ring-2 focus-within:ring-2 ring-ring ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        wide: "px-24 py-5",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        pill: "px-12 py-3 leading-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const StatusButton = React.forwardRef(({ message, status, className, children, spinDelay, ...props }, ref) => {
  const delayedPending = useSpinDelay(status === "pending", {
    delay: 400,
    minDuration: 300,
    ...spinDelay
  });
  const companion = {
    pending: delayedPending ? /* @__PURE__ */ jsx(
      "div",
      {
        role: "status",
        className: "inline-flex h-6 w-6 items-center justify-center",
        children: /* @__PURE__ */ jsx(Icon, { name: "update", className: "animate-spin", title: "loading" })
      }
    ) : null,
    success: /* @__PURE__ */ jsx(
      "div",
      {
        role: "status",
        className: "inline-flex h-6 w-6 items-center justify-center",
        children: /* @__PURE__ */ jsx(Icon, { name: "check", title: "success" })
      }
    ),
    error: /* @__PURE__ */ jsx(
      "div",
      {
        role: "status",
        className: "inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive",
        children: /* @__PURE__ */ jsx(
          Icon,
          {
            name: "cross-1",
            className: "text-destructive-foreground",
            title: "error"
          }
        )
      }
    ),
    idle: null
  }[status];
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      className: cn("flex justify-center gap-4", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { children }),
        message ? /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { children: companion }),
          /* @__PURE__ */ jsx(TooltipContent, { children: message })
        ] }) }) : companion
      ]
    }
  );
});
StatusButton.displayName = "Button";
function SearchBar({
  status,
  autoFocus = false,
  autoSubmit = false
}) {
  const id = useId();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const isSubmitting = useIsPending({
    formMethod: "GET",
    formAction: "/users"
  });
  const handleFormChange = useDebounce((form) => {
    submit(form);
  }, 400);
  return /* @__PURE__ */ jsxs(
    Form,
    {
      method: "GET",
      action: "/users",
      className: "flex flex-wrap items-center justify-center gap-2",
      onChange: (e) => autoSubmit && handleFormChange(e.currentTarget),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: id, className: "sr-only", children: "Search" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "search",
              name: "search",
              id,
              defaultValue: searchParams.get("search") ?? "",
              placeholder: "Search",
              className: "w-full",
              autoFocus
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
          StatusButton,
          {
            type: "submit",
            status: isSubmitting ? "pending" : status,
            className: "flex w-full items-center justify-center",
            children: [
              /* @__PURE__ */ jsx(Icon, { name: "magnifying-glass", size: "md" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Search" })
            ]
          }
        ) })
      ]
    }
  );
}
function useToast(toast$1) {
  useEffect(() => {
    if (toast$1) {
      setTimeout(() => {
        toast[toast$1.type](toast$1.title, {
          id: toast$1.id,
          description: toast$1.description
        });
      }, 0);
    }
  }, [toast$1]);
}
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx("span", { className: "ml-auto h-4 w-4", children: "▶️" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx("span", { className: "h-4 w-4", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 8 8", children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M1,4 L3,6 L7,2",
          stroke: "black",
          strokeWidth: "1",
          fill: "none"
        }
      ) }) }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx("span", { className: "h-2 w-2", children: "⚪" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const EpicToaster = ({ theme, ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function useRequestInfo() {
  const data = useRouteLoaderData("root");
  invariant(data == null ? void 0 : data.requestInfo, "No requestInfo found in root loader");
  return data.requestInfo;
}
const hintsUtils = getHintUtils({
  theme: clientHint,
  timeZone: clientHint$1
  // add other hints here
});
const { getHints } = hintsUtils;
function useHints() {
  const requestInfo = useRequestInfo();
  return requestInfo.hints;
}
function ClientHintCheck({ nonce }) {
  const { revalidate } = useRevalidator();
  React.useEffect(
    () => subscribeToSchemeChange(() => revalidate()),
    [revalidate]
  );
  return /* @__PURE__ */ jsx(
    "script",
    {
      nonce,
      dangerouslySetInnerHTML: {
        __html: hintsUtils.getClientHintCheckScript()
      }
    }
  );
}
const cookieName = "en_theme";
function getTheme(request) {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : "light";
  if (parsed === "light" || parsed === "dark")
    return parsed;
  return null;
}
function setTheme(theme) {
  if (theme === "system") {
    return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
  } else {
    return cookie.serialize(cookieName, theme, { path: "/", maxAge: 31536e3 });
  }
}
const ThemeFormSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  // this is useful for progressive enhancement
  redirectTo: z.string().optional()
});
async function action$m({ request }) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: ThemeFormSchema
  });
  invariantResponse(submission.status === "success", "Invalid theme received");
  const { theme, redirectTo } = submission.value;
  const responseInit = {
    headers: { "set-cookie": setTheme(theme) }
  };
  if (redirectTo) {
    return redirect(redirectTo, responseInit);
  } else {
    return json({ result: submission.reply() }, responseInit);
  }
}
function ThemeSwitch({
  userPreference
}) {
  var _a2;
  const fetcher = useFetcher();
  const requestInfo = useRequestInfo();
  const [form] = useForm({
    id: "theme-switch",
    lastResult: (_a2 = fetcher.data) == null ? void 0 : _a2.result
  });
  const optimisticMode = useOptimisticThemeMode();
  const mode2 = optimisticMode ?? userPreference ?? "system";
  const nextMode = mode2 === "system" ? "light" : mode2 === "light" ? "dark" : "system";
  const modeLabel = {
    light: /* @__PURE__ */ jsx(Icon, { name: "sun", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Light" }) }),
    dark: /* @__PURE__ */ jsx(Icon, { name: "moon", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Dark" }) }),
    system: /* @__PURE__ */ jsx(Icon, { name: "laptop", children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: "System" }) })
  };
  return /* @__PURE__ */ jsxs(
    fetcher.Form,
    {
      method: "POST",
      ...getFormProps(form),
      action: "/resources/theme-switch",
      children: [
        /* @__PURE__ */ jsx(ServerOnly, { children: () => /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirectTo", value: requestInfo.path }) }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "theme", value: nextMode }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "flex h-8 w-8 cursor-pointer items-center justify-center",
            children: modeLabel[mode2]
          }
        ) })
      ]
    }
  );
}
function useOptimisticThemeMode() {
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    (f) => f.formAction === "/resources/theme-switch"
  );
  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema
    });
    if (submission.status === "success") {
      return submission.value.theme;
    }
  }
}
function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  const optimisticMode = useOptimisticThemeMode();
  if (optimisticMode) {
    return optimisticMode === "system" ? hints.theme : optimisticMode;
  }
  return requestInfo.userPrefs.theme ?? hints.theme;
}
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ThemeSwitch,
  action: action$m,
  useOptimisticThemeMode,
  useTheme
}, Symbol.toStringTag, { value: "Module" }));
const tailwindStyleSheetUrl = "/assets/tailwind-DLqiVpmW.css";
async function updatePrimaryCacheValue({
  key: key2,
  cacheValue
}) {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
  if (currentIsPrimary) {
    throw new Error(
      `updatePrimaryCacheValue should not be called on the primary instance (${primaryInstance})}`
    );
  }
  const domain = getInternalInstanceDomain(primaryInstance);
  const token = process.env.INTERNAL_COMMAND_TOKEN;
  return fetch(`${domain}/admin/cache/sqlite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ key: key2, cacheValue })
  });
}
const CACHE_DATABASE_PATH = process.env.CACHE_DATABASE_PATH;
const cacheDb = remember("cacheDb", createDatabase);
function createDatabase(tryAgain = true) {
  const db = new Database(CACHE_DATABASE_PATH);
  const { currentIsPrimary } = getInstanceInfoSync();
  if (!currentIsPrimary)
    return db;
  try {
    db.exec(`
			CREATE TABLE IF NOT EXISTS cache (
				key TEXT PRIMARY KEY,
				metadata TEXT,
				value TEXT
			)
		`);
  } catch (error) {
    fs.unlinkSync(CACHE_DATABASE_PATH);
    if (tryAgain) {
      console.error(
        `Error creating cache database, deleting the file at "${CACHE_DATABASE_PATH}" and trying again...`
      );
      return createDatabase(false);
    }
    throw error;
  }
  return db;
}
const lru = remember(
  "lru-cache",
  () => new LRUCache({ max: 5e3 })
);
const lruCache = {
  name: "app-memory-cache",
  set: (key2, value) => {
    var _a2;
    const ttl = totalTtl(value == null ? void 0 : value.metadata);
    lru.set(key2, value, {
      ttl: ttl === Infinity ? void 0 : ttl,
      start: (_a2 = value == null ? void 0 : value.metadata) == null ? void 0 : _a2.createdTime
    });
    return value;
  },
  get: (key2) => lru.get(key2),
  delete: (key2) => lru.delete(key2)
};
const cacheEntrySchema = z.object({
  metadata: z.object({
    createdTime: z.number(),
    ttl: z.number().nullable().optional(),
    swr: z.number().nullable().optional()
  }),
  value: z.unknown()
});
const cacheQueryResultSchema = z.object({
  metadata: z.string(),
  value: z.string()
});
const cache = {
  name: "SQLite cache",
  get(key2) {
    const result = cacheDb.prepare("SELECT value, metadata FROM cache WHERE key = ?").get(key2);
    const parseResult = cacheQueryResultSchema.safeParse(result);
    if (!parseResult.success)
      return null;
    const parsedEntry = cacheEntrySchema.safeParse({
      metadata: JSON.parse(parseResult.data.metadata),
      value: JSON.parse(parseResult.data.value)
    });
    if (!parsedEntry.success)
      return null;
    const { metadata, value } = parsedEntry.data;
    if (!value)
      return null;
    return { metadata, value };
  },
  async set(key2, entry2) {
    const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
    if (currentIsPrimary) {
      cacheDb.prepare(
        "INSERT OR REPLACE INTO cache (key, value, metadata) VALUES (@key, @value, @metadata)"
      ).run({
        key: key2,
        value: JSON.stringify(entry2.value),
        metadata: JSON.stringify(entry2.metadata)
      });
    } else {
      void updatePrimaryCacheValue({
        key: key2,
        cacheValue: entry2
      }).then((response) => {
        if (!response.ok) {
          console.error(
            `Error updating cache value for key "${key2}" on primary instance (${primaryInstance}): ${response.status} ${response.statusText}`,
            { entry: entry2 }
          );
        }
      });
    }
  },
  async delete(key2) {
    const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
    if (currentIsPrimary) {
      cacheDb.prepare("DELETE FROM cache WHERE key = ?").run(key2);
    } else {
      void updatePrimaryCacheValue({
        key: key2,
        cacheValue: void 0
      }).then((response) => {
        if (!response.ok) {
          console.error(
            `Error deleting cache value for key "${key2}" on primary instance (${primaryInstance}): ${response.status} ${response.statusText}`
          );
        }
      });
    }
  }
};
async function getAllCacheKeys(limit) {
  return {
    sqlite: cacheDb.prepare("SELECT key FROM cache LIMIT ?").all(limit).map((row) => row.key),
    lru: [...lru.keys()]
  };
}
async function searchCacheKeys(search, limit) {
  return {
    sqlite: cacheDb.prepare("SELECT key FROM cache WHERE key LIKE ? LIMIT ?").all(`%${search}%`, limit).map((row) => row.key),
    lru: [...lru.keys()].filter((key2) => key2.includes(search))
  };
}
async function cachified({
  timings,
  ...options
}, reporter = verboseReporter()) {
  return cachified$1(
    options,
    mergeReporters(cachifiedTimingReporter(timings), reporter)
  );
}
const MOCK_CODE_GITHUB = "MOCK_CODE_GITHUB_KODY";
const MOCK_CODE_GITHUB_HEADER = "x-mock-code-github";
const GitHubUserSchema = z.object({ login: z.string() });
const GitHubUserParseResult = z.object({
  success: z.literal(true),
  data: GitHubUserSchema
}).or(
  z.object({
    success: z.literal(false)
  })
);
const shouldMock = ((_a = process.env.GITHUB_CLIENT_ID) == null ? void 0 : _a.startsWith("MOCK_")) || process.env.NODE_ENV === "test";
class GitHubProvider {
  getAuthStrategy() {
    return new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
      },
      async ({ profile }) => {
        var _a2;
        const email = (_a2 = profile.emails[0]) == null ? void 0 : _a2.value.trim().toLowerCase();
        if (!email) {
          throw new Error("Email not found");
        }
        const username = profile.displayName;
        const imageUrl = profile.photos[0].value;
        return {
          email,
          id: profile.id,
          username,
          name: profile.name.givenName,
          imageUrl
        };
      }
    );
  }
  async resolveConnectionData(providerId, { timings } = {}) {
    const result = await cachified({
      key: `connection-data:github:${providerId}`,
      cache,
      timings,
      ttl: 1e3 * 60,
      swr: 1e3 * 60 * 60 * 24 * 7,
      async getFreshValue(context) {
        const response = await fetch(
          `https://api.github.com/user/${providerId}`,
          { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
        );
        const rawJson = await response.json();
        const result2 = GitHubUserSchema.safeParse(rawJson);
        if (!result2.success) {
          context.metadata.ttl = 0;
        }
        return result2;
      },
      checkValue: GitHubUserParseResult
    });
    return {
      displayName: result.success ? result.data.login : "Unknown",
      link: result.success ? `https://github.com/${result.data.login}` : null
    };
  }
  async handleMockAction(request) {
    if (!shouldMock)
      return;
    const connectionSession = await connectionSessionStorage.getSession(
      request.headers.get("cookie")
    );
    const state = createId();
    connectionSession.set("oauth2:state", state);
    const code = request.headers.get(MOCK_CODE_GITHUB_HEADER) || MOCK_CODE_GITHUB;
    const searchParams = new URLSearchParams({ code, state });
    throw redirect$1(`/auth/github/callback?${searchParams}`, {
      headers: {
        "set-cookie": await connectionSessionStorage.commitSession(connectionSession)
      }
    });
  }
}
const connectionSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "en_connection",
    sameSite: "lax",
    // CSRF protection is advised if changing to 'none'
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    // 10 minutes
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production"
  }
});
const providers = {
  github: new GitHubProvider()
};
function handleMockAction(providerName, request) {
  return providers[providerName].handleMockAction(request);
}
function resolveConnectionData(providerName, providerId, options) {
  return providers[providerName].resolveConnectionData(providerId, options);
}
const prisma$1 = remember("prisma", () => {
  const logThreshold = 20;
  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" }
    ]
  });
  client.$on("query", async (e) => {
    if (e.duration < logThreshold)
      return;
    const color = e.duration < logThreshold * 1.1 ? "green" : e.duration < logThreshold * 1.2 ? "blue" : e.duration < logThreshold * 1.3 ? "yellow" : e.duration < logThreshold * 1.4 ? "redBright" : "red";
    const dur = chalk[color](`${e.duration}ms`);
    console.info(`prisma:query - ${dur} - ${e.query}`);
  });
  client.$connect();
  return client;
});
const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "en_session",
    sameSite: "lax",
    // CSRF protection is advised if changing to 'none'
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production"
  }
});
const originalCommitSession = authSessionStorage.commitSession;
Object.defineProperty(authSessionStorage, "commitSession", {
  value: async function commitSession(...args) {
    const [session, options] = args;
    if (options == null ? void 0 : options.expires) {
      session.set("expires", options.expires);
    }
    if (options == null ? void 0 : options.maxAge) {
      session.set("expires", new Date(Date.now() + options.maxAge * 1e3));
    }
    const expires = session.has("expires") ? new Date(session.get("expires")) : void 0;
    const setCookieHeader = await originalCommitSession(session, {
      ...options,
      expires
    });
    return setCookieHeader;
  }
});
const SESSION_EXPIRATION_TIME = 1e3 * 60 * 60 * 24 * 30;
const getSessionExpirationDate = () => new Date(Date.now() + SESSION_EXPIRATION_TIME);
const sessionKey = "sessionId";
const authenticator = new Authenticator(
  connectionSessionStorage
);
for (const [providerName, provider] of Object.entries(providers)) {
  authenticator.use(provider.getAuthStrategy(), providerName);
}
async function getUserId(request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionId = authSession.get(sessionKey);
  if (!sessionId)
    return null;
  const session = await prisma$1.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { id: sessionId, expirationDate: { gt: /* @__PURE__ */ new Date() } }
  });
  if (!(session == null ? void 0 : session.user)) {
    throw redirect$1("/", {
      headers: {
        "set-cookie": await authSessionStorage.destroySession(authSession)
      }
    });
  }
  return session.user.id;
}
async function requireUserId(request, { redirectTo } = {}) {
  const userId = await getUserId(request);
  if (!userId) {
    const requestUrl = new URL(request.url);
    redirectTo = redirectTo === null ? null : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`;
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = ["/login", loginParams == null ? void 0 : loginParams.toString()].filter(Boolean).join("?");
    throw redirect$1(loginRedirect);
  }
  return userId;
}
async function requireAnonymous(request) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect$1("/");
  }
}
async function login({
  username,
  password
}) {
  const user = await verifyUserPassword({ username }, password);
  if (!user)
    return null;
  const session = await prisma$1.session.create({
    select: { id: true, expirationDate: true, userId: true },
    data: {
      expirationDate: getSessionExpirationDate(),
      userId: user.id
    }
  });
  return session;
}
async function resetUserPassword({
  username,
  password
}) {
  const hashedPassword = await getPasswordHash(password);
  return prisma$1.user.update({
    where: { username },
    data: {
      password: {
        update: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function signup({
  email,
  username,
  password,
  name
}) {
  const hashedPassword = await getPasswordHash(password);
  const session = await prisma$1.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      user: {
        create: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          name,
          roles: { connect: { name: "user" } },
          password: {
            create: {
              hash: hashedPassword
            }
          }
        }
      }
    },
    select: { id: true, expirationDate: true }
  });
  return session;
}
async function signupWithConnection({
  email,
  username,
  name,
  providerId,
  providerName,
  imageUrl
}) {
  const session = await prisma$1.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      user: {
        create: {
          email: email.toLowerCase(),
          username: username.toLowerCase(),
          name,
          roles: { connect: { name: "user" } },
          connections: { create: { providerId, providerName } },
          image: imageUrl ? { create: await downloadFile(imageUrl) } : void 0
        }
      }
    },
    select: { id: true, expirationDate: true }
  });
  return session;
}
async function logout({
  request,
  redirectTo = "/"
}, responseInit) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionId = authSession.get(sessionKey);
  if (sessionId) {
    void prisma$1.session.deleteMany({ where: { id: sessionId } }).catch(() => {
    });
  }
  throw redirect$1(safeRedirect(redirectTo), {
    ...responseInit,
    headers: combineHeaders(
      { "set-cookie": await authSessionStorage.destroySession(authSession) },
      responseInit == null ? void 0 : responseInit.headers
    )
  });
}
async function getPasswordHash(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}
async function verifyUserPassword(where, password) {
  const userWithPassword = await prisma$1.user.findUnique({
    where,
    select: { id: true, password: { select: { hash: true } } }
  });
  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await bcrypt.compare(password, userWithPassword.password.hash);
  if (!isValid) {
    return null;
  }
  return { id: userWithPassword.id };
}
const honeypot = new Honeypot({
  validFromFieldName: process.env.NODE_ENV === "test" ? null : void 0,
  encryptionSeed: process.env.HONEYPOT_SECRET
});
function checkHoneypot(formData) {
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response("Form not submitted properly", { status: 400 });
    }
    throw error;
  }
}
const toastKey = "toast";
const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => createId()),
  title: z.string().optional(),
  type: z.enum(["message", "success", "error"]).default("message")
});
const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "en_toast",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production"
  }
});
async function redirectWithToast(url, toast2, init2) {
  return redirect$1(url, {
    ...init2,
    headers: combineHeaders(init2 == null ? void 0 : init2.headers, await createToastHeaders(toast2))
  });
}
async function createToastHeaders(toastInput) {
  const session = await toastSessionStorage.getSession();
  const toast2 = ToastSchema.parse(toastInput);
  session.flash(toastKey, toast2);
  const cookie2 = await toastSessionStorage.commitSession(session);
  return new Headers({ "set-cookie": cookie2 });
}
async function getToast(request) {
  const session = await toastSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const result = ToastSchema.safeParse(session.get(toastKey));
  const toast2 = result.success ? result.data : null;
  return {
    toast: toast2,
    headers: toast2 ? new Headers({
      "set-cookie": await toastSessionStorage.destroySession(session)
    }) : null
  };
}
function isUser(user) {
  return user && typeof user === "object" && typeof user.id === "string";
}
function useOptionalUser() {
  const data = useRouteLoaderData("root");
  if (!data || !isUser(data.user)) {
    return void 0;
  }
  return data.user;
}
function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
function parsePermissionString(permissionString) {
  const [action2, entity, access] = permissionString.split(":");
  return {
    action: action2,
    entity,
    access: access ? access.split(",") : void 0
  };
}
function userHasPermission(user, permission) {
  if (!user)
    return false;
  const { action: action2, entity, access } = parsePermissionString(permission);
  return user.roles.some(
    (role) => role.permissions.some(
      (permission2) => permission2.entity === entity && permission2.action === action2 && (!access || access.includes(permission2.access))
    )
  );
}
const links = () => {
  return [
    // Preload svg sprite as a resource to avoid render blocking
    { rel: "preload", href: iconsHref, as: "image" },
    // Preload CSS as a resource to avoid render blocking
    { rel: "mask-icon", href: "/favicons/mask-icon.svg" },
    {
      rel: "alternate icon",
      type: "image/png",
      href: "/favicons/favicon-32x32.png"
    },
    { rel: "apple-touch-icon", href: "/favicons/apple-touch-icon.png" },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      crossOrigin: "use-credentials"
    },
    // necessary to make typescript happy
    //These should match the css preloads above to avoid css as render blocking resource
    { rel: "icon", type: "image/svg+xml", href: "/favicons/favicon.svg" },
    { rel: "stylesheet", href: tailwindStyleSheetUrl }
  ].filter(Boolean);
};
const meta$a = ({ data }) => {
  return [
    { title: data ? "Epic Notes" : "Error | Epic Notes" },
    { name: "description", content: `Your own captain's log` }
  ];
};
async function loader$y({ request }) {
  const timings = makeTimings("root loader");
  const userId = await time(() => getUserId(request), {
    timings,
    type: "getUserId",
    desc: "getUserId in root"
  });
  const user = userId ? await time(
    () => prisma$1.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        username: true,
        image: { select: { id: true } },
        roles: {
          select: {
            name: true,
            permissions: {
              select: { entity: true, action: true, access: true }
            }
          }
        }
      },
      where: { id: userId }
    }),
    { timings, type: "find user", desc: "find user in root" }
  ) : null;
  if (userId && !user) {
    console.info("something weird happened");
    await logout({ request, redirectTo: "/" });
  }
  const { toast: toast2, headers: toastHeaders } = await getToast(request);
  const honeyProps = honeypot.getInputProps();
  return json(
    {
      user,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: {
          theme: getTheme(request)
        }
      },
      ENV: getEnv(),
      toast: toast2,
      honeyProps
    },
    {
      headers: combineHeaders(
        { "Server-Timing": timings.toString() },
        toastHeaders
      )
    }
  );
}
const headers$1 = ({ loaderHeaders }) => {
  const headers2 = {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? ""
  };
  return headers2;
};
function Document({
  children,
  nonce,
  theme = "light",
  env = {},
  allowIndexing = true
}) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: `${theme} h-full overflow-x-hidden`, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(ClientHintCheck, { nonce }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      allowIndexing ? null : /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-background text-foreground", children: [
      children,
      /* @__PURE__ */ jsx(
        "script",
        {
          nonce,
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify(env)}`
          }
        }
      ),
      /* @__PURE__ */ jsx(ScrollRestoration, { nonce }),
      /* @__PURE__ */ jsx(Scripts, { nonce })
    ] })
  ] });
}
function App() {
  const data = useLoaderData();
  const nonce = useNonce();
  const user = useOptionalUser();
  const theme = useTheme();
  const matches = useMatches();
  const isOnSearchPage = matches.find((m) => m.id === "routes/users+/index");
  const searchBar = isOnSearchPage ? null : /* @__PURE__ */ jsx(SearchBar, { status: "idle" });
  const allowIndexing = data.ENV.ALLOW_INDEXING !== "false";
  useToast(data.toast);
  return /* @__PURE__ */ jsxs(
    Document,
    {
      nonce,
      theme,
      allowIndexing,
      env: data.ENV,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-screen flex-col justify-between", children: [
          /* @__PURE__ */ jsx("header", { className: "container py-6", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8", children: [
            /* @__PURE__ */ jsx(Logo, {}),
            /* @__PURE__ */ jsx("div", { className: "ml-auto hidden max-w-sm flex-1 sm:block", children: searchBar }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-10", children: user ? /* @__PURE__ */ jsx(UserDropdown, {}) : /* @__PURE__ */ jsx(Button, { asChild: true, variant: "default", size: "lg", children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "Log In" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "block w-full sm:hidden", children: searchBar })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
          /* @__PURE__ */ jsxs("div", { className: "container flex justify-between pb-5", children: [
            /* @__PURE__ */ jsx(Logo, {}),
            /* @__PURE__ */ jsx(ThemeSwitch, { userPreference: data.requestInfo.userPrefs.theme })
          ] })
        ] }),
        /* @__PURE__ */ jsx(EpicToaster, { closeButton: true, position: "top-center", theme }),
        /* @__PURE__ */ jsx(EpicProgress, {})
      ]
    }
  );
}
function Logo() {
  return /* @__PURE__ */ jsxs(Link, { to: "/", className: "group grid leading-snug", children: [
    /* @__PURE__ */ jsx("span", { className: "font-light transition group-hover:-translate-x-1", children: "epic" }),
    /* @__PURE__ */ jsx("span", { className: "font-bold transition group-hover:translate-x-1", children: "notes" })
  ] });
}
function AppWithProviders() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsx(HoneypotProvider, { ...data.honeyProps, children: /* @__PURE__ */ jsx(App, {}) });
}
const root = withSentry(AppWithProviders);
function UserDropdown() {
  var _a2;
  const user = useUser();
  const submit = useSubmit();
  const formRef = useRef(null);
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "secondary", children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/users/${user.username}`,
        onClick: (e) => e.preventDefault(),
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "h-8 w-8 rounded-full object-cover",
              alt: user.name ?? user.username,
              src: getUserImgSrc((_a2 = user.image) == null ? void 0 : _a2.id)
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-body-sm font-bold", children: user.name ?? user.username })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(DropdownMenuPortal, { children: /* @__PURE__ */ jsxs(DropdownMenuContent, { sideOffset: 8, align: "start", children: [
      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { prefetch: "intent", to: `/users/${user.username}`, children: /* @__PURE__ */ jsx(Icon, { className: "text-body-md", name: "avatar", children: "Profile" }) }) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsx(Link, { prefetch: "intent", to: `/users/${user.username}/notes`, children: /* @__PURE__ */ jsx(Icon, { className: "text-body-md", name: "pencil-2", children: "Notes" }) }) }),
      /* @__PURE__ */ jsx(
        DropdownMenuItem,
        {
          asChild: true,
          onSelect: (event) => {
            event.preventDefault();
            submit(formRef.current);
          },
          children: /* @__PURE__ */ jsx(Form, { action: "/logout", method: "POST", ref: formRef, children: /* @__PURE__ */ jsx(Icon, { className: "text-body-md", name: "exit", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Logout" }) }) })
        }
      )
    ] }) })
  ] });
}
function ErrorBoundary$c() {
  const nonce = useNonce();
  return /* @__PURE__ */ jsx(Document, { nonce, children: /* @__PURE__ */ jsx(GeneralErrorBoundary, {}) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$c,
  default: root,
  headers: headers$1,
  links,
  loader: loader$y,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$x() {
  throw new Response("Not found", { status: 404 });
}
function NotFound() {
  return /* @__PURE__ */ jsx(ErrorBoundary$b, {});
}
function ErrorBoundary$b() {
  const location = useLocation();
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        404: () => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsx("h1", { children: "We can't find this page:" }),
            /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap break-all text-body-lg", children: location.pathname })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/", className: "text-body-md underline", children: /* @__PURE__ */ jsx(Icon, { name: "arrow-left", children: "Back to home" }) })
        ] })
      }
    }
  );
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$b,
  default: NotFound,
  loader: loader$x
}, Symbol.toStringTag, { value: "Module" }));
const GITHUB_PROVIDER_NAME = "github";
const providerNames = [GITHUB_PROVIDER_NAME];
const ProviderNameSchema = z.enum(providerNames);
const providerLabels = {
  [GITHUB_PROVIDER_NAME]: "GitHub"
};
const providerIcons = {
  [GITHUB_PROVIDER_NAME]: /* @__PURE__ */ jsx(Icon, { name: "github-logo" })
};
function ProviderConnectionForm({
  redirectTo,
  type,
  providerName
}) {
  const label = providerLabels[providerName];
  const formAction = `/auth/${providerName}`;
  const isPending = useIsPending({ formAction });
  return /* @__PURE__ */ jsxs(
    Form,
    {
      className: "flex items-center justify-center gap-2",
      action: formAction,
      method: "POST",
      children: [
        redirectTo ? /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirectTo", value: redirectTo }) : null,
        /* @__PURE__ */ jsx(
          StatusButton,
          {
            type: "submit",
            className: "w-full",
            status: isPending ? "pending" : "idle",
            children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
              providerIcons[providerName],
              /* @__PURE__ */ jsxs("span", { children: [
                type,
                " with ",
                label
              ] })
            ] })
          }
        )
      ]
    }
  );
}
const key = "redirectTo";
const destroyRedirectToHeader = cookie.serialize(key, "", { maxAge: -1 });
function getRedirectCookieHeader(redirectTo) {
  return redirectTo && redirectTo !== "/" ? cookie.serialize(key, redirectTo, { maxAge: 60 * 10 }) : null;
}
function getRedirectCookieValue(request) {
  const rawCookie = request.headers.get("cookie");
  const parsedCookies = rawCookie ? cookie.parse(rawCookie) : {};
  const redirectTo = parsedCookies[key];
  return redirectTo || null;
}
async function loader$w() {
  return redirect$1("/login");
}
async function action$l({ request, params }) {
  const providerName = ProviderNameSchema.parse(params.provider);
  try {
    await handleMockAction(providerName, request);
    return await authenticator.authenticate(providerName, request);
  } catch (error) {
    if (error instanceof Response) {
      const formData = await request.formData();
      const rawRedirectTo = formData.get("redirectTo");
      const redirectTo = typeof rawRedirectTo === "string" ? rawRedirectTo : getReferrerRoute(request);
      const redirectToCookie = getRedirectCookieHeader(redirectTo);
      if (redirectToCookie) {
        error.headers.append("set-cookie", redirectToCookie);
      }
    }
    throw error;
  }
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$l,
  loader: loader$w
}, Symbol.toStringTag, { value: "Module" }));
const normalizeEmail = (s) => s.toLowerCase();
const normalizeUsername = (s) => s.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
const verifySessionStorage = createCookieSessionStorage({
  cookie: {
    name: "en_verification",
    sameSite: "lax",
    // CSRF protection is advised if changing to 'none'
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    // 10 minutes
    secrets: process.env.SESSION_SECRET.split(","),
    secure: process.env.NODE_ENV === "production"
  }
});
const handle$b = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "lock-closed", children: "2FA" }),
  getSitemapEntries: () => null
};
const twoFAVerificationType = "2fa";
function TwoFactorRoute$2() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TwoFactorRoute$2,
  handle: handle$b,
  twoFAVerificationType
}, Symbol.toStringTag, { value: "Module" }));
const resendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number()
  }),
  z.object({
    name: z.literal("UnknownError"),
    message: z.literal("Unknown Error"),
    statusCode: z.literal(500),
    cause: z.any()
  })
]);
const resendSuccessSchema = z.object({
  id: z.string()
});
async function sendEmail({
  react,
  ...options
}) {
  const from = "hello@epicstack.dev";
  const email = {
    from,
    ...options,
    ...react ? await renderReactEmail(react) : null
  };
  if (!process.env.RESEND_API_KEY && !process.env.MOCKS) {
    console.error(`RESEND_API_KEY not set and we're not in mocks mode.`);
    console.error(
      `To send emails, set the RESEND_API_KEY environment variable.`
    );
    console.error(`Would have sent the following email:`, JSON.stringify(email));
    return {
      status: "success",
      data: { id: "mocked" }
    };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  const parsedData = resendSuccessSchema.safeParse(data);
  if (response.ok && parsedData.success) {
    return {
      status: "success",
      data: parsedData
    };
  } else {
    const parseResult = resendErrorSchema.safeParse(data);
    if (parseResult.success) {
      return {
        status: "error",
        error: parseResult.data
      };
    } else {
      return {
        status: "error",
        error: {
          name: "UnknownError",
          message: "Unknown Error",
          statusCode: 500,
          cause: data
        }
      };
    }
  }
}
async function renderReactEmail(react) {
  const [html, text] = await Promise.all([
    renderAsync(react),
    renderAsync(react, { plainText: true })
  ]);
  return { html, text };
}
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 8 8", children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M1,4 L3,6 L7,2",
            stroke: "currentcolor",
            strokeWidth: "1",
            fill: "none"
          }
        ) })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsx(
  OTPInput,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext.slots[index];
  if (!slot)
    throw new Error("Invalid slot index");
  const { char, hasFakeCaret, isActive } = slot;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "separator", ...props, children: "-" }));
InputOTPSeparator.displayName = "InputOTPSeparator";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function ErrorList({
  id,
  errors
}) {
  const errorsToRender = errors == null ? void 0 : errors.filter(Boolean);
  if (!(errorsToRender == null ? void 0 : errorsToRender.length))
    return null;
  return /* @__PURE__ */ jsx("ul", { id, className: "flex flex-col gap-1", children: errorsToRender.map((e) => /* @__PURE__ */ jsx("li", { className: "text-[10px] text-foreground-destructive", children: e }, e)) });
}
function Field({
  labelProps,
  inputProps,
  errors,
  className
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = (errors == null ? void 0 : errors.length) ? `${id}-error` : void 0;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, ...labelProps }),
    /* @__PURE__ */ jsx(
      Input,
      {
        id,
        "aria-invalid": errorId ? true : void 0,
        "aria-describedby": errorId,
        ...inputProps
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ jsx(ErrorList, { id: errorId, errors }) : null })
  ] });
}
function OTPField({
  labelProps,
  inputProps,
  errors,
  className
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = (errors == null ? void 0 : errors.length) ? `${id}-error` : void 0;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, ...labelProps }),
    /* @__PURE__ */ jsxs(
      InputOTP,
      {
        pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
        maxLength: 6,
        id,
        "aria-invalid": errorId ? true : void 0,
        "aria-describedby": errorId,
        ...inputProps,
        children: [
          /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 0 }),
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 1 }),
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 2 })
          ] }),
          /* @__PURE__ */ jsx(InputOTPSeparator, {}),
          /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 3 }),
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 4 }),
            /* @__PURE__ */ jsx(InputOTPSlot, { index: 5 })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ jsx(ErrorList, { id: errorId, errors }) : null })
  ] });
}
function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className
}) {
  const fallbackId = useId();
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
  const errorId = (errors == null ? void 0 : errors.length) ? `${id}-error` : void 0;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, ...labelProps }),
    /* @__PURE__ */ jsx(
      Textarea,
      {
        id,
        "aria-invalid": errorId ? true : void 0,
        "aria-describedby": errorId,
        ...textareaProps
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ jsx(ErrorList, { id: errorId, errors }) : null })
  ] });
}
function CheckboxField({
  labelProps,
  buttonProps,
  errors,
  className
}) {
  const { key: key2, defaultChecked, ...checkboxProps } = buttonProps;
  const fallbackId = useId();
  const checkedValue = buttonProps.value ?? "on";
  const input = useInputControl({
    key: key2,
    name: buttonProps.name,
    formId: buttonProps.form,
    initialValue: defaultChecked ? checkedValue : void 0
  });
  const id = buttonProps.id ?? fallbackId;
  const errorId = (errors == null ? void 0 : errors.length) ? `${id}-error` : void 0;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          ...checkboxProps,
          id,
          "aria-invalid": errorId ? true : void 0,
          "aria-describedby": errorId,
          checked: input.value === checkedValue,
          onCheckedChange: (state) => {
            var _a2;
            input.change(state.valueOf() ? checkedValue : "");
            (_a2 = buttonProps.onCheckedChange) == null ? void 0 : _a2.call(buttonProps, state);
          },
          onFocus: (event) => {
            var _a2;
            input.focus();
            (_a2 = buttonProps.onFocus) == null ? void 0 : _a2.call(buttonProps, event);
          },
          onBlur: (event) => {
            var _a2;
            input.blur();
            (_a2 = buttonProps.onBlur) == null ? void 0 : _a2.call(buttonProps, event);
          },
          type: "button"
        }
      ),
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: id,
          ...labelProps,
          className: "self-center text-body-xs text-muted-foreground"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ jsx(ErrorList, { id: errorId, errors }) : null })
  ] });
}
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const UsernameSchema = z.string({ required_error: "Username is required" }).min(USERNAME_MIN_LENGTH, { message: "Username is too short" }).max(USERNAME_MAX_LENGTH, { message: "Username is too long" }).regex(/^[a-zA-Z0-9_]+$/, {
  message: "Username can only include letters, numbers, and underscores"
}).transform((value) => value.toLowerCase());
const PasswordSchema = z.string({ required_error: "Password is required" }).min(6, { message: "Password is too short" }).max(100, { message: "Password is too long" });
const NameSchema = z.string({ required_error: "Name is required" }).min(3, { message: "Name is too short" }).max(40, { message: "Name is too long" });
const EmailSchema = z.string({ required_error: "Email is required" }).email({ message: "Email is invalid" }).min(3, { message: "Email is too short" }).max(100, { message: "Email is too long" }).transform((value) => value.toLowerCase());
const PasswordAndConfirmPasswordSchema = z.object({ password: PasswordSchema, confirmPassword: PasswordSchema }).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "The passwords must match"
    });
  }
});
const handle$a = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "envelope-closed", children: "Change Email" }),
  getSitemapEntries: () => null
};
const newEmailAddressSessionKey = "new-email-address";
const ChangeEmailSchema = z.object({
  email: EmailSchema
});
async function loader$v({ request }) {
  await requireRecentVerification(request);
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });
  if (!user) {
    const params = new URLSearchParams({ redirectTo: request.url });
    throw redirect$1(`/login?${params}`);
  }
  return json({ user });
}
async function action$k({ request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: ChangeEmailSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma$1.user.findUnique({
        where: { email: data.email }
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "This email is already in use."
        });
      }
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { otp, redirectTo, verifyUrl } = await prepareVerification({
    period: 10 * 60,
    request,
    target: userId,
    type: "change-email"
  });
  const response = await sendEmail({
    to: submission.value.email,
    subject: `Epic Notes Email Change Verification`,
    react: /* @__PURE__ */ jsx(EmailChangeEmail, { verifyUrl: verifyUrl.toString(), otp })
  });
  if (response.status === "success") {
    const verifySession = await verifySessionStorage.getSession();
    verifySession.set(newEmailAddressSessionKey, submission.value.email);
    return redirect$1(redirectTo.toString(), {
      headers: {
        "set-cookie": await verifySessionStorage.commitSession(verifySession)
      }
    });
  } else {
    return json(
      { result: submission.reply({ formErrors: [response.error.message] }) },
      { status: 500 }
    );
  }
}
function ChangeEmailIndex() {
  const data = useLoaderData();
  const actionData = useActionData();
  const [form, fields] = useForm({
    id: "change-email-form",
    constraint: getZodConstraint(ChangeEmailSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ChangeEmailSchema });
    }
  });
  const isPending = useIsPending();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Change Email" }),
    /* @__PURE__ */ jsx("p", { children: "You will receive an email at the new email address to confirm." }),
    /* @__PURE__ */ jsxs("p", { children: [
      "An email notice will also be sent to your old address ",
      data.user.email,
      "."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-5 max-w-sm", children: /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), children: [
      /* @__PURE__ */ jsx(
        Field,
        {
          labelProps: { children: "New Email" },
          inputProps: {
            ...getInputProps(fields.email, { type: "email" }),
            autoComplete: "email"
          },
          errors: fields.email.errors
        }
      ),
      /* @__PURE__ */ jsx(ErrorList, { id: form.errorId, errors: form.errors }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        StatusButton,
        {
          status: isPending ? "pending" : form.status ?? "idle",
          children: "Send Confirmation"
        }
      ) })
    ] }) })
  ] });
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$k,
  default: ChangeEmailIndex,
  handle: handle$a,
  loader: loader$v,
  newEmailAddressSessionKey
}, Symbol.toStringTag, { value: "Module" }));
async function handleVerification$3({
  request,
  submission
}) {
  await requireRecentVerification(request);
  invariant(
    submission.status === "success",
    "Submission should be successful by now"
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const newEmail = verifySession.get(newEmailAddressSessionKey);
  if (!newEmail) {
    return json(
      {
        result: submission.reply({
          formErrors: [
            "You must submit the code on the same device that requested the email change."
          ]
        })
      },
      { status: 400 }
    );
  }
  const preUpdateUser = await prisma$1.user.findFirstOrThrow({
    select: { email: true },
    where: { id: submission.value.target }
  });
  const user = await prisma$1.user.update({
    where: { id: submission.value.target },
    select: { id: true, email: true, username: true },
    data: { email: newEmail }
  });
  void sendEmail({
    to: preUpdateUser.email,
    subject: "Epic Stack email changed",
    react: /* @__PURE__ */ jsx(EmailChangeNoticeEmail, { userId: user.id })
  });
  return redirectWithToast(
    "/settings/profile",
    {
      title: "Email Changed",
      type: "success",
      description: `Your email has been changed to ${user.email}`
    },
    {
      headers: {
        "set-cookie": await verifySessionStorage.destroySession(verifySession)
      }
    }
  );
}
function EmailChangeEmail({
  verifyUrl,
  otp
}) {
  return /* @__PURE__ */ jsx(E.Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ jsxs(E.Container, { children: [
    /* @__PURE__ */ jsx("h1", { children: /* @__PURE__ */ jsx(E.Text, { children: "Epic Notes Email Change" }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs(E.Text, { children: [
      "Here's your verification code: ",
      /* @__PURE__ */ jsx("strong", { children: otp })
    ] }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(E.Text, { children: "Or click the link:" }) }),
    /* @__PURE__ */ jsx(E.Link, { href: verifyUrl, children: verifyUrl })
  ] }) });
}
function EmailChangeNoticeEmail({ userId }) {
  return /* @__PURE__ */ jsx(E.Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ jsxs(E.Container, { children: [
    /* @__PURE__ */ jsx("h1", { children: /* @__PURE__ */ jsx(E.Text, { children: "Your Epic Notes email has been changed" }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(E.Text, { children: "We're writing to let you know that your Epic Notes email has been changed." }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(E.Text, { children: "If you changed your email address, then you can safely ignore this. But if you did not change your email address, then please contact support immediately." }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs(E.Text, { children: [
      "Your Account ID: ",
      userId
    ] }) })
  ] }) });
}
function Spacer({
  size
}) {
  const options = {
    "4xs": "h-4",
    "3xs": "h-8",
    "2xs": "h-12",
    xs: "h-16",
    sm: "h-20",
    md: "h-24",
    lg: "h-28",
    xl: "h-32",
    "2xl": "h-36",
    "3xl": "h-40",
    "4xl": "h-44"
  };
  const className = options[size];
  return /* @__PURE__ */ jsx("div", { className });
}
const onboardingEmailSessionKey = "onboardingEmail";
const SignupFormSchema$1 = z.object({
  username: UsernameSchema,
  name: NameSchema,
  agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
    required_error: "You must agree to the terms of service and privacy policy"
  }),
  remember: z.boolean().optional(),
  redirectTo: z.string().optional()
}).and(PasswordAndConfirmPasswordSchema);
async function requireOnboardingEmail(request) {
  await requireAnonymous(request);
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const email = verifySession.get(onboardingEmailSessionKey);
  if (typeof email !== "string" || !email) {
    throw redirect$1("/signup");
  }
  return email;
}
async function loader$u({ request }) {
  const email = await requireOnboardingEmail(request);
  return json({ email });
}
async function action$j({ request }) {
  const email = await requireOnboardingEmail(request);
  const formData = await request.formData();
  checkHoneypot(formData);
  const submission = await parseWithZod(formData, {
    schema: (intent) => SignupFormSchema$1.superRefine(async (data, ctx) => {
      const existingUser = await prisma$1.user.findUnique({
        where: { username: data.username },
        select: { id: true }
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this username"
        });
        return;
      }
    }).transform(async (data) => {
      if (intent !== null)
        return { ...data, session: null };
      const session2 = await signup({ ...data, email });
      return { ...data, session: session2 };
    }),
    async: true
  });
  if (submission.status !== "success" || !submission.value.session) {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { session, remember: remember2, redirectTo } = submission.value;
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  authSession.set(sessionKey, session.id);
  const verifySession = await verifySessionStorage.getSession();
  const headers2 = new Headers();
  headers2.append(
    "set-cookie",
    await authSessionStorage.commitSession(authSession, {
      expires: remember2 ? session.expirationDate : void 0
    })
  );
  headers2.append(
    "set-cookie",
    await verifySessionStorage.destroySession(verifySession)
  );
  return redirectWithToast(
    safeRedirect(redirectTo),
    { title: "Welcome", description: "Thanks for signing up!" },
    { headers: headers2 }
  );
}
const meta$9 = () => {
  return [{ title: "Setup Epic Notes Account" }];
};
function OnboardingRoute() {
  const data = useLoaderData();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "onboarding-form",
    constraint: getZodConstraint(SignupFormSchema$1),
    defaultValue: { redirectTo },
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema$1 });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsx("div", { className: "container flex min-h-full flex-col justify-center pb-32 pt-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-h1", children: [
        "Welcome aboard ",
        data.email,
        "!"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." })
    ] }),
    /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        className: "mx-auto min-w-full max-w-sm sm:min-w-[368px]",
        ...getFormProps(form),
        children: [
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: { htmlFor: fields.username.id, children: "Username" },
              inputProps: {
                ...getInputProps(fields.username, { type: "text" }),
                autoComplete: "username",
                className: "lowercase"
              },
              errors: fields.username.errors
            }
          ),
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: { htmlFor: fields.name.id, children: "Name" },
              inputProps: {
                ...getInputProps(fields.name, { type: "text" }),
                autoComplete: "name"
              },
              errors: fields.name.errors
            }
          ),
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: { htmlFor: fields.password.id, children: "Password" },
              inputProps: {
                ...getInputProps(fields.password, { type: "password" }),
                autoComplete: "new-password"
              },
              errors: fields.password.errors
            }
          ),
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: {
                htmlFor: fields.confirmPassword.id,
                children: "Confirm Password"
              },
              inputProps: {
                ...getInputProps(fields.confirmPassword, { type: "password" }),
                autoComplete: "new-password"
              },
              errors: fields.confirmPassword.errors
            }
          ),
          /* @__PURE__ */ jsx(
            CheckboxField,
            {
              labelProps: {
                htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
                children: "Do you agree to our Terms of Service and Privacy Policy?"
              },
              buttonProps: getInputProps(
                fields.agreeToTermsOfServiceAndPrivacyPolicy,
                { type: "checkbox" }
              ),
              errors: fields.agreeToTermsOfServiceAndPrivacyPolicy.errors
            }
          ),
          /* @__PURE__ */ jsx(
            CheckboxField,
            {
              labelProps: {
                htmlFor: fields.remember.id,
                children: "Remember me"
              },
              buttonProps: getInputProps(fields.remember, { type: "checkbox" }),
              errors: fields.remember.errors
            }
          ),
          /* @__PURE__ */ jsx("input", { ...getInputProps(fields.redirectTo, { type: "hidden" }) }),
          /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-6", children: /* @__PURE__ */ jsx(
            StatusButton,
            {
              className: "w-full",
              status: isPending ? "pending" : form.status ?? "idle",
              type: "submit",
              disabled: isPending,
              children: "Create an account"
            }
          ) })
        ]
      }
    )
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j,
  default: OnboardingRoute,
  loader: loader$u,
  meta: meta$9,
  onboardingEmailSessionKey
}, Symbol.toStringTag, { value: "Module" }));
async function handleVerification$2({ submission }) {
  invariant(
    submission.status === "success",
    "Submission should be successful by now"
  );
  const verifySession = await verifySessionStorage.getSession();
  verifySession.set(onboardingEmailSessionKey, submission.value.target);
  return redirect$1("/onboarding", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession)
    }
  });
}
const resetPasswordUsernameSessionKey = "resetPasswordUsername";
const ResetPasswordSchema = PasswordAndConfirmPasswordSchema;
async function requireResetPasswordUsername(request) {
  await requireAnonymous(request);
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const resetPasswordUsername = verifySession.get(
    resetPasswordUsernameSessionKey
  );
  if (typeof resetPasswordUsername !== "string" || !resetPasswordUsername) {
    throw redirect$1("/login");
  }
  return resetPasswordUsername;
}
async function loader$t({ request }) {
  const resetPasswordUsername = await requireResetPasswordUsername(request);
  return json({ resetPasswordUsername });
}
async function action$i({ request }) {
  const resetPasswordUsername = await requireResetPasswordUsername(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: ResetPasswordSchema
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { password } = submission.value;
  await resetUserPassword({ username: resetPasswordUsername, password });
  const verifySession = await verifySessionStorage.getSession();
  return redirect$1("/login", {
    headers: {
      "set-cookie": await verifySessionStorage.destroySession(verifySession)
    }
  });
}
const meta$8 = () => {
  return [{ title: "Reset Password | Epic Notes" }];
};
function ResetPasswordPage() {
  const data = useLoaderData();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "reset-password",
    constraint: getZodConstraint(ResetPasswordSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordSchema });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsxs("div", { className: "container flex flex-col justify-center pb-32 pt-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Password Reset" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-3 text-body-md text-muted-foreground", children: [
        "Hi, ",
        data.resetPasswordUsername,
        ". No worries. It happens all the time."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]", children: /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), children: [
      /* @__PURE__ */ jsx(
        Field,
        {
          labelProps: {
            htmlFor: fields.password.id,
            children: "New Password"
          },
          inputProps: {
            ...getInputProps(fields.password, { type: "password" }),
            autoComplete: "new-password",
            autoFocus: true
          },
          errors: fields.password.errors
        }
      ),
      /* @__PURE__ */ jsx(
        Field,
        {
          labelProps: {
            htmlFor: fields.confirmPassword.id,
            children: "Confirm Password"
          },
          inputProps: {
            ...getInputProps(fields.confirmPassword, { type: "password" }),
            autoComplete: "new-password"
          },
          errors: fields.confirmPassword.errors
        }
      ),
      /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
      /* @__PURE__ */ jsx(
        StatusButton,
        {
          className: "w-full",
          status: isPending ? "pending" : form.status ?? "idle",
          type: "submit",
          disabled: isPending,
          children: "Reset password"
        }
      )
    ] }) })
  ] });
}
function ErrorBoundary$a() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$a,
  action: action$i,
  default: ResetPasswordPage,
  loader: loader$t,
  meta: meta$8,
  resetPasswordUsernameSessionKey
}, Symbol.toStringTag, { value: "Module" }));
async function handleVerification$1({ submission }) {
  invariant(
    submission.status === "success",
    "Submission should be successful by now"
  );
  const target = submission.value.target;
  const user = await prisma$1.user.findFirst({
    where: { OR: [{ email: target }, { username: target }] },
    select: { email: true, username: true }
  });
  if (!user) {
    return json(
      { result: submission.reply({ fieldErrors: { code: ["Invalid code"] } }) },
      { status: 400 }
    );
  }
  const verifySession = await verifySessionStorage.getSession();
  verifySession.set(resetPasswordUsernameSessionKey, user.username);
  return redirect$1("/reset-password", {
    headers: {
      "set-cookie": await verifySessionStorage.commitSession(verifySession)
    }
  });
}
const codeQueryParam = "code";
const targetQueryParam = "target";
const typeQueryParam = "type";
const redirectToQueryParam = "redirectTo";
const types = ["onboarding", "reset-password", "change-email", "2fa"];
const VerificationTypeSchema = z.enum(types);
const VerifySchema$1 = z.object({
  [codeQueryParam]: z.string().min(6).max(6),
  [typeQueryParam]: VerificationTypeSchema,
  [targetQueryParam]: z.string(),
  [redirectToQueryParam]: z.string().optional()
});
async function action$h({ request }) {
  const formData = await request.formData();
  checkHoneypot(formData);
  return validateRequest(request, formData);
}
function VerifyRoute() {
  const [searchParams] = useSearchParams();
  const isPending = useIsPending();
  const actionData = useActionData();
  const parseWithZoddType = VerificationTypeSchema.safeParse(
    searchParams.get(typeQueryParam)
  );
  const type = parseWithZoddType.success ? parseWithZoddType.data : null;
  const checkEmail = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Check your email" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-body-md text-muted-foreground", children: "We've sent you a code to verify your email address." })
  ] });
  const headings = {
    onboarding: checkEmail,
    "reset-password": checkEmail,
    "change-email": checkEmail,
    "2fa": /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Check your 2FA app" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-body-md text-muted-foreground", children: "Please enter your 2FA code to verify your identity." })
    ] })
  };
  const [form, fields] = useForm({
    id: "verify-form",
    constraint: getZodConstraint(VerifySchema$1),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifySchema$1 });
    },
    defaultValue: {
      code: searchParams.get(codeQueryParam),
      type,
      target: searchParams.get(targetQueryParam),
      redirectTo: searchParams.get(redirectToQueryParam)
    }
  });
  return /* @__PURE__ */ jsxs("main", { className: "container flex flex-col justify-center pb-32 pt-20", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center", children: type ? headings[type] : "Invalid Verification Type" }),
    /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-72 max-w-full flex-col justify-center gap-1", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }) }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full gap-2", children: /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), className: "flex-1", children: [
        /* @__PURE__ */ jsx(HoneypotInputs, {}),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
          OTPField,
          {
            labelProps: {
              htmlFor: fields[codeQueryParam].id,
              children: "Code"
            },
            inputProps: {
              ...getInputProps(fields[codeQueryParam], { type: "text" }),
              autoComplete: "one-time-code"
            },
            errors: fields[codeQueryParam].errors
          }
        ) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...getInputProps(fields[typeQueryParam], { type: "hidden" })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...getInputProps(fields[targetQueryParam], { type: "hidden" })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...getInputProps(fields[redirectToQueryParam], {
              type: "hidden"
            })
          }
        ),
        /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            status: isPending ? "pending" : form.status ?? "idle",
            type: "submit",
            disabled: isPending,
            children: "Submit"
          }
        )
      ] }) })
    ] })
  ] });
}
function ErrorBoundary$9() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$9,
  VerifySchema: VerifySchema$1,
  action: action$h,
  codeQueryParam,
  default: VerifyRoute,
  redirectToQueryParam,
  targetQueryParam,
  typeQueryParam
}, Symbol.toStringTag, { value: "Module" }));
function getRedirectToUrl({
  request,
  type,
  target,
  redirectTo
}) {
  const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`);
  redirectToUrl.searchParams.set(typeQueryParam, type);
  redirectToUrl.searchParams.set(targetQueryParam, target);
  if (redirectTo) {
    redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo);
  }
  return redirectToUrl;
}
async function requireRecentVerification(request) {
  const userId = await requireUserId(request);
  const shouldReverify = await shouldRequestTwoFA(request);
  if (shouldReverify) {
    const reqUrl = new URL(request.url);
    const redirectUrl = getRedirectToUrl({
      request,
      target: userId,
      type: twoFAVerificationType,
      redirectTo: reqUrl.pathname + reqUrl.search
    });
    throw await redirectWithToast(redirectUrl.toString(), {
      title: "Please Reverify",
      description: "Please reverify your account before proceeding"
    });
  }
}
async function prepareVerification({
  period,
  request,
  type,
  target
}) {
  const verifyUrl = getRedirectToUrl({ request, type, target });
  const redirectTo = new URL(verifyUrl.toString());
  const { otp, ...verificationConfig } = generateTOTP({
    algorithm: "SHA256",
    // Leaving off 0, O, and I on purpose to avoid confusing users.
    charSet: "ABCDEFGHJKLMNPQRSTUVWXYZ123456789",
    period
  });
  const verificationData = {
    type,
    target,
    ...verificationConfig,
    expiresAt: new Date(Date.now() + verificationConfig.period * 1e3)
  };
  await prisma$1.verification.upsert({
    where: { target_type: { target, type } },
    create: verificationData,
    update: verificationData
  });
  verifyUrl.searchParams.set(codeQueryParam, otp);
  return { otp, redirectTo, verifyUrl };
}
async function isCodeValid({
  code,
  type,
  target
}) {
  const verification = await prisma$1.verification.findUnique({
    where: {
      target_type: { target, type },
      OR: [{ expiresAt: { gt: /* @__PURE__ */ new Date() } }, { expiresAt: null }]
    },
    select: { algorithm: true, secret: true, period: true, charSet: true }
  });
  if (!verification)
    return false;
  const result = verifyTOTP({
    otp: code,
    ...verification
  });
  if (!result)
    return false;
  return true;
}
async function validateRequest(request, body) {
  const submission = await parseWithZod(body, {
    schema: VerifySchema$1.superRefine(async (data, ctx) => {
      const codeIsValid = await isCodeValid({
        code: data[codeQueryParam],
        type: data[typeQueryParam],
        target: data[targetQueryParam]
      });
      if (!codeIsValid) {
        ctx.addIssue({
          path: ["code"],
          code: z.ZodIssueCode.custom,
          message: `Invalid code`
        });
        return;
      }
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  await ensurePrimary();
  const { value: submissionValue } = submission;
  async function deleteVerification() {
    await prisma$1.verification.delete({
      where: {
        target_type: {
          type: submissionValue[typeQueryParam],
          target: submissionValue[targetQueryParam]
        }
      }
    });
  }
  switch (submissionValue[typeQueryParam]) {
    case "reset-password": {
      await deleteVerification();
      return handleVerification$1({ request, body, submission });
    }
    case "onboarding": {
      await deleteVerification();
      return handleVerification$2({ request, body, submission });
    }
    case "change-email": {
      await deleteVerification();
      return handleVerification$3({ request, body, submission });
    }
    case "2fa": {
      return handleVerification({ request, body, submission });
    }
  }
}
const verifiedTimeKey = "verified-time";
const unverifiedSessionIdKey = "unverified-session-id";
const rememberKey = "remember";
async function handleNewSession({
  request,
  session,
  redirectTo,
  remember: remember2
}, responseInit) {
  const verification = await prisma$1.verification.findUnique({
    select: { id: true },
    where: {
      target_type: { target: session.userId, type: twoFAVerificationType }
    }
  });
  const userHasTwoFactor = Boolean(verification);
  if (userHasTwoFactor) {
    const verifySession = await verifySessionStorage.getSession();
    verifySession.set(unverifiedSessionIdKey, session.id);
    verifySession.set(rememberKey, remember2);
    const redirectUrl = getRedirectToUrl({
      request,
      type: twoFAVerificationType,
      target: session.userId,
      redirectTo
    });
    return redirect$1(
      `${redirectUrl.pathname}?${redirectUrl.searchParams}`,
      combineResponseInits(
        {
          headers: {
            "set-cookie": await verifySessionStorage.commitSession(verifySession)
          }
        },
        responseInit
      )
    );
  } else {
    const authSession = await authSessionStorage.getSession(
      request.headers.get("cookie")
    );
    authSession.set(sessionKey, session.id);
    return redirect$1(
      safeRedirect(redirectTo),
      combineResponseInits(
        {
          headers: {
            "set-cookie": await authSessionStorage.commitSession(authSession, {
              expires: remember2 ? session.expirationDate : void 0
            })
          }
        },
        responseInit
      )
    );
  }
}
async function handleVerification({
  request,
  submission
}) {
  invariant(
    submission.status === "success",
    "Submission should be successful by now"
  );
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const remember2 = verifySession.get(rememberKey);
  const { redirectTo } = submission.value;
  const headers2 = new Headers();
  authSession.set(verifiedTimeKey, Date.now());
  const unverifiedSessionId = verifySession.get(unverifiedSessionIdKey);
  if (unverifiedSessionId) {
    const session = await prisma$1.session.findUnique({
      select: { expirationDate: true },
      where: { id: unverifiedSessionId }
    });
    if (!session) {
      throw await redirectWithToast("/login", {
        type: "error",
        title: "Invalid session",
        description: "Could not find session to verify. Please try again."
      });
    }
    authSession.set(sessionKey, unverifiedSessionId);
    headers2.append(
      "set-cookie",
      await authSessionStorage.commitSession(authSession, {
        expires: remember2 ? session.expirationDate : void 0
      })
    );
  } else {
    headers2.append(
      "set-cookie",
      await authSessionStorage.commitSession(authSession)
    );
  }
  headers2.append(
    "set-cookie",
    await verifySessionStorage.destroySession(verifySession)
  );
  return redirect$1(safeRedirect(redirectTo), { headers: headers2 });
}
async function shouldRequestTwoFA(request) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  if (verifySession.has(unverifiedSessionIdKey))
    return true;
  const userId = await getUserId(request);
  if (!userId)
    return false;
  const userHasTwoFA = await prisma$1.verification.findUnique({
    select: { id: true },
    where: { target_type: { target: userId, type: twoFAVerificationType } }
  });
  if (!userHasTwoFA)
    return false;
  const verifiedTime = authSession.get(verifiedTimeKey) ?? /* @__PURE__ */ new Date(0);
  const twoHours = 1e3 * 60 * 2;
  return Date.now() - verifiedTime > twoHours;
}
const providerIdKey = "providerId";
const prefilledProfileKey = "prefilledProfile";
const SignupFormSchema = z.object({
  imageUrl: z.string().optional(),
  username: UsernameSchema,
  name: NameSchema,
  agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
    required_error: "You must agree to the terms of service and privacy policy"
  }),
  remember: z.boolean().optional(),
  redirectTo: z.string().optional()
});
async function requireData({
  request,
  params
}) {
  await requireAnonymous(request);
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const email = verifySession.get(onboardingEmailSessionKey);
  const providerId = verifySession.get(providerIdKey);
  const result = z.object({
    email: z.string(),
    providerName: ProviderNameSchema,
    providerId: z.string()
  }).safeParse({ email, providerName: params.provider, providerId });
  if (result.success) {
    return result.data;
  } else {
    console.error(result.error);
    throw redirect$1("/signup");
  }
}
async function loader$s({ request, params }) {
  const { email } = await requireData({ request, params });
  const connectionSession = await connectionSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const prefilledProfile = verifySession.get(prefilledProfileKey);
  const formError = connectionSession.get(authenticator.sessionErrorKey);
  const hasError = typeof formError === "string";
  return json({
    email,
    status: "idle",
    submission: {
      status: hasError ? "error" : void 0,
      initialValue: prefilledProfile ?? {},
      error: { "": hasError ? [formError] : [] }
    }
  });
}
async function action$g({ request, params }) {
  const { email, providerId, providerName } = await requireData({
    request,
    params
  });
  const formData = await request.formData();
  const verifySession = await verifySessionStorage.getSession(
    request.headers.get("cookie")
  );
  const submission = await parseWithZod(formData, {
    schema: SignupFormSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma$1.user.findUnique({
        where: { username: data.username },
        select: { id: true }
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this username"
        });
        return;
      }
    }).transform(async (data) => {
      const session2 = await signupWithConnection({
        ...data,
        email,
        providerId,
        providerName
      });
      return { ...data, session: session2 };
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { session, remember: remember2, redirectTo } = submission.value;
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  authSession.set(sessionKey, session.id);
  const headers2 = new Headers();
  headers2.append(
    "set-cookie",
    await authSessionStorage.commitSession(authSession, {
      expires: remember2 ? session.expirationDate : void 0
    })
  );
  headers2.append(
    "set-cookie",
    await verifySessionStorage.destroySession(verifySession)
  );
  return redirectWithToast(
    safeRedirect(redirectTo),
    { title: "Welcome", description: "Thanks for signing up!" },
    { headers: headers2 }
  );
}
const meta$7 = () => {
  return [{ title: "Setup Epic Notes Account" }];
};
function OnboardingProviderRoute() {
  const data = useLoaderData();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "onboarding-provider-form",
    constraint: getZodConstraint(SignupFormSchema),
    lastResult: (actionData == null ? void 0 : actionData.result) ?? data.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsx("div", { className: "container flex min-h-full flex-col justify-center pb-32 pt-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-h1", children: [
        "Welcome aboard ",
        data.email,
        "!"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." })
    ] }),
    /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        className: "mx-auto min-w-full max-w-sm sm:min-w-[368px]",
        ...getFormProps(form),
        children: [
          fields.imageUrl.initialValue ? /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: fields.imageUrl.initialValue,
                alt: "Profile",
                className: "h-24 w-24 rounded-full"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-body-sm text-muted-foreground", children: "You can change your photo later" }),
            /* @__PURE__ */ jsx("input", { ...getInputProps(fields.imageUrl, { type: "hidden" }) })
          ] }) : null,
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: { htmlFor: fields.username.id, children: "Username" },
              inputProps: {
                ...getInputProps(fields.username, { type: "text" }),
                autoComplete: "username",
                className: "lowercase"
              },
              errors: fields.username.errors
            }
          ),
          /* @__PURE__ */ jsx(
            Field,
            {
              labelProps: { htmlFor: fields.name.id, children: "Name" },
              inputProps: {
                ...getInputProps(fields.name, { type: "text" }),
                autoComplete: "name"
              },
              errors: fields.name.errors
            }
          ),
          /* @__PURE__ */ jsx(
            CheckboxField,
            {
              labelProps: {
                htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
                children: "Do you agree to our Terms of Service and Privacy Policy?"
              },
              buttonProps: getInputProps(
                fields.agreeToTermsOfServiceAndPrivacyPolicy,
                { type: "checkbox" }
              ),
              errors: fields.agreeToTermsOfServiceAndPrivacyPolicy.errors
            }
          ),
          /* @__PURE__ */ jsx(
            CheckboxField,
            {
              labelProps: {
                htmlFor: fields.remember.id,
                children: "Remember me"
              },
              buttonProps: getInputProps(fields.remember, { type: "checkbox" }),
              errors: fields.remember.errors
            }
          ),
          redirectTo ? /* @__PURE__ */ jsx("input", { type: "hidden", name: "redirectTo", value: redirectTo }) : null,
          /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-6", children: /* @__PURE__ */ jsx(
            StatusButton,
            {
              className: "w-full",
              status: isPending ? "pending" : form.status ?? "idle",
              type: "submit",
              disabled: isPending,
              children: "Create an account"
            }
          ) })
        ]
      }
    )
  ] }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  default: OnboardingProviderRoute,
  loader: loader$s,
  meta: meta$7,
  prefilledProfileKey,
  providerIdKey
}, Symbol.toStringTag, { value: "Module" }));
const destroyRedirectTo = { "set-cookie": destroyRedirectToHeader };
async function loader$r({ request, params }) {
  await ensurePrimary();
  const providerName = ProviderNameSchema.parse(params.provider);
  const redirectTo = getRedirectCookieValue(request);
  const label = providerLabels[providerName];
  const authResult = await authenticator.authenticate(providerName, request, { throwOnError: true }).then(
    (data) => ({ success: true, data }),
    (error) => ({ success: false, error })
  );
  if (!authResult.success) {
    console.error(authResult.error);
    throw await redirectWithToast(
      "/login",
      {
        title: "Auth Failed",
        description: `There was an error authenticating with ${label}.`,
        type: "error"
      },
      { headers: destroyRedirectTo }
    );
  }
  const { data: profile } = authResult;
  const existingConnection = await prisma$1.connection.findUnique({
    select: { userId: true },
    where: {
      providerName_providerId: { providerName, providerId: profile.id }
    }
  });
  const userId = await getUserId(request);
  if (existingConnection && userId) {
    if (existingConnection.userId === userId) {
      return redirectWithToast(
        "/settings/profile/connections",
        {
          title: "Already Connected",
          description: `Your "${profile.username}" ${label} account is already connected.`
        },
        { headers: destroyRedirectTo }
      );
    } else {
      return redirectWithToast(
        "/settings/profile/connections",
        {
          title: "Already Connected",
          description: `The "${profile.username}" ${label} account is already connected to another account.`
        },
        { headers: destroyRedirectTo }
      );
    }
  }
  if (userId) {
    await prisma$1.connection.create({
      data: {
        providerName,
        providerId: profile.id,
        userId
      }
    });
    return redirectWithToast(
      "/settings/profile/connections",
      {
        title: "Connected",
        type: "success",
        description: `Your "${profile.username}" ${label} account has been connected.`
      },
      { headers: destroyRedirectTo }
    );
  }
  if (existingConnection) {
    return makeSession({ request, userId: existingConnection.userId });
  }
  const user = await prisma$1.user.findUnique({
    select: { id: true },
    where: { email: profile.email.toLowerCase() }
  });
  if (user) {
    await prisma$1.connection.create({
      data: {
        providerName,
        providerId: profile.id,
        userId: user.id
      }
    });
    return makeSession(
      { request, userId: user.id },
      {
        headers: await createToastHeaders({
          title: "Connected",
          description: `Your "${profile.username}" ${label} account has been connected.`
        })
      }
    );
  }
  const verifySession = await verifySessionStorage.getSession();
  verifySession.set(onboardingEmailSessionKey, profile.email);
  verifySession.set(prefilledProfileKey, {
    ...profile,
    email: normalizeEmail(profile.email),
    username: typeof profile.username === "string" ? normalizeUsername(profile.username) : void 0
  });
  verifySession.set(providerIdKey, profile.id);
  const onboardingRedirect = [
    `/onboarding/${providerName}`,
    redirectTo ? new URLSearchParams({ redirectTo }) : null
  ].filter(Boolean).join("?");
  return redirect$1(onboardingRedirect, {
    headers: combineHeaders(
      { "set-cookie": await verifySessionStorage.commitSession(verifySession) },
      destroyRedirectTo
    )
  });
}
async function makeSession({
  request,
  userId,
  redirectTo
}, responseInit) {
  redirectTo ?? (redirectTo = "/");
  const session = await prisma$1.session.create({
    select: { id: true, expirationDate: true, userId: true },
    data: {
      expirationDate: getSessionExpirationDate(),
      userId
    }
  });
  return handleNewSession(
    { request, session, redirectTo, remember: true },
    { headers: combineHeaders(responseInit == null ? void 0 : responseInit.headers, destroyRedirectTo) }
  );
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$r
}, Symbol.toStringTag, { value: "Module" }));
const ForgotPasswordSchema = z.object({
  usernameOrEmail: z.union([EmailSchema, UsernameSchema])
});
async function action$f({ request }) {
  const formData = await request.formData();
  checkHoneypot(formData);
  const submission = await parseWithZod(formData, {
    schema: ForgotPasswordSchema.superRefine(async (data, ctx) => {
      const user2 = await prisma$1.user.findFirst({
        where: {
          OR: [
            { email: data.usernameOrEmail },
            { username: data.usernameOrEmail }
          ]
        },
        select: { id: true }
      });
      if (!user2) {
        ctx.addIssue({
          path: ["usernameOrEmail"],
          code: z.ZodIssueCode.custom,
          message: "No user exists with this username or email"
        });
        return;
      }
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { usernameOrEmail } = submission.value;
  const user = await prisma$1.user.findFirstOrThrow({
    where: { OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }] },
    select: { email: true, username: true }
  });
  const { verifyUrl, redirectTo, otp } = await prepareVerification({
    period: 10 * 60,
    request,
    type: "reset-password",
    target: usernameOrEmail
  });
  const response = await sendEmail({
    to: user.email,
    subject: `Epic Notes Password Reset`,
    react: /* @__PURE__ */ jsx(ForgotPasswordEmail, { onboardingUrl: verifyUrl.toString(), otp })
  });
  if (response.status === "success") {
    return redirect$1(redirectTo.toString());
  } else {
    return json(
      { result: submission.reply({ formErrors: [response.error.message] }) },
      { status: 500 }
    );
  }
}
function ForgotPasswordEmail({
  onboardingUrl,
  otp
}) {
  return /* @__PURE__ */ jsx(E.Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ jsxs(E.Container, { children: [
    /* @__PURE__ */ jsx("h1", { children: /* @__PURE__ */ jsx(E.Text, { children: "Epic Notes Password Reset" }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs(E.Text, { children: [
      "Here's your verification code: ",
      /* @__PURE__ */ jsx("strong", { children: otp })
    ] }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(E.Text, { children: "Or click the link:" }) }),
    /* @__PURE__ */ jsx(E.Link, { href: onboardingUrl, children: onboardingUrl })
  ] }) });
}
const meta$6 = () => {
  return [{ title: "Password Recovery for Epic Notes" }];
};
function ForgotPasswordRoute() {
  var _a2;
  const forgotPassword = useFetcher();
  const [form, fields] = useForm({
    id: "forgot-password-form",
    constraint: getZodConstraint(ForgotPasswordSchema),
    lastResult: (_a2 = forgotPassword.data) == null ? void 0 : _a2.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordSchema });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsx("div", { className: "container pb-32 pt-20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Forgot Password" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-body-md text-muted-foreground", children: "No worries, we'll send you reset instructions." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]", children: [
      /* @__PURE__ */ jsxs(forgotPassword.Form, { method: "POST", ...getFormProps(form), children: [
        /* @__PURE__ */ jsx(HoneypotInputs, {}),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Field,
          {
            labelProps: {
              htmlFor: fields.usernameOrEmail.id,
              children: "Username or Email"
            },
            inputProps: {
              autoFocus: true,
              ...getInputProps(fields.usernameOrEmail, { type: "text" })
            },
            errors: fields.usernameOrEmail.errors
          }
        ) }),
        /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            status: forgotPassword.state === "submitting" ? "pending" : form.status ?? "idle",
            type: "submit",
            disabled: forgotPassword.state !== "idle",
            children: "Recover password"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/login",
          className: "mt-11 text-center text-body-sm font-bold",
          children: "Back to Login"
        }
      )
    ] })
  ] }) });
}
function ErrorBoundary$8() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$8,
  action: action$f,
  default: ForgotPasswordRoute,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const LoginFormSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
  redirectTo: z.string().optional(),
  remember: z.boolean().optional()
});
async function loader$q({ request }) {
  await requireAnonymous(request);
  return json({});
}
async function action$e({ request }) {
  await requireAnonymous(request);
  const formData = await request.formData();
  checkHoneypot(formData);
  const submission = await parseWithZod(formData, {
    schema: (intent) => LoginFormSchema.transform(async (data, ctx) => {
      if (intent !== null)
        return { ...data, session: null };
      const session2 = await login(data);
      if (!session2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid username or password"
        });
        return z.NEVER;
      }
      return { ...data, session: session2 };
    }),
    async: true
  });
  if (submission.status !== "success" || !submission.value.session) {
    return json(
      { result: submission.reply({ hideFields: ["password"] }) },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { session, remember: remember2, redirectTo } = submission.value;
  return handleNewSession({
    request,
    session,
    remember: remember2 ?? false,
    redirectTo
  });
}
function LoginPage() {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "login-form",
    constraint: getZodConstraint(LoginFormSchema),
    defaultValue: { redirectTo },
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-full flex-col justify-center pb-32 pt-20", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Welcome back!" }),
      /* @__PURE__ */ jsx("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." })
    ] }),
    /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-md px-8", children: [
      /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), children: [
        /* @__PURE__ */ jsx(HoneypotInputs, {}),
        /* @__PURE__ */ jsx(
          Field,
          {
            labelProps: { children: "Username" },
            inputProps: {
              ...getInputProps(fields.username, { type: "text" }),
              autoFocus: true,
              className: "lowercase",
              autoComplete: "username"
            },
            errors: fields.username.errors
          }
        ),
        /* @__PURE__ */ jsx(
          Field,
          {
            labelProps: { children: "Password" },
            inputProps: {
              ...getInputProps(fields.password, {
                type: "password"
              }),
              autoComplete: "current-password"
            },
            errors: fields.password.errors
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx(
            CheckboxField,
            {
              labelProps: {
                htmlFor: fields.remember.id,
                children: "Remember me"
              },
              buttonProps: getInputProps(fields.remember, {
                type: "checkbox"
              }),
              errors: fields.remember.errors
            }
          ),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: "/forgot-password",
              className: "text-body-xs font-semibold",
              children: "Forgot password?"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...getInputProps(fields.redirectTo, { type: "hidden" })
          }
        ),
        /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-6 pt-3", children: /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            status: isPending ? "pending" : form.status ?? "idle",
            type: "submit",
            disabled: isPending,
            children: "Log in"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3", children: providerNames.map((providerName) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        ProviderConnectionForm,
        {
          type: "Login",
          providerName,
          redirectTo
        }
      ) }, providerName)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 pt-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "New here?" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: redirectTo ? `/signup?${encodeURIComponent(redirectTo)}` : "/signup",
            children: "Create an account"
          }
        )
      ] })
    ] }) })
  ] }) });
}
const meta$5 = () => {
  return [{ title: "Login to Epic Notes" }];
};
function ErrorBoundary$7() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$7,
  action: action$e,
  default: LoginPage,
  loader: loader$q,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
async function loader$p() {
  return redirect$1("/");
}
async function action$d({ request }) {
  return logout({ request });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d,
  loader: loader$p
}, Symbol.toStringTag, { value: "Module" }));
const SignupSchema = z.object({
  email: EmailSchema
});
async function action$c({ request }) {
  const formData = await request.formData();
  checkHoneypot(formData);
  const submission = await parseWithZod(formData, {
    schema: SignupSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma$1.user.findUnique({
        where: { email: data.email },
        select: { id: true }
      });
      if (existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this email"
        });
        return;
      }
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { email } = submission.value;
  const { verifyUrl, redirectTo, otp } = await prepareVerification({
    period: 10 * 60,
    request,
    type: "onboarding",
    target: email
  });
  const response = await sendEmail({
    to: email,
    subject: `Welcome to Epic Notes!`,
    react: /* @__PURE__ */ jsx(SignupEmail, { onboardingUrl: verifyUrl.toString(), otp })
  });
  if (response.status === "success") {
    return redirect$1(redirectTo.toString());
  } else {
    return json(
      {
        result: submission.reply({ formErrors: [response.error.message] })
      },
      {
        status: 500
      }
    );
  }
}
function SignupEmail({
  onboardingUrl,
  otp
}) {
  return /* @__PURE__ */ jsx(E.Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ jsxs(E.Container, { children: [
    /* @__PURE__ */ jsx("h1", { children: /* @__PURE__ */ jsx(E.Text, { children: "Welcome to Epic Notes!" }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs(E.Text, { children: [
      "Here's your verification code: ",
      /* @__PURE__ */ jsx("strong", { children: otp })
    ] }) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(E.Text, { children: "Or click the link to get started:" }) }),
    /* @__PURE__ */ jsx(E.Link, { href: onboardingUrl, children: onboardingUrl })
  ] }) });
}
const meta$4 = () => {
  return [{ title: "Sign Up | Epic Notes" }];
};
function SignupRoute() {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getZodConstraint(SignupSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: SignupSchema });
      return result;
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsxs("div", { className: "container flex flex-col justify-center pb-32 pt-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Let's start your journey!" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-body-md text-muted-foreground", children: "Please enter your email." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]", children: [
      /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), children: [
        /* @__PURE__ */ jsx(HoneypotInputs, {}),
        /* @__PURE__ */ jsx(
          Field,
          {
            labelProps: {
              htmlFor: fields.email.id,
              children: "Email"
            },
            inputProps: {
              ...getInputProps(fields.email, { type: "email" }),
              autoFocus: true,
              autoComplete: "email"
            },
            errors: fields.email.errors
          }
        ),
        /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
        /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            status: isPending ? "pending" : form.status ?? "idle",
            type: "submit",
            disabled: isPending,
            children: "Submit"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3", children: providerNames.map((providerName) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        ProviderConnectionForm,
        {
          type: "Signup",
          providerName,
          redirectTo
        }
      ) }, providerName)) })
    ] })
  ] });
}
function ErrorBoundary$6() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$6,
  SignupEmail,
  action: action$c,
  default: SignupRoute,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function AboutRoute() {
  return /* @__PURE__ */ jsx("div", { children: "About page" });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AboutRoute
}, Symbol.toStringTag, { value: "Module" }));
const docker = "/assets/docker-CKYupBMy.svg";
const eslint = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2015.1.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20version='1.1'%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20294.825%20258.982'%20xml:space='preserve'%3e%3cg%3e%3cpath%20fill='%238080F2'%20d='M97.021,99.016l48.432-27.962c1.212-0.7,2.706-0.7,3.918,0l48.433,27.962%20c1.211,0.7,1.959,1.993,1.959,3.393v55.924c0,1.399-0.748,2.693-1.959,3.394l-48.433,27.962c-1.212,0.7-2.706,0.7-3.918,0%20l-48.432-27.962c-1.212-0.7-1.959-1.994-1.959-3.394v-55.924C95.063,101.009,95.81,99.716,97.021,99.016'/%3e%3cpath%20fill='%234B32C3'%20d='M273.336,124.488L215.469,23.816c-2.102-3.64-5.985-6.325-10.188-6.325H89.545%20c-4.204,0-8.088,2.685-10.19,6.325l-57.867,100.45c-2.102,3.641-2.102,8.236,0,11.877l57.867,99.847%20c2.102,3.64,5.986,5.501,10.19,5.501h115.735c4.203,0,8.087-1.805,10.188-5.446l57.867-100.01%20C275.439,132.396,275.439,128.128,273.336,124.488%20M225.419,172.898c0,1.48-0.891,2.849-2.174,3.59l-73.71,42.527%20c-1.282,0.74-2.888,0.74-4.17,0l-73.767-42.527c-1.282-0.741-2.179-2.109-2.179-3.59V87.843c0-1.481,0.884-2.849,2.167-3.59%20l73.707-42.527c1.282-0.741,2.886-0.741,4.168,0l73.772,42.527c1.283,0.741,2.186,2.109,2.186,3.59V172.898z'/%3e%3c/g%3e%3c/svg%3e";
const fakerJS = "/assets/faker-D6l4cpmx.svg";
const fly = "/assets/fly-COcofn25.svg";
const github = "data:image/svg+xml,%3csvg%20width='98'%20height='96'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M48.854%200C21.839%200%200%2022%200%2049.217c0%2021.756%2013.993%2040.172%2033.405%2046.69%202.427.49%203.316-1.059%203.316-2.362%200-1.141-.08-5.052-.08-9.127-13.59%202.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015%204.934.326%207.523%205.052%207.523%205.052%204.367%207.496%2011.404%205.378%2014.235%204.074.404-3.178%201.699-5.378%203.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283%200-5.378%201.94-9.778%205.014-13.2-.485-1.222-2.184-6.275.486-13.038%200%200%204.125-1.304%2013.426%205.052a46.97%2046.97%200%200%201%2012.214-1.63c4.125%200%208.33.571%2012.213%201.63%209.302-6.356%2013.427-5.052%2013.427-5.052%202.67%206.763.97%2011.816.485%2013.038%203.155%203.422%205.015%207.822%205.015%2013.2%200%2018.905-11.404%2023.06-22.324%2024.283%201.78%201.548%203.316%204.481%203.316%209.126%200%206.6-.08%2011.897-.08%2013.526%200%201.304.89%202.853%203.316%202.364%2019.412-6.52%2033.405-24.935%2033.405-46.691C97.707%2022%2075.788%200%2048.854%200z'%20fill='%2324292f'/%3e%3c/svg%3e";
const msw = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='128px'%20height='128px'%20viewBox='0%200%20128%20128'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle%3eLOGO%3c/title%3e%3cg%20id='LOGO'%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%3e%3crect%20id='Rectangle'%20fill='%23000000'%20x='0'%20y='0'%20width='128'%20height='128'%20rx='24'%3e%3c/rect%3e%3cg%20id='logo'%20transform='translate(-27.172013,%20-27.850148)'%20stroke-width='17.85'%3e%3cg%20id='Group'%20transform='translate(91.172013,%2091.850148)%20rotate(-42.000000)%20translate(-91.172013,%20-91.850148)%20translate(30.956217,%2022.472129)'%3e%3cpath%20d='M63.77676,39.8567809%20C66.7201615,39.8567809%2069.3849115,41.0498301%2071.3138112,42.9787297%20C73.2427108,44.9076293%2074.43576,47.5723793%2074.43576,50.5157809%20C74.43576,53.1536096%2073.4576536,55.6977418%2071.690581,57.6562093%20L40.9074742,91.7734893%20C40.2942428,92.4531409%2039.4635827,92.8198888%2038.6163176,92.863416%20C37.7690524,92.9069431%2036.9051822,92.6272495%2036.2255306,92.0140181%20L5.20189513,57.6562093%20C3.23012026,55.470868%202.33079774,52.693193%202.47075426,49.9689097%20C2.61071079,47.2446264%203.78994636,44.5737347%205.97528769,42.6019599%20C7.93375514,40.8348872%2010.4778874,39.8567809%2013.1157161,39.8567809%20Z'%20id='back'%20stroke='%23FF3333'%20opacity='0.48'%20transform='translate(38.446238,%2069.378019)%20rotate(90.000000)%20translate(-38.446238,%20-69.378019)%20'%3e%3c/path%3e%3cpath%20d='M123.833688,39.8567809%20C124.7491,39.8567809%20125.57785,40.2278249%20126.177747,40.8277219%20C126.777644,41.4276189%20127.148688,42.2563689%20127.148688,43.1717809%20C127.148688,43.9921582%20126.844492,44.7833955%20126.294924,45.3924883%20L84.4465906,91.7734893%20C83.8333592,92.4531409%2083.0026991,92.8198888%2082.1554339,92.863416%20C81.3081688,92.9069431%2080.4442986,92.6272495%2079.764647,92.0140181%20L37.6757849,45.3924883%20C37.0625535,44.7128367%2036.7828599,43.8489665%2036.826387,43.0017013%20C36.8699142,42.1544362%2037.2366621,41.3237761%2037.9163137,40.7105447%20C38.5254064,40.1609766%2039.3166437,39.8567809%2040.1370211,39.8567809%20Z'%20id='front'%20stroke='%23FF6A33'%20transform='translate(81.985354,%2069.378019)%20rotate(-90.000000)%20translate(-81.985354,%20-69.378019)%20'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
const playwright = "/assets/playwright-D0Du3LFd.svg";
const prettier = "/assets/prettier-DbIVlkV4.svg";
const prisma = "/assets/prisma-IaIz7Mrr.svg";
const radixUI = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%20viewBox='0%200%2025%2025'%20fill='none'%20style='margin-right:3px'%3e%3cpath%20d='M12%2025C7.58173%2025%204%2021.4183%204%2017C4%2012.5817%207.58173%209%2012%209V25Z'%20fill='currentcolor'%3e%3c/path%3e%3cpath%20d='M12%200H4V8H12V0Z'%20fill='currentcolor'%3e%3c/path%3e%3cpath%20d='M17%208C19.2091%208%2021%206.20914%2021%204C21%201.79086%2019.2091%200%2017%200C14.7909%200%2013%201.79086%2013%204C13%206.20914%2014.7909%208%2017%208Z'%20fill='currentcolor'%3e%3c/path%3e%3c/svg%3e";
const reactEmail = "/assets/react-email-DKP-k4Ck.svg";
const remix = "data:image/svg+xml,%3csvg%20width='800'%20height='800'%20viewBox='0%200%20800%20800'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='800'%20height='800'%20fill='%23212121'/%3e%3cg%20filter='url(%23filter0_dd_126_53)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M587.947%20527.768C592.201%20582.418%20592.201%20608.036%20592.201%20636H465.756C465.756%20629.909%20465.865%20624.337%20465.975%20618.687C466.317%20601.123%20466.674%20582.807%20463.828%20545.819C460.067%20491.667%20436.748%20479.634%20393.871%20479.634H355.883H195V381.109H399.889C454.049%20381.109%20481.13%20364.633%20481.13%20321.011C481.13%20282.654%20454.049%20259.41%20399.889%20259.41H195V163H422.456C545.069%20163%20606%20220.912%20606%20313.42C606%20382.613%20563.123%20427.739%20505.201%20435.26C554.096%20445.037%20582.681%20472.865%20587.947%20527.768Z'%20fill='%23E8F2FF'/%3e%3cpath%20d='M195%20636V562.553H328.697C351.029%20562.553%20355.878%20579.116%20355.878%20588.994V636H195Z'%20fill='%23E8F2FF'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_dd_126_53'%20x='131'%20y='99'%20width='539'%20height='601'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset/%3e%3cfeGaussianBlur%20stdDeviation='28'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.223529%200%200%200%200%200.572549%200%200%200%200%201%200%200%200%201%200'/%3e%3cfeBlend%20mode='normal'%20in2='BackgroundImageFix'%20result='effect1_dropShadow_126_53'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset/%3e%3cfeGaussianBlur%20stdDeviation='32'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='out'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200.223529%200%200%200%200%200.572549%200%200%200%200%201%200%200%200%200.9%200'/%3e%3cfeBlend%20mode='normal'%20in2='effect1_dropShadow_126_53'%20result='effect2_dropShadow_126_53'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='effect2_dropShadow_126_53'%20result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e";
const resend = "/assets/resend-qZaqO_xw.svg";
const sentry = "data:image/svg+xml,%3csvg%20class='css-lfbo6j%20e10nushx4'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20222%2066'%20width='400'%20height='119'%3e%3cpath%20d='M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z%20M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z'%20transform='translate(11,%2011)'%20fill='%23362d59'%3e%3c/path%3e%3c/svg%3e";
const shadcnUI = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20256%20256'%3e%3crect%20width='256'%20height='256'%20fill='none'%3e%3c/rect%3e%3cline%20x1='208'%20y1='128'%20x2='128'%20y2='208'%20fill='none'%20stroke='currentColor'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='16'%3e%3c/line%3e%3cline%20x1='192'%20y1='40'%20x2='40'%20y2='192'%20fill='none'%20stroke='currentColor'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='16'%3e%3c/line%3e%3c/svg%3e";
const sqlite = "/assets/sqlite-C780ctma.svg";
const tailwind = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%2054%2033'%3e%3cg%20clip-path='url(%23prefix__clip0)'%3e%3cpath%20fill='%2338bdf8'%20fill-rule='evenodd'%20d='M27%200c-7.2%200-11.7%203.6-13.5%2010.8%202.7-3.6%205.85-4.95%209.45-4.05%202.054.513%203.522%202.004%205.147%203.653C30.744%2013.09%2033.808%2016.2%2040.5%2016.2c7.2%200%2011.7-3.6%2013.5-10.8-2.7%203.6-5.85%204.95-9.45%204.05-2.054-.513-3.522-2.004-5.147-3.653C36.756%203.11%2033.692%200%2027%200zM13.5%2016.2C6.3%2016.2%201.8%2019.8%200%2027c2.7-3.6%205.85-4.95%209.45-4.05%202.054.514%203.522%202.004%205.147%203.653C17.244%2029.29%2020.308%2032.4%2027%2032.4c7.2%200%2011.7-3.6%2013.5-10.8-2.7%203.6-5.85%204.95-9.45%204.05-2.054-.513-3.522-2.004-5.147-3.653C23.256%2019.31%2020.192%2016.2%2013.5%2016.2z'%20clip-rule='evenodd'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='prefix__clip0'%3e%3cpath%20fill='%23fff'%20d='M0%200h54v32.4H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const testingLibrary = "/assets/testing-library-DlPZpWfP.png";
const typescript = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20width='512'%20height='512'%20fill='none'%20version='1.1'%20viewBox='0%200%20512%20512'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:cc='http://creativecommons.org/ns%23'%20xmlns:dc='http://purl.org/dc/elements/1.1/'%20xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23'%3e%3ctitle%3eTypeScript%20logo%3c/title%3e%3crect%20width='512'%20height='512'%20rx='50'%20fill='%233178c6'/%3e%3cpath%20d='m317%20407v50c8.1%204.2%2018%207.3%2029%209.4s23%203.1%2035%203.1c12%200%2023-1.1%2034-3.4%2011-2.3%2020-6.1%2028-11%208.1-5.3%2015-12%2019-21s7.1-19%207.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9-5.2-2.6-9.7-5.2-13-7.8-3.7-2.7-6.5-5.5-8.5-8.4-2-3-3-6.3-3-10%200-3.4%200.89-6.5%202.7-9.3s4.3-5.1%207.5-7.1c3.2-2%207.2-3.5%2012-4.6%204.7-1.1%209.9-1.6%2016-1.6%204.2%200%208.6%200.31%2013%200.94%204.6%200.63%209.3%201.6%2014%202.9%204.7%201.3%209.3%202.9%2014%204.9%204.4%202%208.5%204.3%2012%206.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12%200-23%201.3-34%203.8s-20%206.5-28%2012c-8.1%205.4-14%2012-19%2021-4.7%208.4-7%2018-7%2030%200%2015%204.3%2028%2013%2038%208.6%2011%2022%2019%2039%2027%206.9%202.8%2013%205.6%2019%208.3s11%205.5%2015%208.4c4.3%202.9%207.7%206.1%2010%209.5%202.5%203.4%203.8%207.4%203.8%2012%200%203.2-0.78%206.2-2.3%209s-3.9%205.2-7.1%207.2-7.1%203.6-12%204.8c-4.7%201.1-10%201.7-17%201.7-11%200-22-1.9-32-5.7-11-3.8-21-9.5-30-17zm-84-123h64v-41h-179v41h64v183h51z'%20clip-rule='evenodd'%20fill='%23fff'%20fill-rule='evenodd'%20style='fill:%23fff'/%3e%3c/svg%3e";
const vitest = "data:image/svg+xml,%3csvg%20width='165'%20height='165'%20viewBox='0%200%20165%20165'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M120.831%2057.2543L84.693%20109.505C84.3099%20110.059%2083.7558%20110.474%2083.1148%20110.687C82.4738%20110.9%2081.7809%20110.898%2081.1412%20110.684C80.5015%20110.469%2079.95%20110.052%2079.5702%20109.497C79.1905%20108.941%2079.0032%20108.277%2079.037%20107.606L80.4833%2078.7582L57.1343%2073.8064C56.6353%2073.7007%2056.1704%2073.474%2055.7807%2073.1465C55.391%2072.8191%2055.0885%2072.4009%2054.9001%2071.929C54.7117%2071.4571%2054.6432%2070.9461%2054.7006%2070.4412C54.758%2069.9364%2054.9395%2069.4532%2055.2291%2069.0345L91.3675%2016.7837C91.7507%2016.2294%2092.3048%2015.8145%2092.9458%2015.6018C93.5869%2015.3891%2094.2798%2015.3902%2094.9196%2015.6051C95.5593%2015.8199%2096.1109%2016.2367%2096.4906%2016.7923C96.8703%2017.3478%2097.0575%2018.0117%2097.0236%2018.6833L95.5773%2047.5314L118.926%2052.4828C119.425%2052.5885%20119.89%2052.8152%20120.28%2053.1426C120.67%2053.4701%20120.972%2053.8883%20121.16%2054.3602C121.349%2054.8321%20121.417%2055.3431%20121.36%2055.8479C121.303%2056.3528%20121.121%2056.836%20120.831%2057.2547L120.831%2057.2543Z'%20fill='%23FCC72B'/%3e%3cpath%20d='M82.9866%20153.343C82.0254%20153.344%2081.0735%20153.156%2080.1855%20152.788C79.2975%20152.42%2078.4909%20151.88%2077.8122%20151.2L43.6658%20117.056C42.2998%20115.683%2041.5341%20113.824%2041.5366%20111.887C41.5392%20109.95%2042.3098%20108.092%2043.6796%20106.723C45.0493%20105.353%2046.9064%20104.582%2048.8435%20104.579C50.7807%20104.577%2052.6399%20105.342%2054.0134%20106.708L82.9866%20135.678L146.105%2072.5626C147.481%2071.2088%20149.336%2070.4536%20151.266%2070.4615C153.197%2070.4693%20155.046%2071.2396%20156.41%2072.6045C157.775%2073.9695%20158.546%2075.8184%20158.554%2077.7487C158.561%2079.679%20157.806%2081.5342%20156.452%2082.9101L88.1597%20151.2C87.4811%20151.881%2086.6747%20152.42%2085.7869%20152.788C84.8992%20153.156%2083.9475%20153.344%2082.9866%20153.343Z'%20fill='%23729B1B'/%3e%3cpath%20d='M82.9572%20153.343C83.9184%20153.344%2084.8703%20153.156%2085.7583%20152.788C86.6463%20152.42%2087.4528%20151.88%2088.1316%20151.2L122.278%20117.056C123.644%20115.683%20124.41%20113.824%20124.407%20111.887C124.405%20109.95%20123.634%20108.092%20122.264%20106.723C120.894%20105.353%20119.037%20104.582%20117.1%20104.579C115.163%20104.577%20113.304%20105.342%20111.93%20106.708L82.9572%20135.678L19.8389%2072.5626C18.4629%2071.2088%2016.6077%2070.4536%2014.6775%2070.4615C12.7472%2070.4693%2010.8982%2071.2396%209.53331%2072.6045C8.16839%2073.9695%207.39811%2075.8184%207.39025%2077.7487C7.38239%2079.679%208.13759%2081.5342%209.49135%2082.9101L77.784%20151.2C78.4627%20151.881%2079.2691%20152.42%2080.1568%20152.788C81.0446%20153.156%2081.9963%20153.344%2082.9572%20153.343Z'%20fill='%23729B1B'%20fill-opacity='0.5'/%3e%3c/svg%3e";
const zod = "/assets/zod-TYtFcqGX.svg";
const logos = [
  {
    src: remix,
    alt: "Remix",
    href: "https://remix.run",
    column: 1,
    row: 1
  },
  {
    src: fly,
    alt: "Fly.io",
    href: "https://fly.io",
    column: 1,
    row: 2
  },
  {
    src: sqlite,
    alt: "SQLite",
    href: "https://sqlite.org",
    column: 1,
    row: 3
  },
  {
    src: prisma,
    alt: "Prisma",
    href: "https://prisma.io",
    column: 2,
    row: 2
  },
  {
    src: zod,
    alt: "Zod",
    href: "https://zod.dev/",
    column: 2,
    row: 3
  },
  {
    src: github,
    alt: "GitHub",
    href: "https://github.com",
    column: 2,
    row: 4
  },
  {
    src: resend,
    alt: "Resend",
    href: "https://resend.com",
    column: 2,
    row: 5
  },
  {
    src: reactEmail,
    alt: "React Email",
    href: "https://react.email",
    column: 2,
    row: 6
  },
  {
    src: tailwind,
    alt: "Tailwind CSS",
    href: "https://tailwindcss.com",
    column: 3,
    row: 3
  },
  {
    src: radixUI,
    alt: "Radix UI",
    href: "https://www.radix-ui.com/",
    column: 3,
    row: 4
  },
  {
    src: shadcnUI,
    alt: "shadcn/ui",
    href: "https://ui.shadcn.com/",
    column: 3,
    row: 5
  },
  {
    src: playwright,
    alt: "Playwright",
    href: "https://playwright.dev/",
    column: 4,
    row: 1
  },
  {
    src: msw,
    alt: "MSW",
    href: "https://mswjs.io",
    column: 4,
    row: 2
  },
  {
    src: fakerJS,
    alt: "Faker.js",
    href: "https://fakerjs.dev/",
    column: 4,
    row: 3
  },
  {
    src: vitest,
    alt: "Vitest",
    href: "https://vitest.dev",
    column: 4,
    row: 4
  },
  {
    src: testingLibrary,
    alt: "Testing Library",
    href: "https://testing-library.com",
    column: 4,
    row: 5
  },
  {
    src: docker,
    alt: "Docker",
    href: "https://www.docker.com",
    column: 4,
    row: 6
  },
  {
    src: typescript,
    alt: "TypeScript",
    href: "https://typescriptlang.org",
    column: 5,
    row: 2
  },
  {
    src: prettier,
    alt: "Prettier",
    href: "https://prettier.io",
    column: 5,
    row: 3
  },
  {
    src: eslint,
    alt: "ESLint",
    href: "https://eslint.org",
    column: 5,
    row: 4
  },
  {
    src: sentry,
    alt: "Sentry",
    href: "https://sentry.io",
    column: 5,
    row: 5
  }
];
const meta$3 = () => [{ title: "Epic Notes" }];
const columnClasses = {
  1: "xl:col-start-1",
  2: "xl:col-start-2",
  3: "xl:col-start-3",
  4: "xl:col-start-4",
  5: "xl:col-start-5"
};
const rowClasses = {
  1: "xl:row-start-1",
  2: "xl:row-start-2",
  3: "xl:row-start-3",
  4: "xl:row-start-4",
  5: "xl:row-start-5",
  6: "xl:row-start-6"
};
function Index() {
  return /* @__PURE__ */ jsx("main", { className: "font-poppins grid h-full place-items-center", children: /* @__PURE__ */ jsxs("div", { className: "grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.epicweb.dev/stack",
          className: "animate-slide-top [animation-fill-mode:backwards] xl:animate-slide-left xl:[animation-delay:0.5s] xl:[animation-fill-mode:backwards]",
          children: /* @__PURE__ */ jsx(
            "svg",
            {
              className: "size-20 text-foreground xl:-mt-4",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 65 65",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  d: "M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "h1",
        {
          "data-heading": true,
          className: "mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]",
          children: /* @__PURE__ */ jsx("a", { href: "https://www.epicweb.dev/stack", children: "The Epic Stack" })
        }
      ),
      /* @__PURE__ */ jsxs(
        "p",
        {
          "data-paragraph": true,
          className: "mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]",
          children: [
            "Check the",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                className: "underline hover:no-underline",
                href: "https://github.com/epicweb-dev/epic-stack/blob/main/docs/getting-started.md",
                children: "Getting Started guide"
              }
            ),
            " ",
            "file for how to get your project off the ground!"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "mt-16 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-5 xl:grid-rows-6", children: /* @__PURE__ */ jsx(TooltipProvider, { children: logos.map((logo, i) => /* @__PURE__ */ jsx(
      "li",
      {
        className: cn(
          columnClasses[logo.column],
          rowClasses[logo.row],
          "animate-roll-reveal [animation-fill-mode:backwards]"
        ),
        style: { animationDelay: `${i * 0.07}s` },
        children: /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            "a",
            {
              href: logo.href,
              className: "grid size-20 place-items-center rounded-2xl bg-violet-600/10 p-4 transition hover:-rotate-6 hover:bg-violet-600/15 dark:bg-violet-200 dark:hover:bg-violet-100 sm:size-24",
              children: /* @__PURE__ */ jsx("img", { src: logo.src, alt: "" })
            }
          ) }),
          /* @__PURE__ */ jsx(TooltipContent, { children: logo.alt })
        ] })
      },
      logo.href
    )) }) })
  ] }) });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function PrivacyRoute() {
  return /* @__PURE__ */ jsx("div", { children: "Privacy" });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyRoute
}, Symbol.toStringTag, { value: "Module" }));
function SupportRoute() {
  return /* @__PURE__ */ jsx("div", { children: "Support" });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SupportRoute
}, Symbol.toStringTag, { value: "Module" }));
const marketingPreset = {
  theme: {
    extend: {
      keyframes: {
        "roll-reveal": {
          from: { transform: "rotate(12deg) scale(0)", opacity: "0" },
          to: { transform: "rotate(0deg) scale(1)", opacity: "1" }
        },
        "slide-left": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0px)", opacity: "1" }
        },
        "slide-top": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0px)", opacity: "1" }
        }
      },
      animation: {
        "roll-reveal": "roll-reveal 0.4s cubic-bezier(.22,1.28,.54,.99)",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-top": "slide-top 0.3s ease-out"
      }
    }
  }
};
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  marketingPreset
}, Symbol.toStringTag, { value: "Module" }));
function TermsOfServiceRoute() {
  return /* @__PURE__ */ jsx("div", { children: "Terms of service" });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsOfServiceRoute
}, Symbol.toStringTag, { value: "Module" }));
function loader$o({ request }) {
  return generateRobotsTxt([
    { type: "sitemap", value: `${getDomainUrl(request)}/sitemap.xml` }
  ]);
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
async function loader$n({ request, context }) {
  const serverBuild = await context.serverBuild;
  return generateSitemap(request, serverBuild.routes, {
    siteUrl: getDomainUrl(request),
    headers: {
      "Cache-Control": `public, max-age=${60 * 5}`
    }
  });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$n
}, Symbol.toStringTag, { value: "Module" }));
async function requireUserWithPermission(request, permission) {
  const userId = await requireUserId(request);
  const permissionData = parsePermissionString(permission);
  const user = await prisma$1.user.findFirst({
    select: { id: true },
    where: {
      id: userId,
      roles: {
        some: {
          permissions: {
            some: {
              ...permissionData,
              access: permissionData.access ? { in: permissionData.access } : void 0
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw json(
      {
        error: "Unauthorized",
        requiredPermission: permissionData,
        message: `Unauthorized: required permissions: ${permission}`
      },
      { status: 403 }
    );
  }
  return user.id;
}
async function requireUserWithRole(request, name) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findFirst({
    select: { id: true },
    where: { id: userId, roles: { some: { name } } }
  });
  if (!user) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`
      },
      { status: 403 }
    );
  }
  return user.id;
}
const handle$9 = {
  getSitemapEntries: () => null
};
async function loader$m({ request }) {
  await requireUserWithRole(request, "admin");
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query");
  if (query === "") {
    searchParams.delete("query");
    return redirect$1(`/admin/cache?${searchParams.toString()}`);
  }
  const limit = Number(searchParams.get("limit") ?? 100);
  const currentInstanceInfo = await getInstanceInfo();
  const instance = searchParams.get("instance") ?? currentInstanceInfo.currentInstance;
  const instances = await getAllInstances();
  await ensureInstance(instance);
  let cacheKeys;
  if (typeof query === "string") {
    cacheKeys = await searchCacheKeys(query, limit);
  } else {
    cacheKeys = await getAllCacheKeys(limit);
  }
  return json({ cacheKeys, instance, instances, currentInstanceInfo });
}
async function action$b({ request }) {
  await requireUserWithRole(request, "admin");
  const formData = await request.formData();
  const key2 = formData.get("cacheKey");
  const { currentInstance } = await getInstanceInfo();
  const instance = formData.get("instance") ?? currentInstance;
  const type = formData.get("type");
  invariantResponse(typeof key2 === "string", "cacheKey must be a string");
  invariantResponse(typeof type === "string", "type must be a string");
  invariantResponse(typeof instance === "string", "instance must be a string");
  await ensureInstance(instance);
  switch (type) {
    case "sqlite": {
      await cache.delete(key2);
      break;
    }
    case "lru": {
      lruCache.delete(key2);
      break;
    }
    default: {
      throw new Error(`Unknown cache type: ${type}`);
    }
  }
  return json({ success: true });
}
function CacheAdminRoute() {
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const query = searchParams.get("query") ?? "";
  const limit = searchParams.get("limit") ?? "100";
  const instance = searchParams.get("instance") ?? data.instance;
  const handleFormChange = useDebounce((form) => {
    submit(form);
  }, 400);
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Cache Admin" }),
    /* @__PURE__ */ jsx(Spacer, { size: "2xs" }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "get",
        className: "flex flex-col gap-4",
        onChange: (e) => handleFormChange(e.currentTarget),
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-1 gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "flex h-16 items-center justify-center",
                children: "🔎"
              }
            ),
            /* @__PURE__ */ jsx(
              Field,
              {
                className: "flex-1",
                labelProps: { children: "Search" },
                inputProps: {
                  type: "search",
                  name: "query",
                  defaultValue: query
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex h-16 w-14 items-center text-lg font-medium text-muted-foreground", children: /* @__PURE__ */ jsx("span", { title: "Total results shown", children: data.cacheKeys.sqlite.length + data.cacheKeys.lru.length }) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsx(
              Field,
              {
                labelProps: {
                  children: "Limit"
                },
                inputProps: {
                  name: "limit",
                  defaultValue: limit,
                  type: "number",
                  step: "1",
                  min: "1",
                  max: "10000",
                  placeholder: "results limit"
                }
              }
            ),
            /* @__PURE__ */ jsx("select", { name: "instance", defaultValue: instance, children: Object.entries(data.instances).map(([inst, region]) => /* @__PURE__ */ jsx("option", { value: inst, children: [
              inst,
              `(${region})`,
              inst === data.currentInstanceInfo.currentInstance ? "(current)" : "",
              inst === data.currentInstanceInfo.primaryInstance ? " (primary)" : ""
            ].filter(Boolean).join(" ") }, inst)) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Spacer, { size: "2xs" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-h2", children: "LRU Cache:" }),
      data.cacheKeys.lru.map((key2) => /* @__PURE__ */ jsx(
        CacheKeyRow,
        {
          cacheKey: key2,
          instance,
          type: "lru"
        },
        key2
      ))
    ] }),
    /* @__PURE__ */ jsx(Spacer, { size: "3xs" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-h2", children: "SQLite Cache:" }),
      data.cacheKeys.sqlite.map((key2) => /* @__PURE__ */ jsx(
        CacheKeyRow,
        {
          cacheKey: key2,
          instance,
          type: "sqlite"
        },
        key2
      ))
    ] })
  ] });
}
function CacheKeyRow({
  cacheKey,
  instance,
  type
}) {
  const fetcher = useFetcher();
  const dc = useDoubleCheck();
  const encodedKey = encodeURIComponent(cacheKey);
  const valuePage = `/admin/cache/${type}/${encodedKey}?instance=${instance}`;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-mono", children: [
    /* @__PURE__ */ jsxs(fetcher.Form, { method: "POST", children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "cacheKey", value: cacheKey }),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "instance", value: instance }),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "type", value: type }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          variant: "secondary",
          ...dc.getButtonProps({ type: "submit" }),
          children: fetcher.state === "idle" ? dc.doubleCheck ? "You sure?" : "Delete" : "Deleting..."
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Link, { reloadDocument: true, to: valuePage, children: cacheKey })
  ] });
}
function ErrorBoundary$5() {
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        403: ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
          "You are not allowed to do that: ",
          error == null ? void 0 : error.data.message
        ] })
      }
    }
  );
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$5,
  action: action$b,
  default: CacheAdminRoute,
  handle: handle$9,
  loader: loader$m
}, Symbol.toStringTag, { value: "Module" }));
async function loader$l({ request, params }) {
  await requireUserWithRole(request, "admin");
  const searchParams = new URL(request.url).searchParams;
  const currentInstanceInfo = await getInstanceInfo();
  const allInstances = await getAllInstances();
  const instance = searchParams.get("instance") ?? currentInstanceInfo.currentInstance;
  await ensureInstance(instance);
  const { cacheKey } = params;
  invariantResponse(cacheKey, "cacheKey is required");
  return json({
    instance: {
      hostname: instance,
      region: allInstances[instance],
      isPrimary: currentInstanceInfo.primaryInstance === instance
    },
    cacheKey,
    value: lruCache.get(cacheKey)
  });
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function action$a({ request }) {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
  if (!currentIsPrimary) {
    throw new Error(
      `${request.url} should only be called on the primary instance (${primaryInstance})}`
    );
  }
  const token = process.env.INTERNAL_COMMAND_TOKEN;
  const isAuthorized = request.headers.get("Authorization") === `Bearer ${token}`;
  if (!isAuthorized) {
    return redirect$1("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }
  const { key: key2, cacheValue } = z.object({ key: z.string(), cacheValue: z.unknown().optional() }).parse(await request.json());
  if (cacheValue === void 0) {
    await cache.delete(key2);
  } else {
    await cache.set(key2, cacheValue);
  }
  return json({ success: true });
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$k({ request, params }) {
  await requireUserWithRole(request, "admin");
  const searchParams = new URL(request.url).searchParams;
  const currentInstanceInfo = await getInstanceInfo();
  const allInstances = await getAllInstances();
  const instance = searchParams.get("instance") ?? currentInstanceInfo.currentInstance;
  await ensureInstance(instance);
  const { cacheKey } = params;
  invariantResponse(cacheKey, "cacheKey is required");
  return json({
    instance: {
      hostname: instance,
      region: allInstances[instance],
      isPrimary: currentInstanceInfo.primaryInstance === instance
    },
    cacheKey,
    value: cache.get(cacheKey)
  });
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$k
}, Symbol.toStringTag, { value: "Module" }));
async function loader$j({ request }) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUnique({ where: { id: userId } });
  if (!user) {
    const requestUrl = new URL(request.url);
    const loginParams = new URLSearchParams([
      ["redirectTo", `${requestUrl.pathname}${requestUrl.search}`]
    ]);
    const redirectTo = `/login?${loginParams}`;
    await logout({ request, redirectTo });
    return redirect$1(redirectTo);
  }
  return redirect$1(`/users/${user.username}`);
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
async function loader$i({ request }) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUniqueOrThrow({
    where: { id: userId },
    // this is one of the *few* instances where you can use "include" because
    // the goal is to literally get *everything*. Normally you should be
    // explicit with "select". We're using select for images because we don't
    // want to send back the entire blob of the image. We'll send a URL they can
    // use to download it instead.
    include: {
      image: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          contentType: true
        }
      },
      notes: {
        include: {
          images: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              contentType: true
            }
          }
        }
      },
      password: false,
      // <-- intentionally omit password
      sessions: true,
      roles: true
    }
  });
  const domain = getDomainUrl(request);
  return json({
    user: {
      ...user,
      image: user.image ? {
        ...user.image,
        url: `${domain}/resources/user-images/${user.image.id}`
      } : null,
      notes: user.notes.map((note) => ({
        ...note,
        images: note.images.map((image) => ({
          ...image,
          url: `${domain}/resources/note-images/${image.id}`
        }))
      }))
    }
  });
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
async function loader$h({ request }) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    await Promise.all([
      prisma$1.user.count(),
      fetch(`${new URL(request.url).protocol}${host}`, {
        method: "HEAD",
        headers: { "X-Healthcheck": "true" }
      }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]);
    return new Response("OK");
  } catch (error) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
async function loader$g({ params }) {
  invariantResponse(params.imageId, "Image ID is required", { status: 400 });
  const image = await prisma$1.noteImage.findUnique({
    where: { id: params.imageId },
    select: { contentType: true, blob: true }
  });
  invariantResponse(image, "Not found", { status: 404 });
  return new Response(image.blob, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": Buffer.byteLength(image.blob).toString(),
      "Content-Disposition": `inline; filename="${params.imageId}"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
async function loader$f({ params }) {
  invariantResponse(params.imageId, "Image ID is required", { status: 400 });
  const image = await prisma$1.userImage.findUnique({
    where: { id: params.imageId },
    select: { contentType: true, blob: true }
  });
  invariantResponse(image, "Not found", { status: 404 });
  return new Response(image.blob, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": Buffer.byteLength(image.blob).toString(),
      "Content-Disposition": `inline; filename="${params.imageId}"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
const BreadcrumbHandle = z.object({ breadcrumb: z.any() });
const handle$8 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "file-text", children: "Edit Profile" }),
  getSitemapEntries: () => null
};
async function loader$e({ request }) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUnique({
    where: { id: userId },
    select: { username: true }
  });
  invariantResponse(user, "User not found", { status: 404 });
  return json({});
}
const BreadcrumbHandleMatch = z.object({
  handle: BreadcrumbHandle
});
function EditUserProfile$1() {
  const user = useUser();
  const matches = useMatches();
  const breadcrumbs = matches.map((m) => {
    const result = BreadcrumbHandleMatch.safeParse(m);
    if (!result.success || !result.data.handle.breadcrumb)
      return null;
    return /* @__PURE__ */ jsx(Link, { to: m.pathname, className: "flex items-center", children: result.data.handle.breadcrumb }, m.id);
  }).filter(Boolean);
  return /* @__PURE__ */ jsxs("div", { className: "m-auto mb-24 mt-16 max-w-3xl", children: [
    /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("ul", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-muted-foreground",
          to: `/users/${user.username}`,
          children: "Profile"
        }
      ) }),
      breadcrumbs.map((breadcrumb, i, arr) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: cn("flex items-center gap-3", {
            "text-muted-foreground": i < arr.length - 1
          }),
          children: [
            "▶️ ",
            breadcrumb
          ]
        },
        i
      ))
    ] }) }),
    /* @__PURE__ */ jsx(Spacer, { size: "xs" }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto bg-muted px-6 py-8 md:container md:rounded-3xl", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BreadcrumbHandle,
  default: EditUserProfile$1,
  handle: handle$8,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
const handle$7 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "link-2", children: "Connections" }),
  getSitemapEntries: () => null
};
async function userCanDeleteConnections(userId) {
  const user = await prisma$1.user.findUnique({
    select: {
      password: { select: { userId: true } },
      _count: { select: { connections: true } }
    },
    where: { id: userId }
  });
  if (user == null ? void 0 : user.password)
    return true;
  return Boolean((user == null ? void 0 : user._count.connections) && (user == null ? void 0 : user._count.connections) > 1);
}
async function loader$d({ request }) {
  const userId = await requireUserId(request);
  const timings = makeTimings("profile connections loader");
  const rawConnections = await prisma$1.connection.findMany({
    select: { id: true, providerName: true, providerId: true, createdAt: true },
    where: { userId }
  });
  const connections = [];
  for (const connection of rawConnections) {
    const r = ProviderNameSchema.safeParse(connection.providerName);
    if (!r.success)
      continue;
    const providerName = r.data;
    const connectionData = await resolveConnectionData(
      providerName,
      connection.providerId,
      { timings }
    );
    connections.push({
      ...connectionData,
      providerName,
      id: connection.id,
      createdAtFormatted: connection.createdAt.toLocaleString()
    });
  }
  return json(
    {
      connections,
      canDeleteConnections: await userCanDeleteConnections(userId)
    },
    { headers: { "Server-Timing": timings.toString() } }
  );
}
const headers = ({ loaderHeaders }) => {
  const headers2 = {
    "Server-Timing": loaderHeaders.get("Server-Timing") ?? ""
  };
  return headers2;
};
async function action$9({ request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  invariantResponse(
    formData.get("intent") === "delete-connection",
    "Invalid intent"
  );
  invariantResponse(
    await userCanDeleteConnections(userId),
    "You cannot delete your last connection unless you have a password."
  );
  const connectionId = formData.get("connectionId");
  invariantResponse(typeof connectionId === "string", "Invalid connectionId");
  await prisma$1.connection.delete({
    where: {
      id: connectionId,
      userId
    }
  });
  const toastHeaders = await createToastHeaders({
    title: "Deleted",
    description: "Your connection has been deleted."
  });
  return json({ status: "success" }, { headers: toastHeaders });
}
function Connections() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md", children: [
    data.connections.length ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("p", { children: "Here are your current connections:" }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-4", children: data.connections.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Connection,
        {
          connection: c,
          canDelete: data.canDeleteConnections
        }
      ) }, c.id)) })
    ] }) : /* @__PURE__ */ jsx("p", { children: "You don't have any connections yet." }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3", children: providerNames.map((providerName) => /* @__PURE__ */ jsx(
      ProviderConnectionForm,
      {
        type: "Connect",
        providerName
      },
      providerName
    )) })
  ] });
}
function Connection({
  connection,
  canDelete
}) {
  var _a2;
  const deleteFetcher = useFetcher();
  const [infoOpen, setInfoOpen] = useState(false);
  const icon = providerIcons[connection.providerName];
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
    /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5`, children: [
      icon,
      /* @__PURE__ */ jsxs("span", { children: [
        connection.link ? /* @__PURE__ */ jsx("a", { href: connection.link, className: "underline", children: connection.displayName }) : connection.displayName,
        " ",
        "(",
        connection.createdAtFormatted,
        ")"
      ] })
    ] }),
    canDelete ? /* @__PURE__ */ jsxs(deleteFetcher.Form, { method: "POST", children: [
      /* @__PURE__ */ jsx("input", { name: "connectionId", value: connection.id, type: "hidden" }),
      /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
          StatusButton,
          {
            name: "intent",
            value: "delete-connection",
            variant: "destructive",
            size: "sm",
            status: deleteFetcher.state !== "idle" ? "pending" : ((_a2 = deleteFetcher.data) == null ? void 0 : _a2.status) ?? "idle",
            children: /* @__PURE__ */ jsx(Icon, { name: "cross-1" })
          }
        ) }),
        /* @__PURE__ */ jsx(TooltipContent, { children: "Disconnect this account" })
      ] }) })
    ] }) : /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { open: infoOpen, onOpenChange: setInfoOpen, children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { onClick: () => setInfoOpen(true), children: /* @__PURE__ */ jsx(Icon, { name: "question-mark-circled" }) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: "You cannot delete your last connection unless you have a password." })
    ] }) })
  ] });
}
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: Connections,
  handle: handle$7,
  headers,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
const handle$6 = {
  getSitemapEntries: () => null
};
const ProfileFormSchema = z.object({
  name: NameSchema.optional(),
  username: UsernameSchema
});
async function loader$c({ request }) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: {
        select: { id: true }
      },
      _count: {
        select: {
          sessions: {
            where: {
              expirationDate: { gt: /* @__PURE__ */ new Date() }
            }
          }
        }
      }
    }
  });
  const twoFactorVerification = await prisma$1.verification.findUnique({
    select: { id: true },
    where: { target_type: { type: twoFAVerificationType, target: userId } }
  });
  const password = await prisma$1.password.findUnique({
    select: { userId: true },
    where: { userId }
  });
  return json({
    user,
    hasPassword: Boolean(password),
    isTwoFactorEnabled: Boolean(twoFactorVerification)
  });
}
const profileUpdateActionIntent = "update-profile";
const signOutOfSessionsActionIntent = "sign-out-of-sessions";
const deleteDataActionIntent = "delete-data";
async function action$8({ request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case profileUpdateActionIntent: {
      return profileUpdateAction({ request, userId, formData });
    }
    case signOutOfSessionsActionIntent: {
      return signOutOfSessionsAction({ request, userId, formData });
    }
    case deleteDataActionIntent: {
      return deleteDataAction({ request, userId, formData });
    }
    default: {
      throw new Response(`Invalid intent "${intent}"`, { status: 400 });
    }
  }
}
function EditUserProfile() {
  var _a2;
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-12", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative h-52 w-52", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: getUserImgSrc((_a2 = data.user.image) == null ? void 0 : _a2.id),
          alt: data.user.username,
          className: "h-full w-full rounded-full object-cover"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "outline",
          className: "absolute -right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full p-0",
          children: /* @__PURE__ */ jsx(
            Link,
            {
              preventScrollReset: true,
              to: "photo",
              title: "Change profile photo",
              "aria-label": "Change profile photo",
              children: /* @__PURE__ */ jsx(Icon, { name: "camera", className: "h-4 w-4" })
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(UpdateProfile, {}),
    /* @__PURE__ */ jsx("div", { className: "col-span-6 my-6 h-1 border-b-[1.5px] border-foreground" }),
    /* @__PURE__ */ jsxs("div", { className: "col-span-full flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "change-email", children: /* @__PURE__ */ jsxs(Icon, { name: "envelope-closed", children: [
        "Change email from ",
        data.user.email
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "two-factor", children: data.isTwoFactorEnabled ? /* @__PURE__ */ jsx(Icon, { name: "lock-closed", children: "2FA is enabled" }) : /* @__PURE__ */ jsx(Icon, { name: "lock-open-1", children: "Enable 2FA" }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: data.hasPassword ? "password" : "password/create", children: /* @__PURE__ */ jsx(Icon, { name: "dots-horizontal", children: data.hasPassword ? "Change Password" : "Create a Password" }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "connections", children: /* @__PURE__ */ jsx(Icon, { name: "link-2", children: "Manage connections" }) }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        Link,
        {
          reloadDocument: true,
          download: "my-epic-notes-data.json",
          to: "/resources/download-user-data",
          children: /* @__PURE__ */ jsx(Icon, { name: "download", children: "Download your data" })
        }
      ) }),
      /* @__PURE__ */ jsx(SignOutOfSessions, {}),
      /* @__PURE__ */ jsx(DeleteData, {})
    ] })
  ] });
}
async function profileUpdateAction({ userId, formData }) {
  const submission = await parseWithZod(formData, {
    async: true,
    schema: ProfileFormSchema.superRefine(async ({ username }, ctx) => {
      const existingUsername = await prisma$1.user.findUnique({
        where: { username },
        select: { id: true }
      });
      if (existingUsername && existingUsername.id !== userId) {
        ctx.addIssue({
          path: ["username"],
          code: z.ZodIssueCode.custom,
          message: "A user already exists with this username"
        });
      }
    })
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const data = submission.value;
  await prisma$1.user.update({
    select: { username: true },
    where: { id: userId },
    data: {
      name: data.name,
      username: data.username
    }
  });
  return json({
    result: submission.reply()
  });
}
function UpdateProfile() {
  var _a2;
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [form, fields] = useForm({
    id: "edit-profile",
    constraint: getZodConstraint(ProfileFormSchema),
    lastResult: (_a2 = fetcher.data) == null ? void 0 : _a2.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ProfileFormSchema });
    },
    defaultValue: {
      username: data.user.username,
      name: data.user.name
    }
  });
  return /* @__PURE__ */ jsxs(fetcher.Form, { method: "POST", ...getFormProps(form), children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-6 gap-x-10", children: [
      /* @__PURE__ */ jsx(
        Field,
        {
          className: "col-span-3",
          labelProps: {
            htmlFor: fields.username.id,
            children: "Username"
          },
          inputProps: getInputProps(fields.username, { type: "text" }),
          errors: fields.username.errors
        }
      ),
      /* @__PURE__ */ jsx(
        Field,
        {
          className: "col-span-3",
          labelProps: { htmlFor: fields.name.id, children: "Name" },
          inputProps: getInputProps(fields.name, { type: "text" }),
          errors: fields.name.errors
        }
      )
    ] }),
    /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ jsx(
      StatusButton,
      {
        type: "submit",
        size: "wide",
        name: "intent",
        value: profileUpdateActionIntent,
        status: fetcher.state !== "idle" ? "pending" : form.status ?? "idle",
        children: "Save changes"
      }
    ) })
  ] });
}
async function signOutOfSessionsAction({ request, userId }) {
  const authSession = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const sessionId = authSession.get(sessionKey);
  invariantResponse(
    sessionId,
    "You must be authenticated to sign out of other sessions"
  );
  await prisma$1.session.deleteMany({
    where: {
      userId,
      id: { not: sessionId }
    }
  });
  return json({ status: "success" });
}
function SignOutOfSessions() {
  var _a2;
  const data = useLoaderData();
  const dc = useDoubleCheck();
  const fetcher = useFetcher();
  const otherSessionsCount = data.user._count.sessions - 1;
  return /* @__PURE__ */ jsx("div", { children: otherSessionsCount ? /* @__PURE__ */ jsx(fetcher.Form, { method: "POST", children: /* @__PURE__ */ jsx(
    StatusButton,
    {
      ...dc.getButtonProps({
        type: "submit",
        name: "intent",
        value: signOutOfSessionsActionIntent
      }),
      variant: dc.doubleCheck ? "destructive" : "default",
      status: fetcher.state !== "idle" ? "pending" : ((_a2 = fetcher.data) == null ? void 0 : _a2.status) ?? "idle",
      children: /* @__PURE__ */ jsx(Icon, { name: "avatar", children: dc.doubleCheck ? `Are you sure?` : `Sign out of ${otherSessionsCount} other sessions` })
    }
  ) }) : /* @__PURE__ */ jsx(Icon, { name: "avatar", children: "This is your only session" }) });
}
async function deleteDataAction({ userId }) {
  await prisma$1.user.delete({ where: { id: userId } });
  return redirectWithToast("/", {
    type: "success",
    title: "Data Deleted",
    description: "All of your data has been deleted"
  });
}
function DeleteData() {
  const dc = useDoubleCheck();
  const fetcher = useFetcher();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(fetcher.Form, { method: "POST", children: /* @__PURE__ */ jsx(
    StatusButton,
    {
      ...dc.getButtonProps({
        type: "submit",
        name: "intent",
        value: deleteDataActionIntent
      }),
      variant: dc.doubleCheck ? "destructive" : "default",
      status: fetcher.state !== "idle" ? "pending" : "idle",
      children: /* @__PURE__ */ jsx(Icon, { name: "trash", children: dc.doubleCheck ? `Are you sure?` : `Delete all your data` })
    }
  ) }) });
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: EditUserProfile,
  handle: handle$6,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const handle$5 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "dots-horizontal", children: "Password" }),
  getSitemapEntries: () => null
};
const ChangePasswordForm = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
  confirmNewPassword: PasswordSchema
}).superRefine(({ confirmNewPassword, newPassword }, ctx) => {
  if (confirmNewPassword !== newPassword) {
    ctx.addIssue({
      path: ["confirmNewPassword"],
      code: z.ZodIssueCode.custom,
      message: "The passwords must match"
    });
  }
});
async function requirePassword(userId) {
  const password = await prisma$1.password.findUnique({
    select: { userId: true },
    where: { userId }
  });
  if (!password) {
    throw redirect$1("/settings/profile/password/create");
  }
}
async function loader$b({ request }) {
  const userId = await requireUserId(request);
  await requirePassword(userId);
  return json({});
}
async function action$7({ request }) {
  const userId = await requireUserId(request);
  await requirePassword(userId);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    async: true,
    schema: ChangePasswordForm.superRefine(
      async ({ currentPassword, newPassword: newPassword2 }, ctx) => {
        if (currentPassword && newPassword2) {
          const user = await verifyUserPassword({ id: userId }, currentPassword);
          if (!user) {
            ctx.addIssue({
              path: ["currentPassword"],
              code: z.ZodIssueCode.custom,
              message: "Incorrect password."
            });
          }
        }
      }
    )
  });
  if (submission.status !== "success") {
    return json(
      {
        result: submission.reply({
          hideFields: ["currentPassword", "newPassword", "confirmNewPassword"]
        })
      },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { newPassword } = submission.value;
  await prisma$1.user.update({
    select: { username: true },
    where: { id: userId },
    data: {
      password: {
        update: {
          hash: await getPasswordHash(newPassword)
        }
      }
    }
  });
  return redirectWithToast(
    `/settings/profile`,
    {
      type: "success",
      title: "Password Changed",
      description: "Your password has been changed."
    },
    { status: 302 }
  );
}
function ChangePasswordRoute() {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "password-change-form",
    constraint: getZodConstraint(ChangePasswordForm),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ChangePasswordForm });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ jsx(
      Field,
      {
        labelProps: { children: "Current Password" },
        inputProps: {
          ...getInputProps(fields.currentPassword, { type: "password" }),
          autoComplete: "current-password"
        },
        errors: fields.currentPassword.errors
      }
    ),
    /* @__PURE__ */ jsx(
      Field,
      {
        labelProps: { children: "New Password" },
        inputProps: {
          ...getInputProps(fields.newPassword, { type: "password" }),
          autoComplete: "new-password"
        },
        errors: fields.newPassword.errors
      }
    ),
    /* @__PURE__ */ jsx(
      Field,
      {
        labelProps: { children: "Confirm New Password" },
        inputProps: {
          ...getInputProps(fields.confirmNewPassword, {
            type: "password"
          }),
          autoComplete: "new-password"
        },
        errors: fields.confirmNewPassword.errors
      }
    ),
    /* @__PURE__ */ jsx(ErrorList, { id: form.errorId, errors: form.errors }),
    /* @__PURE__ */ jsxs("div", { className: "grid w-full grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "..", children: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        StatusButton,
        {
          type: "submit",
          status: isPending ? "pending" : form.status ?? "idle",
          children: "Change Password"
        }
      )
    ] })
  ] });
}
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: ChangePasswordRoute,
  handle: handle$5,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const handle$4 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "dots-horizontal", children: "Password" }),
  getSitemapEntries: () => null
};
const CreatePasswordForm = PasswordAndConfirmPasswordSchema;
async function requireNoPassword(userId) {
  const password = await prisma$1.password.findUnique({
    select: { userId: true },
    where: { userId }
  });
  if (password) {
    throw redirect$1("/settings/profile/password");
  }
}
async function loader$a({ request }) {
  const userId = await requireUserId(request);
  await requireNoPassword(userId);
  return json({});
}
async function action$6({ request }) {
  const userId = await requireUserId(request);
  await requireNoPassword(userId);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    async: true,
    schema: CreatePasswordForm
  });
  if (submission.status !== "success") {
    return json(
      {
        result: submission.reply({
          hideFields: ["password", "confirmPassword"]
        })
      },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { password } = submission.value;
  await prisma$1.user.update({
    select: { username: true },
    where: { id: userId },
    data: {
      password: {
        create: {
          hash: await getPasswordHash(password)
        }
      }
    }
  });
  return redirect$1(`/settings/profile`, { status: 302 });
}
function CreatePasswordRoute() {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "password-create-form",
    constraint: getZodConstraint(CreatePasswordForm),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreatePasswordForm });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ jsx(
      Field,
      {
        labelProps: { children: "New Password" },
        inputProps: {
          ...getInputProps(fields.password, { type: "password" }),
          autoComplete: "new-password"
        },
        errors: fields.password.errors
      }
    ),
    /* @__PURE__ */ jsx(
      Field,
      {
        labelProps: { children: "Confirm New Password" },
        inputProps: {
          ...getInputProps(fields.confirmPassword, {
            type: "password"
          }),
          autoComplete: "new-password"
        },
        errors: fields.confirmPassword.errors
      }
    ),
    /* @__PURE__ */ jsx(ErrorList, { id: form.errorId, errors: form.errors }),
    /* @__PURE__ */ jsxs("div", { className: "grid w-full grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "..", children: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        StatusButton,
        {
          type: "submit",
          status: isPending ? "pending" : form.status ?? "idle",
          children: "Create Password"
        }
      )
    ] })
  ] });
}
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  default: CreatePasswordRoute,
  handle: handle$4,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const handle$3 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "avatar", children: "Photo" }),
  getSitemapEntries: () => null
};
const MAX_SIZE = 1024 * 1024 * 3;
const DeleteImageSchema = z.object({
  intent: z.literal("delete")
});
const NewImageSchema = z.object({
  intent: z.literal("submit"),
  photoFile: z.instanceof(File).refine((file) => file.size > 0, "Image is required").refine((file) => file.size <= MAX_SIZE, "Image size must be less than 3MB")
});
const PhotoFormSchema = z.discriminatedUnion("intent", [
  DeleteImageSchema,
  NewImageSchema
]);
async function loader$9({ request }) {
  const userId = await requireUserId(request);
  const user = await prisma$1.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      image: { select: { id: true } }
    }
  });
  invariantResponse(user, "User not found", { status: 404 });
  return json({ user });
}
async function action$5({ request }) {
  const userId = await requireUserId(request);
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: MAX_SIZE })
  );
  const submission = await parseWithZod(formData, {
    schema: PhotoFormSchema.transform(async (data) => {
      if (data.intent === "delete")
        return { intent: "delete" };
      if (data.photoFile.size <= 0)
        return z.NEVER;
      return {
        intent: data.intent,
        image: {
          contentType: data.photoFile.type,
          blob: Buffer.from(await data.photoFile.arrayBuffer())
        }
      };
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { image, intent } = submission.value;
  if (intent === "delete") {
    await prisma$1.userImage.deleteMany({ where: { userId } });
    return redirect$1("/settings/profile");
  }
  await prisma$1.$transaction(async ($prisma) => {
    await $prisma.userImage.deleteMany({ where: { userId } });
    await $prisma.user.update({
      where: { id: userId },
      data: { image: { create: image } }
    });
  });
  return redirect$1("/settings/profile");
}
function PhotoRoute() {
  var _a2, _b, _c, _d, _e;
  const data = useLoaderData();
  const doubleCheckDeleteImage = useDoubleCheck();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    id: "profile-photo",
    constraint: getZodConstraint(PhotoFormSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PhotoFormSchema });
    },
    shouldRevalidate: "onBlur"
  });
  const isPending = useIsPending();
  const pendingIntent = isPending ? (_a2 = navigation.formData) == null ? void 0 : _a2.get("intent") : null;
  const lastSubmissionIntent = fields.intent.value;
  const [newImageSrc, setNewImageSrc] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "POST",
      encType: "multipart/form-data",
      className: "flex flex-col items-center justify-center gap-10",
      onReset: () => setNewImageSrc(null),
      ...getFormProps(form),
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: newImageSrc ?? (data.user ? getUserImgSrc((_b = data.user.image) == null ? void 0 : _b.id) : ""),
            className: "h-52 w-52 rounded-full object-cover",
            alt: ((_c = data.user) == null ? void 0 : _c.name) ?? ((_d = data.user) == null ? void 0 : _d.username)
          }
        ),
        /* @__PURE__ */ jsx(ErrorList, { errors: fields.photoFile.errors, id: fields.photoFile.id }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ...getInputProps(fields.photoFile, { type: "file" }),
              accept: "image/*",
              className: "peer sr-only",
              required: true,
              tabIndex: newImageSrc ? -1 : 0,
              onChange: (e) => {
                var _a3;
                const file = (_a3 = e.currentTarget.files) == null ? void 0 : _a3[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    var _a4, _b2;
                    setNewImageSrc(((_b2 = (_a4 = event.target) == null ? void 0 : _a4.result) == null ? void 0 : _b2.toString()) ?? null);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              asChild: true,
              className: "cursor-pointer peer-valid:hidden peer-focus-within:ring-2 peer-focus-visible:ring-2",
              children: /* @__PURE__ */ jsx("label", { htmlFor: fields.photoFile.id, children: /* @__PURE__ */ jsx(Icon, { name: "pencil-1", children: "Change" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            StatusButton,
            {
              name: "intent",
              value: "submit",
              type: "submit",
              className: "peer-invalid:hidden",
              status: pendingIntent === "submit" ? "pending" : lastSubmissionIntent === "submit" ? form.status ?? "idle" : "idle",
              children: "Save Photo"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "destructive",
              className: "peer-invalid:hidden",
              ...form.reset.getButtonProps(),
              children: /* @__PURE__ */ jsx(Icon, { name: "trash", children: "Reset" })
            }
          ),
          ((_e = data.user.image) == null ? void 0 : _e.id) ? /* @__PURE__ */ jsx(
            StatusButton,
            {
              className: "peer-valid:hidden",
              variant: "destructive",
              ...doubleCheckDeleteImage.getButtonProps({
                type: "submit",
                name: "intent",
                value: "delete"
              }),
              status: pendingIntent === "delete" ? "pending" : lastSubmissionIntent === "delete" ? form.status ?? "idle" : "idle",
              children: /* @__PURE__ */ jsx(Icon, { name: "trash", children: doubleCheckDeleteImage.doubleCheck ? "Are you sure?" : "Delete" })
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsx(ErrorList, { errors: form.errors })
      ]
    }
  ) });
}
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: PhotoRoute,
  handle: handle$3,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const handle$2 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "lock-open-1", children: "Disable" }),
  getSitemapEntries: () => null
};
async function loader$8({ request }) {
  await requireRecentVerification(request);
  return json({});
}
async function action$4({ request }) {
  await requireRecentVerification(request);
  const userId = await requireUserId(request);
  await prisma$1.verification.delete({
    where: { target_type: { target: userId, type: twoFAVerificationType } }
  });
  return redirectWithToast("/settings/profile/two-factor", {
    title: "2FA Disabled",
    description: "Two factor authentication has been disabled."
  });
}
function TwoFactorDisableRoute() {
  const disable2FAFetcher = useFetcher();
  const dc = useDoubleCheck();
  return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-sm", children: /* @__PURE__ */ jsxs(disable2FAFetcher.Form, { method: "POST", children: [
    /* @__PURE__ */ jsx("p", { children: "Disabling two factor authentication is not recommended. However, if you would like to do so, click here:" }),
    /* @__PURE__ */ jsx(
      StatusButton,
      {
        variant: "destructive",
        status: disable2FAFetcher.state === "loading" ? "pending" : "idle",
        ...dc.getButtonProps({
          className: "mx-auto",
          name: "intent",
          value: "disable",
          type: "submit"
        }),
        children: dc.doubleCheck ? "Are you sure?" : "Disable 2FA"
      }
    )
  ] }) });
}
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: TwoFactorDisableRoute,
  handle: handle$2,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const handle$1 = {
  breadcrumb: /* @__PURE__ */ jsx(Icon, { name: "check", children: "Verify" }),
  getSitemapEntries: () => null
};
const CancelSchema = z.object({ intent: z.literal("cancel") });
const VerifySchema = z.object({
  intent: z.literal("verify"),
  code: z.string().min(6).max(6)
});
const ActionSchema = z.discriminatedUnion("intent", [
  CancelSchema,
  VerifySchema
]);
const twoFAVerifyVerificationType = "2fa-verify";
async function loader$7({ request }) {
  const userId = await requireUserId(request);
  const verification = await prisma$1.verification.findUnique({
    where: {
      target_type: { type: twoFAVerifyVerificationType, target: userId }
    },
    select: {
      id: true,
      algorithm: true,
      secret: true,
      period: true,
      digits: true
    }
  });
  if (!verification) {
    return redirect$1("/settings/profile/two-factor");
  }
  const user = await prisma$1.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true }
  });
  const issuer = new URL(getDomainUrl(request)).host;
  const otpUri = getTOTPAuthUri({
    ...verification,
    accountName: user.email,
    issuer
  });
  const qrCode = await QRCode.toDataURL(otpUri);
  return json({ otpUri, qrCode });
}
async function action$3({ request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: () => ActionSchema.superRefine(async (data, ctx) => {
      if (data.intent === "cancel")
        return null;
      const codeIsValid = await isCodeValid({
        code: data.code,
        type: twoFAVerifyVerificationType,
        target: userId
      });
      if (!codeIsValid) {
        ctx.addIssue({
          path: ["code"],
          code: z.ZodIssueCode.custom,
          message: `Invalid code`
        });
        return z.NEVER;
      }
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  switch (submission.value.intent) {
    case "cancel": {
      await prisma$1.verification.deleteMany({
        where: { type: twoFAVerifyVerificationType, target: userId }
      });
      return redirect$1("/settings/profile/two-factor");
    }
    case "verify": {
      await prisma$1.verification.update({
        where: {
          target_type: { type: twoFAVerifyVerificationType, target: userId }
        },
        data: { type: twoFAVerificationType }
      });
      return redirectWithToast("/settings/profile/two-factor", {
        type: "success",
        title: "Enabled",
        description: "Two-factor authentication has been enabled."
      });
    }
  }
}
function TwoFactorRoute$1() {
  var _a2;
  const data = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isPending = useIsPending();
  const pendingIntent = isPending ? (_a2 = navigation.formData) == null ? void 0 : _a2.get("intent") : null;
  const [form, fields] = useForm({
    id: "verify-form",
    constraint: getZodConstraint(ActionSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ActionSchema });
    }
  });
  const lastSubmissionIntent = fields.intent.value;
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("img", { alt: "qr code", src: data.qrCode, className: "h-56 w-56" }),
    /* @__PURE__ */ jsx("p", { children: "Scan this QR code with your authenticator app." }),
    /* @__PURE__ */ jsx("p", { className: "text-sm", children: "If you cannot scan the QR code, you can manually add this account to your authenticator app using this code:" }),
    /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsx(
      "pre",
      {
        className: "whitespace-pre-wrap break-all text-sm",
        "aria-label": "One-time Password URI",
        children: data.otpUri
      }
    ) }),
    /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Once you've added the account, enter the code from your authenticator app below. Once you enable 2FA, you will need to enter a code from your authenticator app every time you log in or perform important actions. Do not lose access to your authenticator app, or you will lose access to your account." }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-xs flex-col justify-center gap-4", children: /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), className: "flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
        OTPField,
        {
          labelProps: {
            htmlFor: fields.code.id,
            children: "Code"
          },
          inputProps: {
            ...getInputProps(fields.code, { type: "text" }),
            autoFocus: true,
            autoComplete: "one-time-code"
          },
          errors: fields.code.errors
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: /* @__PURE__ */ jsx(ErrorList, { id: form.errorId, errors: form.errors }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
        /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            status: pendingIntent === "verify" ? "pending" : lastSubmissionIntent === "verify" ? form.status ?? "idle" : "idle",
            type: "submit",
            name: "intent",
            value: "verify",
            children: "Submit"
          }
        ),
        /* @__PURE__ */ jsx(
          StatusButton,
          {
            className: "w-full",
            variant: "secondary",
            status: pendingIntent === "cancel" ? "pending" : lastSubmissionIntent === "cancel" ? form.status ?? "idle" : "idle",
            type: "submit",
            name: "intent",
            value: "cancel",
            disabled: isPending,
            children: "Cancel"
          }
        )
      ] })
    ] }) })
  ] }) });
}
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: TwoFactorRoute$1,
  handle: handle$1,
  loader: loader$7,
  twoFAVerifyVerificationType
}, Symbol.toStringTag, { value: "Module" }));
const handle = {
  getSitemapEntries: () => null
};
async function loader$6({ request }) {
  const userId = await requireUserId(request);
  const verification = await prisma$1.verification.findUnique({
    where: { target_type: { type: twoFAVerificationType, target: userId } },
    select: { id: true }
  });
  return json({ is2FAEnabled: Boolean(verification) });
}
async function action$2({ request }) {
  const userId = await requireUserId(request);
  const { otp: _otp, ...config } = generateTOTP();
  const verificationData = {
    ...config,
    type: twoFAVerifyVerificationType,
    target: userId
  };
  await prisma$1.verification.upsert({
    where: {
      target_type: { target: userId, type: twoFAVerifyVerificationType }
    },
    create: verificationData,
    update: verificationData
  });
  return redirect$1("/settings/profile/two-factor/verify");
}
function TwoFactorRoute() {
  const data = useLoaderData();
  const enable2FAFetcher = useFetcher();
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: data.is2FAEnabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "text-lg", children: /* @__PURE__ */ jsx(Icon, { name: "check", children: "You have enabled two-factor authentication." }) }),
    /* @__PURE__ */ jsx(Link, { to: "disable", children: /* @__PURE__ */ jsx(Icon, { name: "lock-open-1", children: "Disable 2FA" }) })
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Icon, { name: "lock-open-1", children: "You have not enabled two-factor authentication yet." }) }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
      "Two factor authentication adds an extra layer of security to your account. You will need to enter a code from an authenticator app like",
      " ",
      /* @__PURE__ */ jsx("a", { className: "underline", href: "https://1password.com/", children: "1Password" }),
      " ",
      "to log in."
    ] }),
    /* @__PURE__ */ jsx(enable2FAFetcher.Form, { method: "POST", children: /* @__PURE__ */ jsx(
      StatusButton,
      {
        type: "submit",
        name: "intent",
        value: "enable",
        status: enable2FAFetcher.state === "loading" ? "pending" : "idle",
        className: "mx-auto",
        children: "Enable 2FA"
      }
    ) })
  ] }) });
}
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: TwoFactorRoute,
  handle,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
async function loader$5({ params }) {
  const user = await prisma$1.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      createdAt: true,
      image: { select: { id: true } }
    },
    where: {
      username: params.username
    }
  });
  invariantResponse(user, "User not found", { status: 404 });
  return json({ user, userJoinedDisplay: user.createdAt.toLocaleDateString() });
}
function ProfileRoute() {
  var _a2;
  const data = useLoaderData();
  const user = data.user;
  const userDisplayName = user.name ?? user.username;
  const loggedInUser = useOptionalUser();
  const isLoggedInUser = data.user.id === (loggedInUser == null ? void 0 : loggedInUser.id);
  return /* @__PURE__ */ jsxs("div", { className: "container mb-48 mt-36 flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx(Spacer, { size: "4xs" }),
    /* @__PURE__ */ jsxs("div", { className: "container flex flex-col items-center rounded-3xl bg-muted p-12", children: [
      /* @__PURE__ */ jsx("div", { className: "relative w-52", children: /* @__PURE__ */ jsx("div", { className: "absolute -top-40", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: getUserImgSrc((_a2 = data.user.image) == null ? void 0 : _a2.id),
          alt: userDisplayName,
          className: "h-52 w-52 rounded-full object-cover"
        }
      ) }) }) }),
      /* @__PURE__ */ jsx(Spacer, { size: "sm" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-center gap-4", children: /* @__PURE__ */ jsx("h1", { className: "text-center text-h2", children: userDisplayName }) }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-center text-muted-foreground", children: [
          "Joined ",
          data.userJoinedDisplay
        ] }),
        isLoggedInUser ? /* @__PURE__ */ jsx(Form, { action: "/logout", method: "POST", className: "mt-3", children: /* @__PURE__ */ jsx(Button, { type: "submit", variant: "link", size: "pill", children: /* @__PURE__ */ jsx(Icon, { name: "exit", className: "scale-125 max-md:scale-150", children: "Logout" }) }) }) : null,
        /* @__PURE__ */ jsx("div", { className: "mt-10 flex gap-4", children: isLoggedInUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "notes", prefetch: "intent", children: "My notes" }) }),
          /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/settings/profile", prefetch: "intent", children: "Edit profile" }) })
        ] }) : /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "notes", prefetch: "intent", children: [
          userDisplayName,
          "'s notes"
        ] }) }) })
      ] })
    ] })
  ] });
}
const meta$2 = ({ data, params }) => {
  const displayName = (data == null ? void 0 : data.user.name) ?? params.username;
  return [
    { title: `${displayName} | Epic Notes` },
    {
      name: "description",
      content: `Profile of ${displayName} on Epic Notes`
    }
  ];
};
function ErrorBoundary$4() {
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        404: ({ params }) => /* @__PURE__ */ jsxs("p", { children: [
          'No user with the username "',
          params.username,
          '" exists'
        ] })
      }
    }
  );
}
const route41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$4,
  default: ProfileRoute,
  loader: loader$5,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4({ params }) {
  const owner = await prisma$1.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      image: { select: { id: true } },
      notes: { select: { id: true, title: true } }
    },
    where: { username: params.username }
  });
  invariantResponse(owner, "Owner not found", { status: 404 });
  return json({ owner });
}
function NotesRoute() {
  var _a2;
  const data = useLoaderData();
  const user = useOptionalUser();
  const isOwner = (user == null ? void 0 : user.id) === data.owner.id;
  const ownerDisplayName = data.owner.name ?? data.owner.username;
  const navLinkDefaultClassName = "line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl";
  return /* @__PURE__ */ jsx("main", { className: "container flex h-full min-h-[400px] px-0 pb-12 md:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid w-full grid-cols-4 bg-muted pl-2 md:container md:rounded-3xl md:pr-0", children: [
    /* @__PURE__ */ jsx("div", { className: "relative col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/users/${data.owner.username}`,
          className: "flex flex-col items-center justify-center gap-2 bg-muted pb-4 pl-8 pr-4 pt-12 lg:flex-row lg:justify-start lg:gap-4",
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: getUserImgSrc((_a2 = data.owner.image) == null ? void 0 : _a2.id),
                alt: ownerDisplayName,
                className: "h-16 w-16 rounded-full object-cover lg:h-24 lg:w-24"
              }
            ),
            /* @__PURE__ */ jsxs("h1", { className: "text-center text-base font-bold md:text-lg lg:text-left lg:text-2xl", children: [
              ownerDisplayName,
              "'s Notes"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("ul", { className: "overflow-y-auto overflow-x-hidden pb-12", children: [
        isOwner ? /* @__PURE__ */ jsx("li", { className: "p-1 pr-0", children: /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "new",
            className: ({ isActive }) => cn(navLinkDefaultClassName, isActive && "bg-accent"),
            children: /* @__PURE__ */ jsx(Icon, { name: "plus", children: "New Note" })
          }
        ) }) : null,
        data.owner.notes.map((note) => /* @__PURE__ */ jsx("li", { className: "p-1 pr-0", children: /* @__PURE__ */ jsx(
          NavLink,
          {
            to: note.id,
            preventScrollReset: true,
            prefetch: "intent",
            className: ({ isActive }) => cn(navLinkDefaultClassName, isActive && "bg-accent"),
            children: note.title
          }
        ) }, note.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "relative col-span-3 bg-accent md:rounded-r-3xl", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] }) });
}
function ErrorBoundary$3() {
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        404: ({ params }) => /* @__PURE__ */ jsxs("p", { children: [
          'No user with the username "',
          params.username,
          '" exists'
        ] })
      }
    }
  );
}
const route42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$3,
  default: NotesRoute,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const floatingToolbarClassName = "absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-muted/80 p-4 pl-5 shadow-xl shadow-accent backdrop-blur-sm md:gap-4 md:pl-7 justify-end";
async function loader$3({ params }) {
  const note = await prisma$1.note.findUnique({
    where: { id: params.noteId },
    select: {
      id: true,
      title: true,
      content: true,
      ownerId: true,
      updatedAt: true,
      images: {
        select: {
          id: true,
          altText: true
        }
      }
    }
  });
  invariantResponse(note, "Not found", { status: 404 });
  const date = new Date(note.updatedAt);
  const timeAgo = formatDistanceToNow(date);
  return json({
    note,
    timeAgo
  });
}
const DeleteFormSchema = z.object({
  intent: z.literal("delete-note"),
  noteId: z.string()
});
async function action$1({ request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: DeleteFormSchema
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const { noteId } = submission.value;
  const note = await prisma$1.note.findFirst({
    select: { id: true, ownerId: true, owner: { select: { username: true } } },
    where: { id: noteId }
  });
  invariantResponse(note, "Not found", { status: 404 });
  const isOwner = note.ownerId === userId;
  await requireUserWithPermission(
    request,
    isOwner ? `delete:note:own` : `delete:note:any`
  );
  await prisma$1.note.delete({ where: { id: note.id } });
  return redirectWithToast(`/users/${note.owner.username}/notes`, {
    type: "success",
    title: "Success",
    description: "Your note has been deleted."
  });
}
function NoteRoute() {
  const data = useLoaderData();
  const user = useOptionalUser();
  const isOwner = (user == null ? void 0 : user.id) === data.note.ownerId;
  const canDelete = userHasPermission(
    user,
    isOwner ? `delete:note:own` : `delete:note:any`
  );
  const displayBar = canDelete || isOwner;
  return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col px-10", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-2 pt-12 text-h2 lg:mb-6", children: data.note.title }),
    /* @__PURE__ */ jsxs("div", { className: `${displayBar ? "pb-24" : "pb-12"} overflow-y-auto`, children: [
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-5 py-5", children: data.note.images.map((image) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: getNoteImgSrc(image.id), children: /* @__PURE__ */ jsx(
        "img",
        {
          src: getNoteImgSrc(image.id),
          alt: image.altText ?? "",
          className: "h-32 w-32 rounded-lg object-cover"
        }
      ) }) }, image.id)) }),
      /* @__PURE__ */ jsx("p", { className: "whitespace-break-spaces text-sm md:text-lg", children: data.note.content })
    ] }),
    displayBar ? /* @__PURE__ */ jsxs("div", { className: floatingToolbarClassName, children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-foreground/90 max-[524px]:hidden", children: /* @__PURE__ */ jsxs(Icon, { name: "clock", className: "scale-125", children: [
        data.timeAgo,
        " ago"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4", children: [
        canDelete ? /* @__PURE__ */ jsx(DeleteNote, { id: data.note.id }) : null,
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            className: "min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0",
            children: /* @__PURE__ */ jsx(Link, { to: "edit", children: /* @__PURE__ */ jsx(Icon, { name: "pencil-1", className: "scale-125 max-md:scale-150", children: /* @__PURE__ */ jsx("span", { className: "max-md:hidden", children: "Edit" }) }) })
          }
        )
      ] })
    ] }) : null
  ] });
}
function DeleteNote({ id }) {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form] = useForm({
    id: "delete-note",
    lastResult: actionData == null ? void 0 : actionData.result
  });
  return /* @__PURE__ */ jsxs(Form, { method: "POST", ...getFormProps(form), children: [
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "noteId", value: id }),
    /* @__PURE__ */ jsx(
      StatusButton,
      {
        type: "submit",
        name: "intent",
        value: "delete-note",
        variant: "destructive",
        status: isPending ? "pending" : form.status ?? "idle",
        disabled: isPending,
        className: "w-full max-md:aspect-square max-md:px-0",
        children: /* @__PURE__ */ jsx(Icon, { name: "trash", className: "scale-125 max-md:scale-150", children: /* @__PURE__ */ jsx("span", { className: "max-md:hidden", children: "Delete" }) })
      }
    ),
    /* @__PURE__ */ jsx(ErrorList, { errors: form.errors, id: form.errorId })
  ] });
}
const meta$1 = ({ data, params, matches }) => {
  var _a2;
  const notesMatch = matches.find(
    (m) => m.id === "routes/users+/$username_+/notes"
  );
  const displayName = ((_a2 = notesMatch == null ? void 0 : notesMatch.data) == null ? void 0 : _a2.owner.name) ?? params.username;
  const noteTitle = (data == null ? void 0 : data.note.title) ?? "Note";
  const noteContentsSummary = data && data.note.content.length > 100 ? (data == null ? void 0 : data.note.content.slice(0, 97)) + "..." : "No content";
  return [
    { title: `${noteTitle} | ${displayName}'s Notes | Epic Notes` },
    {
      name: "description",
      content: noteContentsSummary
    }
  ];
};
function ErrorBoundary$2() {
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        403: () => /* @__PURE__ */ jsx("p", { children: "You are not allowed to do that" }),
        404: ({ params }) => /* @__PURE__ */ jsxs("p", { children: [
          'No note with the id "',
          params.noteId,
          '" exists'
        ] })
      }
    }
  );
}
const route43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DeleteNote,
  ErrorBoundary: ErrorBoundary$2,
  action: action$1,
  default: NoteRoute,
  loader: loader$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const titleMinLength = 1;
const titleMaxLength = 100;
const contentMinLength = 1;
const contentMaxLength = 1e4;
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ImageFieldsetSchema = z.object({
  id: z.string().optional(),
  file: z.instanceof(File).optional().refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 3MB"),
  altText: z.string().optional()
});
const NoteEditorSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(titleMinLength).max(titleMaxLength),
  content: z.string().min(contentMinLength).max(contentMaxLength),
  images: z.array(ImageFieldsetSchema).max(5).optional()
});
function NoteEditor({
  note
}) {
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "note-editor",
    constraint: getZodConstraint(NoteEditorSchema),
    lastResult: actionData == null ? void 0 : actionData.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NoteEditorSchema });
    },
    defaultValue: {
      ...note,
      images: (note == null ? void 0 : note.images) ?? [{}]
    },
    shouldRevalidate: "onBlur"
  });
  const imageList = fields.images.getFieldList();
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsxs(FormProvider, { context: form.context, children: [
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        className: "flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12",
        ...getFormProps(form),
        encType: "multipart/form-data",
        children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "hidden" }),
          note ? /* @__PURE__ */ jsx("input", { type: "hidden", name: "id", value: note.id }) : null,
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsx(
              Field,
              {
                labelProps: { children: "Title" },
                inputProps: {
                  autoFocus: true,
                  ...getInputProps(fields.title, { type: "text" })
                },
                errors: fields.title.errors
              }
            ),
            /* @__PURE__ */ jsx(
              TextareaField,
              {
                labelProps: { children: "Content" },
                textareaProps: {
                  ...getTextareaProps(fields.content)
                },
                errors: fields.content.errors
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Images" }),
              /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-4", children: imageList.map((image, index) => {
                console.log("image.key", image.key);
                return /* @__PURE__ */ jsxs(
                  "li",
                  {
                    className: "relative border-b-2 border-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          className: "absolute right-0 top-0 text-foreground-destructive",
                          ...form.remove.getButtonProps({
                            name: fields.images.name,
                            index
                          }),
                          children: [
                            /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: /* @__PURE__ */ jsx(Icon, { name: "cross-1" }) }),
                            " ",
                            /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
                              "Remove image ",
                              index + 1
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(ImageChooser, { meta: image })
                    ]
                  },
                  image.key
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: "mt-3",
                ...form.insert.getButtonProps({ name: fields.images.name }),
                children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: /* @__PURE__ */ jsx(Icon, { name: "plus", children: "Image" }) }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Add image" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(ErrorList, { id: form.errorId, errors: form.errors })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: floatingToolbarClassName, children: [
      /* @__PURE__ */ jsx(Button, { variant: "destructive", ...form.reset.getButtonProps(), children: "Reset" }),
      /* @__PURE__ */ jsx(
        StatusButton,
        {
          form: form.id,
          type: "submit",
          disabled: isPending,
          status: isPending ? "pending" : "idle",
          children: "Submit"
        }
      )
    ] })
  ] }) });
}
function ImageChooser({ meta: meta2 }) {
  const fields = meta2.getFieldset();
  const existingImage = Boolean(fields.id.initialValue);
  const [previewImage, setPreviewImage] = useState(
    fields.id.initialValue ? getNoteImgSrc(fields.id.initialValue) : null
  );
  const [altText, setAltText] = useState(fields.altText.initialValue ?? "");
  return /* @__PURE__ */ jsxs("fieldset", { ...getFieldsetProps(meta2), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-32", children: [
        /* @__PURE__ */ jsx("div", { className: "relative h-32 w-32", children: /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: fields.file.id,
            className: cn("group absolute h-32 w-32 rounded-lg", {
              "bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100": !previewImage,
              "cursor-pointer focus-within:ring-2": !existingImage
            }),
            children: [
              previewImage ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: previewImage,
                    alt: altText ?? "",
                    className: "h-32 w-32 rounded-lg object-cover"
                  }
                ),
                existingImage ? null : /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md", children: "new" })
              ] }) : /* @__PURE__ */ jsx("div", { className: "flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground", children: /* @__PURE__ */ jsx(Icon, { name: "plus" }) }),
              existingImage ? /* @__PURE__ */ jsx("input", { ...getInputProps(fields.id, { type: "hidden" }) }) : null,
              /* @__PURE__ */ jsx(
                "input",
                {
                  "aria-label": "Image",
                  className: "absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0",
                  onChange: (event) => {
                    var _a2;
                    const file = (_a2 = event.target.files) == null ? void 0 : _a2[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewImage(null);
                    }
                  },
                  accept: "image/*",
                  ...getInputProps(fields.file, { type: "file" })
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: /* @__PURE__ */ jsx(ErrorList, { id: fields.file.errorId, errors: fields.file.errors }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: fields.altText.id, children: "Alt Text" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            onChange: (e) => setAltText(e.currentTarget.value),
            ...getTextareaProps(fields.altText)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: /* @__PURE__ */ jsx(
          ErrorList,
          {
            id: fields.altText.errorId,
            errors: fields.altText.errors
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: /* @__PURE__ */ jsx(ErrorList, { id: meta2.errorId, errors: meta2.errors }) })
  ] });
}
function imageHasFile(image) {
  var _a2, _b;
  return Boolean(((_a2 = image.file) == null ? void 0 : _a2.size) && ((_b = image.file) == null ? void 0 : _b.size) > 0);
}
function imageHasId(image) {
  return image.id != null;
}
async function action({ request }) {
  const userId = await requireUserId(request);
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE })
  );
  const submission = await parseWithZod(formData, {
    schema: NoteEditorSchema.superRefine(async (data, ctx) => {
      if (!data.id)
        return;
      const note = await prisma$1.note.findUnique({
        select: { id: true },
        where: { id: data.id, ownerId: userId }
      });
      if (!note) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Note not found"
        });
      }
    }).transform(async ({ images = [], ...data }) => {
      return {
        ...data,
        imageUpdates: await Promise.all(
          images.filter(imageHasId).map(async (i) => {
            if (imageHasFile(i)) {
              return {
                id: i.id,
                altText: i.altText,
                contentType: i.file.type,
                blob: Buffer.from(await i.file.arrayBuffer())
              };
            } else {
              return {
                id: i.id,
                altText: i.altText
              };
            }
          })
        ),
        newImages: await Promise.all(
          images.filter(imageHasFile).filter((i) => !i.id).map(async (image) => {
            return {
              altText: image.altText,
              contentType: image.file.type,
              blob: Buffer.from(await image.file.arrayBuffer())
            };
          })
        )
      };
    }),
    async: true
  });
  if (submission.status !== "success") {
    return json(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 }
    );
  }
  const {
    id: noteId,
    title,
    content,
    imageUpdates = [],
    newImages = []
  } = submission.value;
  const updatedNote = await prisma$1.note.upsert({
    select: { id: true, owner: { select: { username: true } } },
    where: { id: noteId ?? "__new_note__" },
    create: {
      ownerId: userId,
      title,
      content,
      images: { create: newImages }
    },
    update: {
      title,
      content,
      images: {
        deleteMany: { id: { notIn: imageUpdates.map((i) => i.id) } },
        updateMany: imageUpdates.map((updates) => ({
          where: { id: updates.id },
          data: { ...updates, id: updates.blob ? createId() : updates.id }
        })),
        create: newImages
      }
    }
  });
  return redirect$1(
    `/users/${updatedNote.owner.username}/notes/${updatedNote.id}`
  );
}
async function loader$2({ params, request }) {
  const userId = await requireUserId(request);
  const note = await prisma$1.note.findFirst({
    select: {
      id: true,
      title: true,
      content: true,
      images: {
        select: {
          id: true,
          altText: true
        }
      }
    },
    where: {
      id: params.noteId,
      ownerId: userId
    }
  });
  invariantResponse(note, "Not found", { status: 404 });
  return json({ note });
}
function NoteEdit() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsx(NoteEditor, { note: data.note });
}
function ErrorBoundary$1() {
  return /* @__PURE__ */ jsx(
    GeneralErrorBoundary,
    {
      statusHandlers: {
        404: ({ params }) => /* @__PURE__ */ jsxs("p", { children: [
          'No note with the id "',
          params.noteId,
          '" exists'
        ] })
      }
    }
  );
}
const route44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  action,
  default: NoteEdit,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function NotesIndexRoute() {
  return /* @__PURE__ */ jsx("div", { className: "container pt-12", children: /* @__PURE__ */ jsx("p", { className: "text-body-md", children: "Select a note" }) });
}
const meta = ({ params, matches }) => {
  var _a2, _b;
  const notesMatch = matches.find(
    (m) => m.id === "routes/users+/$username_+/notes"
  );
  const displayName = ((_a2 = notesMatch == null ? void 0 : notesMatch.data) == null ? void 0 : _a2.owner.name) ?? params.username;
  const noteCount = ((_b = notesMatch == null ? void 0 : notesMatch.data) == null ? void 0 : _b.owner.notes.length) ?? 0;
  const notesText = noteCount === 1 ? "note" : "notes";
  return [
    { title: `${displayName}'s Notes | Epic Notes` },
    {
      name: "description",
      content: `Checkout ${displayName}'s ${noteCount} ${notesText} on Epic Notes`
    }
  ];
};
const route45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotesIndexRoute,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({ request }) {
  await requireUserId(request);
  return json({});
}
const route46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: NoteEditor,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const UserSearchResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().nullable(),
  imageId: z.string().nullable()
});
const UserSearchResultsSchema = z.array(UserSearchResultSchema);
async function loader({ request }) {
  const searchTerm = new URL(request.url).searchParams.get("search");
  if (searchTerm === "") {
    return redirect$1("/users");
  }
  const like = `%${searchTerm ?? ""}%`;
  const rawUsers = await prisma$1.$queryRaw`
		SELECT User.id, User.username, User.name, UserImage.id AS imageId
		FROM User
		LEFT JOIN UserImage ON User.id = UserImage.userId
		WHERE User.username LIKE ${like}
		OR User.name LIKE ${like}
		ORDER BY (
			SELECT Note.updatedAt
			FROM Note
			WHERE Note.ownerId = User.id
			ORDER BY Note.updatedAt DESC
			LIMIT 1
		) DESC
		LIMIT 50
	`;
  const result = UserSearchResultsSchema.safeParse(rawUsers);
  if (!result.success) {
    return json({ status: "error", error: result.error.message }, {
      status: 400
    });
  }
  return json({ status: "idle", users: result.data });
}
function UsersRoute() {
  const data = useLoaderData();
  const isPending = useDelayedIsPending({
    formMethod: "GET",
    formAction: "/users"
  });
  if (data.status === "error") {
    console.error(data.error);
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mb-48 mt-36 flex flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-h1", children: "Epic Notes Users" }),
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-[700px]", children: /* @__PURE__ */ jsx(SearchBar, { status: data.status, autoFocus: true, autoSubmit: true }) }),
    /* @__PURE__ */ jsx("main", { children: data.status === "idle" ? data.users.length ? /* @__PURE__ */ jsx(
      "ul",
      {
        className: cn(
          "flex w-full flex-wrap items-center justify-center gap-4 delay-200",
          { "opacity-50": isPending }
        ),
        children: data.users.map((user) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: user.username,
            className: "flex h-36 w-44 flex-col items-center justify-center rounded-lg bg-muted px-5 py-3",
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  alt: user.name ?? user.username,
                  src: getUserImgSrc(user.imageId),
                  className: "h-16 w-16 rounded-full"
                }
              ),
              user.name ? /* @__PURE__ */ jsx("span", { className: "w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-body-md", children: user.name }) : null,
              /* @__PURE__ */ jsx("span", { className: "w-full overflow-hidden text-ellipsis text-center text-body-sm text-muted-foreground", children: user.username })
            ]
          }
        ) }, user.id))
      }
    ) : /* @__PURE__ */ jsx("p", { children: "No users found" }) : data.status === "error" ? /* @__PURE__ */ jsx(ErrorList, { errors: ["There was an error parsing the results"] }) : null })
  ] });
}
function ErrorBoundary() {
  return /* @__PURE__ */ jsx(GeneralErrorBoundary, {});
}
const route47 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: UsersRoute,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DKlv6gla.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DU47gpLL.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/components-C2HTMhgG.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/label-Bak8eTW5.js", "/assets/status-button-Bx4F4H9E.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/honeypot-Cga4G5SV.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/search-bar-DtaryT39.js", "/assets/parse-Cj2OtakU.js", "/assets/user-DifDgJky.js", "/assets/performance-DM0PS3ML.js"], "css": [] }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/_-XjV_JlOP.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/icon-CC3MP7l8.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes/_auth+/auth.$provider": { "id": "routes/_auth+/auth.$provider", "parentId": "root", "path": "auth/:provider", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._provider-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_auth+/auth.$provider.callback": { "id": "routes/_auth+/auth.$provider.callback", "parentId": "routes/_auth+/auth.$provider", "path": "callback", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._provider.callback-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_auth+/forgot-password": { "id": "routes/_auth+/forgot-password", "parentId": "root", "path": "forgot-password", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/forgot-password-C8bgVfN2.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/honeypot-Cga4G5SV.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/login": { "id": "routes/_auth+/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/login-4uAotnuo.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/status-button-Bx4F4H9E.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/honeypot-Cga4G5SV.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/spacer-_kxp_vdK.js", "/assets/connections-Cz6fFBks.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/logout": { "id": "routes/_auth+/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_auth+/onboarding": { "id": "routes/_auth+/onboarding", "parentId": "root", "path": "onboarding", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/onboarding-CcNnfuHZ.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/honeypot-Cga4G5SV.js", "/assets/forms-O3akMyig.js", "/assets/spacer-_kxp_vdK.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/onboarding_.$provider": { "id": "routes/_auth+/onboarding_.$provider", "parentId": "root", "path": "onboarding/:provider", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/onboarding_._provider-Clr487UX.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/spacer-_kxp_vdK.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/reset-password": { "id": "routes/_auth+/reset-password", "parentId": "root", "path": "reset-password", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/reset-password-C6bVvSxH.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/signup": { "id": "routes/_auth+/signup", "parentId": "root", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/signup-C6PJwDwW.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/status-button-Bx4F4H9E.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/honeypot-Cga4G5SV.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/connections-Cz6fFBks.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_auth+/verify": { "id": "routes/_auth+/verify", "parentId": "root", "path": "verify", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/verify-BYEPBbzA.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/honeypot-Cga4G5SV.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/spacer-_kxp_vdK.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/_marketing+/about": { "id": "routes/_marketing+/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-DEtQIx41.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js"], "css": [] }, "routes/_marketing+/index": { "id": "routes/_marketing+/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/index-CYHa_FEL.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/index-DbU3sxCe.js", "/assets/misc-CxaYal_B.js", "/assets/tooltip-wwqaYhkn.js"], "css": [] }, "routes/_marketing+/privacy": { "id": "routes/_marketing+/privacy", "parentId": "root", "path": "privacy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/privacy-CJItoDsU.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js"], "css": [] }, "routes/_marketing+/support": { "id": "routes/_marketing+/support", "parentId": "root", "path": "support", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/support-DHDUX-Oe.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js"], "css": [] }, "routes/_marketing+/tailwind-preset": { "id": "routes/_marketing+/tailwind-preset", "parentId": "root", "path": "tailwind-preset", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/tailwind-preset-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_marketing+/tos": { "id": "routes/_marketing+/tos", "parentId": "root", "path": "tos", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/tos-keZemvP4.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js"], "css": [] }, "routes/_seo+/robots[.]txt": { "id": "routes/_seo+/robots[.]txt", "parentId": "root", "path": "robots.txt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/robots_._txt-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_seo+/sitemap[.]xml": { "id": "routes/_seo+/sitemap[.]xml", "parentId": "root", "path": "sitemap.xml", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sitemap_._xml-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin+/cache": { "id": "routes/admin+/cache", "parentId": "root", "path": "admin/cache", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/cache-DrrqvmNR.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/spacer-_kxp_vdK.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes/admin+/cache_.lru.$cacheKey": { "id": "routes/admin+/cache_.lru.$cacheKey", "parentId": "root", "path": "admin/cache/lru/:cacheKey", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cache_.lru._cacheKey-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin+/cache_.sqlite": { "id": "routes/admin+/cache_.sqlite", "parentId": "root", "path": "admin/cache/sqlite", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cache_.sqlite-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin+/cache_.sqlite.$cacheKey": { "id": "routes/admin+/cache_.sqlite.$cacheKey", "parentId": "routes/admin+/cache_.sqlite", "path": ":cacheKey", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cache_.sqlite._cacheKey-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/me": { "id": "routes/me", "parentId": "root", "path": "me", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/me-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/download-user-data": { "id": "routes/resources+/download-user-data", "parentId": "root", "path": "resources/download-user-data", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/download-user-data-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/healthcheck": { "id": "routes/resources+/healthcheck", "parentId": "root", "path": "resources/healthcheck", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/healthcheck-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/note-images.$imageId": { "id": "routes/resources+/note-images.$imageId", "parentId": "root", "path": "resources/note-images/:imageId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/note-images._imageId-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/theme-switch": { "id": "routes/resources+/theme-switch", "parentId": "root", "path": "resources/theme-switch", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/theme-switch-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/resources+/user-images.$imageId": { "id": "routes/resources+/user-images.$imageId", "parentId": "root", "path": "resources/user-images/:imageId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/user-images._imageId-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/settings+/profile": { "id": "routes/settings+/profile", "parentId": "root", "path": "settings/profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile-Ca6JOM2M.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/components-C2HTMhgG.js", "/assets/index-BeXw7Xwl.js", "/assets/spacer-_kxp_vdK.js", "/assets/icon-CC3MP7l8.js", "/assets/user-DifDgJky.js"], "css": [] }, "routes/settings+/profile.change-email": { "id": "routes/settings+/profile.change-email", "parentId": "routes/settings+/profile", "path": "change-email", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.change-email-D5A4idJw.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/settings+/profile.connections": { "id": "routes/settings+/profile.connections", "parentId": "routes/settings+/profile", "path": "connections", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.connections-nQM8T2xY.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/status-button-Bx4F4H9E.js", "/assets/connections-Cz6fFBks.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes/settings+/profile.index": { "id": "routes/settings+/profile.index", "parentId": "routes/settings+/profile", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.index-D_bUgvDX.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/settings+/profile.password": { "id": "routes/settings+/profile.password", "parentId": "routes/settings+/profile", "path": "password", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.password-9eb2qJZT.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/settings+/profile.password_.create": { "id": "routes/settings+/profile.password_.create", "parentId": "routes/settings+/profile", "path": "password/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.password_.create-DGtucOEW.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-validation-CpoOsRJY.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/settings+/profile.photo": { "id": "routes/settings+/profile.photo", "parentId": "routes/settings+/profile", "path": "photo", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.photo-DqOBFlUA.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/settings+/profile.two-factor": { "id": "routes/settings+/profile.two-factor", "parentId": "routes/settings+/profile", "path": "two-factor", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.two-factor-dlWApREH.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/icon-CC3MP7l8.js"], "css": [] }, "routes/settings+/profile.two-factor.disable": { "id": "routes/settings+/profile.two-factor.disable", "parentId": "routes/settings+/profile.two-factor", "path": "disable", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.two-factor.disable-D_-jAyfE.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes/settings+/profile.two-factor.index": { "id": "routes/settings+/profile.two-factor.index", "parentId": "routes/settings+/profile.two-factor", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.two-factor.index-D9TY_bOs.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js"], "css": [] }, "routes/settings+/profile.two-factor.verify": { "id": "routes/settings+/profile.two-factor.verify", "parentId": "routes/settings+/profile.two-factor", "path": "verify", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile.two-factor.verify-DXby7ISc.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/users+/$username": { "id": "routes/users+/$username", "parentId": "root", "path": "users/:username", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/_username-DhgIcrno.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/components-C2HTMhgG.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/spacer-_kxp_vdK.js", "/assets/button-xs8ZcSgc.js", "/assets/icon-CC3MP7l8.js", "/assets/user-DifDgJky.js"], "css": [] }, "routes/users+/$username_+/notes": { "id": "routes/users+/$username_+/notes", "parentId": "root", "path": "users/:username/notes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/notes-d9d4KKiV.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/components-C2HTMhgG.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/icon-CC3MP7l8.js", "/assets/user-DifDgJky.js"], "css": [] }, "routes/users+/$username_+/notes.$noteId": { "id": "routes/users+/$username_+/notes.$noteId", "parentId": "routes/users+/$username_+/notes", "path": ":noteId", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/notes._noteId-DRBvn7B6.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/components-C2HTMhgG.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/floating-toolbar-B1U7BWws.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/user-DifDgJky.js", "/assets/helpers-CMO8ncdm.js"], "css": [] }, "routes/users+/$username_+/notes.$noteId_.edit": { "id": "routes/users+/$username_+/notes.$noteId_.edit", "parentId": "routes/users+/$username_+/notes", "path": ":noteId/edit", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/notes._noteId_.edit-CZhzE2gC.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/floating-toolbar-B1U7BWws.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/notes.new-C-xpiaZc.js"], "css": [] }, "routes/users+/$username_+/notes.index": { "id": "routes/users+/$username_+/notes.index", "parentId": "routes/users+/$username_+/notes", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/notes.index-B7Jqqa_i.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js"], "css": [] }, "routes/users+/$username_+/notes.new": { "id": "routes/users+/$username_+/notes.new", "parentId": "routes/users+/$username_+/notes", "path": "new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/notes.new-C-xpiaZc.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-ikwP-usE.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/index-BeXw7Xwl.js", "/assets/helpers-CMO8ncdm.js", "/assets/parse-Cj2OtakU.js", "/assets/floating-toolbar-B1U7BWws.js", "/assets/forms-O3akMyig.js", "/assets/status-button-Bx4F4H9E.js", "/assets/components-C2HTMhgG.js", "/assets/constraint-BS8S8JXD.js"], "css": [] }, "routes/users+/index": { "id": "routes/users+/index", "parentId": "root", "path": "users/", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/index-BtGSky0B.js", "imports": ["/assets/jsx-runtime-D1yySo7E.js", "/assets/index-CcD7lzrX.js", "/assets/misc-CxaYal_B.js", "/assets/exports-BkEIprPr.js", "/assets/index-ikwP-usE.js", "/assets/index-DbU3sxCe.js", "/assets/button-xs8ZcSgc.js", "/assets/label-Bak8eTW5.js", "/assets/icon-CC3MP7l8.js", "/assets/tooltip-wwqaYhkn.js", "/assets/status-button-Bx4F4H9E.js", "/assets/error-boundary-B0NZhsrC.js", "/assets/forms-O3akMyig.js", "/assets/search-bar-DtaryT39.js", "/assets/components-C2HTMhgG.js"], "css": [] } }, "url": "/assets/manifest-b8c74ae6.js", "version": "b8c74ae6" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_auth+/auth.$provider": {
    id: "routes/_auth+/auth.$provider",
    parentId: "root",
    path: "auth/:provider",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_auth+/auth.$provider.callback": {
    id: "routes/_auth+/auth.$provider.callback",
    parentId: "routes/_auth+/auth.$provider",
    path: "callback",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_auth+/forgot-password": {
    id: "routes/_auth+/forgot-password",
    parentId: "root",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_auth+/login": {
    id: "routes/_auth+/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_auth+/logout": {
    id: "routes/_auth+/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_auth+/onboarding": {
    id: "routes/_auth+/onboarding",
    parentId: "root",
    path: "onboarding",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_auth+/onboarding_.$provider": {
    id: "routes/_auth+/onboarding_.$provider",
    parentId: "root",
    path: "onboarding/:provider",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_auth+/reset-password": {
    id: "routes/_auth+/reset-password",
    parentId: "root",
    path: "reset-password",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_auth+/signup": {
    id: "routes/_auth+/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_auth+/verify": {
    id: "routes/_auth+/verify",
    parentId: "root",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_marketing+/about": {
    id: "routes/_marketing+/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/_marketing+/index": {
    id: "routes/_marketing+/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route13
  },
  "routes/_marketing+/privacy": {
    id: "routes/_marketing+/privacy",
    parentId: "root",
    path: "privacy",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/_marketing+/support": {
    id: "routes/_marketing+/support",
    parentId: "root",
    path: "support",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_marketing+/tailwind-preset": {
    id: "routes/_marketing+/tailwind-preset",
    parentId: "root",
    path: "tailwind-preset",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_marketing+/tos": {
    id: "routes/_marketing+/tos",
    parentId: "root",
    path: "tos",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/_seo+/robots[.]txt": {
    id: "routes/_seo+/robots[.]txt",
    parentId: "root",
    path: "robots.txt",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/_seo+/sitemap[.]xml": {
    id: "routes/_seo+/sitemap[.]xml",
    parentId: "root",
    path: "sitemap.xml",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/admin+/cache": {
    id: "routes/admin+/cache",
    parentId: "root",
    path: "admin/cache",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/admin+/cache_.lru.$cacheKey": {
    id: "routes/admin+/cache_.lru.$cacheKey",
    parentId: "root",
    path: "admin/cache/lru/:cacheKey",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/admin+/cache_.sqlite": {
    id: "routes/admin+/cache_.sqlite",
    parentId: "root",
    path: "admin/cache/sqlite",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/admin+/cache_.sqlite.$cacheKey": {
    id: "routes/admin+/cache_.sqlite.$cacheKey",
    parentId: "routes/admin+/cache_.sqlite",
    path: ":cacheKey",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/me": {
    id: "routes/me",
    parentId: "root",
    path: "me",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/resources+/download-user-data": {
    id: "routes/resources+/download-user-data",
    parentId: "root",
    path: "resources/download-user-data",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/resources+/healthcheck": {
    id: "routes/resources+/healthcheck",
    parentId: "root",
    path: "resources/healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/resources+/note-images.$imageId": {
    id: "routes/resources+/note-images.$imageId",
    parentId: "root",
    path: "resources/note-images/:imageId",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/resources+/theme-switch": {
    id: "routes/resources+/theme-switch",
    parentId: "root",
    path: "resources/theme-switch",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/resources+/user-images.$imageId": {
    id: "routes/resources+/user-images.$imageId",
    parentId: "root",
    path: "resources/user-images/:imageId",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/settings+/profile": {
    id: "routes/settings+/profile",
    parentId: "root",
    path: "settings/profile",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/settings+/profile.change-email": {
    id: "routes/settings+/profile.change-email",
    parentId: "routes/settings+/profile",
    path: "change-email",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/settings+/profile.connections": {
    id: "routes/settings+/profile.connections",
    parentId: "routes/settings+/profile",
    path: "connections",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/settings+/profile.index": {
    id: "routes/settings+/profile.index",
    parentId: "routes/settings+/profile",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route33
  },
  "routes/settings+/profile.password": {
    id: "routes/settings+/profile.password",
    parentId: "routes/settings+/profile",
    path: "password",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/settings+/profile.password_.create": {
    id: "routes/settings+/profile.password_.create",
    parentId: "routes/settings+/profile",
    path: "password/create",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/settings+/profile.photo": {
    id: "routes/settings+/profile.photo",
    parentId: "routes/settings+/profile",
    path: "photo",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/settings+/profile.two-factor": {
    id: "routes/settings+/profile.two-factor",
    parentId: "routes/settings+/profile",
    path: "two-factor",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/settings+/profile.two-factor.disable": {
    id: "routes/settings+/profile.two-factor.disable",
    parentId: "routes/settings+/profile.two-factor",
    path: "disable",
    index: void 0,
    caseSensitive: void 0,
    module: route38
  },
  "routes/settings+/profile.two-factor.index": {
    id: "routes/settings+/profile.two-factor.index",
    parentId: "routes/settings+/profile.two-factor",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route39
  },
  "routes/settings+/profile.two-factor.verify": {
    id: "routes/settings+/profile.two-factor.verify",
    parentId: "routes/settings+/profile.two-factor",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: route40
  },
  "routes/users+/$username": {
    id: "routes/users+/$username",
    parentId: "root",
    path: "users/:username",
    index: void 0,
    caseSensitive: void 0,
    module: route41
  },
  "routes/users+/$username_+/notes": {
    id: "routes/users+/$username_+/notes",
    parentId: "root",
    path: "users/:username/notes",
    index: void 0,
    caseSensitive: void 0,
    module: route42
  },
  "routes/users+/$username_+/notes.$noteId": {
    id: "routes/users+/$username_+/notes.$noteId",
    parentId: "routes/users+/$username_+/notes",
    path: ":noteId",
    index: void 0,
    caseSensitive: void 0,
    module: route43
  },
  "routes/users+/$username_+/notes.$noteId_.edit": {
    id: "routes/users+/$username_+/notes.$noteId_.edit",
    parentId: "routes/users+/$username_+/notes",
    path: ":noteId/edit",
    index: void 0,
    caseSensitive: void 0,
    module: route44
  },
  "routes/users+/$username_+/notes.index": {
    id: "routes/users+/$username_+/notes.index",
    parentId: "routes/users+/$username_+/notes",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route45
  },
  "routes/users+/$username_+/notes.new": {
    id: "routes/users+/$username_+/notes.new",
    parentId: "routes/users+/$username_+/notes",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: route46
  },
  "routes/users+/index": {
    id: "routes/users+/index",
    parentId: "root",
    path: "users/",
    index: true,
    caseSensitive: void 0,
    module: route47
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
