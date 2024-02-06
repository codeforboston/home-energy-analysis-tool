import {
  BrowserProfilingIntegration,
  BrowserTracing,
  Replay,
  init,
  remixRouterInstrumentation
} from "/build/_shared/chunk-YYXIFXT3.js";
import {
  useLocation,
  useMatches
} from "/build/_shared/chunk-DKP5DHW6.js";
import "/build/_shared/chunk-GIAAE3CH.js";
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

// app/utils/monitoring.client.tsx
var import_react2 = __toESM(require_react(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/utils/monitoring.client.tsx"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
function init2() {
  init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.MODE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: remixRouterInstrumentation(
          import_react2.useEffect,
          useLocation,
          useMatches
        )
      }),
      // Replay is only available in the client
      new Replay(),
      new BrowserProfilingIntegration()
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1,
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1
  });
}
export {
  init2 as init
};
//# sourceMappingURL=/build/_shared/monitoring.client-ONP36K7H.js.map
