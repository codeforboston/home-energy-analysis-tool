import {
  AuthenticityTokenInput,
  require_csrf_server
} from "/build/_shared/chunk-E55JX6V7.js";
import {
  require_toast_server
} from "/build/_shared/chunk-O7MTR2WV.js";
import {
  PasswordSchema
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
  ErrorList,
  Field,
  helpers_exports,
  useForm
} from "/build/_shared/chunk-JXJ2XXPJ.js";
import {
  Button
} from "/build/_shared/chunk-FBSGADWS.js";
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
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  Link,
  useActionData
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

// app/routes/settings+/profile.password.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_toast_server = __toESM(require_toast_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.password.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.password.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "dots-horizontal", children: "Password" }, void 0, false, {
    fileName: "app/routes/settings+/profile.password.tsx",
    lineNumber: 39,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
var ChangePasswordForm = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
  confirmNewPassword: PasswordSchema
}).superRefine(_c = ({
  confirmNewPassword,
  newPassword
}, ctx) => {
  if (confirmNewPassword !== newPassword) {
    ctx.addIssue({
      path: ["confirmNewPassword"],
      code: z.ZodIssueCode.custom,
      message: "The passwords must match"
    });
  }
});
_c2 = ChangePasswordForm;
function ChangePasswordRoute() {
  _s();
  const actionData = useActionData();
  const isPending = useIsPending();
  const [form, fields] = useForm({
    id: "password-change-form",
    constraint: getConstraint(ChangePasswordForm),
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: ChangePasswordForm
      });
    },
    shouldRevalidate: "onBlur"
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "POST", ...form.props, className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 168,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
      children: "Current Password"
    }, inputProps: helpers_exports.input(fields.currentPassword, {
      type: "password"
    }), errors: fields.currentPassword.errors }, void 0, false, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 169,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
      children: "New Password"
    }, inputProps: helpers_exports.input(fields.newPassword, {
      type: "password"
    }), errors: fields.newPassword.errors }, void 0, false, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 174,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { labelProps: {
      children: "Confirm New Password"
    }, inputProps: helpers_exports.input(fields.confirmNewPassword, {
      type: "password"
    }), errors: fields.confirmNewPassword.errors }, void 0, false, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 179,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { id: form.errorId, errors: form.errors }, void 0, false, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 184,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid w-full grid-cols-2 gap-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { variant: "secondary", asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "..", children: "Cancel" }, void 0, false, {
        fileName: "app/routes/settings+/profile.password.tsx",
        lineNumber: 187,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.password.tsx",
        lineNumber: 186,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { type: "submit", status: isPending ? "pending" : actionData?.status ?? "idle", children: "Change Password" }, void 0, false, {
        fileName: "app/routes/settings+/profile.password.tsx",
        lineNumber: 189,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.password.tsx",
      lineNumber: 185,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.password.tsx",
    lineNumber: 167,
    columnNumber: 10
  }, this);
}
_s(ChangePasswordRoute, "qg6D+LQiyyBwoKKZlQs9OeApyZ8=", false, function() {
  return [useActionData, useIsPending, useForm];
});
_c3 = ChangePasswordRoute;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ChangePasswordForm$z\n	.object({\n		currentPassword: PasswordSchema,\n		newPassword: PasswordSchema,\n		confirmNewPassword: PasswordSchema,\n	})\n	.superRefine");
$RefreshReg$(_c2, "ChangePasswordForm");
$RefreshReg$(_c3, "ChangePasswordRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ChangePasswordRoute as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.password-2VZWSYOV.js.map
