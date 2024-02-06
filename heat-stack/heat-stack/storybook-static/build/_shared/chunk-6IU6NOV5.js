import {
  cn
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XU7DNSPJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/ui/icons/sprite.svg
var sprite_default = "/build/_assets/sprite-SZTQFBWO.svg";

// app/components/ui/icon.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/icon.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/icon.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var sizeClassName = {
  font: "w-[1em] h-[1em]",
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7"
};
var childrenSizeClassName = {
  font: "gap-1.5",
  xs: "gap-1.5",
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2",
  xl: "gap-3"
};
function Icon({
  name,
  size = "font",
  className,
  children,
  ...props
}) {
  if (children) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `inline-flex items-center ${childrenSizeClassName[size]}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name, size, className, ...props }, void 0, false, {
        fileName: "app/components/ui/icon.tsx",
        lineNumber: 58,
        columnNumber: 5
      }, this),
      children
    ] }, void 0, true, {
      fileName: "app/components/ui/icon.tsx",
      lineNumber: 57,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { ...props, className: cn(sizeClassName[size], "inline self-center", className), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("use", { href: `${sprite_default}#${name}` }, void 0, false, {
    fileName: "app/components/ui/icon.tsx",
    lineNumber: 63,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/components/ui/icon.tsx",
    lineNumber: 62,
    columnNumber: 10
  }, this);
}
_c = Icon;
var _c;
$RefreshReg$(_c, "Icon");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  sprite_default,
  Icon
};
//# sourceMappingURL=/build/_shared/chunk-6IU6NOV5.js.map
