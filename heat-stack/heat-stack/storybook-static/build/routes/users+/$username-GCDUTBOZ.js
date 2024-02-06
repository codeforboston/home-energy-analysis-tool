import {
  useOptionalUser
} from "/build/_shared/chunk-5XRMLWXG.js";
import {
  Spacer
} from "/build/_shared/chunk-4UQVKXCC.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import {
  Button
} from "/build/_shared/chunk-FBSGADWS.js";
import "/build/_shared/chunk-FNWCO3JM.js";
import "/build/_shared/chunk-FBX33ZTZ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  GeneralErrorBoundary
} from "/build/_shared/chunk-SUM65VYH.js";
import "/build/_shared/chunk-YYXIFXT3.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import {
  getUserImgSrc
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  Link,
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

// app/routes/users+/$username.tsx
var import_node = __toESM(require_node(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/users+/$username.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/users+/$username.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
function ProfileRoute() {
  _s();
  const data = useLoaderData();
  const user = data.user;
  const userDisplayName = user.name ?? user.username;
  const loggedInUser = useOptionalUser();
  const isLoggedInUser = data.user.id === loggedInUser?.id;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mb-48 mt-36 flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "4xs" }, void 0, false, {
      fileName: "app/routes/users+/$username.tsx",
      lineNumber: 66,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container flex flex-col items-center rounded-3xl bg-muted p-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative w-52", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute -top-40", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: getUserImgSrc(data.user.image?.id), alt: userDisplayName, className: "h-52 w-52 rounded-full object-cover" }, void 0, false, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 72,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 71,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 70,
        columnNumber: 6
      }, this) }, void 0, false, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 69,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Spacer, { size: "sm" }, void 0, false, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 77,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap items-center justify-center gap-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-center text-h2", children: userDisplayName }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 81,
          columnNumber: 7
        }, this) }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 80,
          columnNumber: 6
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-center text-muted-foreground", children: [
          "Joined ",
          data.userJoinedDisplay
        ] }, void 0, true, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 83,
          columnNumber: 6
        }, this),
        isLoggedInUser ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { action: "/logout", method: "POST", className: "mt-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { type: "submit", variant: "link", size: "pill", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "exit", className: "scale-125 max-md:scale-150", children: "Logout" }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 88,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 87,
          columnNumber: 8
        }, this) }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 86,
          columnNumber: 24
        }, this) : null,
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-10 flex gap-4", children: isLoggedInUser ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "notes", prefetch: "intent", children: "My notes" }, void 0, false, {
            fileName: "app/routes/users+/$username.tsx",
            lineNumber: 96,
            columnNumber: 10
          }, this) }, void 0, false, {
            fileName: "app/routes/users+/$username.tsx",
            lineNumber: 95,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/settings/profile", prefetch: "intent", children: "Edit profile" }, void 0, false, {
            fileName: "app/routes/users+/$username.tsx",
            lineNumber: 101,
            columnNumber: 10
          }, this) }, void 0, false, {
            fileName: "app/routes/users+/$username.tsx",
            lineNumber: 100,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 94,
          columnNumber: 25
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "notes", prefetch: "intent", children: [
          userDisplayName,
          "'s notes"
        ] }, void 0, true, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 106,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 105,
          columnNumber: 14
        }, this) }, void 0, false, {
          fileName: "app/routes/users+/$username.tsx",
          lineNumber: 93,
          columnNumber: 6
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/users+/$username.tsx",
        lineNumber: 79,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/users+/$username.tsx",
      lineNumber: 68,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/users+/$username.tsx",
    lineNumber: 65,
    columnNumber: 10
  }, this);
}
_s(ProfileRoute, "WemrhwYXdIHkPFxNeqgcvBbQjZE=", false, function() {
  return [useLoaderData, useOptionalUser];
});
_c = ProfileRoute;
var meta = ({
  data,
  params
}) => {
  const displayName = data?.user.name ?? params.username;
  return [{
    title: `${displayName} | Epic Notes`
  }, {
    name: "description",
    content: `Profile of ${displayName} on Epic Notes`
  }];
};
function ErrorBoundary() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GeneralErrorBoundary, { statusHandlers: {
    404: ({
      params
    }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
      'No user with the username "',
      params.username,
      '" exists'
    ] }, void 0, true, {
      fileName: "app/routes/users+/$username.tsx",
      lineNumber: 135,
      columnNumber: 11
    }, this)
  } }, void 0, false, {
    fileName: "app/routes/users+/$username.tsx",
    lineNumber: 132,
    columnNumber: 10
  }, this);
}
_c2 = ErrorBoundary;
var _c;
var _c2;
$RefreshReg$(_c, "ProfileRoute");
$RefreshReg$(_c2, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ProfileRoute as default,
  meta
};
//# sourceMappingURL=/build/routes/users+/$username-GCDUTBOZ.js.map
