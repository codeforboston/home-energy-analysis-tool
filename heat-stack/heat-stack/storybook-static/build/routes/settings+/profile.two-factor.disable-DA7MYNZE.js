import "/build/_shared/chunk-72RCXK6H.js";
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
import {
  require_toast_server
} from "/build/_shared/chunk-O7MTR2WV.js";
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
import {
  useDoubleCheck
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
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

// app/routes/settings+/profile.two-factor.disable.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.two-factor.disable.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.two-factor.disable.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "lock-open-1", children: "Disable" }, void 0, false, {
    fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
    lineNumber: 35,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
function TwoFactorDisableRoute() {
  _s();
  const disable2FAFetcher = useFetcher();
  const dc = useDoubleCheck();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(disable2FAFetcher.Form, { method: "POST", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
      lineNumber: 69,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Disabling two factor authentication is not recommended. However, if you would like to do so, click here:" }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
      lineNumber: 70,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { variant: "destructive", status: disable2FAFetcher.state === "loading" ? "pending" : "idle", ...dc.getButtonProps({
      className: "mx-auto",
      name: "intent",
      value: "disable",
      type: "submit"
    }), children: dc.doubleCheck ? "Are you sure?" : "Disable 2FA" }, void 0, false, {
      fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
      lineNumber: 74,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
    lineNumber: 68,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.two-factor.disable.tsx",
    lineNumber: 67,
    columnNumber: 10
  }, this);
}
_s(TwoFactorDisableRoute, "AovRxqD2axCh0khrBhmC7lIcx4g=", false, function() {
  return [useFetcher, useDoubleCheck];
});
_c = TwoFactorDisableRoute;
var _c;
$RefreshReg$(_c, "TwoFactorDisableRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  TwoFactorDisableRoute as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.two-factor.disable-DA7MYNZE.js.map
