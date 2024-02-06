import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:#app/utils/csrf.server.ts
var require_csrf_server = __commonJS({
  "empty-module:#app/utils/csrf.server.ts"(exports, module) {
    module.exports = {};
  }
});

// node_modules/remix-utils/build/react/authenticity-token.js
var React = __toESM(require_react(), 1);
var context = React.createContext(null);
function useAuthenticityToken() {
  let token = React.useContext(context);
  if (!token)
    throw new Error("Missing AuthenticityTokenProvider.");
  return token;
}
function AuthenticityTokenInput({ name = "csrf" }) {
  let token = useAuthenticityToken();
  return React.createElement("input", { type: "hidden", value: token, name });
}

export {
  AuthenticityTokenInput,
  require_csrf_server
};
//# sourceMappingURL=/build/_shared/chunk-E55JX6V7.js.map
