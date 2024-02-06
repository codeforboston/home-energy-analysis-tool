import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// empty-module:./auth.server.ts
var require_auth_server = __commonJS({
  "empty-module:./auth.server.ts"(exports, module) {
    module.exports = {};
  }
});

// empty-module:./db.server.ts
var require_db_server = __commonJS({
  "empty-module:./db.server.ts"(exports, module) {
    module.exports = {};
  }
});

// app/utils/permissions.ts
var import_node = __toESM(require_node(), 1);
var import_auth_server = __toESM(require_auth_server(), 1);
var import_db_server = __toESM(require_db_server(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/utils/permissions.ts"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
function parsePermissionString(permissionString) {
  const [action, entity, access] = permissionString.split(":");
  return {
    action,
    entity,
    access: access ? access.split(",") : void 0
  };
}
function userHasPermission(user, permission) {
  if (!user)
    return false;
  const { action, entity, access } = parsePermissionString(permission);
  return user.roles.some(
    (role) => role.permissions.some(
      (permission2) => permission2.entity === entity && permission2.action === action && (!access || access.includes(permission2.access))
    )
  );
}

export {
  userHasPermission
};
//# sourceMappingURL=/build/_shared/chunk-WANFMU5C.js.map
