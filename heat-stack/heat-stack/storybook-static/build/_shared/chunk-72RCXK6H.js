import {
  require_jsx_runtime
} from "/build/_shared/chunk-NMZL6IDN.js";
import {
  require_litefs_server
} from "/build/_shared/chunk-YROKGDF2.js";
import {
  HoneypotInputs,
  require_honeypot_server
} from "/build/_shared/chunk-5K67MMZF.js";
import {
  AuthenticityTokenInput,
  require_csrf_server
} from "/build/_shared/chunk-E55JX6V7.js";
import {
  ProviderConnectionForm,
  providerNames
} from "/build/_shared/chunk-RZHH4FHW.js";
import {
  require_session_server
} from "/build/_shared/chunk-SAJ3AEKV.js";
import {
  require_toast_server
} from "/build/_shared/chunk-O7MTR2WV.js";
import {
  Spacer
} from "/build/_shared/chunk-4UQVKXCC.js";
import {
  require_verification_server
} from "/build/_shared/chunk-PIFLCODP.js";
import {
  EmailSchema,
  PasswordSchema,
  UsernameSchema
} from "/build/_shared/chunk-EJKYYODX.js";
import {
  getConstraint,
  parse
} from "/build/_shared/chunk-FSA34KBF.js";
import {
  StatusButton
} from "/build/_shared/chunk-OO2QJRJG.js";
import {
  require_auth_server
} from "/build/_shared/chunk-44XOYWRB.js";
import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import {
  CheckboxField,
  ErrorList,
  Field,
  helpers_exports,
  useForm
} from "/build/_shared/chunk-JXJ2XXPJ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  GeneralErrorBoundary
} from "/build/_shared/chunk-SUM65VYH.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams
} from "/build/_shared/chunk-DKP5DHW6.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:#app/utils/totp.server.ts
var require_totp_server = __commonJS({
  "empty-module:#app/utils/totp.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:#app/utils/email.server.ts
var require_email_server = __commonJS({
  "empty-module:#app/utils/email.server.ts"(exports, module) {
    module.exports = {};
  }
});

// node_modules/@react-email/container/dist/index.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Container = (_a) => {
  var _b = _a, {
    children,
    style
  } = _b, props = __objRest(_b, [
    "children",
    "style"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "table",
    __spreadProps(__spreadValues({
      align: "center",
      width: "100%"
    }, props), {
      border: 0,
      cellPadding: "0",
      cellSpacing: "0",
      role: "presentation",
      style: __spreadValues({ maxWidth: "37.5em" }, style),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { style: { width: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children }) }) })
    })
  );
};

