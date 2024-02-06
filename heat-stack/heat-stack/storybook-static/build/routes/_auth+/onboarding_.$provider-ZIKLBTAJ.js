import "/build/_shared/chunk-RZHH4FHW.js";
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
import "/build/_shared/chunk-6IU6NOV5.js";
import {
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams
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

// app/routes/_auth+/onboarding_.$provider.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
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
    window.$RefreshRuntime$.register(type, '"app/routes/_auth+/onboarding_.$provider.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth+/onboarding_.$provider.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var SignupFormSchema = z.object({
  imageUrl: z.string().optional(),
  username: UsernameSchema,
  name: NameSchema,
  agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
    required_error: "You must agree to the terms of service and privacy policy"
  }),
  remember: z.boolean().optional(),
  redirectTo: z.string().optional()
});
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
    id: "onboarding-provider-form",
    constraint: getConstraint(SignupFormSchema),
    lastSubmission: actionData?.submission ?? data.submission,
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
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 221,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-body-md text-muted-foreground", children: "Please enter your details." }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 222,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
      lineNumber: 220,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "xs" }, void 0, false, {
      fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
      lineNumber: 226,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "POST", className: "mx-auto min-w-full max-w-sm sm:min-w-[368px]", ...form.props, children: [
      fields.imageUrl.defaultValue ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4 flex flex-col items-center justify-center gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: fields.imageUrl.defaultValue, alt: "Profile", className: "h-24 w-24 rounded-full" }, void 0, false, {
          fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
          lineNumber: 229,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-body-sm text-muted-foreground", children: "You can change your photo later" }, void 0, false, {
          fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
          lineNumber: 230,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { ...helpers_exports.input(fields.imageUrl, {
          type: "hidden"
        }) }, void 0, false, {
          fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
          lineNumber: 233,
          columnNumber: 8
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 228,
        columnNumber: 38
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.username.id,
        children: "Username"
      }, inputProps: {
        ...helpers_exports.input(fields.username),
        autoComplete: "username",
        className: "lowercase"
      }, errors: fields.username.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 237,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
        htmlFor: fields.name.id,
        children: "Name"
      }, inputProps: {
        ...helpers_exports.input(fields.name),
        autoComplete: "name"
      }, errors: fields.name.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 245,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxField, { labelProps: {
        htmlFor: fields.agreeToTermsOfServiceAndPrivacyPolicy.id,
        children: "Do you agree to our Terms of Service and Privacy Policy?"
      }, buttonProps: helpers_exports.input(fields.agreeToTermsOfServiceAndPrivacyPolicy, {
        type: "checkbox"
      }), errors: fields.agreeToTermsOfServiceAndPrivacyPolicy.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 253,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxField, { labelProps: {
        htmlFor: fields.remember.id,
        children: "Remember me"
      }, buttonProps: helpers_exports.input(fields.remember, {
        type: "checkbox"
      }), errors: fields.remember.errors }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 259,
        columnNumber: 6
      }, this),
      redirectTo ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 266,
        columnNumber: 20
      }, this) : null,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 268,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between gap-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { className: "w-full", status: isPending ? "pending" : actionData?.status ?? "idle", type: "submit", disabled: isPending, children: "Create an account" }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 271,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
        lineNumber: 270,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
      lineNumber: 227,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
    lineNumber: 219,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth+/onboarding_.$provider.tsx",
    lineNumber: 218,
    columnNumber: 10
  }, this);
}
_s(SignupRoute, "SbEzVWUNyTwM/qcAIjF6pChQLW8=", false, function() {
  return [useLoaderData, useActionData, useIsPending, useSearchParams, useForm];
});
_c = SignupRoute;
var _c;
$RefreshReg$(_c, "SignupRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  SignupRoute as default,
  meta
};
//# sourceMappingURL=/build/routes/_auth+/onboarding_.$provider-ZIKLBTAJ.js.map
