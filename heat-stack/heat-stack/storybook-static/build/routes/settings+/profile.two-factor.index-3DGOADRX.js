import "/build/_shared/chunk-4T5ZH7KP.js";
import {
  require_totp_server
} from "/build/_shared/chunk-72RCXK6H.js";
import "/build/_shared/chunk-NMZL6IDN.js";
import "/build/_shared/chunk-3H4MS3LM.js";
import "/build/_shared/chunk-YROKGDF2.js";
import "/build/_shared/chunk-5K67MMZF.js";
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
import "/build/_shared/chunk-EJKYYODX.js";
import "/build/_shared/chunk-FSA34KBF.js";
import {
  StatusButton
} from "/build/_shared/chunk-OO2QJRJG.js";
import {
  require_auth_server
} from "/build/_shared/chunk-44XOYWRB.js";
import "/build/_shared/chunk-YTDRTWMN.js";
import {
  require_db_server
} from "/build/_shared/chunk-FSP6GK2P.js";
import "/build/_shared/chunk-JXJ2XXPJ.js";
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
import "/build/_shared/chunk-SUM65VYH.js";
import "/build/_shared/chunk-YYXIFXT3.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import "/build/_shared/chunk-BM2PTB5J.js";
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

// app/routes/settings+/profile.two-factor.index.tsx
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_totp_server = __toESM(require_totp_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.two-factor.index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.two-factor.index.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  getSitemapEntries: () => null
};
function TwoFactorRoute() {
  _s();
  const data = useLoaderData();
  const enable2FAFetcher = useFetcher();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-4", children: data.is2FAEnabled ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "check", children: "You have enabled two-factor authentication." }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 88,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 87,
      columnNumber: 6
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "disable", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "lock-open-1", children: "Disable 2FA" }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 93,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 92,
      columnNumber: 6
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.two-factor.index.tsx",
    lineNumber: 86,
    columnNumber: 25
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "lock-open-1", children: "You have not enabled two-factor authentication yet." }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 96,
      columnNumber: 6
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm", children: [
      "Two factor authentication adds an extra layer of security to your account. You will need to enter a code from an authenticator app like",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { className: "underline", href: "https://1password.com/", children: "1Password" }, void 0, false, {
        fileName: "app/routes/settings+/profile.two-factor.index.tsx",
        lineNumber: 105,
        columnNumber: 7
      }, this),
      " ",
      "to log in."
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 101,
      columnNumber: 6
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(enable2FAFetcher.Form, { method: "POST", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
        fileName: "app/routes/settings+/profile.two-factor.index.tsx",
        lineNumber: 111,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { type: "submit", name: "intent", value: "enable", status: enable2FAFetcher.state === "loading" ? "pending" : "idle", className: "mx-auto", children: "Enable 2FA" }, void 0, false, {
        fileName: "app/routes/settings+/profile.two-factor.index.tsx",
        lineNumber: 112,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.two-factor.index.tsx",
      lineNumber: 110,
      columnNumber: 6
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.two-factor.index.tsx",
    lineNumber: 95,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.two-factor.index.tsx",
    lineNumber: 85,
    columnNumber: 10
  }, this);
}
_s(TwoFactorRoute, "yAxupoGoWsK4f/JRcCn9FOORomA=", false, function() {
  return [useLoaderData, useFetcher];
});
_c = TwoFactorRoute;
var _c;
$RefreshReg$(_c, "TwoFactorRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  TwoFactorRoute as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.two-factor.index-3DGOADRX.js.map
