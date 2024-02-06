import {
  Container,
  Html,
  Link as Link2,
  Text,
  require_email_server
} from "/build/_shared/chunk-72RCXK6H.js";
import "/build/_shared/chunk-NMZL6IDN.js";
import "/build/_shared/chunk-3H4MS3LM.js";
import "/build/_shared/chunk-YROKGDF2.js";
import {
  HoneypotInputs,
  require_honeypot_server
} from "/build/_shared/chunk-5K67MMZF.js";
import {
  AuthenticityTokenInput,
  require_csrf_server
} from "/build/_shared/chunk-E55JX6V7.js";
import "/build/_shared/chunk-RZHH4FHW.js";
import "/build/_shared/chunk-SAJ3AEKV.js";
import "/build/_shared/chunk-O7MTR2WV.js";
import "/build/_shared/chunk-4UQVKXCC.js";
import "/build/_shared/chunk-3QCDGXZW.js";
import "/build/_shared/chunk-PIFLCODP.js";
import {
  EmailSchema,
  UsernameSchema
} from "/build/_shared/chunk-EJKYYODX.js";
import {
  getConstraint,
  parse
} from "/build/_shared/chunk-FSA34KBF.js";
import {
  StatusButton
} from "/build/_shared/chunk-OO2QJRJG.js";
import "/build/_shared/chunk-44XOYWRB.js";
import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import {
  ErrorList,
  Field,
  helpers_exports,
  useForm
} from "/build/_shared/chunk-JXJ2XXPJ.js";
import "/build/_shared/chunk-FBSGADWS.js";
import "/build/_shared/chunk-XCP7KESD.js";
import "/build/_shared/chunk-OTYD2GEN.js";
import "/build/_shared/chunk-LJSTPQ62.js";
import "/build/_shared/chunk-Q7H7MHNO.js";
import "/build/_shared/chunk-FNWCO3JM.js";
import "/build/_shared/chunk-J4MLKRN2.js";
import "/build/_shared/chunk-FBX33ZTZ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  GeneralErrorBoundary
} from "/build/_shared/chunk-SUM65VYH.js";
import "/build/_shared/chunk-YYXIFXT3.js";
import "/build/_shared/chunk-6IU6NOV5.js";
import "/build/_shared/chunk-BM2PTB5J.js";
import {
  Link,
  useFetcher
} from "/build/_shared/chunk-DKP5DHW6.js";
import "/build/_shared/chunk-GIAAE3CH.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-BOXFZXVX.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_auth+/forgot-password.tsx
var import_node = __toESM(require_node(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_email_server = __toESM(require_email_server(), 1);
var import_honeypot_server = __toESM(require_honeypot_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth+/forgot-password.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth+/forgot-password.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var ForgotPasswordSchema = z.object({
  usernameOrEmail: z.union([EmailSchema, UsernameSchema])
});
function ForgotPasswordEmail({
  onboardingUrl,
  otp
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Html, { lang: "en", dir: "ltr", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { children: "Epic Notes Password Reset" }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 137,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 136,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { children: [
      "Here's your verification code: ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: otp }, void 0, false, {
        fileName: "app/routes/_auth+/forgot-password.tsx",
        lineNumber: 141,
        columnNumber: 38
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 140,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 139,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Text, { children: "Or click the link:" }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 145,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 144,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link2, { href: onboardingUrl, children: onboardingUrl }, void 0, false, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 147,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/forgot-password.tsx",
    lineNumber: 135,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth+/forgot-password.tsx",
    lineNumber: 134,
    columnNumber: 10
  }, this);
}
_c = ForgotPasswordEmail;
var meta = () => {
  return [{
    title: "Password Recovery for Epic Notes"
  }];
};
function ForgotPasswordRoute() {
  _s();
  const forgotPassword = useFetcher();
  const [form, fields] = useForm({
    id: "forgot-password-form",
    constraint: getConstraint(ForgotPasswordSchema),
    lastSubmission: forgotPassword.data?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: ForgotPasswordSchema
      });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container pb-32 pt-20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col justify-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-h1", children: "Forgot Password" }, void 0, false, {
        fileName: "app/routes/_auth+/forgot-password.tsx",
        lineNumber: 176,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-3 text-body-md text-muted-foreground", children: "No worries, we'll send you reset instructions." }, void 0, false, {
        fileName: "app/routes/_auth+/forgot-password.tsx",
        lineNumber: 177,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 175,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto mt-16 min-w-full max-w-sm sm:min-w-[368px]", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(forgotPassword.Form, { method: "POST", ...form.props, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 183,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HoneypotInputs, {}, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 184,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
          htmlFor: fields.usernameOrEmail.id,
          children: "Username or Email"
        }, inputProps: {
          autoFocus: true,
          ...helpers_exports.input(fields.usernameOrEmail)
        }, errors: fields.usernameOrEmail.errors }, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 186,
          columnNumber: 8
        }, this) }, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 185,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 194,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { className: "w-full", status: forgotPassword.state === "submitting" ? "pending" : forgotPassword.data?.status ?? "idle", type: "submit", disabled: forgotPassword.state !== "idle", children: "Recover password" }, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 197,
          columnNumber: 8
        }, this) }, void 0, false, {
          fileName: "app/routes/_auth+/forgot-password.tsx",
          lineNumber: 196,
          columnNumber: 7
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/forgot-password.tsx",
        lineNumber: 182,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/login", className: "mt-11 text-center text-body-sm font-bold", children: "Back to Login" }, void 0, false, {
        fileName: "app/routes/_auth+/forgot-password.tsx",
        lineNumber: 202,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/forgot-password.tsx",
      lineNumber: 181,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/forgot-password.tsx",
    lineNumber: 174,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth+/forgot-password.tsx",
    lineNumber: 173,
    columnNumber: 10
  }, this);
}
_s(ForgotPasswordRoute, "X2dFhDI9LNT9Wf5zf55NIkNQiO4=", false, function() {
  return [useFetcher, useForm];
});
_c2 = ForgotPasswordRoute;
function ErrorBoundary() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GeneralErrorBoundary, {}, void 0, false, {
    fileName: "app/routes/_auth+/forgot-password.tsx",
    lineNumber: 214,
    columnNumber: 10
  }, this);
}
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ForgotPasswordEmail");
$RefreshReg$(_c2, "ForgotPasswordRoute");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ForgotPasswordRoute as default,
  meta
};
//# sourceMappingURL=/build/routes/_auth+/forgot-password-T6SC7YJ6.js.map