// node_modules/@react-email/html/dist/index.mjs
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var __objRest2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Html = (_a) => {
  var _b = _a, {
    children,
    lang = "en",
    dir = "ltr"
  } = _b, props = __objRest2(_b, [
    "children",
    "lang",
    "dir"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("html", __spreadProps2(__spreadValues2({}, props), { dir, lang, children }));
};

// node_modules/@react-email/link/dist/index.mjs
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var __defProp3 = Object.defineProperty;
var __defProps3 = Object.defineProperties;
var __getOwnPropDescs3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols3 = Object.getOwnPropertySymbols;
var __hasOwnProp3 = Object.prototype.hasOwnProperty;
var __propIsEnum3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp3 = (obj, key, value) => key in obj ? __defProp3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp3.call(b, prop))
      __defNormalProp3(a, prop, b[prop]);
  if (__getOwnPropSymbols3)
    for (var prop of __getOwnPropSymbols3(b)) {
      if (__propIsEnum3.call(b, prop))
        __defNormalProp3(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps3 = (a, b) => __defProps3(a, __getOwnPropDescs3(b));
var __objRest3 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp3.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols3)
    for (var prop of __getOwnPropSymbols3(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum3.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Link2 = (_a) => {
  var _b = _a, {
    target = "_blank",
    style
  } = _b, props = __objRest3(_b, [
    "target",
    "style"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "a",
    __spreadProps3(__spreadValues3({}, props), {
      style: __spreadValues3({
        color: "#067df7",
        textDecoration: "none"
      }, style),
      target,
      children: props.children
    })
  );
};

// node_modules/@react-email/text/dist/index.mjs
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var __defProp4 = Object.defineProperty;
var __defProps4 = Object.defineProperties;
var __getOwnPropDescs4 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols4 = Object.getOwnPropertySymbols;
var __hasOwnProp4 = Object.prototype.hasOwnProperty;
var __propIsEnum4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp4 = (obj, key, value) => key in obj ? __defProp4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp4.call(b, prop))
      __defNormalProp4(a, prop, b[prop]);
  if (__getOwnPropSymbols4)
    for (var prop of __getOwnPropSymbols4(b)) {
      if (__propIsEnum4.call(b, prop))
        __defNormalProp4(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps4 = (a, b) => __defProps4(a, __getOwnPropDescs4(b));
var __objRest4 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp4.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols4)
    for (var prop of __getOwnPropSymbols4(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum4.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var Text = (_a) => {
  var _b = _a, { style } = _b, props = __objRest4(_b, ["style"]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "p",
    __spreadProps4(__spreadValues4({}, props), {
      style: __spreadValues4({
        fontSize: "14px",
        lineHeight: "24px",
        margin: "16px 0"
      }, style)
    })
  );
};

// app/routes/settings+/profile.change-email.tsx
var import_node3 = __toESM(require_node(), 1);

// app/routes/_auth+/verify.tsx
var import_node2 = __toESM(require_node(), 1);
var import_auth_server2 = __toESM(require_auth_server(), 1);
var import_csrf_server2 = __toESM(require_csrf_server(), 1);
var import_db_server2 = __toESM(require_db_server(), 1);
var import_honeypot_server2 = __toESM(require_honeypot_server(), 1);
var import_litefs_server = __toESM(require_litefs_server(), 1);
var import_toast_server2 = __toESM(require_toast_server(), 1);
var import_totp_server = __toESM(require_totp_server(), 1);

// app/routes/_auth+/login.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_honeypot_server = __toESM(require_honeypot_server(), 1);
var import_session_server = __toESM(require_session_server(), 1);
var import_toast_server = __toESM(require_toast_server(), 1);
var import_verification_server = __toESM(require_verification_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth+/login.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth+/login.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var LoginFormSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
  redirectTo: z.string().optional(),
  remember: z.boolean().optional()
});
function LoginPage() {
  _s();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "login-form",
    constraint: getConstraint(LoginFormSchema),
    defaultValue: {
      redirectTo
    },
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: LoginFormSchema
      });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex min-h-full flex-col justify-center pb-32 pt-20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto w-full max-w-md", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-3 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-h1", children: "Welcome back!" }, void 0, false, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 254,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." }, void 0, false, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 255,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/login.tsx",
      lineNumber: 253,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "xs" }, void 0, false, {
      fileName: "app/routes/_auth+/login.tsx",
      lineNumber: 259,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto w-full max-w-md px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "POST", ...form.props, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 264,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoneypotInputs, {}, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 265,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
          children: "Username"
        }, inputProps: {
          ...helpers_exports.input(fields.username),
          autoFocus: true,
          className: "lowercase"
        }, errors: fields.username.errors }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 266,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
          children: "Password"
        }, inputProps: helpers_exports.input(fields.password, {
          type: "password"
        }), errors: fields.password.errors }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 274,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxField, { labelProps: {
            htmlFor: fields.remember.id,
            children: "Remember me"
          }, buttonProps: helpers_exports.input(fields.remember, {
            type: "checkbox"
          }), errors: fields.remember.errors }, void 0, false, {
            fileName: "app/routes/_auth+/login.tsx",
            lineNumber: 281,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/forgot-password", className: "text-body-xs font-semibold", children: "Forgot password?" }, void 0, false, {
            fileName: "app/routes/_auth+/login.tsx",
            lineNumber: 288,
            columnNumber: 10
          }, this) }, void 0, false, {
            fileName: "app/routes/_auth+/login.tsx",
            lineNumber: 287,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 280,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { ...helpers_exports.input(fields.redirectTo, {
          type: "hidden"
        }) }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 294,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 297,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between gap-6 pt-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { className: "w-full", status: isPending ? "pending" : actionData?.status ?? "idle", type: "submit", disabled: isPending, children: "Log in" }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 300,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 299,
          columnNumber: 8
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 263,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3", children: providerNames.map((providerName) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProviderConnectionForm, { type: "Login", providerName, redirectTo }, void 0, false, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 307,
        columnNumber: 10
      }, this) }, providerName, false, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 306,
        columnNumber: 43
      }, this)) }, void 0, false, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 305,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-center gap-2 pt-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-muted-foreground", children: "New here?" }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 311,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: redirectTo ? `/signup?${encodeURIComponent(redirectTo)}` : "/signup", children: "Create an account" }, void 0, false, {
          fileName: "app/routes/_auth+/login.tsx",
          lineNumber: 312,
          columnNumber: 8
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/login.tsx",
        lineNumber: 310,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/login.tsx",
      lineNumber: 262,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth+/login.tsx",
      lineNumber: 261,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/login.tsx",
    lineNumber: 252,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth+/login.tsx",
    lineNumber: 251,
    columnNumber: 10
  }, this);
}
_s(LoginPage, "pOytQzQfSlfERSUoCdV/IF0+RIo=", false, function() {
  return [useActionData, useIsPending, useSearchParams, useForm];
});
_c = LoginPage;
var meta = () => {
  return [{
    title: "Login to Epic Notes"
  }];
};
function ErrorBoundary() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GeneralErrorBoundary, {}, void 0, false, {
    fileName: "app/routes/_auth+/login.tsx",
    lineNumber: 331,
    columnNumber: 10
  }, this);
}
_c2 = ErrorBoundary;
var _c;
var _c2;
$RefreshReg$(_c, "LoginPage");
$RefreshReg$(_c2, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/_auth+/verify.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth+/verify.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth+/verify.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var codeQueryParam = "code";
var targetQueryParam = "target";
var typeQueryParam = "type";
var redirectToQueryParam = "redirectTo";
var types = ["onboarding", "reset-password", "change-email", "2fa"];
var VerificationTypeSchema = z.enum(types);
var VerifySchema = z.object({
  [codeQueryParam]: z.string().min(6).max(6),
  [typeQueryParam]: VerificationTypeSchema,
  [targetQueryParam]: z.string(),
  [redirectToQueryParam]: z.string().optional()
});
function VerifyRoute() {
  _s2();
  const [searchParams] = useSearchParams();
  const isPending = useIsPending();
  const actionData = useActionData();
  const parsedType = VerificationTypeSchema.safeParse(searchParams.get(typeQueryParam));
  const type = parsedType.success ? parsedType.data : null;
  const checkEmail = /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h1", { className: "text-h1", children: "Check your email" }, void 0, false, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 274,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "mt-3 text-body-md text-muted-foreground", children: "We've sent you a code to verify your email address." }, void 0, false, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 275,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/verify.tsx",
    lineNumber: 273,
    columnNumber: 22
  }, this);
  const headings = {
    onboarding: checkEmail,
    "reset-password": checkEmail,
    "change-email": checkEmail,
    "2fa": /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h1", { className: "text-h1", children: "Check your 2FA app" }, void 0, false, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 284,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "mt-3 text-body-md text-muted-foreground", children: "Please enter your 2FA code to verify your identity." }, void 0, false, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 285,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 283,
      columnNumber: 12
    }, this)
  };
  const [form, fields] = useForm({
    id: "verify-form",
    constraint: getConstraint(VerifySchema),
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: VerifySchema
      });
    },
    defaultValue: {
      code: searchParams.get(codeQueryParam) ?? "",
      type,
      target: searchParams.get(targetQueryParam) ?? "",
      redirectTo: searchParams.get(redirectToQueryParam) ?? ""
    }
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("main", { className: "container flex flex-col justify-center pb-32 pt-20", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "text-center", children: type ? headings[type] : "Invalid Verification Type" }, void 0, false, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 309,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Spacer, { size: "xs" }, void 0, false, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 313,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mx-auto flex w-72 max-w-full flex-col justify-center gap-1", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 317,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 316,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex w-full gap-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Form, { method: "POST", ...form.props, className: "flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 321,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(HoneypotInputs, {}, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 322,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Field, { labelProps: {
          htmlFor: fields[codeQueryParam].id,
          children: "Code"
        }, inputProps: helpers_exports.input(fields[codeQueryParam]), errors: fields[codeQueryParam].errors }, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 323,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { ...helpers_exports.input(fields[typeQueryParam], {
          type: "hidden"
        }) }, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 327,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { ...helpers_exports.input(fields[targetQueryParam], {
          type: "hidden"
        }) }, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 330,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { ...helpers_exports.input(fields[redirectToQueryParam], {
          type: "hidden"
        }) }, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 333,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(StatusButton, { className: "w-full", status: isPending ? "pending" : actionData?.status ?? "idle", type: "submit", disabled: isPending, children: "Submit" }, void 0, false, {
          fileName: "app/routes/_auth+/verify.tsx",
          lineNumber: 336,
          columnNumber: 7
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 320,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/_auth+/verify.tsx",
        lineNumber: 319,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/verify.tsx",
      lineNumber: 315,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/verify.tsx",
    lineNumber: 308,
    columnNumber: 10
  }, this);
}
_s2(VerifyRoute, "mdQnfHSnsVqWxr+aBh52a6+GYjY=", false, function() {
  return [useSearchParams, useIsPending, useActionData, useForm];
});
_c3 = VerifyRoute;
function ErrorBoundary2() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(GeneralErrorBoundary, {}, void 0, false, {
    fileName: "app/routes/_auth+/verify.tsx",
    lineNumber: 349,
    columnNumber: 10
  }, this);
}
_c22 = ErrorBoundary2;
var _c3;
var _c22;
$RefreshReg$(_c3, "VerifyRoute");
$RefreshReg$(_c22, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/settings+/profile.change-email.tsx
var import_auth_server3 = __toESM(require_auth_server(), 1);
var import_csrf_server3 = __toESM(require_csrf_server(), 1);
var import_db_server3 = __toESM(require_db_server(), 1);
var import_email_server = __toESM(require_email_server(), 1);
var import_toast_server3 = __toESM(require_toast_server(), 1);
var import_verification_server2 = __toESM(require_verification_server(), 1);
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.change-email.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.change-email.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Icon, { name: "envelope-closed", children: "Change Email" }, void 0, false, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 42,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
var ChangeEmailSchema = z.object({
  email: EmailSchema
});
function EmailChangeEmail({
  verifyUrl,
  otp
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Container, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: "Epic Notes Email Change" }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 202,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 201,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: [
      "Here's your verification code: ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("strong", { children: otp }, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 206,
        columnNumber: 38
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 205,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 204,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: "Or click the link:" }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 210,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 209,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link2, { href: verifyUrl, children: verifyUrl }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 212,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 200,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 199,
    columnNumber: 10
  }, this);
}
_c4 = EmailChangeEmail;
function EmailChangeNoticeEmail({
  userId
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Container, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: "Your Epic Notes email has been changed" }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 223,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 222,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: "We're writing to let you know that your Epic Notes email has been changed." }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 226,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 225,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: "If you changed your email address, then you can safely ignore this. But if you did not change your email address, then please contact support immediately." }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 232,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 231,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Text, { children: [
      "Your Account ID: ",
      userId
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 239,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 238,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 221,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 220,
    columnNumber: 10
  }, this);
}
_c23 = EmailChangeNoticeEmail;
function ChangeEmailIndex() {
  _s3();
  const data = useLoaderData();
  const actionData = useActionData();
  const [form, fields] = useForm({
    id: "change-email-form",
    constraint: getConstraint(ChangeEmailSchema),
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: ChangeEmailSchema
      });
    }
  });
  const isPending = useIsPending();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { className: "text-h1", children: "Change Email" }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 263,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: "You will receive an email at the new email address to confirm." }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 264,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: [
      "An email notice will also be sent to your old address ",
      data.user.email,
      "."
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 265,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "mx-auto mt-5 max-w-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Form, { method: "POST", ...form.props, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 270,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Field, { labelProps: {
        children: "New Email"
      }, inputProps: helpers_exports.input(fields.email), errors: fields.email.errors }, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 271,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ErrorList, { id: form.errorId, errors: form.errors }, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 274,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(StatusButton, { status: isPending ? "pending" : actionData?.status ?? "idle", children: "Send Confirmation" }, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 276,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.change-email.tsx",
        lineNumber: 275,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 269,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.change-email.tsx",
      lineNumber: 268,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.change-email.tsx",
    lineNumber: 262,
    columnNumber: 10
  }, this);
}
_s3(ChangeEmailIndex, "c7eLdpHqN4NN5gMZvVwHBI//RLo=", false, function() {
  return [useLoaderData, useActionData, useForm, useIsPending];
});
_c32 = ChangeEmailIndex;
var _c4;
var _c23;
var _c32;
$RefreshReg$(_c4, "EmailChangeEmail");
$RefreshReg$(_c23, "EmailChangeNoticeEmail");
$RefreshReg$(_c32, "ChangeEmailIndex");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  Container,
  Html,
  Link2 as Link,
  Text,
  require_email_server,
  handle,
  ChangeEmailIndex,
  require_totp_server,
  LoginPage,
  meta,
  ErrorBoundary,
  VerifyRoute,
  ErrorBoundary2
};
//# sourceMappingURL=/build/_shared/chunk-72RCXK6H.js.map
