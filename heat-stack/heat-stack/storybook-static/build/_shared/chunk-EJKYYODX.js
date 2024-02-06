import {
  z
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  createHotContext
} from "/build/_shared/chunk-O7QHA5CH.js";

// app/utils/user-validation.ts
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/utils/user-validation.ts"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/utils/user-validation.ts"
  );
  import.meta.hot.lastModified = "1706218436656.8838";
}
var UsernameSchema = z.string({
  required_error: "Username is required"
}).min(3, {
  message: "Username is too short"
}).max(20, {
  message: "Username is too long"
}).regex(/^[a-zA-Z0-9_]+$/, {
  message: "Username can only include letters, numbers, and underscores"
}).transform(_c = (value) => value.toLowerCase());
_c2 = UsernameSchema;
var PasswordSchema = z.string({
  required_error: "Password is required"
}).min(6, {
  message: "Password is too short"
}).max(100, {
  message: "Password is too long"
});
var NameSchema = z.string({
  required_error: "Name is required"
}).min(3, {
  message: "Name is too short"
}).max(40, {
  message: "Name is too long"
});
var EmailSchema = z.string({
  required_error: "Email is required"
}).email({
  message: "Email is invalid"
}).min(3, {
  message: "Email is too short"
}).max(100, {
  message: "Email is too long"
}).transform(_c3 = (value) => value.toLowerCase());
_c4 = EmailSchema;
var PasswordAndConfirmPasswordSchema = z.object({
  password: PasswordSchema,
  confirmPassword: PasswordSchema
}).superRefine(_c5 = ({
  confirmPassword,
  password
}, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "The passwords must match"
    });
  }
});
_c6 = PasswordAndConfirmPasswordSchema;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
var _c6;
$RefreshReg$(_c, "UsernameSchema$z\n	.string({ required_error: 'Username is required' })\n	.min(3, { message: 'Username is too short' })\n	.max(20, { message: 'Username is too long' })\n	.regex(/^[a-zA-Z0-9_]+$/, {\n		message: 'Username can only include letters, numbers, and underscores',\n	})\n	// users can type the username in any case, but we store it in lowercase\n	.transform");
$RefreshReg$(_c2, "UsernameSchema");
$RefreshReg$(_c3, "EmailSchema$z\n	.string({ required_error: 'Email is required' })\n	.email({ message: 'Email is invalid' })\n	.min(3, { message: 'Email is too short' })\n	.max(100, { message: 'Email is too long' })\n	// users can type the email in any case, but we store it in lowercase\n	.transform");
$RefreshReg$(_c4, "EmailSchema");
$RefreshReg$(_c5, "PasswordAndConfirmPasswordSchema$z\n	.object({ password: PasswordSchema, confirmPassword: PasswordSchema })\n	.superRefine");
$RefreshReg$(_c6, "PasswordAndConfirmPasswordSchema");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  UsernameSchema,
  PasswordSchema,
  NameSchema,
  EmailSchema,
  PasswordAndConfirmPasswordSchema
};
//# sourceMappingURL=/build/_shared/chunk-EJKYYODX.js.map
