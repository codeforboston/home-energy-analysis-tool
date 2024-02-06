import {
  ProviderConnectionForm,
  providerIcons,
  providerNames
} from "/build/_shared/chunk-RZHH4FHW.js";
import {
  require_toast_server
} from "/build/_shared/chunk-O7MTR2WV.js";
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
import "/build/_shared/chunk-FBSGADWS.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "/build/_shared/chunk-OTYD2GEN.js";
import "/build/_shared/chunk-LJSTPQ62.js";
import "/build/_shared/chunk-FNWCO3JM.js";
import "/build/_shared/chunk-J4MLKRN2.js";
import "/build/_shared/chunk-FBX33ZTZ.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Icon
} from "/build/_shared/chunk-6IU6NOV5.js";
import "/build/_shared/chunk-BM2PTB5J.js";
import {
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
import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:#app/utils/connections.server.ts
var require_connections_server = __commonJS({
  "empty-module:#app/utils/connections.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:#app/utils/timing.server.ts
var require_timing_server = __commonJS({
  "empty-module:#app/utils/timing.server.ts"(exports, module) {
    module.exports = {};
  }
});

// app/routes/settings+/profile.connections.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_connections_server = __toESM(require_connections_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_timing_server = __toESM(require_timing_server(), 1);
var import_toast_server = __toESM(require_toast_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.connections.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.connections.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "link-2", children: "Connections" }, void 0, false, {
    fileName: "app/routes/settings+/profile.connections.tsx",
    lineNumber: 37,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
function Connections() {
  _s();
  const data = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-md", children: [
    data.connections.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Here are your current connections:" }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 141,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "flex flex-col gap-4", children: data.connections.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Connection, { connection: c, canDelete: data.canDeleteConnections }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, this) }, c.id, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 143,
        columnNumber: 34
      }, this)) }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 142,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 140,
      columnNumber: 31
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "You don't have any connections yet." }, void 0, false, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 147,
      columnNumber: 14
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3", children: providerNames.map((providerName) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProviderConnectionForm, { type: "Connect", providerName }, providerName, false, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 149,
      columnNumber: 40
    }, this)) }, void 0, false, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 148,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.connections.tsx",
    lineNumber: 139,
    columnNumber: 10
  }, this);
}
_s(Connections, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = Connections;
function Connection({
  connection,
  canDelete
}) {
  _s2();
  const deleteFetcher = useFetcher();
  const [infoOpen, setInfoOpen] = (0, import_react2.useState)(false);
  const icon = providerIcons[connection.providerName];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `inline-flex items-center gap-1.5`, children: [
      icon,
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
        connection.link ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: connection.link, className: "underline", children: connection.displayName }, void 0, false, {
          fileName: "app/routes/settings+/profile.connections.tsx",
          lineNumber: 169,
          columnNumber: 25
        }, this) : connection.displayName,
        " ",
        "(",
        connection.createdAtFormatted,
        ")"
      ] }, void 0, true, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 168,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 166,
      columnNumber: 4
    }, this),
    canDelete ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(deleteFetcher.Form, { method: "POST", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { name: "connectionId", value: connection.id, type: "hidden" }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 176,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { name: "intent", value: "delete-connection", variant: "destructive", size: "sm", status: deleteFetcher.state !== "idle" ? "pending" : deleteFetcher.data?.status ?? "idle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "cross-1" }, void 0, false, {
          fileName: "app/routes/settings+/profile.connections.tsx",
          lineNumber: 181,
          columnNumber: 10
        }, this) }, void 0, false, {
          fileName: "app/routes/settings+/profile.connections.tsx",
          lineNumber: 180,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "app/routes/settings+/profile.connections.tsx",
          lineNumber: 179,
          columnNumber: 8
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipContent, { children: "Disconnect this account" }, void 0, false, {
          fileName: "app/routes/settings+/profile.connections.tsx",
          lineNumber: 184,
          columnNumber: 8
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 178,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 177,
        columnNumber: 6
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 175,
      columnNumber: 17
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { open: infoOpen, onOpenChange: setInfoOpen, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipTrigger, { onClick: () => setInfoOpen(true), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "question-mark-circled" }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 190,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 189,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipContent, { children: "You cannot delete your last connection unless you have a password." }, void 0, false, {
        fileName: "app/routes/settings+/profile.connections.tsx",
        lineNumber: 192,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 188,
      columnNumber: 6
    }, this) }, void 0, false, {
      fileName: "app/routes/settings+/profile.connections.tsx",
      lineNumber: 187,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.connections.tsx",
    lineNumber: 165,
    columnNumber: 10
  }, this);
}
_s2(Connection, "k2jEgCF0d5m8xX8ShNqKItt8Qeg=", false, function() {
  return [useFetcher];
});
_c2 = Connection;
var _c;
var _c2;
$RefreshReg$(_c, "Connections");
$RefreshReg$(_c2, "Connection");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Connections as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.connections-MDJFVWPI.js.map
