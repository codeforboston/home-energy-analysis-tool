import "/build/_shared/chunk-3H4MS3LM.js";
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
  getUserImgSrc,
  useDoubleCheck
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Link,
  useFetcher,
  useLoaderData
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

// app/routes/settings+/profile.index.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_session_server = __toESM(require_session_server(), 1);
var import_toast_server = __toESM(require_toast_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
var _s3 = $RefreshSig$();
var _s4 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.index.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  getSitemapEntries: () => null
};
var ProfileFormSchema = z.object({
  name: NameSchema.optional(),
  username: UsernameSchema
});
var profileUpdateActionIntent = "update-profile";
var signOutOfSessionsActionIntent = "sign-out-of-sessions";
var deleteDataActionIntent = "delete-data";
function EditUserProfile() {
  _s();
  const data = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-12", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative h-52 w-52", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: getUserImgSrc(data.user.image?.id), alt: data.user.username, className: "h-full w-full rounded-full object-cover" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 155,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { asChild: true, variant: "outline", className: "absolute -right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full p-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { preventScrollReset: true, to: "photo", title: "Change profile photo", "aria-label": "Change profile photo", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "camera", className: "h-4 w-4" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 158,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 157,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 156,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 154,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 153,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UpdateProfile, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 163,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "col-span-6 my-6 h-1 border-b-[1.5px] border-foreground" }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 165,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "col-span-full flex flex-col gap-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "change-email", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "envelope-closed", children: [
        "Change email from ",
        data.user.email
      ] }, void 0, true, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 169,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 168,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 167,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "two-factor", children: data.isTwoFactorEnabled ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "lock-closed", children: "2FA is enabled" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 176,
        columnNumber: 34
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "lock-open-1", children: "Enable 2FA" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 176,
        columnNumber: 83
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 175,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 174,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: data.hasPassword ? "password" : "password/create", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "dots-horizontal", children: data.hasPassword ? "Change Password" : "Create a Password" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 181,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 180,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 179,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "connections", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "link-2", children: "Manage connections" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 188,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 187,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 186,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { reloadDocument: true, download: "my-epic-notes-data.json", to: "/resources/download-user-data", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "download", children: "Download your data" }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 193,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 192,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 191,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SignOutOfSessions, {}, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 196,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DeleteData, {}, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 197,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 166,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 152,
    columnNumber: 10
  }, this);
}
_s(EditUserProfile, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = EditUserProfile;
function UpdateProfile() {
  _s2();
  const data = useLoaderData();
  const fetcher = useFetcher();
  const [form, fields] = useForm({
    id: "edit-profile",
    constraint: getConstraint(ProfileFormSchema),
    lastSubmission: fetcher.data?.submission,
    onValidate({
      formData
    }) {
      return parse(formData, {
        schema: ProfileFormSchema
      });
    },
    defaultValue: {
      username: data.user.username,
      name: data.user.name ?? "",
      email: data.user.email
    }
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(fetcher.Form, { method: "POST", ...form.props, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 285,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-6 gap-x-10", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { className: "col-span-3", labelProps: {
        htmlFor: fields.username.id,
        children: "Username"
      }, inputProps: helpers_exports.input(fields.username), errors: fields.username.errors }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 287,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, { className: "col-span-3", labelProps: {
        htmlFor: fields.name.id,
        children: "Name"
      }, inputProps: helpers_exports.input(fields.name), errors: fields.name.errors }, void 0, false, {
        fileName: "app/routes/settings+/profile.index.tsx",
        lineNumber: 291,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 286,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors, id: form.errorId }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 297,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 flex justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { type: "submit", size: "wide", name: "intent", value: profileUpdateActionIntent, status: fetcher.state !== "idle" ? "pending" : fetcher.data?.status ?? "idle", children: "Save changes" }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 300,
      columnNumber: 5
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 299,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 284,
    columnNumber: 10
  }, this);
}
_s2(UpdateProfile, "UzvSjeKCTDMHQRJe2illLbG0AqY=", false, function() {
  return [useLoaderData, useFetcher, useForm];
});
_c2 = UpdateProfile;
function SignOutOfSessions() {
  _s3();
  const data = useLoaderData();
  const dc = useDoubleCheck();
  const fetcher = useFetcher();
  const otherSessionsCount = data.user._count.sessions - 1;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: otherSessionsCount ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(fetcher.Form, { method: "POST", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 337,
      columnNumber: 6
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { ...dc.getButtonProps({
      type: "submit",
      name: "intent",
      value: signOutOfSessionsActionIntent
    }), variant: dc.doubleCheck ? "destructive" : "default", status: fetcher.state !== "idle" ? "pending" : fetcher.data?.status ?? "idle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "avatar", children: dc.doubleCheck ? `Are you sure?` : `Sign out of ${otherSessionsCount} other sessions` }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 343,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 338,
      columnNumber: 6
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 336,
    columnNumber: 26
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "avatar", children: "This is your only session" }, void 0, false, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 347,
    columnNumber: 23
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 335,
    columnNumber: 10
  }, this);
}
_s3(SignOutOfSessions, "vGqH5veF3P6z3W7E3D5vXZ17b98=", false, function() {
  return [useLoaderData, useDoubleCheck, useFetcher];
});
_c3 = SignOutOfSessions;
function DeleteData() {
  _s4();
  const dc = useDoubleCheck();
  const fetcher = useFetcher();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(fetcher.Form, { method: "POST", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 374,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { ...dc.getButtonProps({
      type: "submit",
      name: "intent",
      value: deleteDataActionIntent
    }), variant: dc.doubleCheck ? "destructive" : "default", status: fetcher.state !== "idle" ? "pending" : "idle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "trash", children: dc.doubleCheck ? `Are you sure?` : `Delete all your data` }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 380,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.index.tsx",
      lineNumber: 375,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 373,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.index.tsx",
    lineNumber: 372,
    columnNumber: 10
  }, this);
}
_s4(DeleteData, "vnFydE1DKgFCQD1o3M4b69zjfoU=", false, function() {
  return [useDoubleCheck, useFetcher];
});
_c4 = DeleteData;
var _c;
var _c2;
var _c3;
var _c4;
$RefreshReg$(_c, "EditUserProfile");
$RefreshReg$(_c2, "UpdateProfile");
$RefreshReg$(_c3, "SignOutOfSessions");
$RefreshReg$(_c4, "DeleteData");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  EditUserProfile as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.index-HGQNTLCA.js.map
