import {
  AuthenticityTokenInput,
  require_csrf_server
} from "/build/_shared/chunk-E55JX6V7.js";
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
  useDoubleCheck,
  useIsPending
} from "/build/_shared/chunk-BM2PTB5J.js";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/settings+/profile.photo.tsx
var import_node = __toESM(require_node(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_csrf_server = __toESM(require_csrf_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/settings+/profile.photo.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/settings+/profile.photo.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var handle = {
  breadcrumb: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "avatar", children: "Photo" }, void 0, false, {
    fileName: "app/routes/settings+/profile.photo.tsx",
    lineNumber: 38,
    columnNumber: 15
  }, this),
  getSitemapEntries: () => null
};
var MAX_SIZE = 1024 * 1024 * 3;
var DeleteImageSchema = z.object({
  intent: z.literal("delete")
});
var NewImageSchema = z.object({
  intent: z.literal("submit"),
  photoFile: z.instanceof(File).refine((file) => file.size > 0, "Image is required").refine((file) => file.size <= MAX_SIZE, "Image size must be less than 3MB")
});
var PhotoFormSchema = z.union([DeleteImageSchema, NewImageSchema]);
function PhotoRoute() {
  _s();
  const data = useLoaderData();
  const doubleCheckDeleteImage = useDoubleCheck();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [form, fields] = useForm({
    id: "profile-photo",
    constraint: getConstraint(PhotoFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({
      formData
    }) {
      if (formData.get("intent") === "delete") {
        return parse(formData, {
          schema: DeleteImageSchema
        });
      }
      return parse(formData, {
        schema: NewImageSchema
      });
    },
    shouldRevalidate: "onBlur"
  });
  const isPending = useIsPending();
  const pendingIntent = isPending ? navigation.formData?.get("intent") : null;
  const lastSubmissionIntent = actionData?.submission.value?.intent;
  const [newImageSrc, setNewImageSrc] = (0, import_react3.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "POST", encType: "multipart/form-data", className: "flex flex-col items-center justify-center gap-10", onReset: () => setNewImageSrc(null), ...form.props, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthenticityTokenInput, {}, void 0, false, {
      fileName: "app/routes/settings+/profile.photo.tsx",
      lineNumber: 178,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: newImageSrc ?? (data.user ? getUserImgSrc(data.user.image?.id) : ""), className: "h-52 w-52 rounded-full object-cover", alt: data.user?.name ?? data.user?.username }, void 0, false, {
      fileName: "app/routes/settings+/profile.photo.tsx",
      lineNumber: 179,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: fields.photoFile.errors, id: fields.photoFile.id }, void 0, false, {
      fileName: "app/routes/settings+/profile.photo.tsx",
      lineNumber: 180,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { ...helpers_exports.input(fields.photoFile, {
        type: "file"
      }), accept: "image/*", className: "peer sr-only", required: true, tabIndex: newImageSrc ? -1 : 0, onChange: (e) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setNewImageSrc(event.target?.result?.toString() ?? null);
          };
          reader.readAsDataURL(file);
        }
      } }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 188,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { asChild: true, className: "cursor-pointer peer-valid:hidden peer-focus-within:ring-4 peer-focus-visible:ring-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: fields.photoFile.id, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "pencil-1", children: "Change" }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 202,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 201,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 200,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { name: "intent", value: "submit", type: "submit", className: "peer-invalid:hidden", status: pendingIntent === "submit" ? "pending" : lastSubmissionIntent === "submit" ? actionData?.status ?? "idle" : "idle", children: "Save Photo" }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 205,
        columnNumber: 6
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, { type: "reset", variant: "destructive", className: "peer-invalid:hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "trash", children: "Reset" }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 209,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 208,
        columnNumber: 6
      }, this),
      data.user.image?.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusButton, { className: "peer-valid:hidden", variant: "destructive", ...doubleCheckDeleteImage.getButtonProps({
        type: "submit",
        name: "intent",
        value: "delete"
      }), status: pendingIntent === "delete" ? "pending" : lastSubmissionIntent === "delete" ? actionData?.status ?? "idle" : "idle", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { name: "trash", children: doubleCheckDeleteImage.doubleCheck ? "Are you sure?" : "Delete" }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 216,
        columnNumber: 8
      }, this) }, void 0, false, {
        fileName: "app/routes/settings+/profile.photo.tsx",
        lineNumber: 211,
        columnNumber: 29
      }, this) : null
    ] }, void 0, true, {
      fileName: "app/routes/settings+/profile.photo.tsx",
      lineNumber: 181,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ErrorList, { errors: form.errors }, void 0, false, {
      fileName: "app/routes/settings+/profile.photo.tsx",
      lineNumber: 221,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings+/profile.photo.tsx",
    lineNumber: 177,
    columnNumber: 4
  }, this) }, void 0, false, {
    fileName: "app/routes/settings+/profile.photo.tsx",
    lineNumber: 176,
    columnNumber: 10
  }, this);
}
_s(PhotoRoute, "iHeSpgIHVoJLphdT2VOeEhrdia8=", false, function() {
  return [useLoaderData, useDoubleCheck, useActionData, useNavigation, useForm, useIsPending];
});
_c = PhotoRoute;
var _c;
$RefreshReg$(_c, "PhotoRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  PhotoRoute as default,
  handle
};
//# sourceMappingURL=/build/routes/settings+/profile.photo-5WDA6UKA.js.map
