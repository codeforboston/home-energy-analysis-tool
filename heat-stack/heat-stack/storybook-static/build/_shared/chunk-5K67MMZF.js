import {
  AuthenticityTokenInput,
  require_csrf_server
} from "/build/_shared/chunk-E55JX6V7.js";
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
  NameSchema,
  PasswordAndConfirmPasswordSchema,
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
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
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
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:#app/utils/honeypot.server.ts
var require_honeypot_server = __commonJS({
  "empty-module:#app/utils/honeypot.server.ts"(exports, module) {
    module.exports = {};
  }
});

// app/routes/_auth+/onboarding.tsx
var import_node = __toESM(require_node(), 1);

// node_modules/remix-utils/build/react/honeypot.js
var React = __toESM(require_react(), 1);
var HoneypotContext = React.createContext({});
function HoneypotInputs({ label = "Please leave this field blank" }) {
  let context = React.useContext(HoneypotContext);
  let { nameFieldName = "name__confirm", validFromFieldName = "from__confirm", encryptedValidFrom } = context;
  return React.createElement(
    "div",
    { id: `${nameFieldName}_wrap`, style: { display: "none" }, "aria-hidden": "true" },
    React.createElement("label", { htmlFor: nameFieldName }, label),
    React.createElement("input", { id: nameFieldName, name: nameFieldName, type: "text", defaultValue: "", autoComplete: "nope", tabIndex: -1 }),
    validFromFieldName && encryptedValidFrom ? React.createElement(
      React.Fragment,
      null,
      React.createElement("label", { htmlFor: validFromFieldName }, label),
      React.createElement("input", { id: validFromFieldName, name: validFromFieldName, type: "text", value: encryptedValidFrom, readOnly: true, autoComplete: "off", tabIndex: -1 })
    ) : null
  );
}

// app/routes/_auth+/onboarding.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/_auth+/onboarding.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth+/onboarding.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var SignupFormSchema = z.object({
  username: UsernameSchema,
  name: NameSchema,
  agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
    required_error: "You must agree to the terms of service and privacy policy"
  }),
  remember: z.boolean().optional(),
  redirectTo: z.string().optional()
}).and(PasswordAndConfirmPasswordSchema);
_c = SignupFormSchema;
var meta = () => {
  return [{
    title: "Setup Epic Notes Account"
  }];
};
function SignupRoute() {
  _s();
  const data = useLoaderData();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [form, fields] = useForm({
    id: "onboarding-form",
    constraint: getConstraint(SignupFormSchema),
    defaultValue: {
      redirectTo
    },
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: SignupFormSchema
      });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container flex min-h-full flex-col justify-center pb-32 pt-20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto w-full max-w-lg", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-3 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-h1", children: [
        "Welcome aboard ",
        data.email,
        "!"
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 188,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 189,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/onboarding.tsx",
      lineNumber: 187,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "xs" }, void 0, false, {
      fileName: "app/routes/_auth+/onboarding.tsx",
      lineNumber: 193,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "POST", className: "mx-auto min-w-full max-w-sm sm:min-w-[368px]", ...form.props, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 195,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoneypotInputs, {}, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 196,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.username.id,
        children: "Username"
      }, inputProps: {
        ...helpers_exports.input(fields.username),
        autoComplete: "username",
        className: "lowercase"
      }, errors: fields.username.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 197,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.name.id,
        children: "Name"
      }, inputProps: {
        ...helpers_exports.input(fields.name),
        autoComplete: "name"
      }, errors: fields.name.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 205,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.password.id,
        children: "Password"
      }, inputProps: {
        ...helpers_exports.input(fields.password, {
          type: "password"
        }),
        autoComplete: "new-password"
      }, errors: fields.password.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 212,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.confirmPassword.id,
        children: "Confirm Password"
      }, inputProps: {
        ...helpers_exports.input(fields.confirmPassword, {
          type: "password"
        }),
        autoComplete: "new-password"
      }, errors: fields.confirmPassword.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 222,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxField, { labelProps: {
        htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
        children: "Do you agree to our Terms of Service and Privacy Policy?"
      }, buttonProps: helpers_exports.input(fields.agreeToTermsOfServiceAndPrivacyPolicy, {
        type: "checkbox"
      }), errors: fields.agreeToTermsOfServiceAndPrivacyPolicy.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 232,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxField, { labelProps: {
        htmlFor: fields.remember.id,
        children: "Remember me"
      }, buttonProps: helpers_exports.input(fields.remember, {
        type: "checkbox"
      }), errors: fields.remember.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 238,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { ...helpers_exports.input(fields.redirectTo, {
        type: "hidden"
      }) }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 245,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 248,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between gap-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { className: "w-full", status: isPending ? "pending" : actionData?.status ?? "idle", type: "submit", disabled: isPending, children: "Create an account" }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 251,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding.tsx",
        lineNumber: 250,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/onboarding.tsx",
      lineNumber: 194,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/onboarding.tsx",
    lineNumber: 186,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth+/onboarding.tsx",
    lineNumber: 185,
    columnNumber: 10
  }, this);
}
_s(SignupRoute, "SbEzVWUNyTwM/qcAIjF6pChQLW8=", false, function() {
  return [useLoaderData, useActionData, useIsPending, useSearchParams, useForm];
});
_c2 = SignupRoute;
var _c;
var _c2;
$RefreshReg$(_c, "SignupFormSchema");
$RefreshReg$(_c2, "SignupRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  HoneypotInputs,
  require_honeypot_server,
  meta,
  SignupRoute
};
//# sourceMappingURL=/build/_shared/chunk-5K67MMZF.js.map
