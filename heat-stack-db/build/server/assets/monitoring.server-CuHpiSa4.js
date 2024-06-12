import { nodeProfilingIntegration } from "@sentry/profiling-node";
import Sentry__default from "@sentry/remix";
function init() {
  Sentry__default.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.MODE,
    tracesSampleRate: ENV.MODE === "production" ? 1 : 0,
    denyUrls: [
      /\/resources\/healthcheck/,
      // TODO: be smarter about the public assets...
      /\/build\//,
      /\/favicons\//,
      /\/img\//,
      /\/fonts\//,
      /\/favicon.ico/,
      /\/site\.webmanifest/
    ],
    integrations: [
      Sentry__default.httpIntegration(),
      Sentry__default.prismaIntegration(),
      nodeProfilingIntegration()
    ],
    tracesSampler(samplingContext) {
      var _a, _b;
      if ((_b = (_a = samplingContext.request) == null ? void 0 : _a.url) == null ? void 0 : _b.includes("/resources/healthcheck")) {
        return 0;
      }
      return 1;
    },
    beforeSendTransaction(event) {
      var _a, _b;
      if (((_b = (_a = event.request) == null ? void 0 : _a.headers) == null ? void 0 : _b["x-healthcheck"]) === "true") {
        return null;
      }
      return event;
    }
  });
}
export {
  init
};
//# sourceMappingURL=monitoring.server-CuHpiSa4.js.map
