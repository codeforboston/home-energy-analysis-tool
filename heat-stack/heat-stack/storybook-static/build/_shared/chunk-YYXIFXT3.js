import {
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __export,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// node_modules/@sentry/utils/esm/is.js
var objectToString = Object.prototype.toString;
function isError(wat) {
  switch (objectToString.call(wat)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}
function isErrorEvent(wat) {
  return isBuiltin(wat, "ErrorEvent");
}
function isDOMError(wat) {
  return isBuiltin(wat, "DOMError");
}
function isDOMException(wat) {
  return isBuiltin(wat, "DOMException");
}
function isString(wat) {
  return isBuiltin(wat, "String");
}
function isPrimitive(wat) {
  return wat === null || typeof wat !== "object" && typeof wat !== "function";
}
function isPlainObject(wat) {
  return isBuiltin(wat, "Object");
}
function isEvent(wat) {
  return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
function isElement(wat) {
  return typeof Element !== "undefined" && isInstanceOf(wat, Element);
}
function isRegExp(wat) {
  return isBuiltin(wat, "RegExp");
}
function isThenable(wat) {
  return Boolean(wat && wat.then && typeof wat.then === "function");
}
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
function isNaN2(wat) {
  return typeof wat === "number" && wat !== wat;
}
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}
function isVueViewModel(wat) {
  return !!(typeof wat === "object" && wat !== null && (wat.__isVue || wat._isVue));
}

// node_modules/@sentry/utils/esm/string.js
function truncate(str, max = 0) {
  if (typeof str !== "string" || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.slice(0, max)}...`;
}
function safeJoin(input, delimiter) {
  if (!Array.isArray(input)) {
    return "";
  }
  const output = [];
  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    try {
      if (isVueViewModel(value)) {
        output.push("[VueViewModel]");
      } else {
        output.push(String(value));
      }
    } catch (e2) {
      output.push("[value cannot be serialized]");
    }
  }
  return output.join(delimiter);
}
function isMatchingPattern(value, pattern, requireExactStringMatch = false) {
  if (!isString(value)) {
    return false;
  }
  if (isRegExp(pattern)) {
    return pattern.test(value);
  }
  if (isString(pattern)) {
    return requireExactStringMatch ? value === pattern : value.includes(pattern);
  }
  return false;
}
function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = false) {
  return patterns.some((pattern) => isMatchingPattern(testString, pattern, requireExactStringMatch));
}

// node_modules/@sentry/utils/esm/aggregate-errors.js
function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, maxValueLimit = 250, key, limit, event, hint) {
  if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
    return;
  }
  const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : void 0;
  if (originalException) {
    event.exception.values = truncateAggregateExceptions(
      aggregateExceptionsFromError(
        exceptionFromErrorImplementation,
        parser,
        limit,
        hint.originalException,
        key,
        event.exception.values,
        originalException,
        0
      ),
      maxValueLimit
    );
  }
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error, key, prevExceptions, exception, exceptionId) {
  if (prevExceptions.length >= limit + 1) {
    return prevExceptions;
  }
  let newExceptions = [...prevExceptions];
  if (isInstanceOf(error[key], Error)) {
    applyExceptionGroupFieldsForParentException(exception, exceptionId);
    const newException = exceptionFromErrorImplementation(parser, error[key]);
    const newExceptionId = newExceptions.length;
    applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId);
    newExceptions = aggregateExceptionsFromError(
      exceptionFromErrorImplementation,
      parser,
      limit,
      error[key],
      key,
      [newException, ...newExceptions],
      newException,
      newExceptionId
    );
  }
  if (Array.isArray(error.errors)) {
    error.errors.forEach((childError, i) => {
      if (isInstanceOf(childError, Error)) {
        applyExceptionGroupFieldsForParentException(exception, exceptionId);
        const newException = exceptionFromErrorImplementation(parser, childError);
        const newExceptionId = newExceptions.length;
        applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId);
        newExceptions = aggregateExceptionsFromError(
          exceptionFromErrorImplementation,
          parser,
          limit,
          childError,
          key,
          [newException, ...newExceptions],
          newException,
          newExceptionId
        );
      }
    });
  }
  return newExceptions;
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId) {
  exception.mechanism = exception.mechanism || { type: "generic", handled: true };
  exception.mechanism = {
    ...exception.mechanism,
    is_exception_group: true,
    exception_id: exceptionId
  };
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
  exception.mechanism = exception.mechanism || { type: "generic", handled: true };
  exception.mechanism = {
    ...exception.mechanism,
    type: "chained",
    source,
    exception_id: exceptionId,
    parent_id: parentId
  };
}
function truncateAggregateExceptions(exceptions, maxValueLength) {
  return exceptions.map((exception) => {
    if (exception.value) {
      exception.value = truncate(exception.value, maxValueLength);
    }
    return exception;
  });
}

// node_modules/@sentry/utils/esm/worldwide.js
function isGlobalObj(obj) {
  return obj && obj.Math == Math ? obj : void 0;
}
var GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || // eslint-disable-next-line no-restricted-globals
typeof window == "object" && isGlobalObj(window) || typeof self == "object" && isGlobalObj(self) || typeof globalThis == "object" && isGlobalObj(globalThis) || function() {
  return this;
}() || {};
function getGlobalObject() {
  return GLOBAL_OBJ;
}
function getGlobalSingleton(name, creator, obj) {
  const gbl = obj || GLOBAL_OBJ;
  const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
  const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}

// node_modules/@sentry/utils/esm/browser.js
var WINDOW = getGlobalObject();
var DEFAULT_MAX_STRING_LENGTH = 80;
function htmlTreeAsString(elem, options = {}) {
  if (!elem) {
    return "<unknown>";
  }
  try {
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5;
    const out = [];
    let height = 0;
    let len = 0;
    const separator = " > ";
    const sepLength = separator.length;
    let nextStr;
    const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
    const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
    while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs);
      if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
        break;
      }
      out.push(nextStr);
      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }
    return out.reverse().join(separator);
  } catch (_oO) {
    return "<unknown>";
  }
}
function _htmlElementAsString(el, keyAttrs) {
  const elem = el;
  const out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;
  if (!elem || !elem.tagName) {
    return "";
  }
  out.push(elem.tagName.toLowerCase());
  const keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter((keyAttr) => elem.getAttribute(keyAttr)).map((keyAttr) => [keyAttr, elem.getAttribute(keyAttr)]) : null;
  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach((keyAttrPair) => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`);
    }
    className = elem.className;
    if (className && isString(className)) {
      classes = className.split(/\s+/);
      for (i = 0; i < classes.length; i++) {
        out.push(`.${classes[i]}`);
      }
    }
  }
  const allowedAttrs = ["aria-label", "type", "name", "title", "alt"];
  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push(`[${key}="${attr}"]`);
    }
  }
  return out.join("");
}
function getLocationHref() {
  try {
    return WINDOW.document.location.href;
  } catch (oO) {
    return "";
  }
}
function getDomElement(selector) {
  if (WINDOW.document && WINDOW.document.querySelector) {
    return WINDOW.document.querySelector(selector);
  }
  return null;
}

// node_modules/@sentry/utils/esm/debug-build.js
var DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// node_modules/@sentry/utils/esm/logger.js
var PREFIX = "Sentry Logger ";
var CONSOLE_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
  "log",
  "assert",
  "trace"
];
var originalConsoleMethods = {};
function consoleSandbox(callback) {
  if (!("console" in GLOBAL_OBJ)) {
    return callback();
  }
  const console2 = GLOBAL_OBJ.console;
  const wrappedFuncs = {};
  const wrappedLevels = Object.keys(originalConsoleMethods);
  wrappedLevels.forEach((level) => {
    const originalConsoleMethod = originalConsoleMethods[level];
    wrappedFuncs[level] = console2[level];
    console2[level] = originalConsoleMethod;
  });
  try {
    return callback();
  } finally {
    wrappedLevels.forEach((level) => {
      console2[level] = wrappedFuncs[level];
    });
  }
}
function makeLogger() {
  let enabled = false;
  const logger2 = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
    isEnabled: () => enabled
  };
  if (DEBUG_BUILD) {
    CONSOLE_LEVELS.forEach((name) => {
      logger2[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach((name) => {
      logger2[name] = () => void 0;
    });
  }
  return logger2;
}
var logger = makeLogger();

// node_modules/@sentry/utils/esm/dsn.js
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
  return protocol === "http" || protocol === "https";
}
function dsnToString(dsn, withPassword = false) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
function dsnFromString(str) {
  const match = DSN_REGEX.exec(str);
  if (!match) {
    consoleSandbox(() => {
      console.error(`Invalid Sentry Dsn: ${str}`);
    });
    return void 0;
  }
  const [protocol, publicKey, pass = "", host, port = "", lastPath] = match.slice(1);
  let path = "";
  let projectId = lastPath;
  const split = projectId.split("/");
  if (split.length > 1) {
    path = split.slice(0, -1).join("/");
    projectId = split.pop();
  }
  if (projectId) {
    const projectMatch = projectId.match(/^\d+/);
    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }
  return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
}
function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || "",
    pass: components.pass || "",
    host: components.host,
    port: components.port || "",
    path: components.path || "",
    projectId: components.projectId
  };
}
function validateDsn(dsn) {
  if (!DEBUG_BUILD) {
    return true;
  }
  const { port, projectId, protocol } = dsn;
  const requiredComponents = ["protocol", "publicKey", "host", "projectId"];
  const hasMissingRequiredComponent = requiredComponents.find((component) => {
    if (!dsn[component]) {
      logger.error(`Invalid Sentry Dsn: ${component} missing`);
      return true;
    }
    return false;
  });
  if (hasMissingRequiredComponent) {
    return false;
  }
  if (!projectId.match(/^\d+$/)) {
    logger.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
    return false;
  }
  if (!isValidProtocol(protocol)) {
    logger.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
    return false;
  }
  if (port && isNaN(parseInt(port, 10))) {
    logger.error(`Invalid Sentry Dsn: Invalid port ${port}`);
    return false;
  }
  return true;
}
function makeDsn(from) {
  const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
  if (!components || !validateDsn(components)) {
    return void 0;
  }
  return components;
}

// node_modules/@sentry/utils/esm/error.js
var SentryError = class extends Error {
  /** Display name of this error instance. */
  constructor(message, logLevel = "warn") {
    super(message);
    this.message = message;
    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.logLevel = logLevel;
  }
};

// node_modules/@sentry/utils/esm/object.js
function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }
  const original = source[name];
  const wrapped = replacementFactory(original);
  if (typeof wrapped === "function") {
    markFunctionWrapped(wrapped, original);
  }
  source[name] = wrapped;
}
function addNonEnumerableProperty(obj, name, value) {
  try {
    Object.defineProperty(obj, name, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value,
      writable: true,
      configurable: true
    });
  } catch (o_O) {
    DEBUG_BUILD && logger.log(`Failed to add non-enumerable property "${name}" to object`, obj);
  }
}
function markFunctionWrapped(wrapped, original) {
  try {
    const proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto;
    addNonEnumerableProperty(wrapped, "__sentry_original__", original);
  } catch (o_O) {
  }
}
function getOriginalFunction(func) {
  return func.__sentry_original__;
}
function urlEncode(object) {
  return Object.keys(object).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join("&");
}
function convertToPlainObject(value) {
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value)
    };
  } else if (isEvent(value)) {
    const newObj = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value)
    };
    if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
      newObj.detail = value.detail;
    }
    return newObj;
  } else {
    return value;
  }
}
function serializeEventTarget(target) {
  try {
    return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return "<unknown>";
  }
}
function getOwnProperties(obj) {
  if (typeof obj === "object" && obj !== null) {
    const extractedProps = {};
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = obj[property];
      }
    }
    return extractedProps;
  } else {
    return {};
  }
}
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  const keys = Object.keys(convertToPlainObject(exception));
  keys.sort();
  if (!keys.length) {
    return "[object has no keys]";
  }
  if (keys[0].length >= maxLength) {
    return truncate(keys[0], maxLength);
  }
  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    const serialized = keys.slice(0, includedKeys).join(", ");
    if (serialized.length > maxLength) {
      continue;
    }
    if (includedKeys === keys.length) {
      return serialized;
    }
    return truncate(serialized, maxLength);
  }
  return "";
}
function dropUndefinedKeys(inputValue) {
  const memoizationMap = /* @__PURE__ */ new Map();
  return _dropUndefinedKeys(inputValue, memoizationMap);
}
function _dropUndefinedKeys(inputValue, memoizationMap) {
  if (isPlainObject(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = {};
    memoizationMap.set(inputValue, returnValue);
    for (const key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== "undefined") {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }
    return returnValue;
  }
  if (Array.isArray(inputValue)) {
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== void 0) {
      return memoVal;
    }
    const returnValue = [];
    memoizationMap.set(inputValue, returnValue);
    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });
    return returnValue;
  }
  return inputValue;
}

// node_modules/@sentry/utils/esm/stacktrace.js
var STACKTRACE_FRAME_LIMIT = 50;
var WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
var STRIP_FRAME_REGEXP = /captureMessage|captureException/;
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirst = 0) => {
    const frames = [];
    const lines = stack.split("\n");
    for (let i = skipFirst; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 1024) {
        continue;
      }
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (cleanedLine.match(/\S*Error: /)) {
        continue;
      }
      for (const parser of sortedParsers) {
        const frame = parser(cleanedLine);
        if (frame) {
          frames.push(frame);
          break;
        }
      }
      if (frames.length >= STACKTRACE_FRAME_LIMIT) {
        break;
      }
    }
    return stripSentryFramesAndReverse(frames);
  };
}
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }
  const localStack = Array.from(stack);
  if (/sentryWrapped/.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
  }
  localStack.reverse();
  if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
    localStack.pop();
    if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
      localStack.pop();
    }
  }
  return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || localStack[localStack.length - 1].filename,
    function: frame.function || "?"
  }));
}
var defaultFunctionName = "<anonymous>";
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== "function") {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e2) {
    return defaultFunctionName;
  }
}

// node_modules/@sentry/utils/esm/instrument/_handlers.js
var handlers = {};
var instrumented = {};
function addHandler(type, handler) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(handler);
}
function maybeInstrument(type, instrumentFn) {
  if (!instrumented[type]) {
    instrumentFn();
    instrumented[type] = true;
  }
}
function triggerHandlers(type, data) {
  const typeHandlers = type && handlers[type];
  if (!typeHandlers) {
    return;
  }
  for (const handler of typeHandlers) {
    try {
      handler(data);
    } catch (e2) {
      DEBUG_BUILD && logger.error(
        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`,
        e2
      );
    }
  }
}

// node_modules/@sentry/utils/esm/instrument/console.js
function addConsoleInstrumentationHandler(handler) {
  const type = "console";
  addHandler(type, handler);
  maybeInstrument(type, instrumentConsole);
}
function instrumentConsole() {
  if (!("console" in GLOBAL_OBJ)) {
    return;
  }
  CONSOLE_LEVELS.forEach(function(level) {
    if (!(level in GLOBAL_OBJ.console)) {
      return;
    }
    fill(GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
      originalConsoleMethods[level] = originalConsoleMethod;
      return function(...args) {
        const handlerData = { args, level };
        triggerHandlers("console", handlerData);
        const log = originalConsoleMethods[level];
        log && log.apply(GLOBAL_OBJ.console, args);
      };
    });
  });
}

// node_modules/@sentry/utils/esm/misc.js
function uuid4() {
  const gbl = GLOBAL_OBJ;
  const crypto = gbl.crypto || gbl.msCrypto;
  let getRandomByte = () => Math.random() * 16;
  try {
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID().replace(/-/g, "");
    }
    if (crypto && crypto.getRandomValues) {
      getRandomByte = () => crypto.getRandomValues(new Uint8Array(1))[0];
    }
  } catch (_) {
  }
  return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(
    /[018]/g,
    (c) => (
      // eslint-disable-next-line no-bitwise
      (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
    )
  );
}
function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : void 0;
}
function getEventDescription(event) {
  const { message, event_id: eventId } = event;
  if (message) {
    return message;
  }
  const firstException = getFirstException(event);
  if (firstException) {
    if (firstException.type && firstException.value) {
      return `${firstException.type}: ${firstException.value}`;
    }
    return firstException.type || firstException.value || eventId || "<unknown>";
  }
  return eventId || "<unknown>";
}
function addExceptionTypeValue(event, value, type) {
  const exception = event.exception = event.exception || {};
  const values = exception.values = exception.values || [];
  const firstException = values[0] = values[0] || {};
  if (!firstException.value) {
    firstException.value = value || "";
  }
  if (!firstException.type) {
    firstException.type = type || "Error";
  }
}
function addExceptionMechanism(event, newMechanism) {
  const firstException = getFirstException(event);
  if (!firstException) {
    return;
  }
  const defaultMechanism = { type: "generic", handled: true };
  const currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
  if (newMechanism && "data" in newMechanism) {
    const mergedData = { ...currentMechanism && currentMechanism.data, ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}
function checkOrSetAlreadyCaught(exception) {
  if (exception && exception.__sentry_captured__) {
    return true;
  }
  try {
    addNonEnumerableProperty(exception, "__sentry_captured__", true);
  } catch (err) {
  }
  return false;
}
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

// node_modules/@sentry/utils/esm/instrument/dom.js
var WINDOW2 = GLOBAL_OBJ;
var DEBOUNCE_DURATION = 1e3;
var debounceTimerID;
var lastCapturedEventType;
var lastCapturedEventTargetId;
function addClickKeypressInstrumentationHandler(handler) {
  const type = "dom";
  addHandler(type, handler);
  maybeInstrument(type, instrumentDOM);
}
function instrumentDOM() {
  if (!WINDOW2.document) {
    return;
  }
  const triggerDOMHandler = triggerHandlers.bind(null, "dom");
  const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
  WINDOW2.document.addEventListener("click", globalDOMEventHandler, false);
  WINDOW2.document.addEventListener("keypress", globalDOMEventHandler, false);
  ["EventTarget", "Node"].forEach((target) => {
    const proto = WINDOW2[target] && WINDOW2[target].prototype;
    if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty("addEventListener")) {
      return;
    }
    fill(proto, "addEventListener", function(originalAddEventListener) {
      return function(type, listener, options) {
        if (type === "click" || type == "keypress") {
          try {
            const el = this;
            const handlers4 = el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {};
            const handlerForType = handlers4[type] = handlers4[type] || { refCount: 0 };
            if (!handlerForType.handler) {
              const handler = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler;
              originalAddEventListener.call(this, type, handler, options);
            }
            handlerForType.refCount++;
          } catch (e2) {
          }
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    });
    fill(
      proto,
      "removeEventListener",
      function(originalRemoveEventListener) {
        return function(type, listener, options) {
          if (type === "click" || type == "keypress") {
            try {
              const el = this;
              const handlers4 = el.__sentry_instrumentation_handlers__ || {};
              const handlerForType = handlers4[type];
              if (handlerForType) {
                handlerForType.refCount--;
                if (handlerForType.refCount <= 0) {
                  originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                  handlerForType.handler = void 0;
                  delete handlers4[type];
                }
                if (Object.keys(handlers4).length === 0) {
                  delete el.__sentry_instrumentation_handlers__;
                }
              }
            } catch (e2) {
            }
          }
          return originalRemoveEventListener.call(this, type, listener, options);
        };
      }
    );
  });
}
function isSimilarToLastCapturedEvent(event) {
  if (event.type !== lastCapturedEventType) {
    return false;
  }
  try {
    if (!event.target || event.target._sentryId !== lastCapturedEventTargetId) {
      return false;
    }
  } catch (e2) {
  }
  return true;
}
function shouldSkipDOMEvent(eventType, target) {
  if (eventType !== "keypress") {
    return false;
  }
  if (!target || !target.tagName) {
    return true;
  }
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
    return false;
  }
  return true;
}
function makeDOMEventHandler(handler, globalListener = false) {
  return (event) => {
    if (!event || event["_sentryCaptured"]) {
      return;
    }
    const target = getEventTarget(event);
    if (shouldSkipDOMEvent(event.type, target)) {
      return;
    }
    addNonEnumerableProperty(event, "_sentryCaptured", true);
    if (target && !target._sentryId) {
      addNonEnumerableProperty(target, "_sentryId", uuid4());
    }
    const name = event.type === "keypress" ? "input" : event.type;
    if (!isSimilarToLastCapturedEvent(event)) {
      const handlerData = { event, name, global: globalListener };
      handler(handlerData);
      lastCapturedEventType = event.type;
      lastCapturedEventTargetId = target ? target._sentryId : void 0;
    }
    clearTimeout(debounceTimerID);
    debounceTimerID = WINDOW2.setTimeout(() => {
      lastCapturedEventTargetId = void 0;
      lastCapturedEventType = void 0;
    }, DEBOUNCE_DURATION);
  };
}
function getEventTarget(event) {
  try {
    return event.target;
  } catch (e2) {
    return null;
  }
}

// node_modules/@sentry/utils/esm/supports.js
var WINDOW3 = getGlobalObject();
function supportsFetch() {
  if (!("fetch" in WINDOW3)) {
    return false;
  }
  try {
    new Headers();
    new Request("http://www.example.com");
    new Response();
    return true;
  } catch (e2) {
    return false;
  }
}
function isNativeFetch(func) {
  return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
function supportsNativeFetch() {
  if (typeof EdgeRuntime === "string") {
    return true;
  }
  if (!supportsFetch()) {
    return false;
  }
  if (isNativeFetch(WINDOW3.fetch)) {
    return true;
  }
  let result = false;
  const doc = WINDOW3.document;
  if (doc && typeof doc.createElement === "function") {
    try {
      const sandbox = doc.createElement("iframe");
      sandbox.hidden = true;
      doc.head.appendChild(sandbox);
      if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
        result = isNativeFetch(sandbox.contentWindow.fetch);
      }
      doc.head.removeChild(sandbox);
    } catch (err) {
      DEBUG_BUILD && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
    }
  }
  return result;
}

// node_modules/@sentry/utils/esm/instrument/fetch.js
function addFetchInstrumentationHandler(handler) {
  const type = "fetch";
  addHandler(type, handler);
  maybeInstrument(type, instrumentFetch);
}
function instrumentFetch() {
  if (!supportsNativeFetch()) {
    return;
  }
  fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
    return function(...args) {
      const { method, url } = parseFetchArgs(args);
      const handlerData = {
        args,
        fetchData: {
          method,
          url
        },
        startTimestamp: Date.now()
      };
      triggerHandlers("fetch", {
        ...handlerData
      });
      return originalFetch.apply(GLOBAL_OBJ, args).then(
        (response) => {
          const finishedHandlerData = {
            ...handlerData,
            endTimestamp: Date.now(),
            response
          };
          triggerHandlers("fetch", finishedHandlerData);
          return response;
        },
        (error) => {
          const erroredHandlerData = {
            ...handlerData,
            endTimestamp: Date.now(),
            error
          };
          triggerHandlers("fetch", erroredHandlerData);
          throw error;
        }
      );
    };
  });
}
function hasProp(obj, prop) {
  return !!obj && typeof obj === "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
  if (typeof resource === "string") {
    return resource;
  }
  if (!resource) {
    return "";
  }
  if (hasProp(resource, "url")) {
    return resource.url;
  }
  if (resource.toString) {
    return resource.toString();
  }
  return "";
}
function parseFetchArgs(fetchArgs) {
  if (fetchArgs.length === 0) {
    return { method: "GET", url: "" };
  }
  if (fetchArgs.length === 2) {
    const [url, options] = fetchArgs;
    return {
      url: getUrlFromResource(url),
      method: hasProp(options, "method") ? String(options.method).toUpperCase() : "GET"
    };
  }
  const arg = fetchArgs[0];
  return {
    url: getUrlFromResource(arg),
    method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
  };
}

// node_modules/@sentry/utils/esm/instrument/globalError.js
var _oldOnErrorHandler = null;
function addGlobalErrorInstrumentationHandler(handler) {
  const type = "error";
  addHandler(type, handler);
  maybeInstrument(type, instrumentError);
}
function instrumentError() {
  _oldOnErrorHandler = GLOBAL_OBJ.onerror;
  GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
    const handlerData = {
      column,
      error,
      line,
      msg,
      url
    };
    triggerHandlers("error", handlerData);
    if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
      return _oldOnErrorHandler.apply(this, arguments);
    }
    return false;
  };
  GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
}

// node_modules/@sentry/utils/esm/instrument/globalUnhandledRejection.js
var _oldOnUnhandledRejectionHandler = null;
function addGlobalUnhandledRejectionInstrumentationHandler(handler) {
  const type = "unhandledrejection";
  addHandler(type, handler);
  maybeInstrument(type, instrumentUnhandledRejection);
}
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = GLOBAL_OBJ.onunhandledrejection;
  GLOBAL_OBJ.onunhandledrejection = function(e2) {
    const handlerData = e2;
    triggerHandlers("unhandledrejection", handlerData);
    if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
      return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }
    return true;
  };
  GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}

// node_modules/@sentry/utils/esm/vendor/supportsHistory.js
var WINDOW4 = getGlobalObject();
function supportsHistory() {
  const chrome2 = WINDOW4.chrome;
  const isChromePackagedApp = chrome2 && chrome2.app && chrome2.app.runtime;
  const hasHistoryApi = "history" in WINDOW4 && !!WINDOW4.history.pushState && !!WINDOW4.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

// node_modules/@sentry/utils/esm/instrument/history.js
var WINDOW5 = GLOBAL_OBJ;
var lastHref;
function addHistoryInstrumentationHandler(handler) {
  const type = "history";
  addHandler(type, handler);
  maybeInstrument(type, instrumentHistory);
}
function instrumentHistory() {
  if (!supportsHistory()) {
    return;
  }
  const oldOnPopState = WINDOW5.onpopstate;
  WINDOW5.onpopstate = function(...args) {
    const to = WINDOW5.location.href;
    const from = lastHref;
    lastHref = to;
    const handlerData = { from, to };
    triggerHandlers("history", handlerData);
    if (oldOnPopState) {
      try {
        return oldOnPopState.apply(this, args);
      } catch (_oO) {
      }
    }
  };
  function historyReplacementFunction(originalHistoryFunction) {
    return function(...args) {
      const url = args.length > 2 ? args[2] : void 0;
      if (url) {
        const from = lastHref;
        const to = String(url);
        lastHref = to;
        const handlerData = { from, to };
        triggerHandlers("history", handlerData);
      }
      return originalHistoryFunction.apply(this, args);
    };
  }
  fill(WINDOW5.history, "pushState", historyReplacementFunction);
  fill(WINDOW5.history, "replaceState", historyReplacementFunction);
}

// node_modules/@sentry/utils/esm/instrument/xhr.js
var WINDOW6 = GLOBAL_OBJ;
var SENTRY_XHR_DATA_KEY = "__sentry_xhr_v3__";
function addXhrInstrumentationHandler(handler) {
  const type = "xhr";
  addHandler(type, handler);
  maybeInstrument(type, instrumentXHR);
}
function instrumentXHR() {
  if (!WINDOW6.XMLHttpRequest) {
    return;
  }
  const xhrproto = XMLHttpRequest.prototype;
  fill(xhrproto, "open", function(originalOpen) {
    return function(...args) {
      const startTimestamp = Date.now();
      const method = isString(args[0]) ? args[0].toUpperCase() : void 0;
      const url = parseUrl(args[1]);
      if (!method || !url) {
        return;
      }
      this[SENTRY_XHR_DATA_KEY] = {
        method,
        url,
        request_headers: {}
      };
      if (method === "POST" && url.match(/sentry_key/)) {
        this.__sentry_own_request__ = true;
      }
      const onreadystatechangeHandler = () => {
        const xhrInfo = this[SENTRY_XHR_DATA_KEY];
        if (!xhrInfo) {
          return;
        }
        if (this.readyState === 4) {
          try {
            xhrInfo.status_code = this.status;
          } catch (e2) {
          }
          const handlerData = {
            args: [method, url],
            endTimestamp: Date.now(),
            startTimestamp,
            xhr: this
          };
          triggerHandlers("xhr", handlerData);
        }
      };
      if ("onreadystatechange" in this && typeof this.onreadystatechange === "function") {
        fill(this, "onreadystatechange", function(original) {
          return function(...readyStateArgs) {
            onreadystatechangeHandler();
            return original.apply(this, readyStateArgs);
          };
        });
      } else {
        this.addEventListener("readystatechange", onreadystatechangeHandler);
      }
      fill(this, "setRequestHeader", function(original) {
        return function(...setRequestHeaderArgs) {
          const [header, value] = setRequestHeaderArgs;
          const xhrInfo = this[SENTRY_XHR_DATA_KEY];
          if (xhrInfo && isString(header) && isString(value)) {
            xhrInfo.request_headers[header.toLowerCase()] = value;
          }
          return original.apply(this, setRequestHeaderArgs);
        };
      });
      return originalOpen.apply(this, args);
    };
  });
  fill(xhrproto, "send", function(originalSend) {
    return function(...args) {
      const sentryXhrData = this[SENTRY_XHR_DATA_KEY];
      if (!sentryXhrData) {
        return;
      }
      if (args[0] !== void 0) {
        sentryXhrData.body = args[0];
      }
      const handlerData = {
        args: [sentryXhrData.method, sentryXhrData.url],
        startTimestamp: Date.now(),
        xhr: this
      };
      triggerHandlers("xhr", handlerData);
      return originalSend.apply(this, args);
    };
  });
}
function parseUrl(url) {
  if (isString(url)) {
    return url;
  }
  try {
    return url.toString();
  } catch (e2) {
  }
  return void 0;
}

// node_modules/@sentry/utils/esm/env.js
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" && !!__SENTRY_BROWSER_BUNDLE__;
}
function getSDKSource() {
  return "npm";
}

// node_modules/@sentry/utils/esm/node.js
function isNodeEnv() {
  return !isBrowserBundle() && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}
function dynamicRequire(mod, request) {
  return mod.require(request);
}

// node_modules/@sentry/utils/esm/isBrowser.js
function isBrowser() {
  return typeof window !== "undefined" && (!isNodeEnv() || isElectronNodeRenderer());
}
function isElectronNodeRenderer() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    GLOBAL_OBJ.process !== void 0 && GLOBAL_OBJ.process.type === "renderer"
  );
}

// node_modules/@sentry/utils/esm/memo.js
function memoBuilder() {
  const hasWeakSet = typeof WeakSet === "function";
  const inner = hasWeakSet ? /* @__PURE__ */ new WeakSet() : [];
  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }
      inner.add(obj);
      return false;
    }
    for (let i = 0; i < inner.length; i++) {
      const value = inner[i];
      if (value === obj) {
        return true;
      }
    }
    inner.push(obj);
    return false;
  }
  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }
  return [memoize, unmemoize];
}

// node_modules/@sentry/utils/esm/normalize.js
function normalize(input, depth = 100, maxProperties = Infinity) {
  try {
    return visit("", input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}
function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
  const normalized = normalize(object, depth);
  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }
  return normalized;
}
function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
  const [memoize, unmemoize] = memo;
  if (value == null || // this matches null and undefined -> eqeq not eqeqeq
  ["number", "boolean", "string"].includes(typeof value) && !isNaN2(value)) {
    return value;
  }
  const stringified = stringifyValue(key, value);
  if (!stringified.startsWith("[object ")) {
    return stringified;
  }
  if (value["__sentry_skip_normalization__"]) {
    return value;
  }
  const remainingDepth = typeof value["__sentry_override_normalization_depth__"] === "number" ? value["__sentry_override_normalization_depth__"] : depth;
  if (remainingDepth === 0) {
    return stringified.replace("object ", "");
  }
  if (memoize(value)) {
    return "[Circular ~]";
  }
  const valueWithToJSON = value;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
    try {
      const jsonValue = valueWithToJSON.toJSON();
      return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
    } catch (err) {
    }
  }
  const normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0;
  const visitable = convertToPlainObject(value);
  for (const visitKey in visitable) {
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }
    if (numAdded >= maxProperties) {
      normalized[visitKey] = "[MaxProperties ~]";
      break;
    }
    const visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
    numAdded++;
  }
  unmemoize(value);
  return normalized;
}
function stringifyValue(key, value) {
  try {
    if (key === "domain" && value && typeof value === "object" && value._events) {
      return "[Domain]";
    }
    if (key === "domainEmitter") {
      return "[DomainEmitter]";
    }
    if (typeof globalThis !== "undefined" && value === globalThis) {
      return "[Global]";
    }
    if (typeof window !== "undefined" && value === window) {
      return "[Window]";
    }
    if (typeof document !== "undefined" && value === document) {
      return "[Document]";
    }
    if (isVueViewModel(value)) {
      return "[VueViewModel]";
    }
    if (isSyntheticEvent(value)) {
      return "[SyntheticEvent]";
    }
    if (typeof value === "number" && value !== value) {
      return "[NaN]";
    }
    if (typeof value === "function") {
      return `[Function: ${getFunctionName(value)}]`;
    }
    if (typeof value === "symbol") {
      return `[${String(value)}]`;
    }
    if (typeof value === "bigint") {
      return `[BigInt: ${String(value)}]`;
    }
    const objName = getConstructorName(value);
    if (/^HTML(\w*)Element$/.test(objName)) {
      return `[HTMLElement: ${objName}]`;
    }
    return `[object ${objName}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}
function getConstructorName(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype ? prototype.constructor.name : "null prototype";
}
function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}

// node_modules/@sentry/utils/esm/syncpromise.js
var States;
(function(States2) {
  const PENDING = 0;
  States2[States2["PENDING"] = PENDING] = "PENDING";
  const RESOLVED = 1;
  States2[States2["RESOLVED"] = RESOLVED] = "RESOLVED";
  const REJECTED = 2;
  States2[States2["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));
function resolvedSyncPromise(value) {
  return new SyncPromise((resolve) => {
    resolve(value);
  });
}
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
var SyncPromise = class {
  constructor(executor) {
    SyncPromise.prototype.__init.call(this);
    SyncPromise.prototype.__init2.call(this);
    SyncPromise.prototype.__init3.call(this);
    SyncPromise.prototype.__init4.call(this);
    this._state = States.PENDING;
    this._handlers = [];
    try {
      executor(this._resolve, this._reject);
    } catch (e2) {
      this._reject(e2);
    }
  }
  /** JSDoc */
  then(onfulfilled, onrejected) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([
        false,
        (result) => {
          if (!onfulfilled) {
            resolve(result);
          } else {
            try {
              resolve(onfulfilled(result));
            } catch (e2) {
              reject(e2);
            }
          }
        },
        (reason) => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve(onrejected(reason));
            } catch (e2) {
              reject(e2);
            }
          }
        }
      ]);
      this._executeHandlers();
    });
  }
  /** JSDoc */
  catch(onrejected) {
    return this.then((val) => val, onrejected);
  }
  /** JSDoc */
  finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val;
      let isRejected;
      return this.then(
        (value) => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        (reason) => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        }
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }
        resolve(val);
      });
    });
  }
  /** JSDoc */
  __init() {
    this._resolve = (value) => {
      this._setResult(States.RESOLVED, value);
    };
  }
  /** JSDoc */
  __init2() {
    this._reject = (reason) => {
      this._setResult(States.REJECTED, reason);
    };
  }
  /** JSDoc */
  __init3() {
    this._setResult = (state, value) => {
      if (this._state !== States.PENDING) {
        return;
      }
      if (isThenable(value)) {
        void value.then(this._resolve, this._reject);
        return;
      }
      this._state = state;
      this._value = value;
      this._executeHandlers();
    };
  }
  /** JSDoc */
  __init4() {
    this._executeHandlers = () => {
      if (this._state === States.PENDING) {
        return;
      }
      const cachedHandlers = this._handlers.slice();
      this._handlers = [];
      cachedHandlers.forEach((handler) => {
        if (handler[0]) {
          return;
        }
        if (this._state === States.RESOLVED) {
          handler[1](this._value);
        }
        if (this._state === States.REJECTED) {
          handler[2](this._value);
        }
        handler[0] = true;
      });
    };
  }
};

// node_modules/@sentry/utils/esm/promisebuffer.js
function makePromiseBuffer(limit) {
  const buffer = [];
  function isReady() {
    return limit === void 0 || buffer.length < limit;
  }
  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0];
  }
  function add(taskProducer) {
    if (!isReady()) {
      return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
    }
    const task = taskProducer();
    if (buffer.indexOf(task) === -1) {
      buffer.push(task);
    }
    void task.then(() => remove(task)).then(
      null,
      () => remove(task).then(null, () => {
      })
    );
    return task;
  }
  function drain(timeout) {
    return new SyncPromise((resolve, reject) => {
      let counter = buffer.length;
      if (!counter) {
        return resolve(true);
      }
      const capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve(false);
        }
      }, timeout);
      buffer.forEach((item) => {
        void resolvedSyncPromise(item).then(() => {
          if (!--counter) {
            clearTimeout(capturedSetTimeout);
            resolve(true);
          }
        }, reject);
      });
    });
  }
  return {
    $: buffer,
    add,
    drain
  };
}

// node_modules/@sentry/utils/esm/url.js
function parseUrl2(url) {
  if (!url) {
    return {};
  }
  const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  if (!match) {
    return {};
  }
  const query = match[6] || "";
  const fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    search: query,
    hash: fragment,
    relative: match[5] + query + fragment
    // everything minus origin
  };
}

// node_modules/@sentry/utils/esm/severity.js
var validSeverityLevels = ["fatal", "error", "warning", "log", "info", "debug"];
function severityLevelFromString(level) {
  return level === "warn" ? "warning" : validSeverityLevels.includes(level) ? level : "log";
}

// node_modules/@sentry/utils/esm/time.js
var WINDOW7 = getGlobalObject();
var dateTimestampSource = {
  nowSeconds: () => Date.now() / 1e3
};
function getBrowserPerformance() {
  const { performance: performance2 } = WINDOW7;
  if (!performance2 || !performance2.now) {
    return void 0;
  }
  const timeOrigin = Date.now() - performance2.now();
  return {
    now: () => performance2.now(),
    timeOrigin
  };
}
function getNodePerformance() {
  try {
    const perfHooks = dynamicRequire(module, "perf_hooks");
    return perfHooks.performance;
  } catch (_) {
    return void 0;
  }
}
var platformPerformance = isNodeEnv() ? getNodePerformance() : getBrowserPerformance();
var timestampSource = platformPerformance === void 0 ? dateTimestampSource : {
  nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1e3
};
var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
var _browserPerformanceTimeOriginMode;
var browserPerformanceTimeOrigin = (() => {
  const { performance: performance2 } = WINDOW7;
  if (!performance2 || !performance2.now) {
    _browserPerformanceTimeOriginMode = "none";
    return void 0;
  }
  const threshold = 3600 * 1e3;
  const performanceNow = performance2.now();
  const dateNow = Date.now();
  const timeOriginDelta = performance2.timeOrigin ? Math.abs(performance2.timeOrigin + performanceNow - dateNow) : threshold;
  const timeOriginIsReliable = timeOriginDelta < threshold;
  const navigationStart = performance2.timing && performance2.timing.navigationStart;
  const hasNavigationStart = typeof navigationStart === "number";
  const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  const navigationStartIsReliable = navigationStartDelta < threshold;
  if (timeOriginIsReliable || navigationStartIsReliable) {
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = "timeOrigin";
      return performance2.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = "navigationStart";
      return navigationStart;
    }
  }
  _browserPerformanceTimeOriginMode = "dateNow";
  return dateNow;
})();

// node_modules/@sentry/utils/esm/baggage.js
var BAGGAGE_HEADER_NAME = "baggage";
var SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
var SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
var MAX_BAGGAGE_STRING_LENGTH = 8192;
function baggageHeaderToDynamicSamplingContext(baggageHeader) {
  if (!isString(baggageHeader) && !Array.isArray(baggageHeader)) {
    return void 0;
  }
  let baggageObject = {};
  if (Array.isArray(baggageHeader)) {
    baggageObject = baggageHeader.reduce((acc, curr) => {
      const currBaggageObject = baggageHeaderToObject(curr);
      return {
        ...acc,
        ...currBaggageObject
      };
    }, {});
  } else {
    if (!baggageHeader) {
      return void 0;
    }
    baggageObject = baggageHeaderToObject(baggageHeader);
  }
  const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
    if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
      const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
      acc[nonPrefixedKey] = value;
    }
    return acc;
  }, {});
  if (Object.keys(dynamicSamplingContext).length > 0) {
    return dynamicSamplingContext;
  } else {
    return void 0;
  }
}
function dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext) {
  if (!dynamicSamplingContext) {
    return void 0;
  }
  const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce(
    (acc, [dscKey, dscValue]) => {
      if (dscValue) {
        acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
      }
      return acc;
    },
    {}
  );
  return objectToBaggageHeader(sentryPrefixedDSC);
}
function baggageHeaderToObject(baggageHeader) {
  return baggageHeader.split(",").map((baggageEntry) => baggageEntry.split("=").map((keyOrValue) => decodeURIComponent(keyOrValue.trim()))).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}
function objectToBaggageHeader(object) {
  if (Object.keys(object).length === 0) {
    return void 0;
  }
  return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
    const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
    const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
    if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
      DEBUG_BUILD && logger.warn(
        `Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`
      );
      return baggageHeader;
    } else {
      return newBaggageHeader;
    }
  }, "");
}

// node_modules/@sentry/utils/esm/tracing.js
var TRACEPARENT_REGEXP = new RegExp(
  "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$"
  // whitespace
);
function extractTraceparentData(traceparent) {
  if (!traceparent) {
    return void 0;
  }
  const matches = traceparent.match(TRACEPARENT_REGEXP);
  if (!matches) {
    return void 0;
  }
  let parentSampled;
  if (matches[3] === "1") {
    parentSampled = true;
  } else if (matches[3] === "0") {
    parentSampled = false;
  }
  return {
    traceId: matches[1],
    parentSampled,
    parentSpanId: matches[2]
  };
}
function tracingContextFromHeaders(sentryTrace, baggage) {
  const traceparentData = extractTraceparentData(sentryTrace);
  const dynamicSamplingContext = baggageHeaderToDynamicSamplingContext(baggage);
  const { traceId, parentSpanId, parentSampled } = traceparentData || {};
  const propagationContext = {
    traceId: traceId || uuid4(),
    spanId: uuid4().substring(16),
    sampled: parentSampled
  };
  if (parentSpanId) {
    propagationContext.parentSpanId = parentSpanId;
  }
  if (dynamicSamplingContext) {
    propagationContext.dsc = dynamicSamplingContext;
  }
  return {
    traceparentData,
    dynamicSamplingContext,
    propagationContext
  };
}
function generateSentryTraceHeader(traceId = uuid4(), spanId = uuid4().substring(16), sampled) {
  let sampledString = "";
  if (sampled !== void 0) {
    sampledString = sampled ? "-1" : "-0";
  }
  return `${traceId}-${spanId}${sampledString}`;
}

// node_modules/@sentry/utils/esm/envelope.js
function createEnvelope(headers, items = []) {
  return [headers, items];
}
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
function forEachEnvelopeItem(envelope, callback) {
  const envelopeItems = envelope[1];
  for (const envelopeItem of envelopeItems) {
    const envelopeItemType = envelopeItem[0].type;
    const result = callback(envelopeItem, envelopeItemType);
    if (result) {
      return true;
    }
  }
  return false;
}
function encodeUTF8(input, textEncoder) {
  const utf8 = textEncoder || new TextEncoder();
  return utf8.encode(input);
}
function serializeEnvelope(envelope, textEncoder) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    if (typeof parts === "string") {
      parts = typeof next === "string" ? parts + next : [encodeUTF8(parts, textEncoder), next];
    } else {
      parts.push(typeof next === "string" ? encodeUTF8(next, textEncoder) : next);
    }
  }
  for (const item of items) {
    const [itemHeaders, payload] = item;
    append(`
${JSON.stringify(itemHeaders)}
`);
    if (typeof payload === "string" || payload instanceof Uint8Array) {
      append(payload);
    } else {
      let stringifiedPayload;
      try {
        stringifiedPayload = JSON.stringify(payload);
      } catch (e2) {
        stringifiedPayload = JSON.stringify(normalize(payload));
      }
      append(stringifiedPayload);
    }
  }
  return typeof parts === "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }
  return merged;
}
function createAttachmentEnvelopeItem(attachment, textEncoder) {
  const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
  return [
    dropUndefinedKeys({
      type: "attachment",
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType
    }),
    buffer
  ];
}
var ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: "session",
  sessions: "session",
  attachment: "attachment",
  transaction: "transaction",
  event: "error",
  client_report: "internal",
  user_report: "default",
  profile: "profile",
  replay_event: "replay",
  replay_recording: "replay",
  check_in: "monitor",
  feedback: "feedback",
  // TODO: This is a temporary workaround until we have a proper data category for metrics
  statsd: "unknown"
};
function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
  if (!metadataOrEvent || !metadataOrEvent.sdk) {
    return;
  }
  const { name, version } = metadataOrEvent.sdk;
  return { name, version };
}
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
  return {
    event_id: event.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) },
    ...dynamicSamplingContext && {
      trace: dropUndefinedKeys({ ...dynamicSamplingContext })
    }
  };
}

// node_modules/@sentry/utils/esm/clientreport.js
function createClientReportEnvelope(discarded_events, dsn, timestamp) {
  const clientReportItem = [
    { type: "client_report" },
    {
      timestamp: timestamp || dateTimestampInSeconds(),
      discarded_events
    }
  ];
  return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
}

// node_modules/@sentry/utils/esm/ratelimit.js
var DEFAULT_RETRY_AFTER = 60 * 1e3;
function parseRetryAfterHeader(header, now = Date.now()) {
  const headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay)) {
    return headerDelay * 1e3;
  }
  const headerDate = Date.parse(`${header}`);
  if (!isNaN(headerDate)) {
    return headerDate - now;
  }
  return DEFAULT_RETRY_AFTER;
}
function disabledUntil(limits, category) {
  return limits[category] || limits.all || 0;
}
function isRateLimited(limits, category, now = Date.now()) {
  return disabledUntil(limits, category) > now;
}
function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
  const updatedRateLimits = {
    ...limits
  };
  const rateLimitHeader = headers && headers["x-sentry-rate-limits"];
  const retryAfterHeader = headers && headers["retry-after"];
  if (rateLimitHeader) {
    for (const limit of rateLimitHeader.trim().split(",")) {
      const [retryAfter, categories] = limit.split(":", 2);
      const headerDelay = parseInt(retryAfter, 10);
      const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
      if (!categories) {
        updatedRateLimits.all = now + delay;
      } else {
        for (const category of categories.split(";")) {
          updatedRateLimits[category] = now + delay;
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1e3;
  }
  return updatedRateLimits;
}

// node_modules/@sentry/utils/esm/eventbuilder.js
function parseStackFrames(stackParser, error) {
  return stackParser(error.stack || "", 1);
}
function exceptionFromError(stackParser, error) {
  const exception = {
    type: error.name || error.constructor.name,
    value: error.message
  };
  const frames = parseStackFrames(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  return exception;
}

// node_modules/@sentry/core/esm/debug-build.js
var DEBUG_BUILD2 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// node_modules/@sentry/core/esm/constants.js
var DEFAULT_ENVIRONMENT = "production";

// node_modules/@sentry/core/esm/eventProcessors.js
function getGlobalEventProcessors() {
  return getGlobalSingleton("globalEventProcessors", () => []);
}
function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}
function notifyEventProcessors(processors, event, hint, index = 0) {
  return new SyncPromise((resolve, reject) => {
    const processor = processors[index];
    if (event === null || typeof processor !== "function") {
      resolve(event);
    } else {
      const result = processor({ ...event }, hint);
      DEBUG_BUILD2 && processor.id && result === null && logger.log(`Event processor "${processor.id}" dropped event`);
      if (isThenable(result)) {
        void result.then((final) => notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject);
      } else {
        void notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
      }
    }
  });
}

// node_modules/@sentry/core/esm/session.js
function makeSession(context) {
  const startingTime = timestampInSeconds();
  const session = {
    sid: uuid4(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: "ok",
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session)
  };
  if (context) {
    updateSession(session, context);
  }
  return session;
}
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }
    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }
  session.timestamp = context.timestamp || timestampInSeconds();
  if (context.abnormal_mechanism) {
    session.abnormal_mechanism = context.abnormal_mechanism;
  }
  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    session.sid = context.sid.length === 32 ? context.sid : uuid4();
  }
  if (context.init !== void 0) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === "number") {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = void 0;
  } else if (typeof context.duration === "number") {
    session.duration = context.duration;
  } else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === "number") {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === "ok") {
    context = { status: "exited" };
  }
  updateSession(session, context);
}
function sessionToJSON(session) {
  return dropUndefinedKeys({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1e3).toISOString(),
    timestamp: new Date(session.timestamp * 1e3).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : void 0,
    duration: session.duration,
    abnormal_mechanism: session.abnormal_mechanism,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent
    }
  });
}

// node_modules/@sentry/core/esm/scope.js
var DEFAULT_MAX_BREADCRUMBS = 100;
var Scope = class {
  /** Flag if notifying is happening. */
  /** Callback for client to receive scope changes. */
  /** Callback list that will be called after {@link applyToEvent}. */
  /** Array of breadcrumbs. */
  /** User */
  /** Tags */
  /** Extra */
  /** Contexts */
  /** Attachments */
  /** Propagation Context for distributed tracing */
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  /** Fingerprint */
  /** Severity */
  // eslint-disable-next-line deprecation/deprecation
  /** Transaction Name */
  /** Span */
  /** Session */
  /** Request Mode Session Status */
  // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
    this._propagationContext = generatePropagationContext();
  }
  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
  static clone(scope) {
    const newScope = new Scope();
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = { ...scope._tags };
      newScope._extra = { ...scope._extra };
      newScope._contexts = { ...scope._contexts };
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
      newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata };
      newScope._propagationContext = { ...scope._propagationContext };
    }
    return newScope;
  }
  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
  addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }
  /**
   * @inheritDoc
   */
  addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }
  /**
   * @inheritDoc
   */
  setUser(user) {
    this._user = user || {};
    if (this._session) {
      updateSession(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getUser() {
    return this._user;
  }
  /**
   * @inheritDoc
   */
  getRequestSession() {
    return this._requestSession;
  }
  /**
   * @inheritDoc
   */
  setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }
  /**
   * @inheritDoc
   */
  setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras
    };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setLevel(level) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getSpan() {
    return this._span;
  }
  /**
   * @inheritDoc
   */
  getTransaction() {
    const span = this.getSpan();
    return span && span.transaction;
  }
  /**
   * @inheritDoc
   */
  setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getSession() {
    return this._session;
  }
  /**
   * @inheritDoc
   */
  update(captureContext) {
    if (!captureContext) {
      return this;
    }
    if (typeof captureContext === "function") {
      const updatedScope = captureContext(this);
      return updatedScope instanceof Scope ? updatedScope : this;
    }
    if (captureContext instanceof Scope) {
      this._tags = { ...this._tags, ...captureContext._tags };
      this._extra = { ...this._extra, ...captureContext._extra };
      this._contexts = { ...this._contexts, ...captureContext._contexts };
      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }
      if (captureContext._level) {
        this._level = captureContext._level;
      }
      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }
      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
      if (captureContext._propagationContext) {
        this._propagationContext = captureContext._propagationContext;
      }
    } else if (isPlainObject(captureContext)) {
      captureContext = captureContext;
      this._tags = { ...this._tags, ...captureContext.tags };
      this._extra = { ...this._extra, ...captureContext.extra };
      this._contexts = { ...this._contexts, ...captureContext.contexts };
      if (captureContext.user) {
        this._user = captureContext.user;
      }
      if (captureContext.level) {
        this._level = captureContext.level;
      }
      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }
      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
      if (captureContext.propagationContext) {
        this._propagationContext = captureContext.propagationContext;
      }
    }
    return this;
  }
  /**
   * @inheritDoc
   */
  clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = void 0;
    this._transactionName = void 0;
    this._fingerprint = void 0;
    this._requestSession = void 0;
    this._span = void 0;
    this._session = void 0;
    this._notifyScopeListeners();
    this._attachments = [];
    this._propagationContext = generatePropagationContext();
    return this;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
    if (maxCrumbs <= 0) {
      return this;
    }
    const mergedBreadcrumb = {
      timestamp: dateTimestampInSeconds(),
      ...breadcrumb
    };
    const breadcrumbs = this._breadcrumbs;
    breadcrumbs.push(mergedBreadcrumb);
    this._breadcrumbs = breadcrumbs.length > maxCrumbs ? breadcrumbs.slice(-maxCrumbs) : breadcrumbs;
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  getLastBreadcrumb() {
    return this._breadcrumbs[this._breadcrumbs.length - 1];
  }
  /**
   * @inheritDoc
   */
  clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }
  /**
   * @inheritDoc
   */
  addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }
  /**
   * @inheritDoc
   */
  getAttachments() {
    return this._attachments;
  }
  /**
   * @inheritDoc
   */
  clearAttachments() {
    this._attachments = [];
    return this;
  }
  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
  applyToEvent(event, hint = {}, additionalEventProcessors) {
    if (this._extra && Object.keys(this._extra).length) {
      event.extra = { ...this._extra, ...event.extra };
    }
    if (this._tags && Object.keys(this._tags).length) {
      event.tags = { ...this._tags, ...event.tags };
    }
    if (this._user && Object.keys(this._user).length) {
      event.user = { ...this._user, ...event.user };
    }
    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = { ...this._contexts, ...event.contexts };
    }
    if (this._level) {
      event.level = this._level;
    }
    if (this._transactionName) {
      event.transaction = this._transactionName;
    }
    if (this._span) {
      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
      const transaction = this._span.transaction;
      if (transaction) {
        event.sdkProcessingMetadata = {
          dynamicSamplingContext: transaction.getDynamicSamplingContext(),
          ...event.sdkProcessingMetadata
        };
        const transactionName = transaction.name;
        if (transactionName) {
          event.tags = { transaction: transactionName, ...event.tags };
        }
      }
    }
    this._applyFingerprint(event);
    const scopeBreadcrumbs = this._getBreadcrumbs();
    const breadcrumbs = [...event.breadcrumbs || [], ...scopeBreadcrumbs];
    event.breadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : void 0;
    event.sdkProcessingMetadata = {
      ...event.sdkProcessingMetadata,
      ...this._sdkProcessingMetadata,
      propagationContext: this._propagationContext
    };
    return notifyEventProcessors(
      [...additionalEventProcessors || [], ...getGlobalEventProcessors(), ...this._eventProcessors],
      event,
      hint
    );
  }
  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
  setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };
    return this;
  }
  /**
   * @inheritDoc
   */
  setPropagationContext(context) {
    this._propagationContext = context;
    return this;
  }
  /**
   * @inheritDoc
   */
  getPropagationContext() {
    return this._propagationContext;
  }
  /**
   * Get the breadcrumbs for this scope.
   */
  _getBreadcrumbs() {
    return this._breadcrumbs;
  }
  /**
   * This will be called on every set call.
   */
  _notifyScopeListeners() {
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach((callback) => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }
  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
  _applyFingerprint(event) {
    event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    }
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }
};
function generatePropagationContext() {
  return {
    traceId: uuid4(),
    spanId: uuid4().substring(16)
  };
}

// node_modules/@sentry/core/esm/hub.js
var API_VERSION = 4;
var DEFAULT_BREADCRUMBS = 100;
var Hub = class {
  /** Is a {@link Layer}[] containing the client and scope */
  /** Contains the last event id of a captured event.  */
  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */
  constructor(client, scope = new Scope(), _version = API_VERSION) {
    this._version = _version;
    this._stack = [{ scope }];
    if (client) {
      this.bindClient(client);
    }
  }
  /**
   * @inheritDoc
   */
  isOlderThan(version) {
    return this._version < version;
  }
  /**
   * @inheritDoc
   */
  bindClient(client) {
    const top = this.getStackTop();
    top.client = client;
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }
  /**
   * @inheritDoc
   */
  pushScope() {
    const scope = Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope
    });
    return scope;
  }
  /**
   * @inheritDoc
   */
  popScope() {
    if (this.getStack().length <= 1)
      return false;
    return !!this.getStack().pop();
  }
  /**
   * @inheritDoc
   */
  withScope(callback) {
    const scope = this.pushScope();
    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }
  /**
   * @inheritDoc
   */
  getClient() {
    return this.getStackTop().client;
  }
  /** Returns the scope of the top stack. */
  getScope() {
    return this.getStackTop().scope;
  }
  /** Returns the scope stack for domains or the process. */
  getStack() {
    return this._stack;
  }
  /** Returns the topmost scope layer in the order domain > local > process. */
  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * @inheritDoc
   */
  captureException(exception, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error("Sentry syntheticException");
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId
        },
        scope
      );
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint) {
    const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4();
    const syntheticException = new Error(message);
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId
        },
        scope
      );
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint) {
    const eventId = hint && hint.event_id ? hint.event_id : uuid4();
    if (!event.type) {
      this._lastEventId = eventId;
    }
    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope);
    });
    return eventId;
  }
  /**
   * @inheritDoc
   */
  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   */
  addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();
    if (!client)
      return;
    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions && client.getOptions() || {};
    if (maxBreadcrumbs <= 0)
      return;
    const timestamp = dateTimestampInSeconds();
    const mergedBreadcrumb = { timestamp, ...breadcrumb };
    const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
    if (finalBreadcrumb === null)
      return;
    if (client.emit) {
      client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
    }
    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }
  /**
   * @inheritDoc
   */
  setUser(user) {
    this.getScope().setUser(user);
  }
  /**
   * @inheritDoc
   */
  setTags(tags) {
    this.getScope().setTags(tags);
  }
  /**
   * @inheritDoc
   */
  setExtras(extras) {
    this.getScope().setExtras(extras);
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this.getScope().setTag(key, value);
  }
  /**
   * @inheritDoc
   */
  setExtra(key, extra) {
    this.getScope().setExtra(key, extra);
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setContext(name, context) {
    this.getScope().setContext(name, context);
  }
  /**
   * @inheritDoc
   */
  configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(scope);
    }
  }
  /**
   * @inheritDoc
   */
  run(callback) {
    const oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }
  /**
   * @inheritDoc
   */
  getIntegration(integration) {
    const client = this.getClient();
    if (!client)
      return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      DEBUG_BUILD2 && logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }
  /**
   * @inheritDoc
   */
  startTransaction(context, customSamplingContext) {
    const result = this._callExtensionMethod("startTransaction", context, customSamplingContext);
    if (DEBUG_BUILD2 && !result) {
      const client = this.getClient();
      if (!client) {
        logger.warn(
          "Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'"
        );
      } else {
        logger.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
Sentry.addTracingExtensions();
Sentry.init({...});
`);
      }
    }
    return result;
  }
  /**
   * @inheritDoc
   */
  traceHeaders() {
    return this._callExtensionMethod("traceHeaders");
  }
  /**
   * @inheritDoc
   */
  captureSession(endSession = false) {
    if (endSession) {
      return this.endSession();
    }
    this._sendSessionUpdate();
  }
  /**
   * @inheritDoc
   */
  endSession() {
    const layer = this.getStackTop();
    const scope = layer.scope;
    const session = scope.getSession();
    if (session) {
      closeSession(session);
    }
    this._sendSessionUpdate();
    scope.setSession();
  }
  /**
   * @inheritDoc
   */
  startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment = DEFAULT_ENVIRONMENT } = client && client.getOptions() || {};
    const { userAgent } = GLOBAL_OBJ.navigator || {};
    const session = makeSession({
      release,
      environment,
      user: scope.getUser(),
      ...userAgent && { userAgent },
      ...context
    });
    const currentSession = scope.getSession && scope.getSession();
    if (currentSession && currentSession.status === "ok") {
      updateSession(currentSession, { status: "exited" });
    }
    this.endSession();
    scope.setSession(session);
    return session;
  }
  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   */
  shouldSendDefaultPii() {
    const client = this.getClient();
    const options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }
  /**
   * Sends the current Session on the scope
   */
  _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    const session = scope.getSession();
    if (session && client && client.captureSession) {
      client.captureSession(session);
    }
  }
  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */
  _withClient(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(client, scope);
    }
  }
  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-expect-error Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _callExtensionMethod(method, ...args) {
    const carrier = getMainCarrier();
    const sentry = carrier.__SENTRY__;
    if (sentry && sentry.extensions && typeof sentry.extensions[method] === "function") {
      return sentry.extensions[method].apply(this, args);
    }
    DEBUG_BUILD2 && logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
};
function getMainCarrier() {
  GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
    extensions: {},
    hub: void 0
  };
  return GLOBAL_OBJ;
}
function makeMain(hub) {
  const registry = getMainCarrier();
  const oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}
function getCurrentHub() {
  const registry = getMainCarrier();
  if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
    const hub = registry.__SENTRY__.acs.getCurrentHub();
    if (hub) {
      return hub;
    }
  }
  return getGlobalHub(registry);
}
function getGlobalHub(registry = getMainCarrier()) {
  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }
  return getHubFromCarrier(registry);
}
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
function getHubFromCarrier(carrier) {
  return getGlobalSingleton("hub", () => new Hub(), carrier);
}
function setHubOnCarrier(carrier, hub) {
  if (!carrier)
    return false;
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  __SENTRY__.hub = hub;
  return true;
}

// node_modules/@sentry/core/esm/tracing/utils.js
function getActiveTransaction(maybeHub) {
  const hub = maybeHub || getCurrentHub();
  const scope = hub.getScope();
  return scope.getTransaction();
}

// node_modules/@sentry/core/esm/tracing/errors.js
var errorsInstrumented = false;
function registerErrorInstrumentation() {
  if (errorsInstrumented) {
    return;
  }
  errorsInstrumented = true;
  addGlobalErrorInstrumentationHandler(errorCallback);
  addGlobalUnhandledRejectionInstrumentationHandler(errorCallback);
}
function errorCallback() {
  const activeTransaction2 = getActiveTransaction();
  if (activeTransaction2) {
    const status = "internal_error";
    DEBUG_BUILD2 && logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction2.setStatus(status);
  }
}
errorCallback.tag = "sentry_tracingErrorCallback";

// node_modules/@sentry/core/esm/tracing/span.js
var SpanRecorder = class {
  constructor(maxlen = 1e3) {
    this._maxlen = maxlen;
    this.spans = [];
  }
  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */
  add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = void 0;
    } else {
      this.spans.push(span);
    }
  }
};
var Span = class {
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * Internal keeper of the status
   */
  /**
   * @inheritDoc
   */
  /**
   * Timestamp in seconds when the span was created.
   */
  /**
   * Timestamp in seconds when the span ended.
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /**
   * List of spans that were finalized
   */
  /**
   * @inheritDoc
   */
  /**
   * The instrumenter that created this span.
   */
  /**
   * The origin of the span, giving context about what created the span.
   */
  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */
  constructor(spanContext = {}) {
    this.traceId = spanContext.traceId || uuid4();
    this.spanId = spanContext.spanId || uuid4().substring(16);
    this.startTimestamp = spanContext.startTimestamp || timestampInSeconds();
    this.tags = spanContext.tags || {};
    this.data = spanContext.data || {};
    this.instrumenter = spanContext.instrumenter || "sentry";
    this.origin = spanContext.origin || "manual";
    if (spanContext.parentSpanId) {
      this.parentSpanId = spanContext.parentSpanId;
    }
    if ("sampled" in spanContext) {
      this.sampled = spanContext.sampled;
    }
    if (spanContext.op) {
      this.op = spanContext.op;
    }
    if (spanContext.description) {
      this.description = spanContext.description;
    }
    if (spanContext.name) {
      this.description = spanContext.name;
    }
    if (spanContext.status) {
      this.status = spanContext.status;
    }
    if (spanContext.endTimestamp) {
      this.endTimestamp = spanContext.endTimestamp;
    }
  }
  /** An alias for `description` of the Span. */
  get name() {
    return this.description || "";
  }
  /** Update the name of the span. */
  set name(name) {
    this.setName(name);
  }
  /**
   * @inheritDoc
   */
  startChild(spanContext) {
    const childSpan = new Span({
      ...spanContext,
      parentSpanId: this.spanId,
      sampled: this.sampled,
      traceId: this.traceId
    });
    childSpan.spanRecorder = this.spanRecorder;
    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }
    childSpan.transaction = this.transaction;
    if (DEBUG_BUILD2 && childSpan.transaction) {
      const opStr = spanContext && spanContext.op || "< unknown op >";
      const nameStr = childSpan.transaction.name || "< unknown name >";
      const idStr = childSpan.transaction.spanId;
      const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
      childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
      logger.log(logMessage);
    }
    return childSpan;
  }
  /**
   * @inheritDoc
   */
  setTag(key, value) {
    this.tags = { ...this.tags, [key]: value };
    return this;
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  setData(key, value) {
    this.data = { ...this.data, [key]: value };
    return this;
  }
  /**
   * @inheritDoc
   */
  setStatus(value) {
    this.status = value;
    return this;
  }
  /**
   * @inheritDoc
   */
  setHttpStatus(httpStatus) {
    this.setTag("http.status_code", String(httpStatus));
    this.setData("http.response.status_code", httpStatus);
    const spanStatus = spanStatusfromHttpCode(httpStatus);
    if (spanStatus !== "unknown_error") {
      this.setStatus(spanStatus);
    }
    return this;
  }
  /**
   * @inheritDoc
   */
  setName(name) {
    this.description = name;
  }
  /**
   * @inheritDoc
   */
  isSuccess() {
    return this.status === "ok";
  }
  /**
   * @inheritDoc
   */
  finish(endTimestamp) {
    if (DEBUG_BUILD2 && // Don't call this for transactions
    this.transaction && this.transaction.spanId !== this.spanId) {
      const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
      if (logMessage) {
        logger.log(logMessage.replace("Starting", "Finishing"));
      }
    }
    this.endTimestamp = typeof endTimestamp === "number" ? endTimestamp : timestampInSeconds();
  }
  /**
   * @inheritDoc
   */
  toTraceparent() {
    return generateSentryTraceHeader(this.traceId, this.spanId, this.sampled);
  }
  /**
   * @inheritDoc
   */
  toContext() {
    return dropUndefinedKeys({
      data: this.data,
      description: this.description,
      endTimestamp: this.endTimestamp,
      op: this.op,
      parentSpanId: this.parentSpanId,
      sampled: this.sampled,
      spanId: this.spanId,
      startTimestamp: this.startTimestamp,
      status: this.status,
      tags: this.tags,
      traceId: this.traceId
    });
  }
  /**
   * @inheritDoc
   */
  updateWithContext(spanContext) {
    this.data = spanContext.data || {};
    this.description = spanContext.description;
    this.endTimestamp = spanContext.endTimestamp;
    this.op = spanContext.op;
    this.parentSpanId = spanContext.parentSpanId;
    this.sampled = spanContext.sampled;
    this.spanId = spanContext.spanId || this.spanId;
    this.startTimestamp = spanContext.startTimestamp || this.startTimestamp;
    this.status = spanContext.status;
    this.tags = spanContext.tags || {};
    this.traceId = spanContext.traceId || this.traceId;
    return this;
  }
  /**
   * @inheritDoc
   */
  getTraceContext() {
    return dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : void 0,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
      trace_id: this.traceId,
      origin: this.origin
    });
  }
  /**
   * @inheritDoc
   */
  toJSON() {
    return dropUndefinedKeys({
      data: Object.keys(this.data).length > 0 ? this.data : void 0,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      start_timestamp: this.startTimestamp,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
      timestamp: this.endTimestamp,
      trace_id: this.traceId,
      origin: this.origin
    });
  }
};
function spanStatusfromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return "ok";
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return "unauthenticated";
      case 403:
        return "permission_denied";
      case 404:
        return "not_found";
      case 409:
        return "already_exists";
      case 413:
        return "failed_precondition";
      case 429:
        return "resource_exhausted";
      default:
        return "invalid_argument";
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return "unimplemented";
      case 503:
        return "unavailable";
      case 504:
        return "deadline_exceeded";
      default:
        return "internal_error";
    }
  }
  return "unknown_error";
}

// node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js
function getDynamicSamplingContextFromClient(trace_id, client, scope) {
  const options = client.getOptions();
  const { publicKey: public_key } = client.getDsn() || {};
  const { segment: user_segment } = scope && scope.getUser() || {};
  const dsc = dropUndefinedKeys({
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    user_segment,
    public_key,
    trace_id
  });
  client.emit && client.emit("createDsc", dsc);
  return dsc;
}

// node_modules/@sentry/core/esm/tracing/transaction.js
var Transaction = class extends Span {
  /**
   * The reference to the current hub.
   */
  /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   */
  constructor(transactionContext, hub) {
    super(transactionContext);
    delete this.description;
    this._measurements = {};
    this._contexts = {};
    this._hub = hub || getCurrentHub();
    this._name = transactionContext.name || "";
    this.metadata = {
      source: "custom",
      ...transactionContext.metadata,
      spanMetadata: {}
    };
    this._trimEnd = transactionContext.trimEnd;
    this.transaction = this;
    const incomingDynamicSamplingContext = this.metadata.dynamicSamplingContext;
    if (incomingDynamicSamplingContext) {
      this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
    }
  }
  /** Getter for `name` property */
  get name() {
    return this._name;
  }
  /** Setter for `name` property, which also sets `source` as custom */
  set name(newName) {
    this.setName(newName);
  }
  /**
   * JSDoc
   */
  setName(name, source = "custom") {
    this._name = name;
    this.metadata.source = source;
  }
  /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */
  initSpanRecorder(maxlen = 1e3) {
    if (!this.spanRecorder) {
      this.spanRecorder = new SpanRecorder(maxlen);
    }
    this.spanRecorder.add(this);
  }
  /**
   * @inheritDoc
   */
  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts[key] = context;
    }
  }
  /**
   * @inheritDoc
   */
  setMeasurement(name, value, unit = "") {
    this._measurements[name] = { value, unit };
  }
  /**
   * @inheritDoc
   */
  setMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
  }
  /**
   * @inheritDoc
   */
  finish(endTimestamp) {
    const transaction = this._finishTransaction(endTimestamp);
    if (!transaction) {
      return void 0;
    }
    return this._hub.captureEvent(transaction);
  }
  /**
   * @inheritDoc
   */
  toContext() {
    const spanContext = super.toContext();
    return dropUndefinedKeys({
      ...spanContext,
      name: this.name,
      trimEnd: this._trimEnd
    });
  }
  /**
   * @inheritDoc
   */
  updateWithContext(transactionContext) {
    super.updateWithContext(transactionContext);
    this.name = transactionContext.name || "";
    this._trimEnd = transactionContext.trimEnd;
    return this;
  }
  /**
   * @inheritdoc
   *
   * @experimental
   */
  getDynamicSamplingContext() {
    if (this._frozenDynamicSamplingContext) {
      return this._frozenDynamicSamplingContext;
    }
    const hub = this._hub || getCurrentHub();
    const client = hub.getClient();
    if (!client)
      return {};
    const scope = hub.getScope();
    const dsc = getDynamicSamplingContextFromClient(this.traceId, client, scope);
    const maybeSampleRate = this.metadata.sampleRate;
    if (maybeSampleRate !== void 0) {
      dsc.sample_rate = `${maybeSampleRate}`;
    }
    const source = this.metadata.source;
    if (source && source !== "url") {
      dsc.transaction = this.name;
    }
    if (this.sampled !== void 0) {
      dsc.sampled = String(this.sampled);
    }
    return dsc;
  }
  /**
   * Override the current hub with a new one.
   * Used if you want another hub to finish the transaction.
   *
   * @internal
   */
  setHub(hub) {
    this._hub = hub;
  }
  /**
   * Finish the transaction & prepare the event to send to Sentry.
   */
  _finishTransaction(endTimestamp) {
    if (this.endTimestamp !== void 0) {
      return void 0;
    }
    if (!this.name) {
      DEBUG_BUILD2 && logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
      this.name = "<unlabeled transaction>";
    }
    super.finish(endTimestamp);
    const client = this._hub.getClient();
    if (client && client.emit) {
      client.emit("finishTransaction", this);
    }
    if (this.sampled !== true) {
      DEBUG_BUILD2 && logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled.");
      if (client) {
        client.recordDroppedEvent("sample_rate", "transaction");
      }
      return void 0;
    }
    const finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter((s) => s !== this && s.endTimestamp) : [];
    if (this._trimEnd && finishedSpans.length > 0) {
      this.endTimestamp = finishedSpans.reduce((prev, current) => {
        if (prev.endTimestamp && current.endTimestamp) {
          return prev.endTimestamp > current.endTimestamp ? prev : current;
        }
        return prev;
      }).endTimestamp;
    }
    const metadata = this.metadata;
    const transaction = {
      contexts: {
        ...this._contexts,
        // We don't want to override trace context
        trace: this.getTraceContext()
      },
      spans: finishedSpans,
      start_timestamp: this.startTimestamp,
      tags: this.tags,
      timestamp: this.endTimestamp,
      transaction: this.name,
      type: "transaction",
      sdkProcessingMetadata: {
        ...metadata,
        dynamicSamplingContext: this.getDynamicSamplingContext()
      },
      ...metadata.source && {
        transaction_info: {
          source: metadata.source
        }
      }
    };
    const hasMeasurements = Object.keys(this._measurements).length > 0;
    if (hasMeasurements) {
      DEBUG_BUILD2 && logger.log(
        "[Measurements] Adding measurements to transaction",
        JSON.stringify(this._measurements, void 0, 2)
      );
      transaction.measurements = this._measurements;
    }
    DEBUG_BUILD2 && logger.log(`[Tracing] Finishing ${this.op} transaction: ${this.name}.`);
    return transaction;
  }
};

// node_modules/@sentry/core/esm/tracing/idletransaction.js
var TRACING_DEFAULTS = {
  idleTimeout: 1e3,
  finalTimeout: 3e4,
  heartbeatInterval: 5e3
};
var FINISH_REASON_TAG = "finishReason";
var IDLE_TRANSACTION_FINISH_REASONS = [
  "heartbeatFailed",
  "idleTimeout",
  "documentHidden",
  "finalTimeout",
  "externalFinish",
  "cancelled"
];
var IdleTransactionSpanRecorder = class extends SpanRecorder {
  constructor(_pushActivity, _popActivity, transactionSpanId, maxlen) {
    super(maxlen);
    this._pushActivity = _pushActivity;
    this._popActivity = _popActivity;
    this.transactionSpanId = transactionSpanId;
  }
  /**
   * @inheritDoc
   */
  add(span) {
    if (span.spanId !== this.transactionSpanId) {
      span.finish = (endTimestamp) => {
        span.endTimestamp = typeof endTimestamp === "number" ? endTimestamp : timestampInSeconds();
        this._popActivity(span.spanId);
      };
      if (span.endTimestamp === void 0) {
        this._pushActivity(span.spanId);
      }
    }
    super.add(span);
  }
};
var IdleTransaction = class extends Transaction {
  // Activities store a list of active spans
  // Track state of activities in previous heartbeat
  // Amount of times heartbeat has counted. Will cause transaction to finish after 3 beats.
  // We should not use heartbeat if we finished a transaction
  // Idle timeout was canceled and we should finish the transaction with the last span end.
  /**
   * Timer that tracks Transaction idleTimeout
   */
  constructor(transactionContext, _idleHub, _idleTimeout = TRACING_DEFAULTS.idleTimeout, _finalTimeout = TRACING_DEFAULTS.finalTimeout, _heartbeatInterval = TRACING_DEFAULTS.heartbeatInterval, _onScope = false) {
    super(transactionContext, _idleHub);
    this._idleHub = _idleHub;
    this._idleTimeout = _idleTimeout;
    this._finalTimeout = _finalTimeout;
    this._heartbeatInterval = _heartbeatInterval;
    this._onScope = _onScope;
    this.activities = {};
    this._heartbeatCounter = 0;
    this._finished = false;
    this._idleTimeoutCanceledPermanently = false;
    this._beforeFinishCallbacks = [];
    this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[4];
    if (_onScope) {
      DEBUG_BUILD2 && logger.log(`Setting idle transaction on scope. Span ID: ${this.spanId}`);
      _idleHub.configureScope((scope) => scope.setSpan(this));
    }
    this._restartIdleTimeout();
    setTimeout(() => {
      if (!this._finished) {
        this.setStatus("deadline_exceeded");
        this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[3];
        this.finish();
      }
    }, this._finalTimeout);
  }
  /** {@inheritDoc} */
  finish(endTimestamp = timestampInSeconds()) {
    this._finished = true;
    this.activities = {};
    if (this.op === "ui.action.click") {
      this.setTag(FINISH_REASON_TAG, this._finishReason);
    }
    if (this.spanRecorder) {
      DEBUG_BUILD2 && logger.log("[Tracing] finishing IdleTransaction", new Date(endTimestamp * 1e3).toISOString(), this.op);
      for (const callback of this._beforeFinishCallbacks) {
        callback(this, endTimestamp);
      }
      this.spanRecorder.spans = this.spanRecorder.spans.filter((span) => {
        if (span.spanId === this.spanId) {
          return true;
        }
        if (!span.endTimestamp) {
          span.endTimestamp = endTimestamp;
          span.setStatus("cancelled");
          DEBUG_BUILD2 && logger.log("[Tracing] cancelling span since transaction ended early", JSON.stringify(span, void 0, 2));
        }
        const spanStartedBeforeTransactionFinish = span.startTimestamp < endTimestamp;
        const timeoutWithMarginOfError = (this._finalTimeout + this._idleTimeout) / 1e3;
        const spanEndedBeforeFinalTimeout = span.endTimestamp - this.startTimestamp < timeoutWithMarginOfError;
        if (DEBUG_BUILD2) {
          const stringifiedSpan = JSON.stringify(span, void 0, 2);
          if (!spanStartedBeforeTransactionFinish) {
            logger.log("[Tracing] discarding Span since it happened after Transaction was finished", stringifiedSpan);
          } else if (!spanEndedBeforeFinalTimeout) {
            logger.log("[Tracing] discarding Span since it finished after Transaction final timeout", stringifiedSpan);
          }
        }
        return spanStartedBeforeTransactionFinish && spanEndedBeforeFinalTimeout;
      });
      DEBUG_BUILD2 && logger.log("[Tracing] flushing IdleTransaction");
    } else {
      DEBUG_BUILD2 && logger.log("[Tracing] No active IdleTransaction");
    }
    if (this._onScope) {
      const scope = this._idleHub.getScope();
      if (scope.getTransaction() === this) {
        scope.setSpan(void 0);
      }
    }
    return super.finish(endTimestamp);
  }
  /**
   * Register a callback function that gets excecuted before the transaction finishes.
   * Useful for cleanup or if you want to add any additional spans based on current context.
   *
   * This is exposed because users have no other way of running something before an idle transaction
   * finishes.
   */
  registerBeforeFinishCallback(callback) {
    this._beforeFinishCallbacks.push(callback);
  }
  /**
   * @inheritDoc
   */
  initSpanRecorder(maxlen) {
    if (!this.spanRecorder) {
      const pushActivity = (id) => {
        if (this._finished) {
          return;
        }
        this._pushActivity(id);
      };
      const popActivity = (id) => {
        if (this._finished) {
          return;
        }
        this._popActivity(id);
      };
      this.spanRecorder = new IdleTransactionSpanRecorder(pushActivity, popActivity, this.spanId, maxlen);
      DEBUG_BUILD2 && logger.log("Starting heartbeat");
      this._pingHeartbeat();
    }
    this.spanRecorder.add(this);
  }
  /**
   * Cancels the existing idle timeout, if there is one.
   * @param restartOnChildSpanChange Default is `true`.
   *                                 If set to false the transaction will end
   *                                 with the last child span.
   */
  cancelIdleTimeout(endTimestamp, {
    restartOnChildSpanChange
  } = {
    restartOnChildSpanChange: true
  }) {
    this._idleTimeoutCanceledPermanently = restartOnChildSpanChange === false;
    if (this._idleTimeoutID) {
      clearTimeout(this._idleTimeoutID);
      this._idleTimeoutID = void 0;
      if (Object.keys(this.activities).length === 0 && this._idleTimeoutCanceledPermanently) {
        this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[5];
        this.finish(endTimestamp);
      }
    }
  }
  /**
   * Temporary method used to externally set the transaction's `finishReason`
   *
   * ** WARNING**
   * This is for the purpose of experimentation only and will be removed in the near future, do not use!
   *
   * @internal
   *
   */
  setFinishReason(reason) {
    this._finishReason = reason;
  }
  /**
   * Restarts idle timeout, if there is no running idle timeout it will start one.
   */
  _restartIdleTimeout(endTimestamp) {
    this.cancelIdleTimeout();
    this._idleTimeoutID = setTimeout(() => {
      if (!this._finished && Object.keys(this.activities).length === 0) {
        this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[1];
        this.finish(endTimestamp);
      }
    }, this._idleTimeout);
  }
  /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */
  _pushActivity(spanId) {
    this.cancelIdleTimeout(void 0, { restartOnChildSpanChange: !this._idleTimeoutCanceledPermanently });
    DEBUG_BUILD2 && logger.log(`[Tracing] pushActivity: ${spanId}`);
    this.activities[spanId] = true;
    DEBUG_BUILD2 && logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */
  _popActivity(spanId) {
    if (this.activities[spanId]) {
      DEBUG_BUILD2 && logger.log(`[Tracing] popActivity ${spanId}`);
      delete this.activities[spanId];
      DEBUG_BUILD2 && logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
    }
    if (Object.keys(this.activities).length === 0) {
      const endTimestamp = timestampInSeconds();
      if (this._idleTimeoutCanceledPermanently) {
        this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[5];
        this.finish(endTimestamp);
      } else {
        this._restartIdleTimeout(endTimestamp + this._idleTimeout / 1e3);
      }
    }
  }
  /**
   * Checks when entries of this.activities are not changing for 3 beats.
   * If this occurs we finish the transaction.
   */
  _beat() {
    if (this._finished) {
      return;
    }
    const heartbeatString = Object.keys(this.activities).join("");
    if (heartbeatString === this._prevHeartbeatString) {
      this._heartbeatCounter++;
    } else {
      this._heartbeatCounter = 1;
    }
    this._prevHeartbeatString = heartbeatString;
    if (this._heartbeatCounter >= 3) {
      DEBUG_BUILD2 && logger.log("[Tracing] Transaction finished because of no change for 3 heart beats");
      this.setStatus("deadline_exceeded");
      this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[0];
      this.finish();
    } else {
      this._pingHeartbeat();
    }
  }
  /**
   * Pings the heartbeat
   */
  _pingHeartbeat() {
    DEBUG_BUILD2 && logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`);
    setTimeout(() => {
      this._beat();
    }, this._heartbeatInterval);
  }
};

// node_modules/@sentry/core/esm/utils/prepareEvent.js
function prepareEvent(options, event, hint, scope, client) {
  const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
  const prepared = {
    ...event,
    event_id: event.event_id || hint.event_id || uuid4(),
    timestamp: event.timestamp || dateTimestampInSeconds()
  };
  const integrations = hint.integrations || options.integrations.map((i) => i.name);
  applyClientOptions(prepared, options);
  applyIntegrationsMetadata(prepared, integrations);
  if (event.type === void 0) {
    applyDebugIds(prepared, options.stackParser);
  }
  let finalScope = scope;
  if (hint.captureContext) {
    finalScope = Scope.clone(finalScope).update(hint.captureContext);
  }
  if (hint.mechanism) {
    addExceptionMechanism(prepared, hint.mechanism);
  }
  let result = resolvedSyncPromise(prepared);
  const clientEventProcessors = client && client.getEventProcessors ? client.getEventProcessors() : [];
  if (finalScope) {
    if (finalScope.getAttachments) {
      const attachments = [...hint.attachments || [], ...finalScope.getAttachments()];
      if (attachments.length) {
        hint.attachments = attachments;
      }
    }
    result = finalScope.applyToEvent(prepared, hint, clientEventProcessors);
  } else {
    result = notifyEventProcessors([...clientEventProcessors, ...getGlobalEventProcessors()], prepared, hint);
  }
  return result.then((evt) => {
    if (evt) {
      applyDebugMeta(evt);
    }
    if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
      return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
    }
    return evt;
  });
}
function applyClientOptions(event, options) {
  const { environment, release, dist, maxValueLength = 250 } = options;
  if (!("environment" in event)) {
    event.environment = "environment" in options ? environment : DEFAULT_ENVIRONMENT;
  }
  if (event.release === void 0 && release !== void 0) {
    event.release = release;
  }
  if (event.dist === void 0 && dist !== void 0) {
    event.dist = dist;
  }
  if (event.message) {
    event.message = truncate(event.message, maxValueLength);
  }
  const exception = event.exception && event.exception.values && event.exception.values[0];
  if (exception && exception.value) {
    exception.value = truncate(exception.value, maxValueLength);
  }
  const request = event.request;
  if (request && request.url) {
    request.url = truncate(request.url, maxValueLength);
  }
}
var debugIdStackParserCache = /* @__PURE__ */ new WeakMap();
function applyDebugIds(event, stackParser) {
  const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  if (!debugIdMap) {
    return;
  }
  let debugIdStackFramesCache;
  const cachedDebugIdStackFrameCache = debugIdStackParserCache.get(stackParser);
  if (cachedDebugIdStackFrameCache) {
    debugIdStackFramesCache = cachedDebugIdStackFrameCache;
  } else {
    debugIdStackFramesCache = /* @__PURE__ */ new Map();
    debugIdStackParserCache.set(stackParser, debugIdStackFramesCache);
  }
  const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace) => {
    let parsedStack;
    const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
    if (cachedParsedStack) {
      parsedStack = cachedParsedStack;
    } else {
      parsedStack = stackParser(debugIdStackTrace);
      debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
    }
    for (let i = parsedStack.length - 1; i >= 0; i--) {
      const stackFrame = parsedStack[i];
      if (stackFrame.filename) {
        acc[stackFrame.filename] = debugIdMap[debugIdStackTrace];
        break;
      }
    }
    return acc;
  }, {});
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.filename) {
          frame.debug_id = filenameDebugIdMap[frame.filename];
        }
      });
    });
  } catch (e2) {
  }
}
function applyDebugMeta(event) {
  const filenameDebugIdMap = {};
  try {
    event.exception.values.forEach((exception) => {
      exception.stacktrace.frames.forEach((frame) => {
        if (frame.debug_id) {
          if (frame.abs_path) {
            filenameDebugIdMap[frame.abs_path] = frame.debug_id;
          } else if (frame.filename) {
            filenameDebugIdMap[frame.filename] = frame.debug_id;
          }
          delete frame.debug_id;
        }
      });
    });
  } catch (e2) {
  }
  if (Object.keys(filenameDebugIdMap).length === 0) {
    return;
  }
  event.debug_meta = event.debug_meta || {};
  event.debug_meta.images = event.debug_meta.images || [];
  const images = event.debug_meta.images;
  Object.keys(filenameDebugIdMap).forEach((filename) => {
    images.push({
      type: "sourcemap",
      code_file: filename,
      debug_id: filenameDebugIdMap[filename]
    });
  });
}
function applyIntegrationsMetadata(event, integrationNames) {
  if (integrationNames.length > 0) {
    event.sdk = event.sdk || {};
    event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
  }
}
function normalizeEvent(event, depth, maxBreadth) {
  if (!event) {
    return null;
  }
  const normalized = {
    ...event,
    ...event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        ...b.data && {
          data: normalize(b.data, depth, maxBreadth)
        }
      }))
    },
    ...event.user && {
      user: normalize(event.user, depth, maxBreadth)
    },
    ...event.contexts && {
      contexts: normalize(event.contexts, depth, maxBreadth)
    },
    ...event.extra && {
      extra: normalize(event.extra, depth, maxBreadth)
    }
  };
  if (event.contexts && event.contexts.trace && normalized.contexts) {
    normalized.contexts.trace = event.contexts.trace;
    if (event.contexts.trace.data) {
      normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
    }
  }
  if (event.spans) {
    normalized.spans = event.spans.map((span) => {
      if (span.data) {
        span.data = normalize(span.data, depth, maxBreadth);
      }
      return span;
    });
  }
  return normalized;
}
function parseEventHintOrCaptureContext(hint) {
  if (!hint) {
    return void 0;
  }
  if (hintIsScopeOrFunction(hint)) {
    return { captureContext: hint };
  }
  if (hintIsScopeContext(hint)) {
    return {
      captureContext: hint
    };
  }
  return hint;
}
function hintIsScopeOrFunction(hint) {
  return hint instanceof Scope || typeof hint === "function";
}
var captureContextKeys = [
  "user",
  "level",
  "extra",
  "contexts",
  "tags",
  "fingerprint",
  "requestSession",
  "propagationContext"
];
function hintIsScopeContext(hint) {
  return Object.keys(hint).some((key) => captureContextKeys.includes(key));
}

// node_modules/@sentry/core/esm/exports.js
function captureException(exception, hint) {
  return getCurrentHub().captureException(exception, parseEventHintOrCaptureContext(hint));
}
function configureScope(callback) {
  getCurrentHub().configureScope(callback);
}
function setContext(name, context) {
  getCurrentHub().setContext(name, context);
}
function withScope(callback) {
  getCurrentHub().withScope(callback);
}
function getClient() {
  return getCurrentHub().getClient();
}

// node_modules/@sentry/core/esm/utils/hasTracingEnabled.js
function hasTracingEnabled(maybeOptions) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
    return false;
  }
  const client = getClient();
  const options = maybeOptions || client && client.getOptions();
  return !!options && (options.enableTracing || "tracesSampleRate" in options || "tracesSampler" in options);
}

// node_modules/@sentry/core/esm/tracing/sampling.js
function sampleTransaction(transaction, options, samplingContext) {
  if (!hasTracingEnabled(options)) {
    transaction.sampled = false;
    return transaction;
  }
  if (transaction.sampled !== void 0) {
    transaction.setMetadata({
      sampleRate: Number(transaction.sampled)
    });
    return transaction;
  }
  let sampleRate;
  if (typeof options.tracesSampler === "function") {
    sampleRate = options.tracesSampler(samplingContext);
    transaction.setMetadata({
      sampleRate: Number(sampleRate)
    });
  } else if (samplingContext.parentSampled !== void 0) {
    sampleRate = samplingContext.parentSampled;
  } else if (typeof options.tracesSampleRate !== "undefined") {
    sampleRate = options.tracesSampleRate;
    transaction.setMetadata({
      sampleRate: Number(sampleRate)
    });
  } else {
    sampleRate = 1;
    transaction.setMetadata({
      sampleRate
    });
  }
  if (!isValidSampleRate(sampleRate)) {
    DEBUG_BUILD2 && logger.warn("[Tracing] Discarding transaction because of invalid sample rate.");
    transaction.sampled = false;
    return transaction;
  }
  if (!sampleRate) {
    DEBUG_BUILD2 && logger.log(
      `[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`
    );
    transaction.sampled = false;
    return transaction;
  }
  transaction.sampled = Math.random() < sampleRate;
  if (!transaction.sampled) {
    DEBUG_BUILD2 && logger.log(
      `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
        sampleRate
      )})`
    );
    return transaction;
  }
  DEBUG_BUILD2 && logger.log(`[Tracing] starting ${transaction.op} transaction - ${transaction.name}`);
  return transaction;
}
function isValidSampleRate(rate) {
  if (isNaN2(rate) || !(typeof rate === "number" || typeof rate === "boolean")) {
    DEBUG_BUILD2 && logger.warn(
      `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        rate
      )} of type ${JSON.stringify(typeof rate)}.`
    );
    return false;
  }
  if (rate < 0 || rate > 1) {
    DEBUG_BUILD2 && logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
    return false;
  }
  return true;
}

// node_modules/@sentry/core/esm/tracing/hubextensions.js
function traceHeaders() {
  const scope = this.getScope();
  const span = scope.getSpan();
  return span ? {
    "sentry-trace": span.toTraceparent()
  } : {};
}
function _startTransaction(transactionContext, customSamplingContext) {
  const client = this.getClient();
  const options = client && client.getOptions() || {};
  const configInstrumenter = options.instrumenter || "sentry";
  const transactionInstrumenter = transactionContext.instrumenter || "sentry";
  if (configInstrumenter !== transactionInstrumenter) {
    DEBUG_BUILD2 && logger.error(
      `A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`
    );
    transactionContext.sampled = false;
  }
  let transaction = new Transaction(transactionContext, this);
  transaction = sampleTransaction(transaction, options, {
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    ...customSamplingContext
  });
  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }
  if (client && client.emit) {
    client.emit("startTransaction", transaction);
  }
  return transaction;
}
function startIdleTransaction(hub, transactionContext, idleTimeout, finalTimeout, onScope, customSamplingContext, heartbeatInterval) {
  const client = hub.getClient();
  const options = client && client.getOptions() || {};
  let transaction = new IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, heartbeatInterval, onScope);
  transaction = sampleTransaction(transaction, options, {
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    ...customSamplingContext
  });
  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }
  if (client && client.emit) {
    client.emit("startTransaction", transaction);
  }
  return transaction;
}
function addTracingExtensions() {
  const carrier = getMainCarrier();
  if (!carrier.__SENTRY__) {
    return;
  }
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  if (!carrier.__SENTRY__.extensions.startTransaction) {
    carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
  }
  if (!carrier.__SENTRY__.extensions.traceHeaders) {
    carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
  }
  registerErrorInstrumentation();
}

// node_modules/@sentry/core/esm/envelope.js
function enhanceEventWithSdkInfo(event, sdkInfo) {
  if (!sdkInfo) {
    return event;
  }
  event.sdk = event.sdk || {};
  event.sdk.name = event.sdk.name || sdkInfo.name;
  event.sdk.version = event.sdk.version || sdkInfo.version;
  event.sdk.integrations = [...event.sdk.integrations || [], ...sdkInfo.integrations || []];
  event.sdk.packages = [...event.sdk.packages || [], ...sdkInfo.packages || []];
  return event;
}
function createSessionEnvelope(session, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const envelopeHeaders = {
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
  return createEnvelope(envelopeHeaders, [envelopeItem]);
}
function createEventEnvelope(event, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
  enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  delete event.sdkProcessingMetadata;
  const eventItem = [{ type: eventType }, event];
  return createEnvelope(envelopeHeaders, [eventItem]);
}

// node_modules/@sentry/core/esm/api.js
var SENTRY_API_VERSION = "7";
function getBaseApiEndpoint(dsn) {
  const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
  const port = dsn.port ? `:${dsn.port}` : "";
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
function _encodedAuth(dsn, sdkInfo) {
  return urlEncode({
    // We send only the minimum set of required information. See
    // https://github.com/getsentry/sentry-javascript/issues/2572.
    sentry_key: dsn.publicKey,
    sentry_version: SENTRY_API_VERSION,
    ...sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }
  });
}
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnelOrOptions = {}) {
  const tunnel = typeof tunnelOrOptions === "string" ? tunnelOrOptions : tunnelOrOptions.tunnel;
  const sdkInfo = typeof tunnelOrOptions === "string" || !tunnelOrOptions._metadata ? void 0 : tunnelOrOptions._metadata.sdk;
  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}

// node_modules/@sentry/core/esm/integration.js
var installedIntegrations = [];
function filterDuplicates(integrations) {
  const integrationsByName = {};
  integrations.forEach((currentInstance) => {
    const { name } = currentInstance;
    const existingInstance = integrationsByName[name];
    if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
      return;
    }
    integrationsByName[name] = currentInstance;
  });
  return Object.keys(integrationsByName).map((k) => integrationsByName[k]);
}
function getIntegrationsToSetup(options) {
  const defaultIntegrations2 = options.defaultIntegrations || [];
  const userIntegrations = options.integrations;
  defaultIntegrations2.forEach((integration) => {
    integration.isDefaultInstance = true;
  });
  let integrations;
  if (Array.isArray(userIntegrations)) {
    integrations = [...defaultIntegrations2, ...userIntegrations];
  } else if (typeof userIntegrations === "function") {
    integrations = arrayify(userIntegrations(defaultIntegrations2));
  } else {
    integrations = defaultIntegrations2;
  }
  const finalIntegrations = filterDuplicates(integrations);
  const debugIndex = findIndex(finalIntegrations, (integration) => integration.name === "Debug");
  if (debugIndex !== -1) {
    const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
    finalIntegrations.push(debugInstance);
  }
  return finalIntegrations;
}
function setupIntegrations(client, integrations) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    if (integration) {
      setupIntegration(client, integration, integrationIndex);
    }
  });
  return integrationIndex;
}
function setupIntegration(client, integration, integrationIndex) {
  integrationIndex[integration.name] = integration;
  if (installedIntegrations.indexOf(integration.name) === -1) {
    integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
    installedIntegrations.push(integration.name);
  }
  if (integration.setup && typeof integration.setup === "function") {
    integration.setup(client);
  }
  if (client.on && typeof integration.preprocessEvent === "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (client.addEventProcessor && typeof integration.processEvent === "function") {
    const callback = integration.processEvent.bind(integration);
    const processor = Object.assign((event, hint) => callback(event, hint, client), {
      id: integration.name
    });
    client.addEventProcessor(processor);
  }
  DEBUG_BUILD2 && logger.log(`Integration installed: ${integration.name}`);
}
function findIndex(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i]) === true) {
      return i;
    }
  }
  return -1;
}

// node_modules/@sentry/core/esm/baseclient.js
var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
var BaseClient = class {
  /** Options passed to the SDK. */
  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  /** Array of set up integrations. */
  /** Indicates whether this client's integrations have been set up. */
  /** Number of calls being processed */
  /** Holds flushable  */
  // eslint-disable-next-line @typescript-eslint/ban-types
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
  constructor(options) {
    this._options = options;
    this._integrations = {};
    this._integrationsInitialized = false;
    this._numProcessing = 0;
    this._outcomes = {};
    this._hooks = {};
    this._eventProcessors = [];
    if (options.dsn) {
      this._dsn = makeDsn(options.dsn);
    } else {
      DEBUG_BUILD2 && logger.warn("No DSN provided, client will not send events.");
    }
    if (this._dsn) {
      const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
      this._transport = options.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url
      });
    }
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  captureException(exception, hint, scope) {
    if (checkOrSetAlreadyCaught(exception)) {
      DEBUG_BUILD2 && logger.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    this._process(
      this.eventFromException(exception, hint).then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureMessage(message, level, hint, scope) {
    let eventId = hint && hint.event_id;
    const promisedEvent = isPrimitive(message) ? this.eventFromMessage(String(message), level, hint) : this.eventFromException(message, hint);
    this._process(
      promisedEvent.then((event) => this._captureEvent(event, hint, scope)).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureEvent(event, hint, scope) {
    if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
      DEBUG_BUILD2 && logger.log(ALREADY_SEEN_ERROR);
      return;
    }
    let eventId = hint && hint.event_id;
    this._process(
      this._captureEvent(event, hint, scope).then((result) => {
        eventId = result;
      })
    );
    return eventId;
  }
  /**
   * @inheritDoc
   */
  captureSession(session) {
    if (!(typeof session.release === "string")) {
      DEBUG_BUILD2 && logger.warn("Discarded session because of missing or non-string release");
    } else {
      this.sendSession(session);
      updateSession(session, { init: false });
    }
  }
  /**
   * @inheritDoc
   */
  getDsn() {
    return this._dsn;
  }
  /**
   * @inheritDoc
   */
  getOptions() {
    return this._options;
  }
  /**
   * @see SdkMetadata in @sentry/types
   *
   * @return The metadata of the SDK
   */
  getSdkMetadata() {
    return this._options._metadata;
  }
  /**
   * @inheritDoc
   */
  getTransport() {
    return this._transport;
  }
  /**
   * @inheritDoc
   */
  flush(timeout) {
    const transport = this._transport;
    if (transport) {
      return this._isClientDoneProcessing(timeout).then((clientFinished) => {
        return transport.flush(timeout).then((transportFlushed) => clientFinished && transportFlushed);
      });
    } else {
      return resolvedSyncPromise(true);
    }
  }
  /**
   * @inheritDoc
   */
  close(timeout) {
    return this.flush(timeout).then((result) => {
      this.getOptions().enabled = false;
      return result;
    });
  }
  /** Get all installed event processors. */
  getEventProcessors() {
    return this._eventProcessors;
  }
  /** @inheritDoc */
  addEventProcessor(eventProcessor) {
    this._eventProcessors.push(eventProcessor);
  }
  /**
   * Sets up the integrations
   */
  setupIntegrations(forceInitialize) {
    if (forceInitialize && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) {
      this._integrations = setupIntegrations(this, this._options.integrations);
      this._integrationsInitialized = true;
    }
  }
  /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   */
  getIntegrationById(integrationId) {
    return this._integrations[integrationId];
  }
  /**
   * @inheritDoc
   */
  getIntegration(integration) {
    try {
      return this._integrations[integration.id] || null;
    } catch (_oO) {
      DEBUG_BUILD2 && logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
      return null;
    }
  }
  /**
   * @inheritDoc
   */
  addIntegration(integration) {
    setupIntegration(this, integration, this._integrations);
  }
  /**
   * @inheritDoc
   */
  sendEvent(event, hint = {}) {
    this.emit("beforeSendEvent", event, hint);
    let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
    for (const attachment of hint.attachments || []) {
      env = addItemToEnvelope(
        env,
        createAttachmentEnvelopeItem(
          attachment,
          this._options.transportOptions && this._options.transportOptions.textEncoder
        )
      );
    }
    const promise = this._sendEnvelope(env);
    if (promise) {
      promise.then((sendResponse) => this.emit("afterSendEvent", event, sendResponse), null);
    }
  }
  /**
   * @inheritDoc
   */
  sendSession(session) {
    const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
    void this._sendEnvelope(env);
  }
  /**
   * @inheritDoc
   */
  recordDroppedEvent(reason, category, _event) {
    if (this._options.sendClientReports) {
      const key = `${reason}:${category}`;
      DEBUG_BUILD2 && logger.log(`Adding outcome: "${key}"`);
      this._outcomes[key] = this._outcomes[key] + 1 || 1;
    }
  }
  // Keep on() & emit() signatures in sync with types' client.ts interface
  /* eslint-disable @typescript-eslint/unified-signatures */
  /** @inheritdoc */
  /** @inheritdoc */
  on(hook, callback) {
    if (!this._hooks[hook]) {
      this._hooks[hook] = [];
    }
    this._hooks[hook].push(callback);
  }
  /** @inheritdoc */
  /** @inheritdoc */
  emit(hook, ...rest) {
    if (this._hooks[hook]) {
      this._hooks[hook].forEach((callback) => callback(...rest));
    }
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  /** Updates existing session based on the provided event */
  _updateSessionFromEvent(session, event) {
    let crashed = false;
    let errored = false;
    const exceptions = event.exception && event.exception.values;
    if (exceptions) {
      errored = true;
      for (const ex of exceptions) {
        const mechanism = ex.mechanism;
        if (mechanism && mechanism.handled === false) {
          crashed = true;
          break;
        }
      }
    }
    const sessionNonTerminal = session.status === "ok";
    const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
    if (shouldUpdateAndSend) {
      updateSession(session, {
        ...crashed && { status: "crashed" },
        errors: session.errors || Number(errored || crashed)
      });
      this.captureSession(session);
    }
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
  _isClientDoneProcessing(timeout) {
    return new SyncPromise((resolve) => {
      let ticked = 0;
      const tick = 1;
      const interval = setInterval(() => {
        if (this._numProcessing == 0) {
          clearInterval(interval);
          resolve(true);
        } else {
          ticked += tick;
          if (timeout && ticked >= timeout) {
            clearInterval(interval);
            resolve(false);
          }
        }
      }, tick);
    });
  }
  /** Determines whether this SDK is enabled and a transport is present. */
  _isEnabled() {
    return this.getOptions().enabled !== false && this._transport !== void 0;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */
  _prepareEvent(event, hint, scope) {
    const options = this.getOptions();
    const integrations = Object.keys(this._integrations);
    if (!hint.integrations && integrations.length > 0) {
      hint.integrations = integrations;
    }
    this.emit("preprocessEvent", event, hint);
    return prepareEvent(options, event, hint, scope, this).then((evt) => {
      if (evt === null) {
        return evt;
      }
      const { propagationContext } = evt.sdkProcessingMetadata || {};
      const trace2 = evt.contexts && evt.contexts.trace;
      if (!trace2 && propagationContext) {
        const { traceId: trace_id, spanId, parentSpanId, dsc } = propagationContext;
        evt.contexts = {
          trace: {
            trace_id,
            span_id: spanId,
            parent_span_id: parentSpanId
          },
          ...evt.contexts
        };
        const dynamicSamplingContext = dsc ? dsc : getDynamicSamplingContextFromClient(trace_id, this, scope);
        evt.sdkProcessingMetadata = {
          dynamicSamplingContext,
          ...evt.sdkProcessingMetadata
        };
      }
      return evt;
    });
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
  _captureEvent(event, hint = {}, scope) {
    return this._processEvent(event, hint, scope).then(
      (finalEvent) => {
        return finalEvent.event_id;
      },
      (reason) => {
        if (DEBUG_BUILD2) {
          const sentryError = reason;
          if (sentryError.logLevel === "log") {
            logger.log(sentryError.message);
          } else {
            logger.warn(sentryError);
          }
        }
        return void 0;
      }
    );
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
  _processEvent(event, hint, scope) {
    const options = this.getOptions();
    const { sampleRate } = options;
    const isTransaction = isTransactionEvent(event);
    const isError2 = isErrorEvent2(event);
    const eventType = event.type || "error";
    const beforeSendLabel = `before send for type \`${eventType}\``;
    if (isError2 && typeof sampleRate === "number" && Math.random() > sampleRate) {
      this.recordDroppedEvent("sample_rate", "error", event);
      return rejectedSyncPromise(
        new SentryError(
          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
          "log"
        )
      );
    }
    const dataCategory = eventType === "replay_event" ? "replay" : eventType;
    return this._prepareEvent(event, hint, scope).then((prepared) => {
      if (prepared === null) {
        this.recordDroppedEvent("event_processor", dataCategory, event);
        throw new SentryError("An event processor returned `null`, will not send event.", "log");
      }
      const isInternalException = hint.data && hint.data.__sentry__ === true;
      if (isInternalException) {
        return prepared;
      }
      const result = processBeforeSend(options, prepared, hint);
      return _validateBeforeSendResult(result, beforeSendLabel);
    }).then((processedEvent) => {
      if (processedEvent === null) {
        this.recordDroppedEvent("before_send", dataCategory, event);
        throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, "log");
      }
      const session = scope && scope.getSession();
      if (!isTransaction && session) {
        this._updateSessionFromEvent(session, processedEvent);
      }
      const transactionInfo = processedEvent.transaction_info;
      if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
        const source = "custom";
        processedEvent.transaction_info = {
          ...transactionInfo,
          source
        };
      }
      this.sendEvent(processedEvent, hint);
      return processedEvent;
    }).then(null, (reason) => {
      if (reason instanceof SentryError) {
        throw reason;
      }
      this.captureException(reason, {
        data: {
          __sentry__: true
        },
        originalException: reason
      });
      throw new SentryError(
        `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
      );
    });
  }
  /**
   * Occupies the client with processing and event
   */
  _process(promise) {
    this._numProcessing++;
    void promise.then(
      (value) => {
        this._numProcessing--;
        return value;
      },
      (reason) => {
        this._numProcessing--;
        return reason;
      }
    );
  }
  /**
   * @inheritdoc
   */
  _sendEnvelope(envelope) {
    this.emit("beforeEnvelope", envelope);
    if (this._isEnabled() && this._transport) {
      return this._transport.send(envelope).then(null, (reason) => {
        DEBUG_BUILD2 && logger.error("Error while sending event:", reason);
      });
    } else {
      DEBUG_BUILD2 && logger.error("Transport disabled");
    }
  }
  /**
   * Clears outcomes on this client and returns them.
   */
  _clearOutcomes() {
    const outcomes = this._outcomes;
    this._outcomes = {};
    return Object.keys(outcomes).map((key) => {
      const [reason, category] = key.split(":");
      return {
        reason,
        category,
        quantity: outcomes[key]
      };
    });
  }
  /**
   * @inheritDoc
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
};
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
  const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
  if (isThenable(beforeSendResult)) {
    return beforeSendResult.then(
      (event) => {
        if (!isPlainObject(event) && event !== null) {
          throw new SentryError(invalidValueError);
        }
        return event;
      },
      (e2) => {
        throw new SentryError(`${beforeSendLabel} rejected with ${e2}`);
      }
    );
  } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
    throw new SentryError(invalidValueError);
  }
  return beforeSendResult;
}
function processBeforeSend(options, event, hint) {
  const { beforeSend, beforeSendTransaction } = options;
  if (isErrorEvent2(event) && beforeSend) {
    return beforeSend(event, hint);
  }
  if (isTransactionEvent(event) && beforeSendTransaction) {
    return beforeSendTransaction(event, hint);
  }
  return event;
}
function isErrorEvent2(event) {
  return event.type === void 0;
}
function isTransactionEvent(event) {
  return event.type === "transaction";
}

// node_modules/@sentry/core/esm/sdk.js
function initAndBind(clientClass, options) {
  if (options.debug === true) {
    if (DEBUG_BUILD2) {
      logger.enable();
    } else {
      consoleSandbox(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
      });
    }
  }
  const hub = getCurrentHub();
  const scope = hub.getScope();
  scope.update(options.initialScope);
  const client = new clientClass(options);
  hub.bindClient(client);
}

// node_modules/@sentry/core/esm/transports/base.js
var DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
function createTransport(options, makeRequest, buffer = makePromiseBuffer(
  options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
)) {
  let rateLimits = {};
  const flush2 = (timeout) => buffer.drain(timeout);
  function send(envelope) {
    const filteredEnvelopeItems = [];
    forEachEnvelopeItem(envelope, (item, type) => {
      const envelopeItemDataCategory = envelopeItemTypeToDataCategory(type);
      if (isRateLimited(rateLimits, envelopeItemDataCategory)) {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent("ratelimit_backoff", envelopeItemDataCategory, event);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });
    if (filteredEnvelopeItems.length === 0) {
      return resolvedSyncPromise();
    }
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
    const recordEnvelopeLoss = (reason) => {
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
      });
    };
    const requestTask = () => makeRequest({ body: serializeEnvelope(filteredEnvelope, options.textEncoder) }).then(
      (response) => {
        if (response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
          DEBUG_BUILD2 && logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
        }
        rateLimits = updateRateLimits(rateLimits, response);
        return response;
      },
      (error) => {
        recordEnvelopeLoss("network_error");
        throw error;
      }
    );
    return buffer.add(requestTask).then(
      (result) => result,
      (error) => {
        if (error instanceof SentryError) {
          DEBUG_BUILD2 && logger.error("Skipped sending event because buffer is full.");
          recordEnvelopeLoss("queue_overflow");
          return resolvedSyncPromise();
        } else {
          throw error;
        }
      }
    );
  }
  send.__sentry__baseTransport__ = true;
  return {
    send,
    flush: flush2
  };
}
function getEventForEnvelopeItem(item, type) {
  if (type !== "event" && type !== "transaction") {
    return void 0;
  }
  return Array.isArray(item) ? item[1] : void 0;
}

// node_modules/@sentry/core/esm/version.js
var SDK_VERSION = "7.84.0";

// node_modules/@sentry/core/esm/integrations/index.js
var integrations_exports = {};
__export(integrations_exports, {
  FunctionToString: () => FunctionToString,
  InboundFilters: () => InboundFilters,
  LinkedErrors: () => LinkedErrors
});

// node_modules/@sentry/core/esm/integrations/functiontostring.js
var originalFunctionToString;
var FunctionToString = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "FunctionToString";
  }
  /**
   * @inheritDoc
   */
  constructor() {
    this.name = FunctionToString.id;
  }
  /**
   * @inheritDoc
   */
  setupOnce() {
    originalFunctionToString = Function.prototype.toString;
    try {
      Function.prototype.toString = function(...args) {
        const context = getOriginalFunction(this) || this;
        return originalFunctionToString.apply(context, args);
      };
    } catch (e2) {
    }
  }
};
FunctionToString.__initStatic();

// node_modules/@sentry/core/esm/integrations/inboundfilters.js
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
var DEFAULT_IGNORE_TRANSACTIONS = [
  /^.*\/healthcheck$/,
  /^.*\/healthy$/,
  /^.*\/live$/,
  /^.*\/ready$/,
  /^.*\/heartbeat$/,
  /^.*\/health$/,
  /^.*\/healthz$/
];
var InboundFilters = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "InboundFilters";
  }
  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    this.name = InboundFilters.id;
    this._options = options;
  }
  /**
   * @inheritDoc
   */
  setupOnce(_addGlobaleventProcessor, _getCurrentHub) {
  }
  /** @inheritDoc */
  processEvent(event, _eventHint, client) {
    const clientOptions = client.getOptions();
    const options = _mergeOptions(this._options, clientOptions);
    return _shouldDropEvent(event, options) ? null : event;
  }
};
InboundFilters.__initStatic();
function _mergeOptions(internalOptions = {}, clientOptions = {}) {
  return {
    allowUrls: [...internalOptions.allowUrls || [], ...clientOptions.allowUrls || []],
    denyUrls: [...internalOptions.denyUrls || [], ...clientOptions.denyUrls || []],
    ignoreErrors: [
      ...internalOptions.ignoreErrors || [],
      ...clientOptions.ignoreErrors || [],
      ...internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS
    ],
    ignoreTransactions: [
      ...internalOptions.ignoreTransactions || [],
      ...clientOptions.ignoreTransactions || [],
      ...internalOptions.disableTransactionDefaults ? [] : DEFAULT_IGNORE_TRANSACTIONS
    ],
    ignoreInternal: internalOptions.ignoreInternal !== void 0 ? internalOptions.ignoreInternal : true
  };
}
function _shouldDropEvent(event, options) {
  if (options.ignoreInternal && _isSentryError(event)) {
    DEBUG_BUILD2 && logger.warn(`Event dropped due to being internal Sentry Error.
Event: ${getEventDescription(event)}`);
    return true;
  }
  if (_isIgnoredError(event, options.ignoreErrors)) {
    DEBUG_BUILD2 && logger.warn(
      `Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${getEventDescription(event)}`
    );
    return true;
  }
  if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
    DEBUG_BUILD2 && logger.warn(
      `Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${getEventDescription(event)}`
    );
    return true;
  }
  if (_isDeniedUrl(event, options.denyUrls)) {
    DEBUG_BUILD2 && logger.warn(
      `Event dropped due to being matched by \`denyUrls\` option.
Event: ${getEventDescription(
        event
      )}.
Url: ${_getEventFilterUrl(event)}`
    );
    return true;
  }
  if (!_isAllowedUrl(event, options.allowUrls)) {
    DEBUG_BUILD2 && logger.warn(
      `Event dropped due to not being matched by \`allowUrls\` option.
Event: ${getEventDescription(
        event
      )}.
Url: ${_getEventFilterUrl(event)}`
    );
    return true;
  }
  return false;
}
function _isIgnoredError(event, ignoreErrors) {
  if (event.type || !ignoreErrors || !ignoreErrors.length) {
    return false;
  }
  return _getPossibleEventMessages(event).some((message) => stringMatchesSomePattern(message, ignoreErrors));
}
function _isIgnoredTransaction(event, ignoreTransactions) {
  if (event.type !== "transaction" || !ignoreTransactions || !ignoreTransactions.length) {
    return false;
  }
  const name = event.transaction;
  return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
}
function _isDeniedUrl(event, denyUrls) {
  if (!denyUrls || !denyUrls.length) {
    return false;
  }
  const url = _getEventFilterUrl(event);
  return !url ? false : stringMatchesSomePattern(url, denyUrls);
}
function _isAllowedUrl(event, allowUrls) {
  if (!allowUrls || !allowUrls.length) {
    return true;
  }
  const url = _getEventFilterUrl(event);
  return !url ? true : stringMatchesSomePattern(url, allowUrls);
}
function _getPossibleEventMessages(event) {
  const possibleMessages = [];
  if (event.message) {
    possibleMessages.push(event.message);
  }
  let lastException;
  try {
    lastException = event.exception.values[event.exception.values.length - 1];
  } catch (e2) {
  }
  if (lastException) {
    if (lastException.value) {
      possibleMessages.push(lastException.value);
      if (lastException.type) {
        possibleMessages.push(`${lastException.type}: ${lastException.value}`);
      }
    }
  }
  if (DEBUG_BUILD2 && possibleMessages.length === 0) {
    logger.error(`Could not extract message for event ${getEventDescription(event)}`);
  }
  return possibleMessages;
}
function _isSentryError(event) {
  try {
    return event.exception.values[0].type === "SentryError";
  } catch (e2) {
  }
  return false;
}
function _getLastValidUrl(frames = []) {
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i];
    if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]") {
      return frame.filename || null;
    }
  }
  return null;
}
function _getEventFilterUrl(event) {
  try {
    let frames;
    try {
      frames = event.exception.values[0].stacktrace.frames;
    } catch (e2) {
    }
    return frames ? _getLastValidUrl(frames) : null;
  } catch (oO) {
    DEBUG_BUILD2 && logger.error(`Cannot extract url for event ${getEventDescription(event)}`);
    return null;
  }
}

// node_modules/@sentry/core/esm/integrations/linkederrors.js
var DEFAULT_KEY = "cause";
var DEFAULT_LIMIT = 5;
var LinkedErrors = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "LinkedErrors";
  }
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    this._key = options.key || DEFAULT_KEY;
    this._limit = options.limit || DEFAULT_LIMIT;
    this.name = LinkedErrors.id;
  }
  /** @inheritdoc */
  setupOnce() {
  }
  /**
   * @inheritDoc
   */
  preprocessEvent(event, hint, client) {
    const options = client.getOptions();
    applyAggregateErrorsToEvent(
      exceptionFromError,
      options.stackParser,
      options.maxValueLength,
      this._key,
      this._limit,
      event,
      hint
    );
  }
};
LinkedErrors.__initStatic();

// node_modules/@sentry/core/esm/utils/isSentryRequestUrl.js
function isSentryRequestUrl(url, hub) {
  const client = hub.getClient();
  const dsn = client && client.getDsn();
  const tunnel = client && client.getOptions().tunnel;
  return checkDsn(url, dsn) || checkTunnel(url, tunnel);
}
function checkTunnel(url, tunnel) {
  if (!tunnel) {
    return false;
  }
  return removeTrailingSlash(url) === removeTrailingSlash(tunnel);
}
function checkDsn(url, dsn) {
  return dsn ? url.includes(dsn.host) : false;
}
function removeTrailingSlash(str) {
  return str[str.length - 1] === "/" ? str.slice(0, -1) : str;
}

// node_modules/@sentry-internal/tracing/esm/common/debug-build.js
var DEBUG_BUILD3 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// node_modules/@sentry-internal/tracing/esm/browser/types.js
var WINDOW8 = GLOBAL_OBJ;

// node_modules/@sentry-internal/tracing/esm/browser/backgroundtab.js
function registerBackgroundTabDetection() {
  if (WINDOW8 && WINDOW8.document) {
    WINDOW8.document.addEventListener("visibilitychange", () => {
      const activeTransaction2 = getActiveTransaction();
      if (WINDOW8.document.hidden && activeTransaction2) {
        const statusType = "cancelled";
        DEBUG_BUILD3 && logger.log(
          `[Tracing] Transaction: ${statusType} -> since tab moved to the background, op: ${activeTransaction2.op}`
        );
        if (!activeTransaction2.status) {
          activeTransaction2.setStatus(statusType);
        }
        activeTransaction2.setTag("visibilitychange", "document.hidden");
        activeTransaction2.finish();
      }
    });
  } else {
    DEBUG_BUILD3 && logger.warn("[Tracing] Could not set up background tab detection due to lack of global document");
  }
}

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/bindReporter.js
var bindReporter = (callback, metric, reportAllChanges) => {
  let prevValue;
  let delta;
  return (forceReport) => {
    if (metric.value >= 0) {
      if (forceReport || reportAllChanges) {
        delta = metric.value - (prevValue || 0);
        if (delta || prevValue === void 0) {
          prevValue = metric.value;
          metric.delta = delta;
          callback(metric);
        }
      }
    }
  };
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/generateUniqueID.js
var generateUniqueID = () => {
  return `v3-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/getNavigationEntry.js
var getNavigationEntryFromPerformanceTiming = () => {
  const timing = WINDOW8.performance.timing;
  const type = WINDOW8.performance.navigation.type;
  const navigationEntry = {
    entryType: "navigation",
    startTime: 0,
    type: type == 2 ? "back_forward" : type === 1 ? "reload" : "navigate"
  };
  for (const key in timing) {
    if (key !== "navigationStart" && key !== "toJSON") {
      navigationEntry[key] = Math.max(timing[key] - timing.navigationStart, 0);
    }
  }
  return navigationEntry;
};
var getNavigationEntry = () => {
  if (WINDOW8.__WEB_VITALS_POLYFILL__) {
    return WINDOW8.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || getNavigationEntryFromPerformanceTiming());
  } else {
    return WINDOW8.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  }
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/getActivationStart.js
var getActivationStart = () => {
  const navEntry = getNavigationEntry();
  return navEntry && navEntry.activationStart || 0;
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/initMetric.js
var initMetric = (name, value) => {
  const navEntry = getNavigationEntry();
  let navigationType = "navigate";
  if (navEntry) {
    if (WINDOW8.document.prerendering || getActivationStart() > 0) {
      navigationType = "prerender";
    } else {
      navigationType = navEntry.type.replace(/_/g, "-");
    }
  }
  return {
    name,
    value: typeof value === "undefined" ? -1 : value,
    rating: "good",
    // Will be updated if the value changes.
    delta: 0,
    entries: [],
    id: generateUniqueID(),
    navigationType
  };
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/observe.js
var observe = (type, callback, opts) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(type)) {
      const po = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      po.observe(
        Object.assign(
          {
            type,
            buffered: true
          },
          opts || {}
        )
      );
      return po;
    }
  } catch (e2) {
  }
  return;
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/onHidden.js
var onHidden = (cb, once) => {
  const onHiddenOrPageHide = (event) => {
    if (event.type === "pagehide" || WINDOW8.document.visibilityState === "hidden") {
      cb(event);
      if (once) {
        removeEventListener("visibilitychange", onHiddenOrPageHide, true);
        removeEventListener("pagehide", onHiddenOrPageHide, true);
      }
    }
  };
  addEventListener("visibilitychange", onHiddenOrPageHide, true);
  addEventListener("pagehide", onHiddenOrPageHide, true);
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/getCLS.js
var onCLS = (onReport) => {
  const metric = initMetric("CLS", 0);
  let report;
  let sessionValue = 0;
  let sessionEntries = [];
  const handleEntries = (entries) => {
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
        if (sessionValue && sessionEntries.length !== 0 && entry.startTime - lastSessionEntry.startTime < 1e3 && entry.startTime - firstSessionEntry.startTime < 5e3) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }
        if (sessionValue > metric.value) {
          metric.value = sessionValue;
          metric.entries = sessionEntries;
          if (report) {
            report();
          }
        }
      }
    });
  };
  const po = observe("layout-shift", handleEntries);
  if (po) {
    report = bindReporter(onReport, metric);
    const stopListening = () => {
      handleEntries(po.takeRecords());
      report(true);
    };
    onHidden(stopListening);
    return stopListening;
  }
  return;
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js
var firstHiddenTime = -1;
var initHiddenTime = () => {
  return WINDOW8.document.visibilityState === "hidden" && !WINDOW8.document.prerendering ? 0 : Infinity;
};
var trackChanges = () => {
  onHidden(({ timeStamp }) => {
    firstHiddenTime = timeStamp;
  }, true);
};
var getVisibilityWatcher = () => {
  if (firstHiddenTime < 0) {
    firstHiddenTime = initHiddenTime();
    trackChanges();
  }
  return {
    get firstHiddenTime() {
      return firstHiddenTime;
    }
  };
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/getFID.js
var onFID = (onReport) => {
  const visibilityWatcher = getVisibilityWatcher();
  const metric = initMetric("FID");
  let report;
  const handleEntry = (entry) => {
    if (entry.startTime < visibilityWatcher.firstHiddenTime) {
      metric.value = entry.processingStart - entry.startTime;
      metric.entries.push(entry);
      report(true);
    }
  };
  const handleEntries = (entries) => {
    entries.forEach(handleEntry);
  };
  const po = observe("first-input", handleEntries);
  report = bindReporter(onReport, metric);
  if (po) {
    onHidden(() => {
      handleEntries(po.takeRecords());
      po.disconnect();
    }, true);
  }
};

// node_modules/@sentry-internal/tracing/esm/browser/web-vitals/getLCP.js
var reportedMetricIDs = {};
var onLCP = (onReport) => {
  const visibilityWatcher = getVisibilityWatcher();
  const metric = initMetric("LCP");
  let report;
  const handleEntries = (entries) => {
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      const value = Math.max(lastEntry.startTime - getActivationStart(), 0);
      if (value < visibilityWatcher.firstHiddenTime) {
        metric.value = value;
        metric.entries = [lastEntry];
        report();
      }
    }
  };
  const po = observe("largest-contentful-paint", handleEntries);
  if (po) {
    report = bindReporter(onReport, metric);
    const stopListening = () => {
      if (!reportedMetricIDs[metric.id]) {
        handleEntries(po.takeRecords());
        po.disconnect();
        reportedMetricIDs[metric.id] = true;
        report(true);
      }
    };
    ["keydown", "click"].forEach((type) => {
      addEventListener(type, stopListening, { once: true, capture: true });
    });
    onHidden(stopListening, true);
    return stopListening;
  }
  return;
};

// node_modules/@sentry-internal/tracing/esm/browser/instrument.js
var handlers2 = {};
var instrumented2 = {};
var _previousCls;
var _previousFid;
var _previousLcp;
function addClsInstrumentationHandler(callback) {
  return addMetricObserver("cls", callback, instrumentCls, _previousCls);
}
function addLcpInstrumentationHandler(callback) {
  return addMetricObserver("lcp", callback, instrumentLcp, _previousLcp);
}
function addFidInstrumentationHandler(callback) {
  return addMetricObserver("fid", callback, instrumentFid, _previousFid);
}
function addPerformanceInstrumentationHandler(type, callback) {
  addHandler2(type, callback);
  if (!instrumented2[type]) {
    instrumentPerformanceObserver(type);
    instrumented2[type] = true;
  }
  return getCleanupCallback(type, callback);
}
function triggerHandlers2(type, data) {
  const typeHandlers = handlers2[type];
  if (!typeHandlers || !typeHandlers.length) {
    return;
  }
  for (const handler of typeHandlers) {
    try {
      handler(data);
    } catch (e2) {
      DEBUG_BUILD3 && logger.error(
        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`,
        e2
      );
    }
  }
}
function instrumentCls() {
  onCLS((metric) => {
    triggerHandlers2("cls", {
      metric
    });
    _previousCls = metric;
  });
}
function instrumentFid() {
  onFID((metric) => {
    triggerHandlers2("fid", {
      metric
    });
    _previousFid = metric;
  });
}
function instrumentLcp() {
  onLCP((metric) => {
    triggerHandlers2("lcp", {
      metric
    });
    _previousLcp = metric;
  });
}
function addMetricObserver(type, callback, instrumentFn, previousValue) {
  addHandler2(type, callback);
  if (!instrumented2[type]) {
    instrumentFn();
    instrumented2[type] = true;
  }
  if (previousValue) {
    callback({ metric: previousValue });
  }
  return getCleanupCallback(type, callback);
}
function instrumentPerformanceObserver(type) {
  const options = {};
  if (type === "event") {
    options.durationThreshold = 0;
  }
  observe(
    type,
    (entries) => {
      triggerHandlers2(type, { entries });
    },
    options
  );
}
function addHandler2(type, handler) {
  handlers2[type] = handlers2[type] || [];
  handlers2[type].push(handler);
}
function getCleanupCallback(type, callback) {
  return () => {
    const typeHandlers = handlers2[type];
    if (!typeHandlers) {
      return;
    }
    const index = typeHandlers.indexOf(callback);
    if (index !== -1) {
      typeHandlers.splice(index, 1);
    }
  };
}

// node_modules/@sentry-internal/tracing/esm/browser/metrics/utils.js
function isMeasurementValue(value) {
  return typeof value === "number" && isFinite(value);
}
function _startChild(transaction, { startTimestamp, ...ctx }) {
  if (startTimestamp && transaction.startTimestamp > startTimestamp) {
    transaction.startTimestamp = startTimestamp;
  }
  return transaction.startChild({
    startTimestamp,
    ...ctx
  });
}

// node_modules/@sentry-internal/tracing/esm/browser/metrics/index.js
var MAX_INT_AS_BYTES = 2147483647;
function msToSec(time) {
  return time / 1e3;
}
function getBrowserPerformanceAPI() {
  return WINDOW8 && WINDOW8.addEventListener && WINDOW8.performance;
}
var _performanceCursor = 0;
var _measurements = {};
var _lcpEntry;
var _clsEntry;
function startTrackingWebVitals() {
  const performance2 = getBrowserPerformanceAPI();
  if (performance2 && browserPerformanceTimeOrigin) {
    if (performance2.mark) {
      WINDOW8.performance.mark("sentry-tracing-init");
    }
    const fidCallback = _trackFID();
    const clsCallback = _trackCLS();
    const lcpCallback = _trackLCP();
    return () => {
      fidCallback();
      clsCallback();
      lcpCallback();
    };
  }
  return () => void 0;
}
function startTrackingLongTasks() {
  addPerformanceInstrumentationHandler("longtask", ({ entries }) => {
    for (const entry of entries) {
      const transaction = getActiveTransaction();
      if (!transaction) {
        return;
      }
      const startTime = msToSec(browserPerformanceTimeOrigin + entry.startTime);
      const duration = msToSec(entry.duration);
      transaction.startChild({
        description: "Main UI thread blocked",
        op: "ui.long-task",
        origin: "auto.ui.browser.metrics",
        startTimestamp: startTime,
        endTimestamp: startTime + duration
      });
    }
  });
}
function startTrackingInteractions() {
  addPerformanceInstrumentationHandler("event", ({ entries }) => {
    for (const entry of entries) {
      const transaction = getActiveTransaction();
      if (!transaction) {
        return;
      }
      if (entry.name === "click") {
        const startTime = msToSec(browserPerformanceTimeOrigin + entry.startTime);
        const duration = msToSec(entry.duration);
        transaction.startChild({
          description: htmlTreeAsString(entry.target),
          op: `ui.interaction.${entry.name}`,
          origin: "auto.ui.browser.metrics",
          startTimestamp: startTime,
          endTimestamp: startTime + duration
        });
      }
    }
  });
}
function _trackCLS() {
  return addClsInstrumentationHandler(({ metric }) => {
    const entry = metric.entries.pop();
    if (!entry) {
      return;
    }
    DEBUG_BUILD3 && logger.log("[Measurements] Adding CLS");
    _measurements["cls"] = { value: metric.value, unit: "" };
    _clsEntry = entry;
  });
}
function _trackLCP() {
  return addLcpInstrumentationHandler(({ metric }) => {
    const entry = metric.entries.pop();
    if (!entry) {
      return;
    }
    DEBUG_BUILD3 && logger.log("[Measurements] Adding LCP");
    _measurements["lcp"] = { value: metric.value, unit: "millisecond" };
    _lcpEntry = entry;
  });
}
function _trackFID() {
  return addFidInstrumentationHandler(({ metric }) => {
    const entry = metric.entries.pop();
    if (!entry) {
      return;
    }
    const timeOrigin = msToSec(browserPerformanceTimeOrigin);
    const startTime = msToSec(entry.startTime);
    DEBUG_BUILD3 && logger.log("[Measurements] Adding FID");
    _measurements["fid"] = { value: metric.value, unit: "millisecond" };
    _measurements["mark.fid"] = { value: timeOrigin + startTime, unit: "second" };
  });
}
function addPerformanceEntries(transaction) {
  const performance2 = getBrowserPerformanceAPI();
  if (!performance2 || !WINDOW8.performance.getEntries || !browserPerformanceTimeOrigin) {
    return;
  }
  DEBUG_BUILD3 && logger.log("[Tracing] Adding & adjusting spans using Performance API");
  const timeOrigin = msToSec(browserPerformanceTimeOrigin);
  const performanceEntries = performance2.getEntries();
  let responseStartTimestamp;
  let requestStartTimestamp;
  performanceEntries.slice(_performanceCursor).forEach((entry) => {
    const startTime = msToSec(entry.startTime);
    const duration = msToSec(entry.duration);
    if (transaction.op === "navigation" && timeOrigin + startTime < transaction.startTimestamp) {
      return;
    }
    switch (entry.entryType) {
      case "navigation": {
        _addNavigationSpans(transaction, entry, timeOrigin);
        responseStartTimestamp = timeOrigin + msToSec(entry.responseStart);
        requestStartTimestamp = timeOrigin + msToSec(entry.requestStart);
        break;
      }
      case "mark":
      case "paint":
      case "measure": {
        _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin);
        const firstHidden = getVisibilityWatcher();
        const shouldRecord = entry.startTime < firstHidden.firstHiddenTime;
        if (entry.name === "first-paint" && shouldRecord) {
          DEBUG_BUILD3 && logger.log("[Measurements] Adding FP");
          _measurements["fp"] = { value: entry.startTime, unit: "millisecond" };
        }
        if (entry.name === "first-contentful-paint" && shouldRecord) {
          DEBUG_BUILD3 && logger.log("[Measurements] Adding FCP");
          _measurements["fcp"] = { value: entry.startTime, unit: "millisecond" };
        }
        break;
      }
      case "resource": {
        const resourceName = entry.name.replace(WINDOW8.location.origin, "");
        _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin);
        break;
      }
    }
  });
  _performanceCursor = Math.max(performanceEntries.length - 1, 0);
  _trackNavigator(transaction);
  if (transaction.op === "pageload") {
    if (typeof responseStartTimestamp === "number") {
      DEBUG_BUILD3 && logger.log("[Measurements] Adding TTFB");
      _measurements["ttfb"] = {
        value: (responseStartTimestamp - transaction.startTimestamp) * 1e3,
        unit: "millisecond"
      };
      if (typeof requestStartTimestamp === "number" && requestStartTimestamp <= responseStartTimestamp) {
        _measurements["ttfb.requestTime"] = {
          value: (responseStartTimestamp - requestStartTimestamp) * 1e3,
          unit: "millisecond"
        };
      }
    }
    ["fcp", "fp", "lcp"].forEach((name) => {
      if (!_measurements[name] || timeOrigin >= transaction.startTimestamp) {
        return;
      }
      const oldValue = _measurements[name].value;
      const measurementTimestamp = timeOrigin + msToSec(oldValue);
      const normalizedValue = Math.abs((measurementTimestamp - transaction.startTimestamp) * 1e3);
      const delta = normalizedValue - oldValue;
      DEBUG_BUILD3 && logger.log(`[Measurements] Normalized ${name} from ${oldValue} to ${normalizedValue} (${delta})`);
      _measurements[name].value = normalizedValue;
    });
    const fidMark = _measurements["mark.fid"];
    if (fidMark && _measurements["fid"]) {
      _startChild(transaction, {
        description: "first input delay",
        endTimestamp: fidMark.value + msToSec(_measurements["fid"].value),
        op: "ui.action",
        origin: "auto.ui.browser.metrics",
        startTimestamp: fidMark.value
      });
      delete _measurements["mark.fid"];
    }
    if (!("fcp" in _measurements)) {
      delete _measurements.cls;
    }
    Object.keys(_measurements).forEach((measurementName) => {
      transaction.setMeasurement(
        measurementName,
        _measurements[measurementName].value,
        _measurements[measurementName].unit
      );
    });
    _tagMetricInfo(transaction);
  }
  _lcpEntry = void 0;
  _clsEntry = void 0;
  _measurements = {};
}
function _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin) {
  const measureStartTimestamp = timeOrigin + startTime;
  const measureEndTimestamp = measureStartTimestamp + duration;
  _startChild(transaction, {
    description: entry.name,
    endTimestamp: measureEndTimestamp,
    op: entry.entryType,
    origin: "auto.resource.browser.metrics",
    startTimestamp: measureStartTimestamp
  });
  return measureStartTimestamp;
}
function _addNavigationSpans(transaction, entry, timeOrigin) {
  ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((event) => {
    _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin);
  });
  _addPerformanceNavigationTiming(transaction, entry, "secureConnection", timeOrigin, "TLS/SSL", "connectEnd");
  _addPerformanceNavigationTiming(transaction, entry, "fetch", timeOrigin, "cache", "domainLookupStart");
  _addPerformanceNavigationTiming(transaction, entry, "domainLookup", timeOrigin, "DNS");
  _addRequest(transaction, entry, timeOrigin);
}
function _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin, description, eventEnd) {
  const end = eventEnd ? entry[eventEnd] : entry[`${event}End`];
  const start = entry[`${event}Start`];
  if (!start || !end) {
    return;
  }
  _startChild(transaction, {
    op: "browser",
    origin: "auto.browser.browser.metrics",
    description: description || event,
    startTimestamp: timeOrigin + msToSec(start),
    endTimestamp: timeOrigin + msToSec(end)
  });
}
function _addRequest(transaction, entry, timeOrigin) {
  _startChild(transaction, {
    op: "browser",
    origin: "auto.browser.browser.metrics",
    description: "request",
    startTimestamp: timeOrigin + msToSec(entry.requestStart),
    endTimestamp: timeOrigin + msToSec(entry.responseEnd)
  });
  _startChild(transaction, {
    op: "browser",
    origin: "auto.browser.browser.metrics",
    description: "response",
    startTimestamp: timeOrigin + msToSec(entry.responseStart),
    endTimestamp: timeOrigin + msToSec(entry.responseEnd)
  });
}
function _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin) {
  if (entry.initiatorType === "xmlhttprequest" || entry.initiatorType === "fetch") {
    return;
  }
  const data = {};
  setResourceEntrySizeData(data, entry, "transferSize", "http.response_transfer_size");
  setResourceEntrySizeData(data, entry, "encodedBodySize", "http.response_content_length");
  setResourceEntrySizeData(data, entry, "decodedBodySize", "http.decoded_response_content_length");
  if ("renderBlockingStatus" in entry) {
    data["resource.render_blocking_status"] = entry.renderBlockingStatus;
  }
  const startTimestamp = timeOrigin + startTime;
  const endTimestamp = startTimestamp + duration;
  _startChild(transaction, {
    description: resourceName,
    endTimestamp,
    op: entry.initiatorType ? `resource.${entry.initiatorType}` : "resource.other",
    origin: "auto.resource.browser.metrics",
    startTimestamp,
    data
  });
}
function _trackNavigator(transaction) {
  const navigator = WINDOW8.navigator;
  if (!navigator) {
    return;
  }
  const connection = navigator.connection;
  if (connection) {
    if (connection.effectiveType) {
      transaction.setTag("effectiveConnectionType", connection.effectiveType);
    }
    if (connection.type) {
      transaction.setTag("connectionType", connection.type);
    }
    if (isMeasurementValue(connection.rtt)) {
      _measurements["connection.rtt"] = { value: connection.rtt, unit: "millisecond" };
    }
  }
  if (isMeasurementValue(navigator.deviceMemory)) {
    transaction.setTag("deviceMemory", `${navigator.deviceMemory} GB`);
  }
  if (isMeasurementValue(navigator.hardwareConcurrency)) {
    transaction.setTag("hardwareConcurrency", String(navigator.hardwareConcurrency));
  }
}
function _tagMetricInfo(transaction) {
  if (_lcpEntry) {
    DEBUG_BUILD3 && logger.log("[Measurements] Adding LCP Data");
    if (_lcpEntry.element) {
      transaction.setTag("lcp.element", htmlTreeAsString(_lcpEntry.element));
    }
    if (_lcpEntry.id) {
      transaction.setTag("lcp.id", _lcpEntry.id);
    }
    if (_lcpEntry.url) {
      transaction.setTag("lcp.url", _lcpEntry.url.trim().slice(0, 200));
    }
    transaction.setTag("lcp.size", _lcpEntry.size);
  }
  if (_clsEntry && _clsEntry.sources) {
    DEBUG_BUILD3 && logger.log("[Measurements] Adding CLS Data");
    _clsEntry.sources.forEach(
      (source, index) => transaction.setTag(`cls.source.${index + 1}`, htmlTreeAsString(source.node))
    );
  }
}
function setResourceEntrySizeData(data, entry, key, dataKey) {
  const entryVal = entry[key];
  if (entryVal != null && entryVal < MAX_INT_AS_BYTES) {
    data[dataKey] = entryVal;
  }
}

// node_modules/@sentry-internal/tracing/esm/common/fetch.js
function instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeaders2, spans, spanOrigin = "auto.http.browser") {
  if (!hasTracingEnabled() || !handlerData.fetchData) {
    return void 0;
  }
  const shouldCreateSpanResult = shouldCreateSpan(handlerData.fetchData.url);
  if (handlerData.endTimestamp && shouldCreateSpanResult) {
    const spanId = handlerData.fetchData.__span;
    if (!spanId)
      return;
    const span2 = spans[spanId];
    if (span2) {
      if (handlerData.response) {
        span2.setHttpStatus(handlerData.response.status);
        const contentLength = handlerData.response && handlerData.response.headers && handlerData.response.headers.get("content-length");
        if (contentLength) {
          const contentLengthNum = parseInt(contentLength);
          if (contentLengthNum > 0) {
            span2.setData("http.response_content_length", contentLengthNum);
          }
        }
      } else if (handlerData.error) {
        span2.setStatus("internal_error");
      }
      span2.finish();
      delete spans[spanId];
    }
    return void 0;
  }
  const hub = getCurrentHub();
  const scope = hub.getScope();
  const client = hub.getClient();
  const parentSpan = scope.getSpan();
  const { method, url } = handlerData.fetchData;
  const span = shouldCreateSpanResult && parentSpan ? parentSpan.startChild({
    data: {
      url,
      type: "fetch",
      "http.method": method
    },
    description: `${method} ${url}`,
    op: "http.client",
    origin: spanOrigin
  }) : void 0;
  if (span) {
    handlerData.fetchData.__span = span.spanId;
    spans[span.spanId] = span;
  }
  if (shouldAttachHeaders2(handlerData.fetchData.url) && client) {
    const request = handlerData.args[0];
    handlerData.args[1] = handlerData.args[1] || {};
    const options = handlerData.args[1];
    options.headers = addTracingHeadersToFetchRequest(request, client, scope, options, span);
  }
  return span;
}
function addTracingHeadersToFetchRequest(request, client, scope, options, requestSpan) {
  const span = requestSpan || scope.getSpan();
  const transaction = span && span.transaction;
  const { traceId, sampled, dsc } = scope.getPropagationContext();
  const sentryTraceHeader = span ? span.toTraceparent() : generateSentryTraceHeader(traceId, void 0, sampled);
  const dynamicSamplingContext = transaction ? transaction.getDynamicSamplingContext() : dsc ? dsc : getDynamicSamplingContextFromClient(traceId, client, scope);
  const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
  const headers = typeof Request !== "undefined" && isInstanceOf(request, Request) ? request.headers : options.headers;
  if (!headers) {
    return { "sentry-trace": sentryTraceHeader, baggage: sentryBaggageHeader };
  } else if (typeof Headers !== "undefined" && isInstanceOf(headers, Headers)) {
    const newHeaders = new Headers(headers);
    newHeaders.append("sentry-trace", sentryTraceHeader);
    if (sentryBaggageHeader) {
      newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
    }
    return newHeaders;
  } else if (Array.isArray(headers)) {
    const newHeaders = [...headers, ["sentry-trace", sentryTraceHeader]];
    if (sentryBaggageHeader) {
      newHeaders.push([BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
    }
    return newHeaders;
  } else {
    const existingBaggageHeader = "baggage" in headers ? headers.baggage : void 0;
    const newBaggageHeaders = [];
    if (Array.isArray(existingBaggageHeader)) {
      newBaggageHeaders.push(...existingBaggageHeader);
    } else if (existingBaggageHeader) {
      newBaggageHeaders.push(existingBaggageHeader);
    }
    if (sentryBaggageHeader) {
      newBaggageHeaders.push(sentryBaggageHeader);
    }
    return {
      ...headers,
      "sentry-trace": sentryTraceHeader,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(",") : void 0
    };
  }
}

// node_modules/@sentry-internal/tracing/esm/browser/request.js
var DEFAULT_TRACE_PROPAGATION_TARGETS = ["localhost", /^\/(?!\/)/];
var defaultRequestInstrumentationOptions = {
  traceFetch: true,
  traceXHR: true,
  enableHTTPTimings: true,
  // TODO (v8): Remove this property
  tracingOrigins: DEFAULT_TRACE_PROPAGATION_TARGETS,
  tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS
};
function instrumentOutgoingRequests(_options) {
  const {
    traceFetch,
    traceXHR,
    // eslint-disable-next-line deprecation/deprecation
    tracePropagationTargets,
    // eslint-disable-next-line deprecation/deprecation
    tracingOrigins,
    shouldCreateSpanForRequest,
    enableHTTPTimings
  } = {
    traceFetch: defaultRequestInstrumentationOptions.traceFetch,
    traceXHR: defaultRequestInstrumentationOptions.traceXHR,
    ..._options
  };
  const shouldCreateSpan = typeof shouldCreateSpanForRequest === "function" ? shouldCreateSpanForRequest : (_) => true;
  const shouldAttachHeadersWithTargets = (url) => shouldAttachHeaders(url, tracePropagationTargets || tracingOrigins);
  const spans = {};
  if (traceFetch) {
    addFetchInstrumentationHandler((handlerData) => {
      const createdSpan = instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
      if (enableHTTPTimings && createdSpan) {
        addHTTPTimings(createdSpan);
      }
    });
  }
  if (traceXHR) {
    addXhrInstrumentationHandler((handlerData) => {
      const createdSpan = xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
      if (enableHTTPTimings && createdSpan) {
        addHTTPTimings(createdSpan);
      }
    });
  }
}
function isPerformanceResourceTiming(entry) {
  return entry.entryType === "resource" && "initiatorType" in entry && typeof entry.nextHopProtocol === "string" && (entry.initiatorType === "fetch" || entry.initiatorType === "xmlhttprequest");
}
function addHTTPTimings(span) {
  const url = span.data.url;
  if (!url) {
    return;
  }
  const cleanup = addPerformanceInstrumentationHandler("resource", ({ entries }) => {
    entries.forEach((entry) => {
      if (isPerformanceResourceTiming(entry) && entry.name.endsWith(url)) {
        const spanData = resourceTimingEntryToSpanData(entry);
        spanData.forEach((data) => span.setData(...data));
        setTimeout(cleanup);
      }
    });
  });
}
function extractNetworkProtocol(nextHopProtocol) {
  let name = "unknown";
  let version = "unknown";
  let _name = "";
  for (const char of nextHopProtocol) {
    if (char === "/") {
      [name, version] = nextHopProtocol.split("/");
      break;
    }
    if (!isNaN(Number(char))) {
      name = _name === "h" ? "http" : _name;
      version = nextHopProtocol.split(_name)[1];
      break;
    }
    _name += char;
  }
  if (_name === nextHopProtocol) {
    name = _name;
  }
  return { name, version };
}
function getAbsoluteTime(time = 0) {
  return ((browserPerformanceTimeOrigin || performance.timeOrigin) + time) / 1e3;
}
function resourceTimingEntryToSpanData(resourceTiming) {
  const { name, version } = extractNetworkProtocol(resourceTiming.nextHopProtocol);
  const timingSpanData = [];
  timingSpanData.push(["network.protocol.version", version], ["network.protocol.name", name]);
  if (!browserPerformanceTimeOrigin) {
    return timingSpanData;
  }
  return [
    ...timingSpanData,
    ["http.request.redirect_start", getAbsoluteTime(resourceTiming.redirectStart)],
    ["http.request.fetch_start", getAbsoluteTime(resourceTiming.fetchStart)],
    ["http.request.domain_lookup_start", getAbsoluteTime(resourceTiming.domainLookupStart)],
    ["http.request.domain_lookup_end", getAbsoluteTime(resourceTiming.domainLookupEnd)],
    ["http.request.connect_start", getAbsoluteTime(resourceTiming.connectStart)],
    ["http.request.secure_connection_start", getAbsoluteTime(resourceTiming.secureConnectionStart)],
    ["http.request.connection_end", getAbsoluteTime(resourceTiming.connectEnd)],
    ["http.request.request_start", getAbsoluteTime(resourceTiming.requestStart)],
    ["http.request.response_start", getAbsoluteTime(resourceTiming.responseStart)],
    ["http.request.response_end", getAbsoluteTime(resourceTiming.responseEnd)]
  ];
}
function shouldAttachHeaders(url, tracePropagationTargets) {
  return stringMatchesSomePattern(url, tracePropagationTargets || DEFAULT_TRACE_PROPAGATION_TARGETS);
}
function xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeaders2, spans) {
  const xhr = handlerData.xhr;
  const sentryXhrData = xhr && xhr[SENTRY_XHR_DATA_KEY];
  if (!hasTracingEnabled() || !xhr || xhr.__sentry_own_request__ || !sentryXhrData) {
    return void 0;
  }
  const shouldCreateSpanResult = shouldCreateSpan(sentryXhrData.url);
  if (handlerData.endTimestamp && shouldCreateSpanResult) {
    const spanId = xhr.__sentry_xhr_span_id__;
    if (!spanId)
      return;
    const span2 = spans[spanId];
    if (span2 && sentryXhrData.status_code !== void 0) {
      span2.setHttpStatus(sentryXhrData.status_code);
      span2.finish();
      delete spans[spanId];
    }
    return void 0;
  }
  const hub = getCurrentHub();
  const scope = hub.getScope();
  const parentSpan = scope.getSpan();
  const span = shouldCreateSpanResult && parentSpan ? parentSpan.startChild({
    data: {
      type: "xhr",
      "http.method": sentryXhrData.method,
      url: sentryXhrData.url
    },
    description: `${sentryXhrData.method} ${sentryXhrData.url}`,
    op: "http.client",
    origin: "auto.http.browser"
  }) : void 0;
  if (span) {
    xhr.__sentry_xhr_span_id__ = span.spanId;
    spans[xhr.__sentry_xhr_span_id__] = span;
  }
  if (xhr.setRequestHeader && shouldAttachHeaders2(sentryXhrData.url)) {
    if (span) {
      const transaction = span && span.transaction;
      const dynamicSamplingContext = transaction && transaction.getDynamicSamplingContext();
      const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
      setHeaderOnXhr(xhr, span.toTraceparent(), sentryBaggageHeader);
    } else {
      const client = hub.getClient();
      const { traceId, sampled, dsc } = scope.getPropagationContext();
      const sentryTraceHeader = generateSentryTraceHeader(traceId, void 0, sampled);
      const dynamicSamplingContext = dsc || (client ? getDynamicSamplingContextFromClient(traceId, client, scope) : void 0);
      const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
      setHeaderOnXhr(xhr, sentryTraceHeader, sentryBaggageHeader);
    }
  }
  return span;
}
function setHeaderOnXhr(xhr, sentryTraceHeader, sentryBaggageHeader) {
  try {
    xhr.setRequestHeader("sentry-trace", sentryTraceHeader);
    if (sentryBaggageHeader) {
      xhr.setRequestHeader(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
    }
  } catch (_) {
  }
}

// node_modules/@sentry-internal/tracing/esm/browser/router.js
function instrumentRoutingWithDefaults(customStartTransaction, startTransactionOnPageLoad = true, startTransactionOnLocationChange = true) {
  if (!WINDOW8 || !WINDOW8.location) {
    DEBUG_BUILD3 && logger.warn("Could not initialize routing instrumentation due to invalid location");
    return;
  }
  let startingUrl = WINDOW8.location.href;
  let activeTransaction2;
  if (startTransactionOnPageLoad) {
    activeTransaction2 = customStartTransaction({
      name: WINDOW8.location.pathname,
      // pageload should always start at timeOrigin (and needs to be in s, not ms)
      startTimestamp: browserPerformanceTimeOrigin ? browserPerformanceTimeOrigin / 1e3 : void 0,
      op: "pageload",
      origin: "auto.pageload.browser",
      metadata: { source: "url" }
    });
  }
  if (startTransactionOnLocationChange) {
    addHistoryInstrumentationHandler(({ to, from }) => {
      if (from === void 0 && startingUrl && startingUrl.indexOf(to) !== -1) {
        startingUrl = void 0;
        return;
      }
      if (from !== to) {
        startingUrl = void 0;
        if (activeTransaction2) {
          DEBUG_BUILD3 && logger.log(`[Tracing] Finishing current transaction with op: ${activeTransaction2.op}`);
          activeTransaction2.finish();
        }
        activeTransaction2 = customStartTransaction({
          name: WINDOW8.location.pathname,
          op: "navigation",
          origin: "auto.navigation.browser",
          metadata: { source: "url" }
        });
      }
    });
  }
}

// node_modules/@sentry-internal/tracing/esm/browser/browsertracing.js
var BROWSER_TRACING_INTEGRATION_ID = "BrowserTracing";
var DEFAULT_BROWSER_TRACING_OPTIONS = {
  ...TRACING_DEFAULTS,
  markBackgroundTransactions: true,
  routingInstrumentation: instrumentRoutingWithDefaults,
  startTransactionOnLocationChange: true,
  startTransactionOnPageLoad: true,
  enableLongTask: true,
  _experiments: {},
  ...defaultRequestInstrumentationOptions
};
var BrowserTracing = class {
  // This class currently doesn't have a static `id` field like the other integration classes, because it prevented
  // @sentry/tracing from being treeshaken. Tree shakers do not like static fields, because they behave like side effects.
  // TODO: Come up with a better plan, than using static fields on integration classes, and use that plan on all
  // integrations.
  /** Browser Tracing integration options */
  /**
   * @inheritDoc
   */
  constructor(_options) {
    this.name = BROWSER_TRACING_INTEGRATION_ID;
    this._hasSetTracePropagationTargets = false;
    addTracingExtensions();
    if (DEBUG_BUILD3) {
      this._hasSetTracePropagationTargets = !!(_options && // eslint-disable-next-line deprecation/deprecation
      (_options.tracePropagationTargets || _options.tracingOrigins));
    }
    this.options = {
      ...DEFAULT_BROWSER_TRACING_OPTIONS,
      ..._options
    };
    if (this.options._experiments.enableLongTask !== void 0) {
      this.options.enableLongTask = this.options._experiments.enableLongTask;
    }
    if (_options && !_options.tracePropagationTargets && _options.tracingOrigins) {
      this.options.tracePropagationTargets = _options.tracingOrigins;
    }
    this._collectWebVitals = startTrackingWebVitals();
    if (this.options.enableLongTask) {
      startTrackingLongTasks();
    }
    if (this.options._experiments.enableInteractions) {
      startTrackingInteractions();
    }
  }
  /**
   * @inheritDoc
   */
  setupOnce(_, getCurrentHub2) {
    this._getCurrentHub = getCurrentHub2;
    const hub = getCurrentHub2();
    const client = hub.getClient();
    const clientOptions = client && client.getOptions();
    const {
      routingInstrumentation: instrumentRouting,
      startTransactionOnLocationChange,
      startTransactionOnPageLoad,
      markBackgroundTransactions,
      traceFetch,
      traceXHR,
      shouldCreateSpanForRequest,
      enableHTTPTimings,
      _experiments
    } = this.options;
    const clientOptionsTracePropagationTargets = clientOptions && clientOptions.tracePropagationTargets;
    const tracePropagationTargets = clientOptionsTracePropagationTargets || this.options.tracePropagationTargets;
    if (DEBUG_BUILD3 && this._hasSetTracePropagationTargets && clientOptionsTracePropagationTargets) {
      logger.warn(
        "[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used."
      );
    }
    instrumentRouting(
      (context) => {
        const transaction = this._createRouteTransaction(context);
        this.options._experiments.onStartRouteTransaction && this.options._experiments.onStartRouteTransaction(transaction, context, getCurrentHub2);
        return transaction;
      },
      startTransactionOnPageLoad,
      startTransactionOnLocationChange
    );
    if (markBackgroundTransactions) {
      registerBackgroundTabDetection();
    }
    if (_experiments.enableInteractions) {
      this._registerInteractionListener();
    }
    instrumentOutgoingRequests({
      traceFetch,
      traceXHR,
      tracePropagationTargets,
      shouldCreateSpanForRequest,
      enableHTTPTimings
    });
  }
  /** Create routing idle transaction. */
  _createRouteTransaction(context) {
    if (!this._getCurrentHub) {
      DEBUG_BUILD3 && logger.warn(`[Tracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
      return void 0;
    }
    const hub = this._getCurrentHub();
    const { beforeNavigate, idleTimeout, finalTimeout, heartbeatInterval } = this.options;
    const isPageloadTransaction = context.op === "pageload";
    const sentryTrace = isPageloadTransaction ? getMetaContent("sentry-trace") : "";
    const baggage = isPageloadTransaction ? getMetaContent("baggage") : "";
    const { traceparentData, dynamicSamplingContext, propagationContext } = tracingContextFromHeaders(
      sentryTrace,
      baggage
    );
    const expandedContext = {
      ...context,
      ...traceparentData,
      metadata: {
        ...context.metadata,
        dynamicSamplingContext: traceparentData && !dynamicSamplingContext ? {} : dynamicSamplingContext
      },
      trimEnd: true
    };
    const modifiedContext = typeof beforeNavigate === "function" ? beforeNavigate(expandedContext) : expandedContext;
    const finalContext = modifiedContext === void 0 ? { ...expandedContext, sampled: false } : modifiedContext;
    finalContext.metadata = finalContext.name !== expandedContext.name ? { ...finalContext.metadata, source: "custom" } : finalContext.metadata;
    this._latestRouteName = finalContext.name;
    this._latestRouteSource = finalContext.metadata && finalContext.metadata.source;
    if (finalContext.sampled === false) {
      DEBUG_BUILD3 && logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
    }
    DEBUG_BUILD3 && logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);
    const { location } = WINDOW8;
    const idleTransaction = startIdleTransaction(
      hub,
      finalContext,
      idleTimeout,
      finalTimeout,
      true,
      { location },
      // for use in the tracesSampler
      heartbeatInterval
    );
    const scope = hub.getScope();
    if (isPageloadTransaction && traceparentData) {
      scope.setPropagationContext(propagationContext);
    } else {
      scope.setPropagationContext({
        traceId: idleTransaction.traceId,
        spanId: idleTransaction.spanId,
        parentSpanId: idleTransaction.parentSpanId,
        sampled: idleTransaction.sampled
      });
    }
    idleTransaction.registerBeforeFinishCallback((transaction) => {
      this._collectWebVitals();
      addPerformanceEntries(transaction);
    });
    return idleTransaction;
  }
  /** Start listener for interaction transactions */
  _registerInteractionListener() {
    let inflightInteractionTransaction;
    const registerInteractionTransaction = () => {
      const { idleTimeout, finalTimeout, heartbeatInterval } = this.options;
      const op = "ui.action.click";
      const currentTransaction = getActiveTransaction();
      if (currentTransaction && currentTransaction.op && ["navigation", "pageload"].includes(currentTransaction.op)) {
        DEBUG_BUILD3 && logger.warn(
          `[Tracing] Did not create ${op} transaction because a pageload or navigation transaction is in progress.`
        );
        return void 0;
      }
      if (inflightInteractionTransaction) {
        inflightInteractionTransaction.setFinishReason("interactionInterrupted");
        inflightInteractionTransaction.finish();
        inflightInteractionTransaction = void 0;
      }
      if (!this._getCurrentHub) {
        DEBUG_BUILD3 && logger.warn(`[Tracing] Did not create ${op} transaction because _getCurrentHub is invalid.`);
        return void 0;
      }
      if (!this._latestRouteName) {
        DEBUG_BUILD3 && logger.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
        return void 0;
      }
      const hub = this._getCurrentHub();
      const { location } = WINDOW8;
      const context = {
        name: this._latestRouteName,
        op,
        trimEnd: true,
        metadata: {
          source: this._latestRouteSource || "url"
        }
      };
      inflightInteractionTransaction = startIdleTransaction(
        hub,
        context,
        idleTimeout,
        finalTimeout,
        true,
        { location },
        // for use in the tracesSampler
        heartbeatInterval
      );
    };
    ["click"].forEach((type) => {
      addEventListener(type, registerInteractionTransaction, { once: false, capture: true });
    });
  }
};
function getMetaContent(metaName) {
  const metaTag = getDomElement(`meta[name=${metaName}]`);
  return metaTag ? metaTag.getAttribute("content") : void 0;
}

// node_modules/@sentry/replay/esm/index.js
var WINDOW9 = GLOBAL_OBJ;
var REPLAY_SESSION_KEY = "sentryReplaySession";
var REPLAY_EVENT_NAME = "replay_event";
var UNABLE_TO_SEND_REPLAY = "Unable to send Replay";
var SESSION_IDLE_PAUSE_DURATION = 3e5;
var SESSION_IDLE_EXPIRE_DURATION = 9e5;
var DEFAULT_FLUSH_MIN_DELAY = 5e3;
var DEFAULT_FLUSH_MAX_DELAY = 5500;
var BUFFER_CHECKOUT_TIME = 6e4;
var RETRY_BASE_INTERVAL = 5e3;
var RETRY_MAX_COUNT = 3;
var NETWORK_BODY_MAX_SIZE = 15e4;
var CONSOLE_ARG_MAX_SIZE = 5e3;
var SLOW_CLICK_THRESHOLD = 3e3;
var SLOW_CLICK_SCROLL_TIMEOUT = 300;
var REPLAY_MAX_EVENT_BUFFER_SIZE = 2e7;
var MIN_REPLAY_DURATION = 4999;
var MIN_REPLAY_DURATION_LIMIT = 15e3;
var MAX_REPLAY_DURATION = 36e5;
var NodeType$1;
(function(NodeType2) {
  NodeType2[NodeType2["Document"] = 0] = "Document";
  NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
  NodeType2[NodeType2["Element"] = 2] = "Element";
  NodeType2[NodeType2["Text"] = 3] = "Text";
  NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
  NodeType2[NodeType2["Comment"] = 5] = "Comment";
})(NodeType$1 || (NodeType$1 = {}));
function isElement$1(n) {
  return n.nodeType === n.ELEMENT_NODE;
}
function isShadowRoot(n) {
  const host = n === null || n === void 0 ? void 0 : n.host;
  return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n);
}
function isNativeShadowDom(shadowRoot) {
  return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
}
function fixBrowserCompatibilityIssuesInCSS(cssText) {
  if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
    cssText = cssText.replace(" background-clip: text;", " -webkit-background-clip: text; background-clip: text;");
  }
  return cssText;
}
function escapeImportStatement(rule) {
  const { cssText } = rule;
  if (cssText.split('"').length < 3)
    return cssText;
  const statement = ["@import", `url(${JSON.stringify(rule.href)})`];
  if (rule.layerName === "") {
    statement.push(`layer`);
  } else if (rule.layerName) {
    statement.push(`layer(${rule.layerName})`);
  }
  if (rule.supportsText) {
    statement.push(`supports(${rule.supportsText})`);
  }
  if (rule.media.length) {
    statement.push(rule.media.mediaText);
  }
  return statement.join(" ") + ";";
}
function stringifyStylesheet(s) {
  try {
    const rules = s.rules || s.cssRules;
    return rules ? fixBrowserCompatibilityIssuesInCSS(Array.from(rules, stringifyRule).join("")) : null;
  } catch (error) {
    return null;
  }
}
function stringifyRule(rule) {
  let importStringified;
  if (isCSSImportRule(rule)) {
    try {
      importStringified = stringifyStylesheet(rule.styleSheet) || escapeImportStatement(rule);
    } catch (error) {
    }
  } else if (isCSSStyleRule(rule) && rule.selectorText.includes(":")) {
    return fixSafariColons(rule.cssText);
  }
  return importStringified || rule.cssText;
}
function fixSafariColons(cssStringified) {
  const regex = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return cssStringified.replace(regex, "$1\\$2");
}
function isCSSImportRule(rule) {
  return "styleSheet" in rule;
}
function isCSSStyleRule(rule) {
  return "selectorText" in rule;
}
var Mirror = class {
  constructor() {
    this.idNodeMap = /* @__PURE__ */ new Map();
    this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
  }
  getId(n) {
    var _a;
    if (!n)
      return -1;
    const id = (_a = this.getMeta(n)) === null || _a === void 0 ? void 0 : _a.id;
    return id !== null && id !== void 0 ? id : -1;
  }
  getNode(id) {
    return this.idNodeMap.get(id) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(n) {
    return this.nodeMetaMap.get(n) || null;
  }
  removeNodeFromMap(n) {
    const id = this.getId(n);
    this.idNodeMap.delete(id);
    if (n.childNodes) {
      n.childNodes.forEach((childNode) => this.removeNodeFromMap(childNode));
    }
  }
  has(id) {
    return this.idNodeMap.has(id);
  }
  hasNode(node) {
    return this.nodeMetaMap.has(node);
  }
  add(n, meta) {
    const id = meta.id;
    this.idNodeMap.set(id, n);
    this.nodeMetaMap.set(n, meta);
  }
  replace(id, n) {
    const oldNode = this.getNode(id);
    if (oldNode) {
      const meta = this.nodeMetaMap.get(oldNode);
      if (meta)
        this.nodeMetaMap.set(n, meta);
    }
    this.idNodeMap.set(id, n);
  }
  reset() {
    this.idNodeMap = /* @__PURE__ */ new Map();
    this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
  }
};
function createMirror() {
  return new Mirror();
}
function shouldMaskInput({ maskInputOptions, tagName, type }) {
  if (tagName === "OPTION") {
    tagName = "SELECT";
  }
  return Boolean(maskInputOptions[tagName.toLowerCase()] || type && maskInputOptions[type] || type === "password" || tagName === "INPUT" && !type && maskInputOptions["text"]);
}
function maskInputValue({ isMasked, element, value, maskInputFn }) {
  let text = value || "";
  if (!isMasked) {
    return text;
  }
  if (maskInputFn) {
    text = maskInputFn(text, element);
  }
  return "*".repeat(text.length);
}
function toLowerCase(str) {
  return str.toLowerCase();
}
function toUpperCase(str) {
  return str.toUpperCase();
}
var ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
function is2DCanvasBlank(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return true;
  const chunkSize = 50;
  for (let x = 0; x < canvas.width; x += chunkSize) {
    for (let y = 0; y < canvas.height; y += chunkSize) {
      const getImageData = ctx.getImageData;
      const originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
      const pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x, y, Math.min(chunkSize, canvas.width - x), Math.min(chunkSize, canvas.height - y)).data.buffer);
      if (pixelBuffer.some((pixel) => pixel !== 0))
        return false;
    }
  }
  return true;
}
function getInputType(element) {
  const type = element.type;
  return element.hasAttribute("data-rr-is-password") ? "password" : type ? toLowerCase(type) : null;
}
function getInputValue(el, tagName, type) {
  if (tagName === "INPUT" && (type === "radio" || type === "checkbox")) {
    return el.getAttribute("value") || "";
  }
  return el.value;
}
var _id = 1;
var tagNameRegex = new RegExp("[^a-z0-9-_:]");
var IGNORED_NODE = -2;
function genId() {
  return _id++;
}
function getValidTagName(element) {
  if (element instanceof HTMLFormElement) {
    return "form";
  }
  const processedTagName = toLowerCase(element.tagName);
  if (tagNameRegex.test(processedTagName)) {
    return "div";
  }
  return processedTagName;
}
function extractOrigin(url) {
  let origin = "";
  if (url.indexOf("//") > -1) {
    origin = url.split("/").slice(0, 3).join("/");
  } else {
    origin = url.split("/")[0];
  }
  origin = origin.split("?")[0];
  return origin;
}
var canvasService;
var canvasCtx;
var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
var URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i;
var URL_WWW_MATCH = /^www\..*/i;
var DATA_URI = /^(data:)([^,]*),(.*)/i;
function absoluteToStylesheet(cssText, href) {
  return (cssText || "").replace(URL_IN_CSS_REF, (origin, quote1, path1, quote2, path2, path3) => {
    const filePath = path1 || path2 || path3;
    const maybeQuote = quote1 || quote2 || "";
    if (!filePath) {
      return origin;
    }
    if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath)) {
      return `url(${maybeQuote}${filePath}${maybeQuote})`;
    }
    if (DATA_URI.test(filePath)) {
      return `url(${maybeQuote}${filePath}${maybeQuote})`;
    }
    if (filePath[0] === "/") {
      return `url(${maybeQuote}${extractOrigin(href) + filePath}${maybeQuote})`;
    }
    const stack = href.split("/");
    const parts = filePath.split("/");
    stack.pop();
    for (const part of parts) {
      if (part === ".") {
        continue;
      } else if (part === "..") {
        stack.pop();
      } else {
        stack.push(part);
      }
    }
    return `url(${maybeQuote}${stack.join("/")}${maybeQuote})`;
  });
}
var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
function getAbsoluteSrcsetString(doc, attributeValue) {
  if (attributeValue.trim() === "") {
    return attributeValue;
  }
  let pos = 0;
  function collectCharacters(regEx) {
    let chars;
    const match = regEx.exec(attributeValue.substring(pos));
    if (match) {
      chars = match[0];
      pos += chars.length;
      return chars;
    }
    return "";
  }
  const output = [];
  while (true) {
    collectCharacters(SRCSET_COMMAS_OR_SPACES);
    if (pos >= attributeValue.length) {
      break;
    }
    let url = collectCharacters(SRCSET_NOT_SPACES);
    if (url.slice(-1) === ",") {
      url = absoluteToDoc(doc, url.substring(0, url.length - 1));
      output.push(url);
    } else {
      let descriptorsStr = "";
      url = absoluteToDoc(doc, url);
      let inParens = false;
      while (true) {
        const c = attributeValue.charAt(pos);
        if (c === "") {
          output.push((url + descriptorsStr).trim());
          break;
        } else if (!inParens) {
          if (c === ",") {
            pos += 1;
            output.push((url + descriptorsStr).trim());
            break;
          } else if (c === "(") {
            inParens = true;
          }
        } else {
          if (c === ")") {
            inParens = false;
          }
        }
        descriptorsStr += c;
        pos += 1;
      }
    }
  }
  return output.join(", ");
}
function absoluteToDoc(doc, attributeValue) {
  if (!attributeValue || attributeValue.trim() === "") {
    return attributeValue;
  }
  const a = doc.createElement("a");
  a.href = attributeValue;
  return a.href;
}
function isSVGElement(el) {
  return Boolean(el.tagName === "svg" || el.ownerSVGElement);
}
function getHref() {
  const a = document.createElement("a");
  a.href = "";
  return a.href;
}
function transformAttribute(doc, tagName, name, value, element, maskAttributeFn) {
  if (!value) {
    return value;
  }
  if (name === "src" || name === "href" && !(tagName === "use" && value[0] === "#")) {
    return absoluteToDoc(doc, value);
  } else if (name === "xlink:href" && value[0] !== "#") {
    return absoluteToDoc(doc, value);
  } else if (name === "background" && (tagName === "table" || tagName === "td" || tagName === "th")) {
    return absoluteToDoc(doc, value);
  } else if (name === "srcset") {
    return getAbsoluteSrcsetString(doc, value);
  } else if (name === "style") {
    return absoluteToStylesheet(value, getHref());
  } else if (tagName === "object" && name === "data") {
    return absoluteToDoc(doc, value);
  }
  if (typeof maskAttributeFn === "function") {
    return maskAttributeFn(name, value, element);
  }
  return value;
}
function ignoreAttribute(tagName, name, _value) {
  return (tagName === "video" || tagName === "audio") && name === "autoplay";
}
function _isBlockedElement(element, blockClass, blockSelector, unblockSelector) {
  try {
    if (unblockSelector && element.matches(unblockSelector)) {
      return false;
    }
    if (typeof blockClass === "string") {
      if (element.classList.contains(blockClass)) {
        return true;
      }
    } else {
      for (let eIndex = element.classList.length; eIndex--; ) {
        const className = element.classList[eIndex];
        if (blockClass.test(className)) {
          return true;
        }
      }
    }
    if (blockSelector) {
      return element.matches(blockSelector);
    }
  } catch (e2) {
  }
  return false;
}
function elementClassMatchesRegex(el, regex) {
  for (let eIndex = el.classList.length; eIndex--; ) {
    const className = el.classList[eIndex];
    if (regex.test(className)) {
      return true;
    }
  }
  return false;
}
function distanceToMatch(node, matchPredicate, limit = Infinity, distance = 0) {
  if (!node)
    return -1;
  if (node.nodeType !== node.ELEMENT_NODE)
    return -1;
  if (distance > limit)
    return -1;
  if (matchPredicate(node))
    return distance;
  return distanceToMatch(node.parentNode, matchPredicate, limit, distance + 1);
}
function createMatchPredicate(className, selector) {
  return (node) => {
    const el = node;
    if (el === null)
      return false;
    if (className) {
      if (typeof className === "string") {
        if (el.matches(`.${className}`))
          return true;
      } else if (elementClassMatchesRegex(el, className)) {
        return true;
      }
    }
    if (selector && el.matches(selector))
      return true;
    return false;
  };
}
function needMaskingText(node, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, maskAllText) {
  try {
    const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
    if (el === null)
      return false;
    let maskDistance = -1;
    let unmaskDistance = -1;
    if (maskAllText) {
      unmaskDistance = distanceToMatch(el, createMatchPredicate(unmaskTextClass, unmaskTextSelector));
      if (unmaskDistance < 0) {
        return true;
      }
      maskDistance = distanceToMatch(el, createMatchPredicate(maskTextClass, maskTextSelector), unmaskDistance >= 0 ? unmaskDistance : Infinity);
    } else {
      maskDistance = distanceToMatch(el, createMatchPredicate(maskTextClass, maskTextSelector));
      if (maskDistance < 0) {
        return false;
      }
      unmaskDistance = distanceToMatch(el, createMatchPredicate(unmaskTextClass, unmaskTextSelector), maskDistance >= 0 ? maskDistance : Infinity);
    }
    return maskDistance >= 0 ? unmaskDistance >= 0 ? maskDistance <= unmaskDistance : true : unmaskDistance >= 0 ? false : !!maskAllText;
  } catch (e2) {
  }
  return !!maskAllText;
}
function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
  const win = iframeEl.contentWindow;
  if (!win) {
    return;
  }
  let fired = false;
  let readyState;
  try {
    readyState = win.document.readyState;
  } catch (error) {
    return;
  }
  if (readyState !== "complete") {
    const timer = setTimeout(() => {
      if (!fired) {
        listener();
        fired = true;
      }
    }, iframeLoadTimeout);
    iframeEl.addEventListener("load", () => {
      clearTimeout(timer);
      fired = true;
      listener();
    });
    return;
  }
  const blankUrl = "about:blank";
  if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
    setTimeout(listener, 0);
    return iframeEl.addEventListener("load", listener);
  }
  iframeEl.addEventListener("load", listener);
}
function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
  let fired = false;
  let styleSheetLoaded;
  try {
    styleSheetLoaded = link.sheet;
  } catch (error) {
    return;
  }
  if (styleSheetLoaded)
    return;
  const timer = setTimeout(() => {
    if (!fired) {
      listener();
      fired = true;
    }
  }, styleSheetLoadTimeout);
  link.addEventListener("load", () => {
    clearTimeout(timer);
    fired = true;
    listener();
  });
}
function serializeNode(n, options) {
  const { doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, maskAllText, maskAttributeFn, maskTextClass, unmaskTextClass, maskTextSelector, unmaskTextSelector, inlineStylesheet, maskInputOptions = {}, maskTextFn, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false } = options;
  const rootId = getRootId(doc, mirror2);
  switch (n.nodeType) {
    case n.DOCUMENT_NODE:
      if (n.compatMode !== "CSS1Compat") {
        return {
          type: NodeType$1.Document,
          childNodes: [],
          compatMode: n.compatMode
        };
      } else {
        return {
          type: NodeType$1.Document,
          childNodes: []
        };
      }
    case n.DOCUMENT_TYPE_NODE:
      return {
        type: NodeType$1.DocumentType,
        name: n.name,
        publicId: n.publicId,
        systemId: n.systemId,
        rootId
      };
    case n.ELEMENT_NODE:
      return serializeElementNode(n, {
        doc,
        blockClass,
        blockSelector,
        unblockSelector,
        inlineStylesheet,
        maskAttributeFn,
        maskInputOptions,
        maskInputFn,
        dataURLOptions,
        inlineImages,
        recordCanvas,
        keepIframeSrcFn,
        newlyAddedElement,
        rootId,
        maskAllText,
        maskTextClass,
        unmaskTextClass,
        maskTextSelector,
        unmaskTextSelector
      });
    case n.TEXT_NODE:
      return serializeTextNode(n, {
        maskAllText,
        maskTextClass,
        unmaskTextClass,
        maskTextSelector,
        unmaskTextSelector,
        maskTextFn,
        maskInputOptions,
        maskInputFn,
        rootId
      });
    case n.CDATA_SECTION_NODE:
      return {
        type: NodeType$1.CDATA,
        textContent: "",
        rootId
      };
    case n.COMMENT_NODE:
      return {
        type: NodeType$1.Comment,
        textContent: n.textContent || "",
        rootId
      };
    default:
      return false;
  }
}
function getRootId(doc, mirror2) {
  if (!mirror2.hasNode(doc))
    return void 0;
  const docId = mirror2.getId(doc);
  return docId === 1 ? void 0 : docId;
}
function serializeTextNode(n, options) {
  var _a;
  const { maskAllText, maskTextClass, unmaskTextClass, maskTextSelector, unmaskTextSelector, maskTextFn, maskInputOptions, maskInputFn, rootId } = options;
  const parentTagName = n.parentNode && n.parentNode.tagName;
  let textContent = n.textContent;
  const isStyle = parentTagName === "STYLE" ? true : void 0;
  const isScript = parentTagName === "SCRIPT" ? true : void 0;
  const isTextarea = parentTagName === "TEXTAREA" ? true : void 0;
  if (isStyle && textContent) {
    try {
      if (n.nextSibling || n.previousSibling) {
      } else if ((_a = n.parentNode.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) {
        textContent = stringifyStylesheet(n.parentNode.sheet);
      }
    } catch (err) {
      console.warn(`Cannot get CSS styles from text's parentNode. Error: ${err}`, n);
    }
    textContent = absoluteToStylesheet(textContent, getHref());
  }
  if (isScript) {
    textContent = "SCRIPT_PLACEHOLDER";
  }
  const forceMask = needMaskingText(n, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, maskAllText);
  if (!isStyle && !isScript && !isTextarea && textContent && forceMask) {
    textContent = maskTextFn ? maskTextFn(textContent) : textContent.replace(/[\S]/g, "*");
  }
  if (isTextarea && textContent && (maskInputOptions.textarea || forceMask)) {
    textContent = maskInputFn ? maskInputFn(textContent, n.parentNode) : textContent.replace(/[\S]/g, "*");
  }
  if (parentTagName === "OPTION" && textContent) {
    const isInputMasked = shouldMaskInput({
      type: null,
      tagName: parentTagName,
      maskInputOptions
    });
    textContent = maskInputValue({
      isMasked: needMaskingText(n, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, isInputMasked),
      element: n,
      value: textContent,
      maskInputFn
    });
  }
  return {
    type: NodeType$1.Text,
    textContent: textContent || "",
    isStyle,
    rootId
  };
}
function serializeElementNode(n, options) {
  const { doc, blockClass, blockSelector, unblockSelector, inlineStylesheet, maskInputOptions = {}, maskAttributeFn, maskInputFn, dataURLOptions = {}, inlineImages, recordCanvas, keepIframeSrcFn, newlyAddedElement = false, rootId, maskAllText, maskTextClass, unmaskTextClass, maskTextSelector, unmaskTextSelector } = options;
  const needBlock = _isBlockedElement(n, blockClass, blockSelector, unblockSelector);
  const tagName = getValidTagName(n);
  let attributes = {};
  const len = n.attributes.length;
  for (let i = 0; i < len; i++) {
    const attr = n.attributes[i];
    if (!ignoreAttribute(tagName, attr.name, attr.value)) {
      attributes[attr.name] = transformAttribute(doc, tagName, toLowerCase(attr.name), attr.value, n, maskAttributeFn);
    }
  }
  if (tagName === "link" && inlineStylesheet) {
    const stylesheet = Array.from(doc.styleSheets).find((s) => {
      return s.href === n.href;
    });
    let cssText = null;
    if (stylesheet) {
      cssText = stringifyStylesheet(stylesheet);
    }
    if (cssText) {
      delete attributes.rel;
      delete attributes.href;
      attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
    }
  }
  if (tagName === "style" && n.sheet && !(n.innerText || n.textContent || "").trim().length) {
    const cssText = stringifyStylesheet(n.sheet);
    if (cssText) {
      attributes._cssText = absoluteToStylesheet(cssText, getHref());
    }
  }
  if (tagName === "input" || tagName === "textarea" || tagName === "select" || tagName === "option") {
    const el = n;
    const type = getInputType(el);
    const value = getInputValue(el, toUpperCase(tagName), type);
    const checked = el.checked;
    if (type !== "submit" && type !== "button" && value) {
      const forceMask = needMaskingText(el, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, shouldMaskInput({
        type,
        tagName: toUpperCase(tagName),
        maskInputOptions
      }));
      attributes.value = maskInputValue({
        isMasked: forceMask,
        element: el,
        value,
        maskInputFn
      });
    }
    if (checked) {
      attributes.checked = checked;
    }
  }
  if (tagName === "option") {
    if (n.selected && !maskInputOptions["select"]) {
      attributes.selected = true;
    } else {
      delete attributes.selected;
    }
  }
  if (tagName === "canvas" && recordCanvas) {
    if (n.__context === "2d") {
      if (!is2DCanvasBlank(n)) {
        attributes.rr_dataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      }
    } else if (!("__context" in n)) {
      const canvasDataURL = n.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      const blankCanvas = document.createElement("canvas");
      blankCanvas.width = n.width;
      blankCanvas.height = n.height;
      const blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      if (canvasDataURL !== blankCanvasDataURL) {
        attributes.rr_dataURL = canvasDataURL;
      }
    }
  }
  if (tagName === "img" && inlineImages) {
    if (!canvasService) {
      canvasService = doc.createElement("canvas");
      canvasCtx = canvasService.getContext("2d");
    }
    const image = n;
    const oldValue = image.crossOrigin;
    image.crossOrigin = "anonymous";
    const recordInlineImage = () => {
      image.removeEventListener("load", recordInlineImage);
      try {
        canvasService.width = image.naturalWidth;
        canvasService.height = image.naturalHeight;
        canvasCtx.drawImage(image, 0, 0);
        attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
      } catch (err) {
        console.warn(`Cannot inline img src=${image.currentSrc}! Error: ${err}`);
      }
      oldValue ? attributes.crossOrigin = oldValue : image.removeAttribute("crossorigin");
    };
    if (image.complete && image.naturalWidth !== 0)
      recordInlineImage();
    else
      image.addEventListener("load", recordInlineImage);
  }
  if (tagName === "audio" || tagName === "video") {
    attributes.rr_mediaState = n.paused ? "paused" : "played";
    attributes.rr_mediaCurrentTime = n.currentTime;
  }
  if (!newlyAddedElement) {
    if (n.scrollLeft) {
      attributes.rr_scrollLeft = n.scrollLeft;
    }
    if (n.scrollTop) {
      attributes.rr_scrollTop = n.scrollTop;
    }
  }
  if (needBlock) {
    const { width, height } = n.getBoundingClientRect();
    attributes = {
      class: attributes.class,
      rr_width: `${width}px`,
      rr_height: `${height}px`
    };
  }
  if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
    if (!n.contentDocument) {
      attributes.rr_src = attributes.src;
    }
    delete attributes.src;
  }
  let isCustomElement;
  try {
    if (customElements.get(tagName))
      isCustomElement = true;
  } catch (e2) {
  }
  return {
    type: NodeType$1.Element,
    tagName,
    attributes,
    childNodes: [],
    isSVG: isSVGElement(n) || void 0,
    needBlock,
    rootId,
    isCustom: isCustomElement
  };
}
function lowerIfExists(maybeAttr) {
  if (maybeAttr === void 0 || maybeAttr === null) {
    return "";
  } else {
    return maybeAttr.toLowerCase();
  }
}
function slimDOMExcluded(sn, slimDOMOptions) {
  if (slimDOMOptions.comment && sn.type === NodeType$1.Comment) {
    return true;
  } else if (sn.type === NodeType$1.Element) {
    if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && (sn.attributes.rel === "preload" || sn.attributes.rel === "modulepreload") && sn.attributes.as === "script" || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && sn.attributes.href.endsWith(".js"))) {
      return true;
    } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
      return true;
    } else if (sn.tagName === "meta") {
      if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
        return true;
      } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
        return true;
      } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
        return true;
      } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
        return true;
      } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
        return true;
      } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
        return true;
      }
    }
  }
  return false;
}
function serializeNodeWithId(n, options) {
  const { doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, maskAllText, maskTextClass, unmaskTextClass, maskTextSelector, unmaskTextSelector, skipChild = false, inlineStylesheet = true, maskInputOptions = {}, maskAttributeFn, maskTextFn, maskInputFn, slimDOMOptions, dataURLOptions = {}, inlineImages = false, recordCanvas = false, onSerialize, onIframeLoad, iframeLoadTimeout = 5e3, onStylesheetLoad, stylesheetLoadTimeout = 5e3, keepIframeSrcFn = () => false, newlyAddedElement = false } = options;
  let { preserveWhiteSpace = true } = options;
  const _serializedNode = serializeNode(n, {
    doc,
    mirror: mirror2,
    blockClass,
    blockSelector,
    maskAllText,
    unblockSelector,
    maskTextClass,
    unmaskTextClass,
    maskTextSelector,
    unmaskTextSelector,
    inlineStylesheet,
    maskInputOptions,
    maskAttributeFn,
    maskTextFn,
    maskInputFn,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    keepIframeSrcFn,
    newlyAddedElement
  });
  if (!_serializedNode) {
    console.warn(n, "not serialized");
    return null;
  }
  let id;
  if (mirror2.hasNode(n)) {
    id = mirror2.getId(n);
  } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType$1.Text && !_serializedNode.isStyle && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
    id = IGNORED_NODE;
  } else {
    id = genId();
  }
  const serializedNode = Object.assign(_serializedNode, { id });
  mirror2.add(n, serializedNode);
  if (id === IGNORED_NODE) {
    return null;
  }
  if (onSerialize) {
    onSerialize(n);
  }
  let recordChild = !skipChild;
  if (serializedNode.type === NodeType$1.Element) {
    recordChild = recordChild && !serializedNode.needBlock;
    delete serializedNode.needBlock;
    const shadowRoot = n.shadowRoot;
    if (shadowRoot && isNativeShadowDom(shadowRoot))
      serializedNode.isShadowHost = true;
  }
  if ((serializedNode.type === NodeType$1.Document || serializedNode.type === NodeType$1.Element) && recordChild) {
    if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType$1.Element && serializedNode.tagName === "head") {
      preserveWhiteSpace = false;
    }
    const bypassOptions = {
      doc,
      mirror: mirror2,
      blockClass,
      blockSelector,
      maskAllText,
      unblockSelector,
      maskTextClass,
      unmaskTextClass,
      maskTextSelector,
      unmaskTextSelector,
      skipChild,
      inlineStylesheet,
      maskInputOptions,
      maskAttributeFn,
      maskTextFn,
      maskInputFn,
      slimDOMOptions,
      dataURLOptions,
      inlineImages,
      recordCanvas,
      preserveWhiteSpace,
      onSerialize,
      onIframeLoad,
      iframeLoadTimeout,
      onStylesheetLoad,
      stylesheetLoadTimeout,
      keepIframeSrcFn
    };
    for (const childN of Array.from(n.childNodes)) {
      const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
      if (serializedChildNode) {
        serializedNode.childNodes.push(serializedChildNode);
      }
    }
    if (isElement$1(n) && n.shadowRoot) {
      for (const childN of Array.from(n.shadowRoot.childNodes)) {
        const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          isNativeShadowDom(n.shadowRoot) && (serializedChildNode.isShadow = true);
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
    }
  }
  if (n.parentNode && isShadowRoot(n.parentNode) && isNativeShadowDom(n.parentNode)) {
    serializedNode.isShadow = true;
  }
  if (serializedNode.type === NodeType$1.Element && serializedNode.tagName === "iframe") {
    onceIframeLoaded(n, () => {
      const iframeDoc = n.contentDocument;
      if (iframeDoc && onIframeLoad) {
        const serializedIframeNode = serializeNodeWithId(iframeDoc, {
          doc: iframeDoc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          unblockSelector,
          maskAllText,
          maskTextClass,
          unmaskTextClass,
          maskTextSelector,
          unmaskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskAttributeFn,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn
        });
        if (serializedIframeNode) {
          onIframeLoad(n, serializedIframeNode);
        }
      }
    }, iframeLoadTimeout);
  }
  if (serializedNode.type === NodeType$1.Element && serializedNode.tagName === "link" && serializedNode.attributes.rel === "stylesheet") {
    onceStylesheetLoaded(n, () => {
      if (onStylesheetLoad) {
        const serializedLinkNode = serializeNodeWithId(n, {
          doc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          unblockSelector,
          maskAllText,
          maskTextClass,
          unmaskTextClass,
          maskTextSelector,
          unmaskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskAttributeFn,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn
        });
        if (serializedLinkNode) {
          onStylesheetLoad(n, serializedLinkNode);
        }
      }
    }, stylesheetLoadTimeout);
  }
  return serializedNode;
}
function snapshot(n, options) {
  const { mirror: mirror2 = new Mirror(), blockClass = "rr-block", blockSelector = null, unblockSelector = null, maskAllText = false, maskTextClass = "rr-mask", unmaskTextClass = null, maskTextSelector = null, unmaskTextSelector = null, inlineStylesheet = true, inlineImages = false, recordCanvas = false, maskAllInputs = false, maskAttributeFn, maskTextFn, maskInputFn, slimDOM = false, dataURLOptions, preserveWhiteSpace, onSerialize, onIframeLoad, iframeLoadTimeout, onStylesheetLoad, stylesheetLoadTimeout, keepIframeSrcFn = () => false } = options || {};
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true
  } : maskAllInputs === false ? {} : maskAllInputs;
  const slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaDescKeywords: slimDOM === "all",
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaAuthorship: true,
    headMetaVerification: true
  } : slimDOM === false ? {} : slimDOM;
  return serializeNodeWithId(n, {
    doc: n,
    mirror: mirror2,
    blockClass,
    blockSelector,
    unblockSelector,
    maskAllText,
    maskTextClass,
    unmaskTextClass,
    maskTextSelector,
    unmaskTextSelector,
    skipChild: false,
    inlineStylesheet,
    maskInputOptions,
    maskAttributeFn,
    maskTextFn,
    maskInputFn,
    slimDOMOptions,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    preserveWhiteSpace,
    onSerialize,
    onIframeLoad,
    iframeLoadTimeout,
    onStylesheetLoad,
    stylesheetLoadTimeout,
    keepIframeSrcFn,
    newlyAddedElement: false
  });
}
function on(type, fn, target = document) {
  const options = { capture: true, passive: true };
  target.addEventListener(type, fn, options);
  return () => target.removeEventListener(type, fn, options);
}
var DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
var _mirror = {
  map: {},
  getId() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return -1;
  },
  getNode() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return null;
  },
  removeNodeFromMap() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  },
  has() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return false;
  },
  reset() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  }
};
if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
  _mirror = new Proxy(_mirror, {
    get(target, prop, receiver) {
      if (prop === "map") {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function throttle$1(func, wait, options = {}) {
  let timeout = null;
  let previous = 0;
  return function(...args) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    const context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}
function hookSetter(target, key, d, isRevoked, win = window) {
  const original = win.Object.getOwnPropertyDescriptor(target, key);
  win.Object.defineProperty(target, key, isRevoked ? d : {
    set(value) {
      setTimeout(() => {
        d.set.call(this, value);
      }, 0);
      if (original && original.set) {
        original.set.call(this, value);
      }
    }
  });
  return () => hookSetter(target, key, original || {}, true);
}
function patch(source, name, replacement) {
  try {
    if (!(name in source)) {
      return () => {
      };
    }
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === "function") {
      wrapped.prototype = wrapped.prototype || {};
      Object.defineProperties(wrapped, {
        __rrweb_original__: {
          enumerable: false,
          value: original
        }
      });
    }
    source[name] = wrapped;
    return () => {
      source[name] = original;
    };
  } catch (_a) {
    return () => {
    };
  }
}
var nowTimestamp = Date.now;
if (!/[1-9][0-9]{12}/.test(Date.now().toString())) {
  nowTimestamp = () => (/* @__PURE__ */ new Date()).getTime();
}
function getWindowScroll(win) {
  var _a, _b, _c, _d, _e, _f;
  const doc = win.document;
  return {
    left: doc.scrollingElement ? doc.scrollingElement.scrollLeft : win.pageXOffset !== void 0 ? win.pageXOffset : (doc === null || doc === void 0 ? void 0 : doc.documentElement.scrollLeft) || ((_b = (_a = doc === null || doc === void 0 ? void 0 : doc.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) || ((_c = doc === null || doc === void 0 ? void 0 : doc.body) === null || _c === void 0 ? void 0 : _c.scrollLeft) || 0,
    top: doc.scrollingElement ? doc.scrollingElement.scrollTop : win.pageYOffset !== void 0 ? win.pageYOffset : (doc === null || doc === void 0 ? void 0 : doc.documentElement.scrollTop) || ((_e = (_d = doc === null || doc === void 0 ? void 0 : doc.body) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.scrollTop) || ((_f = doc === null || doc === void 0 ? void 0 : doc.body) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0
  };
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}
function getWindowWidth() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}
function isBlocked(node, blockClass, blockSelector, unblockSelector, checkAncestors) {
  if (!node) {
    return false;
  }
  const el = node.nodeType === node.ELEMENT_NODE ? node : node.parentElement;
  if (!el)
    return false;
  const blockedPredicate = createMatchPredicate(blockClass, blockSelector);
  if (!checkAncestors) {
    const isUnblocked = unblockSelector && el.matches(unblockSelector);
    return blockedPredicate(el) && !isUnblocked;
  }
  const blockDistance = distanceToMatch(el, blockedPredicate);
  let unblockDistance = -1;
  if (blockDistance < 0) {
    return false;
  }
  if (unblockSelector) {
    unblockDistance = distanceToMatch(el, createMatchPredicate(null, unblockSelector));
  }
  if (blockDistance > -1 && unblockDistance < 0) {
    return true;
  }
  return blockDistance < unblockDistance;
}
function isSerialized(n, mirror2) {
  return mirror2.getId(n) !== -1;
}
function isIgnored(n, mirror2) {
  return mirror2.getId(n) === IGNORED_NODE;
}
function isAncestorRemoved(target, mirror2) {
  if (isShadowRoot(target)) {
    return false;
  }
  const id = mirror2.getId(target);
  if (!mirror2.has(id)) {
    return true;
  }
  if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
    return false;
  }
  if (!target.parentNode) {
    return true;
  }
  return isAncestorRemoved(target.parentNode, mirror2);
}
function legacy_isTouchEvent(event) {
  return Boolean(event.changedTouches);
}
function polyfill(win = window) {
  if ("NodeList" in win && !win.NodeList.prototype.forEach) {
    win.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
    win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
  }
  if (!Node.prototype.contains) {
    Node.prototype.contains = (...args) => {
      let node = args[0];
      if (!(0 in args)) {
        throw new TypeError("1 argument is required");
      }
      do {
        if (this === node) {
          return true;
        }
      } while (node = node && node.parentNode);
      return false;
    };
  }
}
function isSerializedIframe(n, mirror2) {
  return Boolean(n.nodeName === "IFRAME" && mirror2.getMeta(n));
}
function isSerializedStylesheet(n, mirror2) {
  return Boolean(n.nodeName === "LINK" && n.nodeType === n.ELEMENT_NODE && n.getAttribute && n.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n));
}
function hasShadowRoot(n) {
  return Boolean(n === null || n === void 0 ? void 0 : n.shadowRoot);
}
var StyleSheetMirror = class {
  constructor() {
    this.id = 1;
    this.styleIDMap = /* @__PURE__ */ new WeakMap();
    this.idStyleMap = /* @__PURE__ */ new Map();
  }
  getId(stylesheet) {
    var _a;
    return (_a = this.styleIDMap.get(stylesheet)) !== null && _a !== void 0 ? _a : -1;
  }
  has(stylesheet) {
    return this.styleIDMap.has(stylesheet);
  }
  add(stylesheet, id) {
    if (this.has(stylesheet))
      return this.getId(stylesheet);
    let newId;
    if (id === void 0) {
      newId = this.id++;
    } else
      newId = id;
    this.styleIDMap.set(stylesheet, newId);
    this.idStyleMap.set(newId, stylesheet);
    return newId;
  }
  getStyle(id) {
    return this.idStyleMap.get(id) || null;
  }
  reset() {
    this.styleIDMap = /* @__PURE__ */ new WeakMap();
    this.idStyleMap = /* @__PURE__ */ new Map();
    this.id = 1;
  }
  generateId() {
    return this.id++;
  }
};
function getShadowHost(n) {
  var _a, _b;
  let shadowHost = null;
  if (((_b = (_a = n.getRootNode) === null || _a === void 0 ? void 0 : _a.call(n)) === null || _b === void 0 ? void 0 : _b.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && n.getRootNode().host)
    shadowHost = n.getRootNode().host;
  return shadowHost;
}
function getRootShadowHost(n) {
  let rootShadowHost = n;
  let shadowHost;
  while (shadowHost = getShadowHost(rootShadowHost))
    rootShadowHost = shadowHost;
  return rootShadowHost;
}
function shadowHostInDom(n) {
  const doc = n.ownerDocument;
  if (!doc)
    return false;
  const shadowHost = getRootShadowHost(n);
  return doc.contains(shadowHost);
}
function inDom(n) {
  const doc = n.ownerDocument;
  if (!doc)
    return false;
  return doc.contains(n) || shadowHostInDom(n);
}
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType2[EventType2["Load"] = 1] = "Load";
  EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
  EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType2[EventType2["Meta"] = 4] = "Meta";
  EventType2[EventType2["Custom"] = 5] = "Custom";
  EventType2[EventType2["Plugin"] = 6] = "Plugin";
  return EventType2;
})(EventType || {});
var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
  IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
  IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
  IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
  IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
  IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
  IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
  IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
  IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
  IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
  IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
  IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
  IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
  IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
  IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
  IncrementalSource2[IncrementalSource2["CustomElement"] = 16] = "CustomElement";
  return IncrementalSource2;
})(IncrementalSource || {});
var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
  MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
  MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
  MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
  MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
  MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
  MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
  MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
  MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
  MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
  return MouseInteractions2;
})(MouseInteractions || {});
var PointerTypes = /* @__PURE__ */ ((PointerTypes2) => {
  PointerTypes2[PointerTypes2["Mouse"] = 0] = "Mouse";
  PointerTypes2[PointerTypes2["Pen"] = 1] = "Pen";
  PointerTypes2[PointerTypes2["Touch"] = 2] = "Touch";
  return PointerTypes2;
})(PointerTypes || {});
function isNodeInLinkedList(n) {
  return "__ln" in n;
}
var DoubleLinkedList = class {
  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }
  get(position) {
    if (position >= this.length) {
      throw new Error("Position outside of list range");
    }
    let current = this.head;
    for (let index = 0; index < position; index++) {
      current = (current === null || current === void 0 ? void 0 : current.next) || null;
    }
    return current;
  }
  addNode(n) {
    const node = {
      value: n,
      previous: null,
      next: null
    };
    n.__ln = node;
    if (n.previousSibling && isNodeInLinkedList(n.previousSibling)) {
      const current = n.previousSibling.__ln.next;
      node.next = current;
      node.previous = n.previousSibling.__ln;
      n.previousSibling.__ln.next = node;
      if (current) {
        current.previous = node;
      }
    } else if (n.nextSibling && isNodeInLinkedList(n.nextSibling) && n.nextSibling.__ln.previous) {
      const current = n.nextSibling.__ln.previous;
      node.previous = current;
      node.next = n.nextSibling.__ln;
      n.nextSibling.__ln.previous = node;
      if (current) {
        current.next = node;
      }
    } else {
      if (this.head) {
        this.head.previous = node;
      }
      node.next = this.head;
      this.head = node;
    }
    if (node.next === null) {
      this.tail = node;
    }
    this.length++;
  }
  removeNode(n) {
    const current = n.__ln;
    if (!this.head) {
      return;
    }
    if (!current.previous) {
      this.head = current.next;
      if (this.head) {
        this.head.previous = null;
      } else {
        this.tail = null;
      }
    } else {
      current.previous.next = current.next;
      if (current.next) {
        current.next.previous = current.previous;
      } else {
        this.tail = current.previous;
      }
    }
    if (n.__ln) {
      delete n.__ln;
    }
    this.length--;
  }
};
var moveKey = (id, parentId) => `${id}@${parentId}`;
var MutationBuffer = class {
  constructor() {
    this.frozen = false;
    this.locked = false;
    this.texts = [];
    this.attributes = [];
    this.removes = [];
    this.mapRemoves = [];
    this.movedMap = {};
    this.addedSet = /* @__PURE__ */ new Set();
    this.movedSet = /* @__PURE__ */ new Set();
    this.droppedSet = /* @__PURE__ */ new Set();
    this.processMutations = (mutations) => {
      mutations.forEach(this.processMutation);
      this.emit();
    };
    this.emit = () => {
      if (this.frozen || this.locked) {
        return;
      }
      const adds = [];
      const addedIds = /* @__PURE__ */ new Set();
      const addList = new DoubleLinkedList();
      const getNextId = (n) => {
        let ns = n;
        let nextId = IGNORED_NODE;
        while (nextId === IGNORED_NODE) {
          ns = ns && ns.nextSibling;
          nextId = ns && this.mirror.getId(ns);
        }
        return nextId;
      };
      const pushAdd = (n) => {
        if (!n.parentNode || !inDom(n)) {
          return;
        }
        const parentId = isShadowRoot(n.parentNode) ? this.mirror.getId(getShadowHost(n)) : this.mirror.getId(n.parentNode);
        const nextId = getNextId(n);
        if (parentId === -1 || nextId === -1) {
          return addList.addNode(n);
        }
        const sn = serializeNodeWithId(n, {
          doc: this.doc,
          mirror: this.mirror,
          blockClass: this.blockClass,
          blockSelector: this.blockSelector,
          maskAllText: this.maskAllText,
          unblockSelector: this.unblockSelector,
          maskTextClass: this.maskTextClass,
          unmaskTextClass: this.unmaskTextClass,
          maskTextSelector: this.maskTextSelector,
          unmaskTextSelector: this.unmaskTextSelector,
          skipChild: true,
          newlyAddedElement: true,
          inlineStylesheet: this.inlineStylesheet,
          maskInputOptions: this.maskInputOptions,
          maskAttributeFn: this.maskAttributeFn,
          maskTextFn: this.maskTextFn,
          maskInputFn: this.maskInputFn,
          slimDOMOptions: this.slimDOMOptions,
          dataURLOptions: this.dataURLOptions,
          recordCanvas: this.recordCanvas,
          inlineImages: this.inlineImages,
          onSerialize: (currentN) => {
            if (isSerializedIframe(currentN, this.mirror)) {
              this.iframeManager.addIframe(currentN);
            }
            if (isSerializedStylesheet(currentN, this.mirror)) {
              this.stylesheetManager.trackLinkElement(currentN);
            }
            if (hasShadowRoot(n)) {
              this.shadowDomManager.addShadowRoot(n.shadowRoot, this.doc);
            }
          },
          onIframeLoad: (iframe, childSn) => {
            this.iframeManager.attachIframe(iframe, childSn);
            this.shadowDomManager.observeAttachShadow(iframe);
          },
          onStylesheetLoad: (link, childSn) => {
            this.stylesheetManager.attachLinkElement(link, childSn);
          }
        });
        if (sn) {
          adds.push({
            parentId,
            nextId,
            node: sn
          });
          addedIds.add(sn.id);
        }
      };
      while (this.mapRemoves.length) {
        this.mirror.removeNodeFromMap(this.mapRemoves.shift());
      }
      for (const n of this.movedSet) {
        if (isParentRemoved(this.removes, n, this.mirror) && !this.movedSet.has(n.parentNode)) {
          continue;
        }
        pushAdd(n);
      }
      for (const n of this.addedSet) {
        if (!isAncestorInSet(this.droppedSet, n) && !isParentRemoved(this.removes, n, this.mirror)) {
          pushAdd(n);
        } else if (isAncestorInSet(this.movedSet, n)) {
          pushAdd(n);
        } else {
          this.droppedSet.add(n);
        }
      }
      let candidate = null;
      while (addList.length) {
        let node = null;
        if (candidate) {
          const parentId = this.mirror.getId(candidate.value.parentNode);
          const nextId = getNextId(candidate.value);
          if (parentId !== -1 && nextId !== -1) {
            node = candidate;
          }
        }
        if (!node) {
          let tailNode = addList.tail;
          while (tailNode) {
            const _node = tailNode;
            tailNode = tailNode.previous;
            if (_node) {
              const parentId = this.mirror.getId(_node.value.parentNode);
              const nextId = getNextId(_node.value);
              if (nextId === -1)
                continue;
              else if (parentId !== -1) {
                node = _node;
                break;
              } else {
                const unhandledNode = _node.value;
                if (unhandledNode.parentNode && unhandledNode.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                  const shadowHost = unhandledNode.parentNode.host;
                  const parentId2 = this.mirror.getId(shadowHost);
                  if (parentId2 !== -1) {
                    node = _node;
                    break;
                  }
                }
              }
            }
          }
        }
        if (!node) {
          while (addList.head) {
            addList.removeNode(addList.head.value);
          }
          break;
        }
        candidate = node.previous;
        addList.removeNode(node.value);
        pushAdd(node.value);
      }
      const payload = {
        texts: this.texts.map((text) => ({
          id: this.mirror.getId(text.node),
          value: text.value
        })).filter((text) => !addedIds.has(text.id)).filter((text) => this.mirror.has(text.id)),
        attributes: this.attributes.map((attribute) => {
          const { attributes } = attribute;
          if (typeof attributes.style === "string") {
            const diffAsStr = JSON.stringify(attribute.styleDiff);
            const unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
            if (diffAsStr.length < attributes.style.length) {
              if ((diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length) {
                attributes.style = attribute.styleDiff;
              }
            }
          }
          return {
            id: this.mirror.getId(attribute.node),
            attributes
          };
        }).filter((attribute) => !addedIds.has(attribute.id)).filter((attribute) => this.mirror.has(attribute.id)),
        removes: this.removes,
        adds
      };
      if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
        return;
      }
      this.texts = [];
      this.attributes = [];
      this.removes = [];
      this.addedSet = /* @__PURE__ */ new Set();
      this.movedSet = /* @__PURE__ */ new Set();
      this.droppedSet = /* @__PURE__ */ new Set();
      this.movedMap = {};
      this.mutationCb(payload);
    };
    this.processMutation = (m) => {
      if (isIgnored(m.target, this.mirror)) {
        return;
      }
      let unattachedDoc;
      try {
        unattachedDoc = document.implementation.createHTMLDocument();
      } catch (e2) {
        unattachedDoc = this.doc;
      }
      switch (m.type) {
        case "characterData": {
          const value = m.target.textContent;
          if (!isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, false) && value !== m.oldValue) {
            this.texts.push({
              value: needMaskingText(m.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, this.maskAllText) && value ? this.maskTextFn ? this.maskTextFn(value) : value.replace(/[\S]/g, "*") : value,
              node: m.target
            });
          }
          break;
        }
        case "attributes": {
          const target = m.target;
          let attributeName = m.attributeName;
          let value = m.target.getAttribute(attributeName);
          if (attributeName === "value") {
            const type = getInputType(target);
            const tagName = target.tagName;
            value = getInputValue(target, tagName, type);
            const isInputMasked = shouldMaskInput({
              maskInputOptions: this.maskInputOptions,
              tagName,
              type
            });
            const forceMask = needMaskingText(m.target, this.maskTextClass, this.maskTextSelector, this.unmaskTextClass, this.unmaskTextSelector, isInputMasked);
            value = maskInputValue({
              isMasked: forceMask,
              element: target,
              value,
              maskInputFn: this.maskInputFn
            });
          }
          if (isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, false) || value === m.oldValue) {
            return;
          }
          let item = this.attributes.find((a) => a.node === m.target);
          if (target.tagName === "IFRAME" && attributeName === "src" && !this.keepIframeSrcFn(value)) {
            if (!target.contentDocument) {
              attributeName = "rr_src";
            } else {
              return;
            }
          }
          if (!item) {
            item = {
              node: m.target,
              attributes: {},
              styleDiff: {},
              _unchangedStyles: {}
            };
            this.attributes.push(item);
          }
          if (attributeName === "type" && target.tagName === "INPUT" && (m.oldValue || "").toLowerCase() === "password") {
            target.setAttribute("data-rr-is-password", "true");
          }
          if (!ignoreAttribute(target.tagName, attributeName)) {
            item.attributes[attributeName] = transformAttribute(this.doc, toLowerCase(target.tagName), toLowerCase(attributeName), value, target, this.maskAttributeFn);
            if (attributeName === "style") {
              const old = unattachedDoc.createElement("span");
              if (m.oldValue) {
                old.setAttribute("style", m.oldValue);
              }
              for (const pname of Array.from(target.style)) {
                const newValue = target.style.getPropertyValue(pname);
                const newPriority = target.style.getPropertyPriority(pname);
                if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                  if (newPriority === "") {
                    item.styleDiff[pname] = newValue;
                  } else {
                    item.styleDiff[pname] = [newValue, newPriority];
                  }
                } else {
                  item._unchangedStyles[pname] = [newValue, newPriority];
                }
              }
              for (const pname of Array.from(old.style)) {
                if (target.style.getPropertyValue(pname) === "") {
                  item.styleDiff[pname] = false;
                }
              }
            }
          }
          break;
        }
        case "childList": {
          if (isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, true)) {
            return;
          }
          m.addedNodes.forEach((n) => this.genAdds(n, m.target));
          m.removedNodes.forEach((n) => {
            const nodeId = this.mirror.getId(n);
            const parentId = isShadowRoot(m.target) ? this.mirror.getId(m.target.host) : this.mirror.getId(m.target);
            if (isBlocked(m.target, this.blockClass, this.blockSelector, this.unblockSelector, false) || isIgnored(n, this.mirror) || !isSerialized(n, this.mirror)) {
              return;
            }
            if (this.addedSet.has(n)) {
              deepDelete(this.addedSet, n);
              this.droppedSet.add(n);
            } else if (this.addedSet.has(m.target) && nodeId === -1)
              ;
            else if (isAncestorRemoved(m.target, this.mirror))
              ;
            else if (this.movedSet.has(n) && this.movedMap[moveKey(nodeId, parentId)]) {
              deepDelete(this.movedSet, n);
            } else {
              this.removes.push({
                parentId,
                id: nodeId,
                isShadow: isShadowRoot(m.target) && isNativeShadowDom(m.target) ? true : void 0
              });
            }
            this.mapRemoves.push(n);
          });
          break;
        }
      }
    };
    this.genAdds = (n, target) => {
      if (this.processedNodeManager.inOtherBuffer(n, this))
        return;
      if (this.addedSet.has(n) || this.movedSet.has(n))
        return;
      if (this.mirror.hasNode(n)) {
        if (isIgnored(n, this.mirror)) {
          return;
        }
        this.movedSet.add(n);
        let targetId = null;
        if (target && this.mirror.hasNode(target)) {
          targetId = this.mirror.getId(target);
        }
        if (targetId && targetId !== -1) {
          this.movedMap[moveKey(this.mirror.getId(n), targetId)] = true;
        }
      } else {
        this.addedSet.add(n);
        this.droppedSet.delete(n);
      }
      if (!isBlocked(n, this.blockClass, this.blockSelector, this.unblockSelector, false)) {
        n.childNodes.forEach((childN) => this.genAdds(childN));
        if (hasShadowRoot(n)) {
          n.shadowRoot.childNodes.forEach((childN) => {
            this.processedNodeManager.add(childN, this);
            this.genAdds(childN, n);
          });
        }
      }
    };
  }
  init(options) {
    [
      "mutationCb",
      "blockClass",
      "blockSelector",
      "unblockSelector",
      "maskAllText",
      "maskTextClass",
      "unmaskTextClass",
      "maskTextSelector",
      "unmaskTextSelector",
      "inlineStylesheet",
      "maskInputOptions",
      "maskAttributeFn",
      "maskTextFn",
      "maskInputFn",
      "keepIframeSrcFn",
      "recordCanvas",
      "inlineImages",
      "slimDOMOptions",
      "dataURLOptions",
      "doc",
      "mirror",
      "iframeManager",
      "stylesheetManager",
      "shadowDomManager",
      "canvasManager",
      "processedNodeManager"
    ].forEach((key) => {
      this[key] = options[key];
    });
  }
  freeze() {
    this.frozen = true;
    this.canvasManager.freeze();
  }
  unfreeze() {
    this.frozen = false;
    this.canvasManager.unfreeze();
    this.emit();
  }
  isFrozen() {
    return this.frozen;
  }
  lock() {
    this.locked = true;
    this.canvasManager.lock();
  }
  unlock() {
    this.locked = false;
    this.canvasManager.unlock();
    this.emit();
  }
  reset() {
    this.shadowDomManager.reset();
    this.canvasManager.reset();
  }
};
function deepDelete(addsSet, n) {
  addsSet.delete(n);
  n.childNodes.forEach((childN) => deepDelete(addsSet, childN));
}
function isParentRemoved(removes, n, mirror2) {
  if (removes.length === 0)
    return false;
  return _isParentRemoved(removes, n, mirror2);
}
function _isParentRemoved(removes, n, mirror2) {
  const { parentNode } = n;
  if (!parentNode) {
    return false;
  }
  const parentId = mirror2.getId(parentNode);
  if (removes.some((r2) => r2.id === parentId)) {
    return true;
  }
  return _isParentRemoved(removes, parentNode, mirror2);
}
function isAncestorInSet(set, n) {
  if (set.size === 0)
    return false;
  return _isAncestorInSet(set, n);
}
function _isAncestorInSet(set, n) {
  const { parentNode } = n;
  if (!parentNode) {
    return false;
  }
  if (set.has(parentNode)) {
    return true;
  }
  return _isAncestorInSet(set, parentNode);
}
var errorHandler;
function registerErrorHandler(handler) {
  errorHandler = handler;
}
function unregisterErrorHandler() {
  errorHandler = void 0;
}
var callbackWrapper = (cb) => {
  if (!errorHandler) {
    return cb;
  }
  const rrwebWrapped = (...rest) => {
    try {
      return cb(...rest);
    } catch (error) {
      if (errorHandler && errorHandler(error) === true) {
        return () => {
        };
      }
      throw error;
    }
  };
  return rrwebWrapped;
};
var mutationBuffers = [];
function getEventTarget2(event) {
  try {
    if ("composedPath" in event) {
      const path = event.composedPath();
      if (path.length) {
        return path[0];
      }
    } else if ("path" in event && event.path.length) {
      return event.path[0];
    }
  } catch (_a) {
  }
  return event && event.target;
}
function initMutationObserver(options, rootEl) {
  var _a, _b;
  const mutationBuffer = new MutationBuffer();
  mutationBuffers.push(mutationBuffer);
  mutationBuffer.init(options);
  let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver;
  const angularZoneSymbol = (_b = (_a = window === null || window === void 0 ? void 0 : window.Zone) === null || _a === void 0 ? void 0 : _a.__symbol__) === null || _b === void 0 ? void 0 : _b.call(_a, "MutationObserver");
  if (angularZoneSymbol && window[angularZoneSymbol]) {
    mutationObserverCtor = window[angularZoneSymbol];
  }
  const observer = new mutationObserverCtor(callbackWrapper((mutations) => {
    if (options.onMutation && options.onMutation(mutations) === false) {
      return;
    }
    mutationBuffer.processMutations.bind(mutationBuffer)(mutations);
  }));
  observer.observe(rootEl, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
  return observer;
}
function initMoveObserver({ mousemoveCb, sampling, doc, mirror: mirror2 }) {
  if (sampling.mousemove === false) {
    return () => {
    };
  }
  const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
  const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
  let positions = [];
  let timeBaseline;
  const wrappedCb = throttle$1(callbackWrapper((source) => {
    const totalOffset = Date.now() - timeBaseline;
    mousemoveCb(positions.map((p) => {
      p.timeOffset -= totalOffset;
      return p;
    }), source);
    positions = [];
    timeBaseline = null;
  }), callbackThreshold);
  const updatePosition = callbackWrapper(throttle$1(callbackWrapper((evt) => {
    const target = getEventTarget2(evt);
    const { clientX, clientY } = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt;
    if (!timeBaseline) {
      timeBaseline = nowTimestamp();
    }
    positions.push({
      x: clientX,
      y: clientY,
      id: mirror2.getId(target),
      timeOffset: nowTimestamp() - timeBaseline
    });
    wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove);
  }), threshold, {
    trailing: false
  }));
  const handlers4 = [
    on("mousemove", updatePosition, doc),
    on("touchmove", updatePosition, doc),
    on("drag", updatePosition, doc)
  ];
  return callbackWrapper(() => {
    handlers4.forEach((h) => h());
  });
}
function initMouseInteractionObserver({ mouseInteractionCb, doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, sampling }) {
  if (sampling.mouseInteraction === false) {
    return () => {
    };
  }
  const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
  const handlers4 = [];
  let currentPointerType = null;
  const getHandler = (eventKey) => {
    return (event) => {
      const target = getEventTarget2(event);
      if (isBlocked(target, blockClass, blockSelector, unblockSelector, true)) {
        return;
      }
      let pointerType = null;
      let thisEventKey = eventKey;
      if ("pointerType" in event) {
        switch (event.pointerType) {
          case "mouse":
            pointerType = PointerTypes.Mouse;
            break;
          case "touch":
            pointerType = PointerTypes.Touch;
            break;
          case "pen":
            pointerType = PointerTypes.Pen;
            break;
        }
        if (pointerType === PointerTypes.Touch) {
          if (MouseInteractions[eventKey] === MouseInteractions.MouseDown) {
            thisEventKey = "TouchStart";
          } else if (MouseInteractions[eventKey] === MouseInteractions.MouseUp) {
            thisEventKey = "TouchEnd";
          }
        } else if (pointerType === PointerTypes.Pen)
          ;
      } else if (legacy_isTouchEvent(event)) {
        pointerType = PointerTypes.Touch;
      }
      if (pointerType !== null) {
        currentPointerType = pointerType;
        if (thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch || thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse) {
          pointerType = null;
        }
      } else if (MouseInteractions[eventKey] === MouseInteractions.Click) {
        pointerType = currentPointerType;
        currentPointerType = null;
      }
      const e2 = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
      if (!e2) {
        return;
      }
      const id = mirror2.getId(target);
      const { clientX, clientY } = e2;
      callbackWrapper(mouseInteractionCb)(Object.assign({ type: MouseInteractions[thisEventKey], id, x: clientX, y: clientY }, pointerType !== null && { pointerType }));
    };
  };
  Object.keys(MouseInteractions).filter((key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false).forEach((eventKey) => {
    let eventName = toLowerCase(eventKey);
    const handler = getHandler(eventKey);
    if (window.PointerEvent) {
      switch (MouseInteractions[eventKey]) {
        case MouseInteractions.MouseDown:
        case MouseInteractions.MouseUp:
          eventName = eventName.replace("mouse", "pointer");
          break;
        case MouseInteractions.TouchStart:
        case MouseInteractions.TouchEnd:
          return;
      }
    }
    handlers4.push(on(eventName, handler, doc));
  });
  return callbackWrapper(() => {
    handlers4.forEach((h) => h());
  });
}
function initScrollObserver({ scrollCb, doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, sampling }) {
  const updatePosition = callbackWrapper(throttle$1(callbackWrapper((evt) => {
    const target = getEventTarget2(evt);
    if (!target || isBlocked(target, blockClass, blockSelector, unblockSelector, true)) {
      return;
    }
    const id = mirror2.getId(target);
    if (target === doc && doc.defaultView) {
      const scrollLeftTop = getWindowScroll(doc.defaultView);
      scrollCb({
        id,
        x: scrollLeftTop.left,
        y: scrollLeftTop.top
      });
    } else {
      scrollCb({
        id,
        x: target.scrollLeft,
        y: target.scrollTop
      });
    }
  }), sampling.scroll || 100));
  return on("scroll", updatePosition, doc);
}
function initViewportResizeObserver({ viewportResizeCb }, { win }) {
  let lastH = -1;
  let lastW = -1;
  const updateDimension = callbackWrapper(throttle$1(callbackWrapper(() => {
    const height = getWindowHeight();
    const width = getWindowWidth();
    if (lastH !== height || lastW !== width) {
      viewportResizeCb({
        width: Number(width),
        height: Number(height)
      });
      lastH = height;
      lastW = width;
    }
  }), 200));
  return on("resize", updateDimension, win);
}
var INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
var lastInputValueMap = /* @__PURE__ */ new WeakMap();
function initInputObserver({ inputCb, doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, ignoreClass, ignoreSelector, maskInputOptions, maskInputFn, sampling, userTriggeredOnInput, maskTextClass, unmaskTextClass, maskTextSelector, unmaskTextSelector }) {
  function eventHandler(event) {
    let target = getEventTarget2(event);
    const userTriggered = event.isTrusted;
    const tagName = target && toUpperCase(target.tagName);
    if (tagName === "OPTION")
      target = target.parentElement;
    if (!target || !tagName || INPUT_TAGS.indexOf(tagName) < 0 || isBlocked(target, blockClass, blockSelector, unblockSelector, true)) {
      return;
    }
    const el = target;
    if (el.classList.contains(ignoreClass) || ignoreSelector && el.matches(ignoreSelector)) {
      return;
    }
    const type = getInputType(target);
    let text = getInputValue(el, tagName, type);
    let isChecked = false;
    const isInputMasked = shouldMaskInput({
      maskInputOptions,
      tagName,
      type
    });
    const forceMask = needMaskingText(target, maskTextClass, maskTextSelector, unmaskTextClass, unmaskTextSelector, isInputMasked);
    if (type === "radio" || type === "checkbox") {
      isChecked = target.checked;
    }
    text = maskInputValue({
      isMasked: forceMask,
      element: target,
      value: text,
      maskInputFn
    });
    cbWithDedup(target, userTriggeredOnInput ? { text, isChecked, userTriggered } : { text, isChecked });
    const name = target.name;
    if (type === "radio" && name && isChecked) {
      doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el2) => {
        if (el2 !== target) {
          const text2 = maskInputValue({
            isMasked: forceMask,
            element: el2,
            value: getInputValue(el2, tagName, type),
            maskInputFn
          });
          cbWithDedup(el2, userTriggeredOnInput ? { text: text2, isChecked: !isChecked, userTriggered: false } : { text: text2, isChecked: !isChecked });
        }
      });
    }
  }
  function cbWithDedup(target, v) {
    const lastInputValue = lastInputValueMap.get(target);
    if (!lastInputValue || lastInputValue.text !== v.text || lastInputValue.isChecked !== v.isChecked) {
      lastInputValueMap.set(target, v);
      const id = mirror2.getId(target);
      callbackWrapper(inputCb)(Object.assign(Object.assign({}, v), { id }));
    }
  }
  const events = sampling.input === "last" ? ["change"] : ["input", "change"];
  const handlers4 = events.map((eventName) => on(eventName, callbackWrapper(eventHandler), doc));
  const currentWindow = doc.defaultView;
  if (!currentWindow) {
    return () => {
      handlers4.forEach((h) => h());
    };
  }
  const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value");
  const hookProperties = [
    [currentWindow.HTMLInputElement.prototype, "value"],
    [currentWindow.HTMLInputElement.prototype, "checked"],
    [currentWindow.HTMLSelectElement.prototype, "value"],
    [currentWindow.HTMLTextAreaElement.prototype, "value"],
    [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
    [currentWindow.HTMLOptionElement.prototype, "selected"]
  ];
  if (propertyDescriptor && propertyDescriptor.set) {
    handlers4.push(...hookProperties.map((p) => hookSetter(p[0], p[1], {
      set() {
        callbackWrapper(eventHandler)({
          target: this,
          isTrusted: false
        });
      }
    }, false, currentWindow)));
  }
  return callbackWrapper(() => {
    handlers4.forEach((h) => h());
  });
}
function getNestedCSSRulePositions(rule) {
  const positions = [];
  function recurse(childRule, pos) {
    if (hasNestedCSSRule("CSSGroupingRule") && childRule.parentRule instanceof CSSGroupingRule || hasNestedCSSRule("CSSMediaRule") && childRule.parentRule instanceof CSSMediaRule || hasNestedCSSRule("CSSSupportsRule") && childRule.parentRule instanceof CSSSupportsRule || hasNestedCSSRule("CSSConditionRule") && childRule.parentRule instanceof CSSConditionRule) {
      const rules = Array.from(childRule.parentRule.cssRules);
      const index = rules.indexOf(childRule);
      pos.unshift(index);
    } else if (childRule.parentStyleSheet) {
      const rules = Array.from(childRule.parentStyleSheet.cssRules);
      const index = rules.indexOf(childRule);
      pos.unshift(index);
    }
    return pos;
  }
  return recurse(rule, positions);
}
function getIdAndStyleId(sheet, mirror2, styleMirror) {
  let id, styleId;
  if (!sheet)
    return {};
  if (sheet.ownerNode)
    id = mirror2.getId(sheet.ownerNode);
  else
    styleId = styleMirror.getId(sheet);
  return {
    styleId,
    id
  };
}
function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
  if (!win.CSSStyleSheet || !win.CSSStyleSheet.prototype) {
    return () => {
    };
  }
  const insertRule = win.CSSStyleSheet.prototype.insertRule;
  win.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
    apply: callbackWrapper((target, thisArg, argumentsList) => {
      const [rule, index] = argumentsList;
      const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleSheetRuleCb({
          id,
          styleId,
          adds: [{ rule, index }]
        });
      }
      return target.apply(thisArg, argumentsList);
    })
  });
  const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
  win.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
    apply: callbackWrapper((target, thisArg, argumentsList) => {
      const [index] = argumentsList;
      const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleSheetRuleCb({
          id,
          styleId,
          removes: [{ index }]
        });
      }
      return target.apply(thisArg, argumentsList);
    })
  });
  let replace;
  if (win.CSSStyleSheet.prototype.replace) {
    replace = win.CSSStyleSheet.prototype.replace;
    win.CSSStyleSheet.prototype.replace = new Proxy(replace, {
      apply: callbackWrapper((target, thisArg, argumentsList) => {
        const [text] = argumentsList;
        const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            replace: text
          });
        }
        return target.apply(thisArg, argumentsList);
      })
    });
  }
  let replaceSync;
  if (win.CSSStyleSheet.prototype.replaceSync) {
    replaceSync = win.CSSStyleSheet.prototype.replaceSync;
    win.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
      apply: callbackWrapper((target, thisArg, argumentsList) => {
        const [text] = argumentsList;
        const { id, styleId } = getIdAndStyleId(thisArg, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            replaceSync: text
          });
        }
        return target.apply(thisArg, argumentsList);
      })
    });
  }
  const supportedNestedCSSRuleTypes = {};
  if (canMonkeyPatchNestedCSSRule("CSSGroupingRule")) {
    supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
  } else {
    if (canMonkeyPatchNestedCSSRule("CSSMediaRule")) {
      supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSConditionRule")) {
      supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSSupportsRule")) {
      supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
    }
  }
  const unmodifiedFunctions = {};
  Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
    unmodifiedFunctions[typeKey] = {
      insertRule: type.prototype.insertRule,
      deleteRule: type.prototype.deleteRule
    };
    type.prototype.insertRule = new Proxy(unmodifiedFunctions[typeKey].insertRule, {
      apply: callbackWrapper((target, thisArg, argumentsList) => {
        const [rule, index] = argumentsList;
        const { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            adds: [
              {
                rule,
                index: [
                  ...getNestedCSSRulePositions(thisArg),
                  index || 0
                ]
              }
            ]
          });
        }
        return target.apply(thisArg, argumentsList);
      })
    });
    type.prototype.deleteRule = new Proxy(unmodifiedFunctions[typeKey].deleteRule, {
      apply: callbackWrapper((target, thisArg, argumentsList) => {
        const [index] = argumentsList;
        const { id, styleId } = getIdAndStyleId(thisArg.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            removes: [
              { index: [...getNestedCSSRulePositions(thisArg), index] }
            ]
          });
        }
        return target.apply(thisArg, argumentsList);
      })
    });
  });
  return callbackWrapper(() => {
    win.CSSStyleSheet.prototype.insertRule = insertRule;
    win.CSSStyleSheet.prototype.deleteRule = deleteRule;
    replace && (win.CSSStyleSheet.prototype.replace = replace);
    replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
    Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
      type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
      type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
    });
  });
}
function initAdoptedStyleSheetObserver({ mirror: mirror2, stylesheetManager }, host) {
  var _a, _b, _c;
  let hostId = null;
  if (host.nodeName === "#document")
    hostId = mirror2.getId(host);
  else
    hostId = mirror2.getId(host.host);
  const patchTarget = host.nodeName === "#document" ? (_a = host.defaultView) === null || _a === void 0 ? void 0 : _a.Document : (_c = (_b = host.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView) === null || _c === void 0 ? void 0 : _c.ShadowRoot;
  const originalPropertyDescriptor = (patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype) ? Object.getOwnPropertyDescriptor(patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype, "adoptedStyleSheets") : void 0;
  if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
    return () => {
    };
  Object.defineProperty(host, "adoptedStyleSheets", {
    configurable: originalPropertyDescriptor.configurable,
    enumerable: originalPropertyDescriptor.enumerable,
    get() {
      var _a2;
      return (_a2 = originalPropertyDescriptor.get) === null || _a2 === void 0 ? void 0 : _a2.call(this);
    },
    set(sheets) {
      var _a2;
      const result = (_a2 = originalPropertyDescriptor.set) === null || _a2 === void 0 ? void 0 : _a2.call(this, sheets);
      if (hostId !== null && hostId !== -1) {
        try {
          stylesheetManager.adoptStyleSheets(sheets, hostId);
        } catch (e2) {
        }
      }
      return result;
    }
  });
  return callbackWrapper(() => {
    Object.defineProperty(host, "adoptedStyleSheets", {
      configurable: originalPropertyDescriptor.configurable,
      enumerable: originalPropertyDescriptor.enumerable,
      get: originalPropertyDescriptor.get,
      set: originalPropertyDescriptor.set
    });
  });
}
function initStyleDeclarationObserver({ styleDeclarationCb, mirror: mirror2, ignoreCSSAttributes, stylesheetManager }, { win }) {
  const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
  win.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
    apply: callbackWrapper((target, thisArg, argumentsList) => {
      var _a;
      const [property, value, priority] = argumentsList;
      if (ignoreCSSAttributes.has(property)) {
        return setProperty.apply(thisArg, [property, value, priority]);
      }
      const { id, styleId } = getIdAndStyleId((_a = thisArg.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleDeclarationCb({
          id,
          styleId,
          set: {
            property,
            value,
            priority
          },
          index: getNestedCSSRulePositions(thisArg.parentRule)
        });
      }
      return target.apply(thisArg, argumentsList);
    })
  });
  const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
  win.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
    apply: callbackWrapper((target, thisArg, argumentsList) => {
      var _a;
      const [property] = argumentsList;
      if (ignoreCSSAttributes.has(property)) {
        return removeProperty.apply(thisArg, [property]);
      }
      const { id, styleId } = getIdAndStyleId((_a = thisArg.parentRule) === null || _a === void 0 ? void 0 : _a.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
      if (id && id !== -1 || styleId && styleId !== -1) {
        styleDeclarationCb({
          id,
          styleId,
          remove: {
            property
          },
          index: getNestedCSSRulePositions(thisArg.parentRule)
        });
      }
      return target.apply(thisArg, argumentsList);
    })
  });
  return callbackWrapper(() => {
    win.CSSStyleDeclaration.prototype.setProperty = setProperty;
    win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
  });
}
function initMediaInteractionObserver({ mediaInteractionCb, blockClass, blockSelector, unblockSelector, mirror: mirror2, sampling, doc }) {
  const handler = callbackWrapper((type) => throttle$1(callbackWrapper((event) => {
    const target = getEventTarget2(event);
    if (!target || isBlocked(target, blockClass, blockSelector, unblockSelector, true)) {
      return;
    }
    const { currentTime, volume, muted, playbackRate } = target;
    mediaInteractionCb({
      type,
      id: mirror2.getId(target),
      currentTime,
      volume,
      muted,
      playbackRate
    });
  }), sampling.media || 500));
  const handlers4 = [
    on("play", handler(0), doc),
    on("pause", handler(1), doc),
    on("seeked", handler(2), doc),
    on("volumechange", handler(3), doc),
    on("ratechange", handler(4), doc)
  ];
  return callbackWrapper(() => {
    handlers4.forEach((h) => h());
  });
}
function initFontObserver({ fontCb, doc }) {
  const win = doc.defaultView;
  if (!win) {
    return () => {
    };
  }
  const handlers4 = [];
  const fontMap = /* @__PURE__ */ new WeakMap();
  const originalFontFace = win.FontFace;
  win.FontFace = function FontFace(family, source, descriptors) {
    const fontFace = new originalFontFace(family, source, descriptors);
    fontMap.set(fontFace, {
      family,
      buffer: typeof source !== "string",
      descriptors,
      fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
    });
    return fontFace;
  };
  const restoreHandler = patch(doc.fonts, "add", function(original) {
    return function(fontFace) {
      setTimeout(callbackWrapper(() => {
        const p = fontMap.get(fontFace);
        if (p) {
          fontCb(p);
          fontMap.delete(fontFace);
        }
      }), 0);
      return original.apply(this, [fontFace]);
    };
  });
  handlers4.push(() => {
    win.FontFace = originalFontFace;
  });
  handlers4.push(restoreHandler);
  return callbackWrapper(() => {
    handlers4.forEach((h) => h());
  });
}
function initSelectionObserver(param) {
  const { doc, mirror: mirror2, blockClass, blockSelector, unblockSelector, selectionCb } = param;
  let collapsed = true;
  const updateSelection = callbackWrapper(() => {
    const selection = doc.getSelection();
    if (!selection || collapsed && (selection === null || selection === void 0 ? void 0 : selection.isCollapsed))
      return;
    collapsed = selection.isCollapsed || false;
    const ranges = [];
    const count = selection.rangeCount || 0;
    for (let i = 0; i < count; i++) {
      const range = selection.getRangeAt(i);
      const { startContainer, startOffset, endContainer, endOffset } = range;
      const blocked = isBlocked(startContainer, blockClass, blockSelector, unblockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, unblockSelector, true);
      if (blocked)
        continue;
      ranges.push({
        start: mirror2.getId(startContainer),
        startOffset,
        end: mirror2.getId(endContainer),
        endOffset
      });
    }
    selectionCb({ ranges });
  });
  updateSelection();
  return on("selectionchange", updateSelection);
}
function initCustomElementObserver({ doc, customElementCb }) {
  const win = doc.defaultView;
  if (!win || !win.customElements) {
    return () => {
    };
  }
  const restoreHandler = patch(win.customElements, "define", function(original) {
    return function(name, constructor, options) {
      try {
        customElementCb({
          define: {
            name
          }
        });
      } catch (e2) {
      }
      return original.apply(this, [name, constructor, options]);
    };
  });
  return restoreHandler;
}
function initObservers(o, _hooks = {}) {
  const currentWindow = o.doc.defaultView;
  if (!currentWindow) {
    return () => {
    };
  }
  const mutationObserver = initMutationObserver(o, o.doc);
  const mousemoveHandler = initMoveObserver(o);
  const mouseInteractionHandler = initMouseInteractionObserver(o);
  const scrollHandler = initScrollObserver(o);
  const viewportResizeHandler = initViewportResizeObserver(o, {
    win: currentWindow
  });
  const inputHandler = initInputObserver(o);
  const mediaInteractionHandler = initMediaInteractionObserver(o);
  const styleSheetObserver = initStyleSheetObserver(o, { win: currentWindow });
  const adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o, o.doc);
  const styleDeclarationObserver = initStyleDeclarationObserver(o, {
    win: currentWindow
  });
  const fontObserver = o.collectFonts ? initFontObserver(o) : () => {
  };
  const selectionObserver = initSelectionObserver(o);
  const customElementObserver = initCustomElementObserver(o);
  return callbackWrapper(() => {
    mutationBuffers.forEach((b) => b.reset());
    mutationObserver.disconnect();
    mousemoveHandler();
    mouseInteractionHandler();
    scrollHandler();
    viewportResizeHandler();
    inputHandler();
    mediaInteractionHandler();
    styleSheetObserver();
    adoptedStyleSheetObserver();
    styleDeclarationObserver();
    fontObserver();
    selectionObserver();
    customElementObserver();
  });
}
function hasNestedCSSRule(prop) {
  return typeof window[prop] !== "undefined";
}
function canMonkeyPatchNestedCSSRule(prop) {
  return Boolean(typeof window[prop] !== "undefined" && window[prop].prototype && "insertRule" in window[prop].prototype && "deleteRule" in window[prop].prototype);
}
var CrossOriginIframeMirror = class {
  constructor(generateIdFn) {
    this.generateIdFn = generateIdFn;
    this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
    this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
  }
  getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
    const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
    const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
    let id = idToRemoteIdMap.get(remoteId);
    if (!id) {
      id = this.generateIdFn();
      idToRemoteIdMap.set(remoteId, id);
      remoteIdToIdMap.set(id, remoteId);
    }
    return id;
  }
  getIds(iframe, remoteId) {
    const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
    const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
    return remoteId.map((id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap));
  }
  getRemoteId(iframe, id, map) {
    const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
    if (typeof id !== "number")
      return id;
    const remoteId = remoteIdToIdMap.get(id);
    if (!remoteId)
      return -1;
    return remoteId;
  }
  getRemoteIds(iframe, ids) {
    const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
    return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
  }
  reset(iframe) {
    if (!iframe) {
      this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
      this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
      return;
    }
    this.iframeIdToRemoteIdMap.delete(iframe);
    this.iframeRemoteIdToIdMap.delete(iframe);
  }
  getIdToRemoteIdMap(iframe) {
    let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
    if (!idToRemoteIdMap) {
      idToRemoteIdMap = /* @__PURE__ */ new Map();
      this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
    }
    return idToRemoteIdMap;
  }
  getRemoteIdToIdMap(iframe) {
    let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
    if (!remoteIdToIdMap) {
      remoteIdToIdMap = /* @__PURE__ */ new Map();
      this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
    }
    return remoteIdToIdMap;
  }
};
var IframeManagerNoop = class {
  constructor() {
    this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId);
    this.crossOriginIframeRootIdMap = /* @__PURE__ */ new WeakMap();
  }
  addIframe() {
  }
  addLoadListener() {
  }
  attachIframe() {
  }
};
var IframeManager = class {
  constructor(options) {
    this.iframes = /* @__PURE__ */ new WeakMap();
    this.crossOriginIframeMap = /* @__PURE__ */ new WeakMap();
    this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId);
    this.crossOriginIframeRootIdMap = /* @__PURE__ */ new WeakMap();
    this.mutationCb = options.mutationCb;
    this.wrappedEmit = options.wrappedEmit;
    this.stylesheetManager = options.stylesheetManager;
    this.recordCrossOriginIframes = options.recordCrossOriginIframes;
    this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror));
    this.mirror = options.mirror;
    if (this.recordCrossOriginIframes) {
      window.addEventListener("message", this.handleMessage.bind(this));
    }
  }
  addIframe(iframeEl) {
    this.iframes.set(iframeEl, true);
    if (iframeEl.contentWindow)
      this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
  }
  addLoadListener(cb) {
    this.loadListener = cb;
  }
  attachIframe(iframeEl, childSn) {
    var _a;
    this.mutationCb({
      adds: [
        {
          parentId: this.mirror.getId(iframeEl),
          nextId: null,
          node: childSn
        }
      ],
      removes: [],
      texts: [],
      attributes: [],
      isAttachIframe: true
    });
    (_a = this.loadListener) === null || _a === void 0 ? void 0 : _a.call(this, iframeEl);
    if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
      this.stylesheetManager.adoptStyleSheets(iframeEl.contentDocument.adoptedStyleSheets, this.mirror.getId(iframeEl.contentDocument));
  }
  handleMessage(message) {
    const crossOriginMessageEvent = message;
    if (crossOriginMessageEvent.data.type !== "rrweb" || crossOriginMessageEvent.origin !== crossOriginMessageEvent.data.origin)
      return;
    const iframeSourceWindow = message.source;
    if (!iframeSourceWindow)
      return;
    const iframeEl = this.crossOriginIframeMap.get(message.source);
    if (!iframeEl)
      return;
    const transformedEvent = this.transformCrossOriginEvent(iframeEl, crossOriginMessageEvent.data.event);
    if (transformedEvent)
      this.wrappedEmit(transformedEvent, crossOriginMessageEvent.data.isCheckout);
  }
  transformCrossOriginEvent(iframeEl, e2) {
    var _a;
    switch (e2.type) {
      case EventType.FullSnapshot: {
        this.crossOriginIframeMirror.reset(iframeEl);
        this.crossOriginIframeStyleMirror.reset(iframeEl);
        this.replaceIdOnNode(e2.data.node, iframeEl);
        const rootId = e2.data.node.id;
        this.crossOriginIframeRootIdMap.set(iframeEl, rootId);
        this.patchRootIdOnNode(e2.data.node, rootId);
        return {
          timestamp: e2.timestamp,
          type: EventType.IncrementalSnapshot,
          data: {
            source: IncrementalSource.Mutation,
            adds: [
              {
                parentId: this.mirror.getId(iframeEl),
                nextId: null,
                node: e2.data.node
              }
            ],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: true
          }
        };
      }
      case EventType.Meta:
      case EventType.Load:
      case EventType.DomContentLoaded: {
        return false;
      }
      case EventType.Plugin: {
        return e2;
      }
      case EventType.Custom: {
        this.replaceIds(e2.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]);
        return e2;
      }
      case EventType.IncrementalSnapshot: {
        switch (e2.data.source) {
          case IncrementalSource.Mutation: {
            e2.data.adds.forEach((n) => {
              this.replaceIds(
                n,
                iframeEl,
                [
                  "parentId",
                  "nextId",
                  "previousId"
                ]
              );
              this.replaceIdOnNode(n.node, iframeEl);
              const rootId = this.crossOriginIframeRootIdMap.get(iframeEl);
              rootId && this.patchRootIdOnNode(n.node, rootId);
            });
            e2.data.removes.forEach((n) => {
              this.replaceIds(n, iframeEl, ["parentId", "id"]);
            });
            e2.data.attributes.forEach((n) => {
              this.replaceIds(n, iframeEl, ["id"]);
            });
            e2.data.texts.forEach((n) => {
              this.replaceIds(n, iframeEl, ["id"]);
            });
            return e2;
          }
          case IncrementalSource.Drag:
          case IncrementalSource.TouchMove:
          case IncrementalSource.MouseMove: {
            e2.data.positions.forEach((p) => {
              this.replaceIds(p, iframeEl, ["id"]);
            });
            return e2;
          }
          case IncrementalSource.ViewportResize: {
            return false;
          }
          case IncrementalSource.MediaInteraction:
          case IncrementalSource.MouseInteraction:
          case IncrementalSource.Scroll:
          case IncrementalSource.CanvasMutation:
          case IncrementalSource.Input: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            return e2;
          }
          case IncrementalSource.StyleSheetRule:
          case IncrementalSource.StyleDeclaration: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            this.replaceStyleIds(e2.data, iframeEl, ["styleId"]);
            return e2;
          }
          case IncrementalSource.Font: {
            return e2;
          }
          case IncrementalSource.Selection: {
            e2.data.ranges.forEach((range) => {
              this.replaceIds(range, iframeEl, ["start", "end"]);
            });
            return e2;
          }
          case IncrementalSource.AdoptedStyleSheet: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]);
            (_a = e2.data.styles) === null || _a === void 0 ? void 0 : _a.forEach((style) => {
              this.replaceStyleIds(style, iframeEl, ["styleId"]);
            });
            return e2;
          }
        }
      }
    }
    return false;
  }
  replace(iframeMirror, obj, iframeEl, keys) {
    for (const key of keys) {
      if (!Array.isArray(obj[key]) && typeof obj[key] !== "number")
        continue;
      if (Array.isArray(obj[key])) {
        obj[key] = iframeMirror.getIds(iframeEl, obj[key]);
      } else {
        obj[key] = iframeMirror.getId(iframeEl, obj[key]);
      }
    }
    return obj;
  }
  replaceIds(obj, iframeEl, keys) {
    return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
  }
  replaceStyleIds(obj, iframeEl, keys) {
    return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
  }
  replaceIdOnNode(node, iframeEl) {
    this.replaceIds(node, iframeEl, ["id", "rootId"]);
    if ("childNodes" in node) {
      node.childNodes.forEach((child) => {
        this.replaceIdOnNode(child, iframeEl);
      });
    }
  }
  patchRootIdOnNode(node, rootId) {
    if (node.type !== NodeType$1.Document && !node.rootId)
      node.rootId = rootId;
    if ("childNodes" in node) {
      node.childNodes.forEach((child) => {
        this.patchRootIdOnNode(child, rootId);
      });
    }
  }
};
var ShadowDomManagerNoop = class {
  init() {
  }
  addShadowRoot() {
  }
  observeAttachShadow() {
  }
  reset() {
  }
};
var ShadowDomManager = class {
  constructor(options) {
    this.shadowDoms = /* @__PURE__ */ new WeakSet();
    this.restoreHandlers = [];
    this.mutationCb = options.mutationCb;
    this.scrollCb = options.scrollCb;
    this.bypassOptions = options.bypassOptions;
    this.mirror = options.mirror;
    this.init();
  }
  init() {
    this.reset();
    this.patchAttachShadow(Element, document);
  }
  addShadowRoot(shadowRoot, doc) {
    if (!isNativeShadowDom(shadowRoot))
      return;
    if (this.shadowDoms.has(shadowRoot))
      return;
    this.shadowDoms.add(shadowRoot);
    const observer = initMutationObserver(Object.assign(Object.assign({}, this.bypassOptions), { doc, mutationCb: this.mutationCb, mirror: this.mirror, shadowDomManager: this }), shadowRoot);
    this.restoreHandlers.push(() => observer.disconnect());
    this.restoreHandlers.push(initScrollObserver(Object.assign(Object.assign({}, this.bypassOptions), { scrollCb: this.scrollCb, doc: shadowRoot, mirror: this.mirror })));
    setTimeout(() => {
      if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0)
        this.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, this.mirror.getId(shadowRoot.host));
      this.restoreHandlers.push(initAdoptedStyleSheetObserver({
        mirror: this.mirror,
        stylesheetManager: this.bypassOptions.stylesheetManager
      }, shadowRoot));
    }, 0);
  }
  observeAttachShadow(iframeElement) {
    if (!iframeElement.contentWindow || !iframeElement.contentDocument)
      return;
    this.patchAttachShadow(iframeElement.contentWindow.Element, iframeElement.contentDocument);
  }
  patchAttachShadow(element, doc) {
    const manager = this;
    this.restoreHandlers.push(patch(element.prototype, "attachShadow", function(original) {
      return function(option) {
        const shadowRoot = original.call(this, option);
        if (this.shadowRoot && inDom(this))
          manager.addShadowRoot(this.shadowRoot, doc);
        return shadowRoot;
      };
    }));
  }
  reset() {
    this.restoreHandlers.forEach((handler) => {
      try {
        handler();
      } catch (e2) {
      }
    });
    this.restoreHandlers = [];
    this.shadowDoms = /* @__PURE__ */ new WeakSet();
  }
};
var CanvasManagerNoop = class {
  reset() {
  }
  freeze() {
  }
  unfreeze() {
  }
  lock() {
  }
  unlock() {
  }
};
var StylesheetManager = class {
  constructor(options) {
    this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
    this.styleMirror = new StyleSheetMirror();
    this.mutationCb = options.mutationCb;
    this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
  }
  attachLinkElement(linkEl, childSn) {
    if ("_cssText" in childSn.attributes)
      this.mutationCb({
        adds: [],
        removes: [],
        texts: [],
        attributes: [
          {
            id: childSn.id,
            attributes: childSn.attributes
          }
        ]
      });
    this.trackLinkElement(linkEl);
  }
  trackLinkElement(linkEl) {
    if (this.trackedLinkElements.has(linkEl))
      return;
    this.trackedLinkElements.add(linkEl);
    this.trackStylesheetInLinkElement(linkEl);
  }
  adoptStyleSheets(sheets, hostId) {
    if (sheets.length === 0)
      return;
    const adoptedStyleSheetData = {
      id: hostId,
      styleIds: []
    };
    const styles = [];
    for (const sheet of sheets) {
      let styleId;
      if (!this.styleMirror.has(sheet)) {
        styleId = this.styleMirror.add(sheet);
        styles.push({
          styleId,
          rules: Array.from(sheet.rules || CSSRule, (r2, index) => ({
            rule: stringifyRule(r2),
            index
          }))
        });
      } else
        styleId = this.styleMirror.getId(sheet);
      adoptedStyleSheetData.styleIds.push(styleId);
    }
    if (styles.length > 0)
      adoptedStyleSheetData.styles = styles;
    this.adoptedStyleSheetCb(adoptedStyleSheetData);
  }
  reset() {
    this.styleMirror.reset();
    this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
  }
  trackStylesheetInLinkElement(linkEl) {
  }
};
var ProcessedNodeManager = class {
  constructor() {
    this.nodeMap = /* @__PURE__ */ new WeakMap();
    this.loop = true;
    this.periodicallyClear();
  }
  periodicallyClear() {
    requestAnimationFrame(() => {
      this.clear();
      if (this.loop)
        this.periodicallyClear();
    });
  }
  inOtherBuffer(node, thisBuffer) {
    const buffers = this.nodeMap.get(node);
    return buffers && Array.from(buffers).some((buffer) => buffer !== thisBuffer);
  }
  add(node, buffer) {
    this.nodeMap.set(node, (this.nodeMap.get(node) || /* @__PURE__ */ new Set()).add(buffer));
  }
  clear() {
    this.nodeMap = /* @__PURE__ */ new WeakMap();
  }
  destroy() {
    this.loop = false;
  }
};
function wrapEvent(e2) {
  const eWithTime = e2;
  eWithTime.timestamp = nowTimestamp();
  return eWithTime;
}
var _takeFullSnapshot;
var mirror = createMirror();
function record(options = {}) {
  const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = "rr-block", blockSelector = null, unblockSelector = null, ignoreClass = "rr-ignore", ignoreSelector = null, maskAllText = false, maskTextClass = "rr-mask", unmaskTextClass = null, maskTextSelector = null, unmaskTextSelector = null, inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskAttributeFn, maskInputFn, maskTextFn, packFn, sampling = {}, dataURLOptions = {}, mousemoveWait, recordCanvas = false, recordCrossOriginIframes = false, recordAfter = options.recordAfter === "DOMContentLoaded" ? options.recordAfter : "load", userTriggeredOnInput = false, collectFonts = false, inlineImages = false, keepIframeSrcFn = () => false, ignoreCSSAttributes = /* @__PURE__ */ new Set([]), errorHandler: errorHandler2, onMutation, getCanvasManager } = options;
  registerErrorHandler(errorHandler2);
  const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
  let passEmitsToParent = false;
  if (!inEmittingFrame) {
    try {
      if (window.parent.document) {
        passEmitsToParent = false;
      }
    } catch (e2) {
      passEmitsToParent = true;
    }
  }
  if (inEmittingFrame && !emit) {
    throw new Error("emit function is required");
  }
  if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
    sampling.mousemove = mousemoveWait;
  }
  mirror.reset();
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    radio: true,
    checkbox: true
  } : _maskInputOptions !== void 0 ? _maskInputOptions : {};
  const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaVerification: true,
    headMetaAuthorship: _slimDOMOptions === "all",
    headMetaDescKeywords: _slimDOMOptions === "all"
  } : _slimDOMOptions ? _slimDOMOptions : {};
  polyfill();
  let lastFullSnapshotEvent;
  let incrementalSnapshotCount = 0;
  const eventProcessor = (e2) => {
    if (packFn && !passEmitsToParent) {
      e2 = packFn(e2);
    }
    return e2;
  };
  const wrappedEmit = (e2, isCheckout) => {
    var _a;
    if (((_a = mutationBuffers[0]) === null || _a === void 0 ? void 0 : _a.isFrozen()) && e2.type !== EventType.FullSnapshot && !(e2.type === EventType.IncrementalSnapshot && e2.data.source === IncrementalSource.Mutation)) {
      mutationBuffers.forEach((buf) => buf.unfreeze());
    }
    if (inEmittingFrame) {
      emit === null || emit === void 0 ? void 0 : emit(eventProcessor(e2), isCheckout);
    } else if (passEmitsToParent) {
      const message = {
        type: "rrweb",
        event: eventProcessor(e2),
        origin: window.location.origin,
        isCheckout
      };
      window.parent.postMessage(message, "*");
    }
    if (e2.type === EventType.FullSnapshot) {
      lastFullSnapshotEvent = e2;
      incrementalSnapshotCount = 0;
    } else if (e2.type === EventType.IncrementalSnapshot) {
      if (e2.data.source === IncrementalSource.Mutation && e2.data.isAttachIframe) {
        return;
      }
      incrementalSnapshotCount++;
      const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
      const exceedTime = checkoutEveryNms && e2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
      if (exceedCount || exceedTime) {
        takeFullSnapshot2(true);
      }
    }
  };
  const wrappedMutationEmit = (m) => {
    wrappedEmit(wrapEvent({
      type: EventType.IncrementalSnapshot,
      data: Object.assign({ source: IncrementalSource.Mutation }, m)
    }));
  };
  const wrappedScrollEmit = (p) => wrappedEmit(wrapEvent({
    type: EventType.IncrementalSnapshot,
    data: Object.assign({ source: IncrementalSource.Scroll }, p)
  }));
  const wrappedCanvasMutationEmit = (p) => wrappedEmit(wrapEvent({
    type: EventType.IncrementalSnapshot,
    data: Object.assign({ source: IncrementalSource.CanvasMutation }, p)
  }));
  const wrappedAdoptedStyleSheetEmit = (a) => wrappedEmit(wrapEvent({
    type: EventType.IncrementalSnapshot,
    data: Object.assign({ source: IncrementalSource.AdoptedStyleSheet }, a)
  }));
  const stylesheetManager = new StylesheetManager({
    mutationCb: wrappedMutationEmit,
    adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
  });
  const iframeManager = typeof __RRWEB_EXCLUDE_IFRAME__ === "boolean" && __RRWEB_EXCLUDE_IFRAME__ ? new IframeManagerNoop() : new IframeManager({
    mirror,
    mutationCb: wrappedMutationEmit,
    stylesheetManager,
    recordCrossOriginIframes,
    wrappedEmit
  });
  const processedNodeManager = new ProcessedNodeManager();
  const canvasManager = getCanvasManager ? getCanvasManager({
    recordCanvas,
    blockClass,
    blockSelector,
    unblockSelector,
    sampling: sampling["canvas"],
    dataURLOptions
  }) : new CanvasManagerNoop();
  const shadowDomManager = typeof __RRWEB_EXCLUDE_SHADOW_DOM__ === "boolean" && __RRWEB_EXCLUDE_SHADOW_DOM__ ? new ShadowDomManagerNoop() : new ShadowDomManager({
    mutationCb: wrappedMutationEmit,
    scrollCb: wrappedScrollEmit,
    bypassOptions: {
      onMutation,
      blockClass,
      blockSelector,
      unblockSelector,
      maskAllText,
      maskTextClass,
      unmaskTextClass,
      maskTextSelector,
      unmaskTextSelector,
      inlineStylesheet,
      maskInputOptions,
      dataURLOptions,
      maskAttributeFn,
      maskTextFn,
      maskInputFn,
      recordCanvas,
      inlineImages,
      sampling,
      slimDOMOptions,
      iframeManager,
      stylesheetManager,
      canvasManager,
      keepIframeSrcFn,
      processedNodeManager
    },
    mirror
  });
  const takeFullSnapshot2 = (isCheckout = false) => {
    wrappedEmit(wrapEvent({
      type: EventType.Meta,
      data: {
        href: window.location.href,
        width: getWindowWidth(),
        height: getWindowHeight()
      }
    }), isCheckout);
    stylesheetManager.reset();
    shadowDomManager.init();
    mutationBuffers.forEach((buf) => buf.lock());
    const node = snapshot(document, {
      mirror,
      blockClass,
      blockSelector,
      unblockSelector,
      maskAllText,
      maskTextClass,
      unmaskTextClass,
      maskTextSelector,
      unmaskTextSelector,
      inlineStylesheet,
      maskAllInputs: maskInputOptions,
      maskAttributeFn,
      maskInputFn,
      maskTextFn,
      slimDOM: slimDOMOptions,
      dataURLOptions,
      recordCanvas,
      inlineImages,
      onSerialize: (n) => {
        if (isSerializedIframe(n, mirror)) {
          iframeManager.addIframe(n);
        }
        if (isSerializedStylesheet(n, mirror)) {
          stylesheetManager.trackLinkElement(n);
        }
        if (hasShadowRoot(n)) {
          shadowDomManager.addShadowRoot(n.shadowRoot, document);
        }
      },
      onIframeLoad: (iframe, childSn) => {
        iframeManager.attachIframe(iframe, childSn);
        shadowDomManager.observeAttachShadow(iframe);
      },
      onStylesheetLoad: (linkEl, childSn) => {
        stylesheetManager.attachLinkElement(linkEl, childSn);
      },
      keepIframeSrcFn
    });
    if (!node) {
      return console.warn("Failed to snapshot the document");
    }
    wrappedEmit(wrapEvent({
      type: EventType.FullSnapshot,
      data: {
        node,
        initialOffset: getWindowScroll(window)
      }
    }), isCheckout);
    mutationBuffers.forEach((buf) => buf.unlock());
    if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
      stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
  };
  _takeFullSnapshot = takeFullSnapshot2;
  try {
    const handlers4 = [];
    const observe2 = (doc) => {
      return callbackWrapper(initObservers)({
        onMutation,
        mutationCb: wrappedMutationEmit,
        mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: {
            source,
            positions
          }
        })),
        mouseInteractionCb: (d) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.MouseInteraction }, d)
        })),
        scrollCb: wrappedScrollEmit,
        viewportResizeCb: (d) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.ViewportResize }, d)
        })),
        inputCb: (v) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.Input }, v)
        })),
        mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.MediaInteraction }, p)
        })),
        styleSheetRuleCb: (r2) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.StyleSheetRule }, r2)
        })),
        styleDeclarationCb: (r2) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.StyleDeclaration }, r2)
        })),
        canvasMutationCb: wrappedCanvasMutationEmit,
        fontCb: (p) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.Font }, p)
        })),
        selectionCb: (p) => {
          wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.Selection }, p)
          }));
        },
        customElementCb: (c) => {
          wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.CustomElement }, c)
          }));
        },
        blockClass,
        ignoreClass,
        ignoreSelector,
        maskAllText,
        maskTextClass,
        unmaskTextClass,
        maskTextSelector,
        unmaskTextSelector,
        maskInputOptions,
        inlineStylesheet,
        sampling,
        recordCanvas,
        inlineImages,
        userTriggeredOnInput,
        collectFonts,
        doc,
        maskAttributeFn,
        maskInputFn,
        maskTextFn,
        keepIframeSrcFn,
        blockSelector,
        unblockSelector,
        slimDOMOptions,
        dataURLOptions,
        mirror,
        iframeManager,
        stylesheetManager,
        shadowDomManager,
        processedNodeManager,
        canvasManager,
        ignoreCSSAttributes,
        plugins: []
      }, {});
    };
    iframeManager.addLoadListener((iframeEl) => {
      try {
        handlers4.push(observe2(iframeEl.contentDocument));
      } catch (error) {
        console.warn(error);
      }
    });
    const init4 = () => {
      takeFullSnapshot2();
      handlers4.push(observe2(document));
    };
    if (document.readyState === "interactive" || document.readyState === "complete") {
      init4();
    } else {
      handlers4.push(on("DOMContentLoaded", () => {
        wrappedEmit(wrapEvent({
          type: EventType.DomContentLoaded,
          data: {}
        }));
        if (recordAfter === "DOMContentLoaded")
          init4();
      }));
      handlers4.push(on("load", () => {
        wrappedEmit(wrapEvent({
          type: EventType.Load,
          data: {}
        }));
        if (recordAfter === "load")
          init4();
      }, window));
    }
    return () => {
      handlers4.forEach((h) => h());
      processedNodeManager.destroy();
      _takeFullSnapshot = void 0;
      unregisterErrorHandler();
    };
  } catch (error) {
    console.warn(error);
  }
}
function takeFullSnapshot(isCheckout) {
  if (!_takeFullSnapshot) {
    throw new Error("please take full snapshot after start recording");
  }
  _takeFullSnapshot(isCheckout);
}
record.mirror = mirror;
record.takeFullSnapshot = takeFullSnapshot;
var ReplayEventTypeIncrementalSnapshot = 3;
var ReplayEventTypeCustom = 5;
function timestampToMs(timestamp) {
  const isMs = timestamp > 9999999999;
  return isMs ? timestamp : timestamp * 1e3;
}
function timestampToS(timestamp) {
  const isMs = timestamp > 9999999999;
  return isMs ? timestamp / 1e3 : timestamp;
}
function addBreadcrumbEvent(replay, breadcrumb) {
  if (breadcrumb.category === "sentry.transaction") {
    return;
  }
  if (["ui.click", "ui.input"].includes(breadcrumb.category)) {
    replay.triggerUserActivity();
  } else {
    replay.checkAndHandleExpiredSession();
  }
  replay.addUpdate(() => {
    void replay.throttledAddEvent({
      type: EventType.Custom,
      // TODO: We were converting from ms to seconds for breadcrumbs, spans,
      // but maybe we should just keep them as milliseconds
      timestamp: (breadcrumb.timestamp || 0) * 1e3,
      data: {
        tag: "breadcrumb",
        // normalize to max. 10 depth and 1_000 properties per object
        payload: normalize(breadcrumb, 10, 1e3)
      }
    });
    return breadcrumb.category === "console";
  });
}
var INTERACTIVE_SELECTOR = "button,a";
function getClosestInteractive(element) {
  const closestInteractive = element.closest(INTERACTIVE_SELECTOR);
  return closestInteractive || element;
}
function getClickTargetNode(event) {
  const target = getTargetNode(event);
  if (!target || !(target instanceof Element)) {
    return target;
  }
  return getClosestInteractive(target);
}
function getTargetNode(event) {
  if (isEventWithTarget(event)) {
    return event.target;
  }
  return event;
}
function isEventWithTarget(event) {
  return typeof event === "object" && !!event && "target" in event;
}
var handlers3;
function onWindowOpen(cb) {
  if (!handlers3) {
    handlers3 = [];
    monkeyPatchWindowOpen();
  }
  handlers3.push(cb);
  return () => {
    const pos = handlers3 ? handlers3.indexOf(cb) : -1;
    if (pos > -1) {
      handlers3.splice(pos, 1);
    }
  };
}
function monkeyPatchWindowOpen() {
  fill(WINDOW9, "open", function(originalWindowOpen) {
    return function(...args) {
      if (handlers3) {
        try {
          handlers3.forEach((handler) => handler());
        } catch (e2) {
        }
      }
      return originalWindowOpen.apply(WINDOW9, args);
    };
  });
}
function handleClick(clickDetector, clickBreadcrumb, node) {
  clickDetector.handleClick(clickBreadcrumb, node);
}
var ClickDetector = class {
  // protected for testing
  constructor(replay, slowClickConfig, _addBreadcrumbEvent = addBreadcrumbEvent) {
    this._lastMutation = 0;
    this._lastScroll = 0;
    this._clicks = [];
    this._timeout = slowClickConfig.timeout / 1e3;
    this._threshold = slowClickConfig.threshold / 1e3;
    this._scollTimeout = slowClickConfig.scrollTimeout / 1e3;
    this._replay = replay;
    this._ignoreSelector = slowClickConfig.ignoreSelector;
    this._addBreadcrumbEvent = _addBreadcrumbEvent;
  }
  /** Register click detection handlers on mutation or scroll. */
  addListeners() {
    const cleanupWindowOpen = onWindowOpen(() => {
      this._lastMutation = nowInSeconds();
    });
    this._teardown = () => {
      cleanupWindowOpen();
      this._clicks = [];
      this._lastMutation = 0;
      this._lastScroll = 0;
    };
  }
  /** Clean up listeners. */
  removeListeners() {
    if (this._teardown) {
      this._teardown();
    }
    if (this._checkClickTimeout) {
      clearTimeout(this._checkClickTimeout);
    }
  }
  /** @inheritDoc */
  handleClick(breadcrumb, node) {
    if (ignoreElement(node, this._ignoreSelector) || !isClickBreadcrumb(breadcrumb)) {
      return;
    }
    const newClick = {
      timestamp: timestampToS(breadcrumb.timestamp),
      clickBreadcrumb: breadcrumb,
      // Set this to 0 so we know it originates from the click breadcrumb
      clickCount: 0,
      node
    };
    if (this._clicks.some((click) => click.node === newClick.node && Math.abs(click.timestamp - newClick.timestamp) < 1)) {
      return;
    }
    this._clicks.push(newClick);
    if (this._clicks.length === 1) {
      this._scheduleCheckClicks();
    }
  }
  /** @inheritDoc */
  registerMutation(timestamp = Date.now()) {
    this._lastMutation = timestampToS(timestamp);
  }
  /** @inheritDoc */
  registerScroll(timestamp = Date.now()) {
    this._lastScroll = timestampToS(timestamp);
  }
  /** @inheritDoc */
  registerClick(element) {
    const node = getClosestInteractive(element);
    this._handleMultiClick(node);
  }
  /** Count multiple clicks on elements. */
  _handleMultiClick(node) {
    this._getClicks(node).forEach((click) => {
      click.clickCount++;
    });
  }
  /** Get all pending clicks for a given node. */
  _getClicks(node) {
    return this._clicks.filter((click) => click.node === node);
  }
  /** Check the clicks that happened. */
  _checkClicks() {
    const timedOutClicks = [];
    const now = nowInSeconds();
    this._clicks.forEach((click) => {
      if (!click.mutationAfter && this._lastMutation) {
        click.mutationAfter = click.timestamp <= this._lastMutation ? this._lastMutation - click.timestamp : void 0;
      }
      if (!click.scrollAfter && this._lastScroll) {
        click.scrollAfter = click.timestamp <= this._lastScroll ? this._lastScroll - click.timestamp : void 0;
      }
      if (click.timestamp + this._timeout <= now) {
        timedOutClicks.push(click);
      }
    });
    for (const click of timedOutClicks) {
      const pos = this._clicks.indexOf(click);
      if (pos > -1) {
        this._generateBreadcrumbs(click);
        this._clicks.splice(pos, 1);
      }
    }
    if (this._clicks.length) {
      this._scheduleCheckClicks();
    }
  }
  /** Generate matching breadcrumb(s) for the click. */
  _generateBreadcrumbs(click) {
    const replay = this._replay;
    const hadScroll = click.scrollAfter && click.scrollAfter <= this._scollTimeout;
    const hadMutation = click.mutationAfter && click.mutationAfter <= this._threshold;
    const isSlowClick = !hadScroll && !hadMutation;
    const { clickCount, clickBreadcrumb } = click;
    if (isSlowClick) {
      const timeAfterClickMs = Math.min(click.mutationAfter || this._timeout, this._timeout) * 1e3;
      const endReason = timeAfterClickMs < this._timeout * 1e3 ? "mutation" : "timeout";
      const breadcrumb = {
        type: "default",
        message: clickBreadcrumb.message,
        timestamp: clickBreadcrumb.timestamp,
        category: "ui.slowClickDetected",
        data: {
          ...clickBreadcrumb.data,
          url: WINDOW9.location.href,
          route: replay.getCurrentRoute(),
          timeAfterClickMs,
          endReason,
          // If clickCount === 0, it means multiClick was not correctly captured here
          // - we still want to send 1 in this case
          clickCount: clickCount || 1
        }
      };
      this._addBreadcrumbEvent(replay, breadcrumb);
      return;
    }
    if (clickCount > 1) {
      const breadcrumb = {
        type: "default",
        message: clickBreadcrumb.message,
        timestamp: clickBreadcrumb.timestamp,
        category: "ui.multiClick",
        data: {
          ...clickBreadcrumb.data,
          url: WINDOW9.location.href,
          route: replay.getCurrentRoute(),
          clickCount,
          metric: true
        }
      };
      this._addBreadcrumbEvent(replay, breadcrumb);
    }
  }
  /** Schedule to check current clicks. */
  _scheduleCheckClicks() {
    if (this._checkClickTimeout) {
      clearTimeout(this._checkClickTimeout);
    }
    this._checkClickTimeout = setTimeout(() => this._checkClicks(), 1e3);
  }
};
var SLOW_CLICK_TAGS = ["A", "BUTTON", "INPUT"];
function ignoreElement(node, ignoreSelector) {
  if (!SLOW_CLICK_TAGS.includes(node.tagName)) {
    return true;
  }
  if (node.tagName === "INPUT" && !["submit", "button"].includes(node.getAttribute("type") || "")) {
    return true;
  }
  if (node.tagName === "A" && (node.hasAttribute("download") || node.hasAttribute("target") && node.getAttribute("target") !== "_self")) {
    return true;
  }
  if (ignoreSelector && node.matches(ignoreSelector)) {
    return true;
  }
  return false;
}
function isClickBreadcrumb(breadcrumb) {
  return !!(breadcrumb.data && typeof breadcrumb.data.nodeId === "number" && breadcrumb.timestamp);
}
function nowInSeconds() {
  return Date.now() / 1e3;
}
function updateClickDetectorForRecordingEvent(clickDetector, event) {
  try {
    if (!isIncrementalEvent(event)) {
      return;
    }
    const { source } = event.data;
    if (source === IncrementalSource.Mutation) {
      clickDetector.registerMutation(event.timestamp);
    }
    if (source === IncrementalSource.Scroll) {
      clickDetector.registerScroll(event.timestamp);
    }
    if (isIncrementalMouseInteraction(event)) {
      const { type, id } = event.data;
      const node = record.mirror.getNode(id);
      if (node instanceof HTMLElement && type === MouseInteractions.Click) {
        clickDetector.registerClick(node);
      }
    }
  } catch (e2) {
  }
}
function isIncrementalEvent(event) {
  return event.type === ReplayEventTypeIncrementalSnapshot;
}
function isIncrementalMouseInteraction(event) {
  return event.data.source === IncrementalSource.MouseInteraction;
}
function createBreadcrumb(breadcrumb) {
  return {
    timestamp: Date.now() / 1e3,
    type: "default",
    ...breadcrumb
  };
}
var NodeType;
(function(NodeType2) {
  NodeType2[NodeType2["Document"] = 0] = "Document";
  NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
  NodeType2[NodeType2["Element"] = 2] = "Element";
  NodeType2[NodeType2["Text"] = 3] = "Text";
  NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
  NodeType2[NodeType2["Comment"] = 5] = "Comment";
})(NodeType || (NodeType = {}));
var ATTRIBUTES_TO_RECORD = /* @__PURE__ */ new Set(
  [
    "id",
    "class",
    "aria-label",
    "role",
    "name",
    "alt",
    "title",
    "data-test-id",
    "data-testid",
    "disabled",
    "aria-disabled"
  ]
);
function getAttributesToRecord(attributes) {
  const obj = {};
  for (const key in attributes) {
    if (ATTRIBUTES_TO_RECORD.has(key)) {
      let normalizedKey = key;
      if (key === "data-testid" || key === "data-test-id") {
        normalizedKey = "testId";
      }
      obj[normalizedKey] = attributes[key];
    }
  }
  return obj;
}
var handleDomListener = (replay) => {
  return (handlerData) => {
    if (!replay.isEnabled()) {
      return;
    }
    const result = handleDom(handlerData);
    if (!result) {
      return;
    }
    const isClick = handlerData.name === "click";
    const event = isClick ? handlerData.event : void 0;
    if (isClick && replay.clickDetector && event && event.target && !event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      handleClick(
        replay.clickDetector,
        result,
        getClickTargetNode(handlerData.event)
      );
    }
    addBreadcrumbEvent(replay, result);
  };
};
function getBaseDomBreadcrumb(target, message) {
  const nodeId = record.mirror.getId(target);
  const node = nodeId && record.mirror.getNode(nodeId);
  const meta = node && record.mirror.getMeta(node);
  const element = meta && isElement2(meta) ? meta : null;
  return {
    message,
    data: element ? {
      nodeId,
      node: {
        id: nodeId,
        tagName: element.tagName,
        textContent: Array.from(element.childNodes).map((node2) => node2.type === NodeType.Text && node2.textContent).filter(Boolean).map((text) => text.trim()).join(""),
        attributes: getAttributesToRecord(element.attributes)
      }
    } : {}
  };
}
function handleDom(handlerData) {
  const { target, message } = getDomTarget(handlerData);
  return createBreadcrumb({
    category: `ui.${handlerData.name}`,
    ...getBaseDomBreadcrumb(target, message)
  });
}
function getDomTarget(handlerData) {
  const isClick = handlerData.name === "click";
  let message;
  let target = null;
  try {
    target = isClick ? getClickTargetNode(handlerData.event) : getTargetNode(handlerData.event);
    message = htmlTreeAsString(target, { maxStringLength: 200 }) || "<unknown>";
  } catch (e2) {
    message = "<unknown>";
  }
  return { target, message };
}
function isElement2(node) {
  return node.type === NodeType.Element;
}
function handleKeyboardEvent(replay, event) {
  if (!replay.isEnabled()) {
    return;
  }
  replay.updateUserActivity();
  const breadcrumb = getKeyboardBreadcrumb(event);
  if (!breadcrumb) {
    return;
  }
  addBreadcrumbEvent(replay, breadcrumb);
}
function getKeyboardBreadcrumb(event) {
  const { metaKey, shiftKey, ctrlKey, altKey, key, target } = event;
  if (!target || isInputElement(target) || !key) {
    return null;
  }
  const hasModifierKey = metaKey || ctrlKey || altKey;
  const isCharacterKey = key.length === 1;
  if (!hasModifierKey && isCharacterKey) {
    return null;
  }
  const message = htmlTreeAsString(target, { maxStringLength: 200 }) || "<unknown>";
  const baseBreadcrumb = getBaseDomBreadcrumb(target, message);
  return createBreadcrumb({
    category: "ui.keyDown",
    message,
    data: {
      ...baseBreadcrumb.data,
      metaKey,
      shiftKey,
      ctrlKey,
      altKey,
      key
    }
  });
}
function isInputElement(target) {
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}
var ENTRY_TYPES = {
  // @ts-expect-error TODO: entry type does not fit the create* functions entry type
  resource: createResourceEntry,
  paint: createPaintEntry,
  // @ts-expect-error TODO: entry type does not fit the create* functions entry type
  navigation: createNavigationEntry
};
function createPerformanceEntries(entries) {
  return entries.map(createPerformanceEntry).filter(Boolean);
}
function createPerformanceEntry(entry) {
  if (!ENTRY_TYPES[entry.entryType]) {
    return null;
  }
  return ENTRY_TYPES[entry.entryType](entry);
}
function getAbsoluteTime2(time) {
  return ((browserPerformanceTimeOrigin || WINDOW9.performance.timeOrigin) + time) / 1e3;
}
function createPaintEntry(entry) {
  const { duration, entryType, name, startTime } = entry;
  const start = getAbsoluteTime2(startTime);
  return {
    type: entryType,
    name,
    start,
    end: start + duration,
    data: void 0
  };
}
function createNavigationEntry(entry) {
  const {
    entryType,
    name,
    decodedBodySize,
    duration,
    domComplete,
    encodedBodySize,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    domInteractive,
    loadEventStart,
    loadEventEnd,
    redirectCount,
    startTime,
    transferSize,
    type
  } = entry;
  if (duration === 0) {
    return null;
  }
  return {
    type: `${entryType}.${type}`,
    start: getAbsoluteTime2(startTime),
    end: getAbsoluteTime2(domComplete),
    name,
    data: {
      size: transferSize,
      decodedBodySize,
      encodedBodySize,
      duration,
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      loadEventStart,
      loadEventEnd,
      domComplete,
      redirectCount
    }
  };
}
function createResourceEntry(entry) {
  const {
    entryType,
    initiatorType,
    name,
    responseEnd,
    startTime,
    decodedBodySize,
    encodedBodySize,
    responseStatus,
    transferSize
  } = entry;
  if (["fetch", "xmlhttprequest"].includes(initiatorType)) {
    return null;
  }
  return {
    type: `${entryType}.${initiatorType}`,
    start: getAbsoluteTime2(startTime),
    end: getAbsoluteTime2(responseEnd),
    name,
    data: {
      size: transferSize,
      statusCode: responseStatus,
      decodedBodySize,
      encodedBodySize
    }
  };
}
function getLargestContentfulPaint(metric) {
  const entries = metric.entries;
  const lastEntry = entries[entries.length - 1];
  const element = lastEntry ? lastEntry.element : void 0;
  const value = metric.value;
  const end = getAbsoluteTime2(value);
  const data = {
    type: "largest-contentful-paint",
    name: "largest-contentful-paint",
    start: end,
    end,
    data: {
      value,
      size: value,
      nodeId: element ? record.mirror.getId(element) : void 0
    }
  };
  return data;
}
function setupPerformanceObserver(replay) {
  function addPerformanceEntry(entry) {
    if (!replay.performanceEntries.includes(entry)) {
      replay.performanceEntries.push(entry);
    }
  }
  function onEntries({ entries }) {
    entries.forEach(addPerformanceEntry);
  }
  const clearCallbacks = [];
  ["navigation", "paint", "resource"].forEach((type) => {
    clearCallbacks.push(addPerformanceInstrumentationHandler(type, onEntries));
  });
  clearCallbacks.push(
    addLcpInstrumentationHandler(({ metric }) => {
      replay.replayPerformanceEntries.push(getLargestContentfulPaint(metric));
    })
  );
  return () => {
    clearCallbacks.forEach((clearCallback) => clearCallback());
  };
}
var DEBUG_BUILD4 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
var r = `var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),a=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=function(t,e){for(var i=new n(31),a=0;a<31;++a)i[a]=e+=1<<t[a-1];var s=new r(i[30]);for(a=1;a<30;++a)for(var o=i[a];o<i[a+1];++o)s[o]=o-i[a]<<5|a;return{b:i,r:s}},o=s(e,2),f=o.b,h=o.r;f[28]=258,h[258]=28;for(var l=s(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,a=0,s=new n(r);a<i;++a)t[a]&&++s[t[a]-1];var o,f=new n(r);for(a=1;a<r;++a)f[a]=f[a-1]+s[a-1]<<1;if(e){o=new n(1<<r);var h=15-r;for(a=0;a<i;++a)if(t[a])for(var l=a<<4|t[a],c=r-t[a],v=f[t[a]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>h]=l}else for(o=new n(i),a=0;a<i;++a)t[a]&&(o[a]=u[f[t[a]-1]++]>>15-t[a]);return o},g=new t(288);for(c=0;c<144;++c)g[c]=8;for(c=144;c<256;++c)g[c]=9;for(c=256;c<280;++c)g[c]=7;for(c=280;c<288;++c)g[c]=8;var w=new t(32);for(c=0;c<32;++c)w[c]=5;var p=d(g,9,0),y=d(w,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==r||r<0)&&(r=0),(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},A=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},_=function(r,e){for(var i=[],a=0;a<r.length;++a)r[a]&&i.push({s:a,f:r[a]});var s=i.length,o=i.slice();if(!s)return{t:F,l:0};if(1==s){var f=new t(i[0].s+1);return f[i[0].s]=1,{t:f,l:1}}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var h=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:h.f+l.f,l:h,r:l};c!=s-1;)h=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:h.f+l.f,l:h,r:l};var d=o[0].s;for(a=1;a<s;++a)o[a].s>d&&(d=o[a].s);var g=new n(d+1),w=x(i[c-1],g,0);if(w>e){a=0;var p=0,y=w-e,m=1<<y;for(o.sort((function(t,n){return g[n.s]-g[t.s]||t.f-n.f}));a<s;++a){var b=o[a].s;if(!(g[b]>e))break;p+=m-(1<<w-g[b]),g[b]=e}for(p>>=y;p>0;){var M=o[a].s;g[M]<e?p-=1<<e-g[M]++-1:++a}for(;a>=0&&p;--a){var E=o[a].s;g[E]==e&&(--g[E],++p)}w=e}return{t:new t(g),l:w}},x=function(t,n,r){return-1==t.s?Math.max(x(t.l,n,r+1),x(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,a=t[0],s=1,o=function(t){e[i++]=t},f=1;f<=r;++f)if(t[f]==a&&f!=r)++s;else{if(!a&&s>2){for(;s>138;s-=138)o(32754);s>2&&(o(s>10?s-11<<5|28690:s-3<<5|12305),s=0)}else if(s>3){for(o(a),--s;s>6;s-=6)o(8304);s>2&&(o(s-3<<5|8208),s=0)}for(;s--;)o(a);s=1,a=t[f]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var a=0;a<e;++a)t[i+a+4]=r[a];return 8*(i+4+e)},C=function(t,r,s,o,f,h,l,u,c,v,m){z(r,m++,s),++f[256];for(var b=_(f,15),M=b.t,E=b.l,x=_(h,15),C=x.t,U=x.l,F=D(M),I=F.c,S=F.n,L=D(C),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=_(q,7),H=G.t,J=G.l,K=19;K>4&&!H[a[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(f,g)+T(h,w)+l,X=T(f,M)+T(h,C)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(C,U,0),R=C;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[a[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=p,P=g,Q=y,R=w;for(B=0;B<u;++B){var rt=o[B];if(rt>255){A(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;A(r,m,Q[et]),m+=R[et],et>3&&(A(r,m,rt>>5&8191),m+=i[et])}else A(r,m,N[rt]),m+=P[rt]}return A(r,m,N[256]),m+P[256]},U=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,a=0|r.length,s=0;s!=a;){for(var o=Math.min(s+2655,a);s<o;++s)i+=e+=r[s];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(a,s,o,f,u){if(!u&&(u={l:1},s.dictionary)){var c=s.dictionary.subarray(-32768),v=new t(c.length+a.length);v.set(c),v.set(a,c.length),a=v,u.w=c.length}return function(a,s,o,f,u,c){var v=c.z||a.length,d=new t(f+v+5*(1+Math.ceil(v/7e3))+u),g=d.subarray(f,d.length-u),w=c.l,p=7&(c.r||0);if(s){p&&(g[0]=c.r>>3);for(var y=U[s-1],M=y>>13,E=8191&y,z=(1<<o)-1,A=c.p||new n(32768),_=c.h||new n(z+1),x=Math.ceil(o/3),D=2*x,T=function(t){return(a[t]^a[t+1]<<x^a[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=_[H];if(A[J]=K,_[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!w)){p=C(a,g,0,F,I,S,O,q,G,j-G,p),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(a[j+Q]==a[j+Q-W]){for(var $=0;$<Z&&a[j+$]==a[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-A[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=A[J])&32767}if(R){F[q++]=268435456|h[Q]<<18|l[R];var it=31&h[Q],at=31&l[R];O+=e[it]+i[at],++I[257+it],++S[at],B=j+Q,++L}else F[q++]=a[j],++I[a[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=a[j],++I[a[j]];p=C(a,g,w,F,I,S,O,q,G,j-G,p),w||(c.r=7&p|g[p/8|0]<<3,p-=7,c.h=_,c.p=A,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+w;j+=65535){var st=j+65535;st>=v&&(g[p/8|0]=w,st=v),p=k(g,p+1,a.subarray(j,st))}c.i=v}return b(d,0,f+m(p)+u)}(a,null==s.level?6:s.level,null==s.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(a.length)))):12+s.mem,o,f,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var a=this.b.length-this.s.z;a&&(this.b.set(n.subarray(0,a),this.s.z),this.s.z=this.b.length,this.p(this.b,!1)),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(a),32768),this.s.z=n.length-a+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,a=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),s=a.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(a,n),O(a,s-8,r.d()),O(a,s-4,e),a}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(r){for(var e=new t(n.length),i=0;i<n.length;++i)e[i]=n.charCodeAt(i);return e}if(G)return G.encode(n);var a=n.length,s=new t(n.length+(n.length>>1)),o=0,f=function(t){s[o++]=t};for(i=0;i<a;++i){if(o+5>s.length){var h=new t(o+8+(a-i<<1));h.set(s),s=h}var l=n.charCodeAt(i);l<128||r?f(l):l<2048?(f(192|l>>6),f(128|63&l)):l>55295&&l<57344?(f(240|(l=65536+(1047552&l)|1023&n.charCodeAt(++i))>>18),f(128|l>>12&63),f(128|l>>6&63),f(128|63&l)):(f(224|l>>12),f(128|l>>6&63),f(128|63&l))}return b(s,0,o)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(let r=0,e=t.length;r<e;r++)n+=t[r].length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J(((t,n)=>{this.deflate.push(t,n)})),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",(function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}})),postMessage({id:void 0,method:"init",success:!0,response:void 0});`;
function e() {
  const e2 = new Blob([r]);
  return URL.createObjectURL(e2);
}
function logInfo(message, shouldAddBreadcrumb) {
  if (!DEBUG_BUILD4) {
    return;
  }
  logger.info(message);
  if (shouldAddBreadcrumb) {
    addBreadcrumb2(message);
  }
}
function logInfoNextTick(message, shouldAddBreadcrumb) {
  if (!DEBUG_BUILD4) {
    return;
  }
  logger.info(message);
  if (shouldAddBreadcrumb) {
    setTimeout(() => {
      addBreadcrumb2(message);
    }, 0);
  }
}
function addBreadcrumb2(message) {
  const hub = getCurrentHub();
  hub.addBreadcrumb(
    {
      category: "console",
      data: {
        logger: "replay"
      },
      level: "info",
      message
    },
    { level: "info" }
  );
}
var EventBufferSizeExceededError = class extends Error {
  constructor() {
    super(`Event buffer exceeded maximum size of ${REPLAY_MAX_EVENT_BUFFER_SIZE}.`);
  }
};
var EventBufferArray = class {
  /** All the events that are buffered to be sent. */
  /** @inheritdoc */
  constructor() {
    this.events = [];
    this._totalSize = 0;
    this.hasCheckout = false;
  }
  /** @inheritdoc */
  get hasEvents() {
    return this.events.length > 0;
  }
  /** @inheritdoc */
  get type() {
    return "sync";
  }
  /** @inheritdoc */
  destroy() {
    this.events = [];
  }
  /** @inheritdoc */
  async addEvent(event) {
    const eventSize = JSON.stringify(event).length;
    this._totalSize += eventSize;
    if (this._totalSize > REPLAY_MAX_EVENT_BUFFER_SIZE) {
      throw new EventBufferSizeExceededError();
    }
    this.events.push(event);
  }
  /** @inheritdoc */
  finish() {
    return new Promise((resolve) => {
      const eventsRet = this.events;
      this.clear();
      resolve(JSON.stringify(eventsRet));
    });
  }
  /** @inheritdoc */
  clear() {
    this.events = [];
    this._totalSize = 0;
    this.hasCheckout = false;
  }
  /** @inheritdoc */
  getEarliestTimestamp() {
    const timestamp = this.events.map((event) => event.timestamp).sort()[0];
    if (!timestamp) {
      return null;
    }
    return timestampToMs(timestamp);
  }
};
var WorkerHandler = class {
  constructor(worker) {
    this._worker = worker;
    this._id = 0;
  }
  /**
   * Ensure the worker is ready (or not).
   * This will either resolve when the worker is ready, or reject if an error occured.
   */
  ensureReady() {
    if (this._ensureReadyPromise) {
      return this._ensureReadyPromise;
    }
    this._ensureReadyPromise = new Promise((resolve, reject) => {
      this._worker.addEventListener(
        "message",
        ({ data }) => {
          if (data.success) {
            resolve();
          } else {
            reject();
          }
        },
        { once: true }
      );
      this._worker.addEventListener(
        "error",
        (error) => {
          reject(error);
        },
        { once: true }
      );
    });
    return this._ensureReadyPromise;
  }
  /**
   * Destroy the worker.
   */
  destroy() {
    logInfo("[Replay] Destroying compression worker");
    this._worker.terminate();
  }
  /**
   * Post message to worker and wait for response before resolving promise.
   */
  postMessage(method, arg) {
    const id = this._getAndIncrementId();
    return new Promise((resolve, reject) => {
      const listener = ({ data }) => {
        const response = data;
        if (response.method !== method) {
          return;
        }
        if (response.id !== id) {
          return;
        }
        this._worker.removeEventListener("message", listener);
        if (!response.success) {
          DEBUG_BUILD4 && logger.error("[Replay]", response.response);
          reject(new Error("Error in compression worker"));
          return;
        }
        resolve(response.response);
      };
      this._worker.addEventListener("message", listener);
      this._worker.postMessage({ id, method, arg });
    });
  }
  /** Get the current ID and increment it for the next call. */
  _getAndIncrementId() {
    return this._id++;
  }
};
var EventBufferCompressionWorker = class {
  /** @inheritdoc */
  constructor(worker) {
    this._worker = new WorkerHandler(worker);
    this._earliestTimestamp = null;
    this._totalSize = 0;
    this.hasCheckout = false;
  }
  /** @inheritdoc */
  get hasEvents() {
    return !!this._earliestTimestamp;
  }
  /** @inheritdoc */
  get type() {
    return "worker";
  }
  /**
   * Ensure the worker is ready (or not).
   * This will either resolve when the worker is ready, or reject if an error occured.
   */
  ensureReady() {
    return this._worker.ensureReady();
  }
  /**
   * Destroy the event buffer.
   */
  destroy() {
    this._worker.destroy();
  }
  /**
   * Add an event to the event buffer.
   *
   * Returns true if event was successfuly received and processed by worker.
   */
  addEvent(event) {
    const timestamp = timestampToMs(event.timestamp);
    if (!this._earliestTimestamp || timestamp < this._earliestTimestamp) {
      this._earliestTimestamp = timestamp;
    }
    const data = JSON.stringify(event);
    this._totalSize += data.length;
    if (this._totalSize > REPLAY_MAX_EVENT_BUFFER_SIZE) {
      return Promise.reject(new EventBufferSizeExceededError());
    }
    return this._sendEventToWorker(data);
  }
  /**
   * Finish the event buffer and return the compressed data.
   */
  finish() {
    return this._finishRequest();
  }
  /** @inheritdoc */
  clear() {
    this._earliestTimestamp = null;
    this._totalSize = 0;
    this.hasCheckout = false;
    void this._worker.postMessage("clear");
  }
  /** @inheritdoc */
  getEarliestTimestamp() {
    return this._earliestTimestamp;
  }
  /**
   * Send the event to the worker.
   */
  _sendEventToWorker(data) {
    return this._worker.postMessage("addEvent", data);
  }
  /**
   * Finish the request and return the compressed data from the worker.
   */
  async _finishRequest() {
    const response = await this._worker.postMessage("finish");
    this._earliestTimestamp = null;
    this._totalSize = 0;
    return response;
  }
};
var EventBufferProxy = class {
  constructor(worker) {
    this._fallback = new EventBufferArray();
    this._compression = new EventBufferCompressionWorker(worker);
    this._used = this._fallback;
    this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded();
  }
  /** @inheritdoc */
  get type() {
    return this._used.type;
  }
  /** @inheritDoc */
  get hasEvents() {
    return this._used.hasEvents;
  }
  /** @inheritdoc */
  get hasCheckout() {
    return this._used.hasCheckout;
  }
  /** @inheritdoc */
  set hasCheckout(value) {
    this._used.hasCheckout = value;
  }
  /** @inheritDoc */
  destroy() {
    this._fallback.destroy();
    this._compression.destroy();
  }
  /** @inheritdoc */
  clear() {
    return this._used.clear();
  }
  /** @inheritdoc */
  getEarliestTimestamp() {
    return this._used.getEarliestTimestamp();
  }
  /**
   * Add an event to the event buffer.
   *
   * Returns true if event was successfully added.
   */
  addEvent(event) {
    return this._used.addEvent(event);
  }
  /** @inheritDoc */
  async finish() {
    await this.ensureWorkerIsLoaded();
    return this._used.finish();
  }
  /** Ensure the worker has loaded. */
  ensureWorkerIsLoaded() {
    return this._ensureWorkerIsLoadedPromise;
  }
  /** Actually check if the worker has been loaded. */
  async _ensureWorkerIsLoaded() {
    try {
      await this._compression.ensureReady();
    } catch (error) {
      logInfo("[Replay] Failed to load the compression worker, falling back to simple buffer");
      return;
    }
    await this._switchToCompressionWorker();
  }
  /** Switch the used buffer to the compression worker. */
  async _switchToCompressionWorker() {
    const { events, hasCheckout } = this._fallback;
    const addEventPromises = [];
    for (const event of events) {
      addEventPromises.push(this._compression.addEvent(event));
    }
    this._compression.hasCheckout = hasCheckout;
    this._used = this._compression;
    try {
      await Promise.all(addEventPromises);
    } catch (error) {
      DEBUG_BUILD4 && logger.warn("[Replay] Failed to add events when switching buffers.", error);
    }
  }
};
function createEventBuffer({
  useCompression,
  workerUrl: customWorkerUrl
}) {
  if (useCompression && // eslint-disable-next-line no-restricted-globals
  window.Worker) {
    const worker = _loadWorker(customWorkerUrl);
    if (worker) {
      return worker;
    }
  }
  logInfo("[Replay] Using simple buffer");
  return new EventBufferArray();
}
function _loadWorker(customWorkerUrl) {
  try {
    const workerUrl = customWorkerUrl || _getWorkerUrl();
    if (!workerUrl) {
      return;
    }
    logInfo(`[Replay] Using compression worker${customWorkerUrl ? ` from ${customWorkerUrl}` : ""}`);
    const worker = new Worker(workerUrl);
    return new EventBufferProxy(worker);
  } catch (error) {
    logInfo("[Replay] Failed to create compression worker");
  }
}
function _getWorkerUrl() {
  if (typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ === "undefined" || !__SENTRY_EXCLUDE_REPLAY_WORKER__) {
    return e();
  }
  return "";
}
function hasSessionStorage() {
  try {
    return "sessionStorage" in WINDOW9 && !!WINDOW9.sessionStorage;
  } catch (e2) {
    return false;
  }
}
function clearSession(replay) {
  deleteSession();
  replay.session = void 0;
}
function deleteSession() {
  if (!hasSessionStorage()) {
    return;
  }
  try {
    WINDOW9.sessionStorage.removeItem(REPLAY_SESSION_KEY);
  } catch (e2) {
  }
}
function isSampled(sampleRate) {
  if (sampleRate === void 0) {
    return false;
  }
  return Math.random() < sampleRate;
}
function makeSession2(session) {
  const now = Date.now();
  const id = session.id || uuid4();
  const started = session.started || now;
  const lastActivity = session.lastActivity || now;
  const segmentId = session.segmentId || 0;
  const sampled = session.sampled;
  const previousSessionId = session.previousSessionId;
  return {
    id,
    started,
    lastActivity,
    segmentId,
    sampled,
    previousSessionId
  };
}
function saveSession(session) {
  if (!hasSessionStorage()) {
    return;
  }
  try {
    WINDOW9.sessionStorage.setItem(REPLAY_SESSION_KEY, JSON.stringify(session));
  } catch (e2) {
  }
}
function getSessionSampleType(sessionSampleRate, allowBuffering) {
  return isSampled(sessionSampleRate) ? "session" : allowBuffering ? "buffer" : false;
}
function createSession({ sessionSampleRate, allowBuffering, stickySession = false }, { previousSessionId } = {}) {
  const sampled = getSessionSampleType(sessionSampleRate, allowBuffering);
  const session = makeSession2({
    sampled,
    previousSessionId
  });
  if (stickySession) {
    saveSession(session);
  }
  return session;
}
function fetchSession(traceInternals) {
  if (!hasSessionStorage()) {
    return null;
  }
  try {
    const sessionStringFromStorage = WINDOW9.sessionStorage.getItem(REPLAY_SESSION_KEY);
    if (!sessionStringFromStorage) {
      return null;
    }
    const sessionObj = JSON.parse(sessionStringFromStorage);
    logInfoNextTick("[Replay] Loading existing session", traceInternals);
    return makeSession2(sessionObj);
  } catch (e2) {
    return null;
  }
}
function isExpired(initialTime, expiry, targetTime = +/* @__PURE__ */ new Date()) {
  if (initialTime === null || expiry === void 0 || expiry < 0) {
    return true;
  }
  if (expiry === 0) {
    return false;
  }
  return initialTime + expiry <= targetTime;
}
function isSessionExpired(session, {
  maxReplayDuration,
  sessionIdleExpire,
  targetTime = Date.now()
}) {
  return (
    // First, check that maximum session length has not been exceeded
    isExpired(session.started, maxReplayDuration, targetTime) || // check that the idle timeout has not been exceeded (i.e. user has
    // performed an action within the last `sessionIdleExpire` ms)
    isExpired(session.lastActivity, sessionIdleExpire, targetTime)
  );
}
function shouldRefreshSession(session, { sessionIdleExpire, maxReplayDuration }) {
  if (!isSessionExpired(session, { sessionIdleExpire, maxReplayDuration })) {
    return false;
  }
  if (session.sampled === "buffer" && session.segmentId === 0) {
    return false;
  }
  return true;
}
function loadOrCreateSession({
  traceInternals,
  sessionIdleExpire,
  maxReplayDuration,
  previousSessionId
}, sessionOptions) {
  const existingSession = sessionOptions.stickySession && fetchSession(traceInternals);
  if (!existingSession) {
    logInfoNextTick("[Replay] Creating new session", traceInternals);
    return createSession(sessionOptions, { previousSessionId });
  }
  if (!shouldRefreshSession(existingSession, { sessionIdleExpire, maxReplayDuration })) {
    return existingSession;
  }
  logInfoNextTick("[Replay] Session in sessionStorage is expired, creating new one...");
  return createSession(sessionOptions, { previousSessionId: existingSession.id });
}
function isCustomEvent(event) {
  return event.type === EventType.Custom;
}
function addEventSync(replay, event, isCheckout) {
  if (!shouldAddEvent(replay, event)) {
    return false;
  }
  void _addEvent(replay, event, isCheckout);
  return true;
}
function addEvent(replay, event, isCheckout) {
  if (!shouldAddEvent(replay, event)) {
    return Promise.resolve(null);
  }
  return _addEvent(replay, event, isCheckout);
}
async function _addEvent(replay, event, isCheckout) {
  if (!replay.eventBuffer) {
    return null;
  }
  try {
    if (isCheckout && replay.recordingMode === "buffer") {
      replay.eventBuffer.clear();
    }
    if (isCheckout) {
      replay.eventBuffer.hasCheckout = true;
    }
    const replayOptions = replay.getOptions();
    const eventAfterPossibleCallback = maybeApplyCallback(event, replayOptions.beforeAddRecordingEvent);
    if (!eventAfterPossibleCallback) {
      return;
    }
    return await replay.eventBuffer.addEvent(eventAfterPossibleCallback);
  } catch (error) {
    const reason = error && error instanceof EventBufferSizeExceededError ? "addEventSizeExceeded" : "addEvent";
    DEBUG_BUILD4 && logger.error(error);
    await replay.stop({ reason });
    const client = getClient();
    if (client) {
      client.recordDroppedEvent("internal_sdk_error", "replay");
    }
  }
}
function shouldAddEvent(replay, event) {
  if (!replay.eventBuffer || replay.isPaused() || !replay.isEnabled()) {
    return false;
  }
  const timestampInMs = timestampToMs(event.timestamp);
  if (timestampInMs + replay.timeouts.sessionIdlePause < Date.now()) {
    return false;
  }
  if (timestampInMs > replay.getContext().initialTimestamp + replay.getOptions().maxReplayDuration) {
    logInfo(
      `[Replay] Skipping event with timestamp ${timestampInMs} because it is after maxReplayDuration`,
      replay.getOptions()._experiments.traceInternals
    );
    return false;
  }
  return true;
}
function maybeApplyCallback(event, callback) {
  try {
    if (typeof callback === "function" && isCustomEvent(event)) {
      return callback(event);
    }
  } catch (error) {
    DEBUG_BUILD4 && logger.error("[Replay] An error occured in the `beforeAddRecordingEvent` callback, skipping the event...", error);
    return null;
  }
  return event;
}
function isErrorEvent3(event) {
  return !event.type;
}
function isTransactionEvent2(event) {
  return event.type === "transaction";
}
function isReplayEvent(event) {
  return event.type === "replay_event";
}
function isFeedbackEvent(event) {
  return event.type === "feedback";
}
function handleAfterSendEvent(replay) {
  const enforceStatusCode = isBaseTransportSend();
  return (event, sendResponse) => {
    if (!replay.isEnabled() || !isErrorEvent3(event) && !isTransactionEvent2(event)) {
      return;
    }
    const statusCode = sendResponse && sendResponse.statusCode;
    if (enforceStatusCode && (!statusCode || statusCode < 200 || statusCode >= 300)) {
      return;
    }
    if (isTransactionEvent2(event)) {
      handleTransactionEvent(replay, event);
      return;
    }
    handleErrorEvent(replay, event);
  };
}
function handleTransactionEvent(replay, event) {
  const replayContext = replay.getContext();
  if (event.contexts && event.contexts.trace && event.contexts.trace.trace_id && replayContext.traceIds.size < 100) {
    replayContext.traceIds.add(event.contexts.trace.trace_id);
  }
}
function handleErrorEvent(replay, event) {
  const replayContext = replay.getContext();
  if (event.event_id && replayContext.errorIds.size < 100) {
    replayContext.errorIds.add(event.event_id);
  }
  if (replay.recordingMode !== "buffer" || !event.tags || !event.tags.replayId) {
    return;
  }
  const { beforeErrorSampling } = replay.getOptions();
  if (typeof beforeErrorSampling === "function" && !beforeErrorSampling(event)) {
    return;
  }
  setTimeout(() => {
    void replay.sendBufferedReplayOrFlush();
  });
}
function isBaseTransportSend() {
  const client = getClient();
  if (!client) {
    return false;
  }
  const transport = client.getTransport();
  if (!transport) {
    return false;
  }
  return transport.send.__sentry__baseTransport__ || false;
}
function isRrwebError(event, hint) {
  if (event.type || !event.exception || !event.exception.values || !event.exception.values.length) {
    return false;
  }
  if (hint.originalException && hint.originalException.__rrweb__) {
    return true;
  }
  return false;
}
function addFeedbackBreadcrumb(replay, event) {
  replay.triggerUserActivity();
  replay.addUpdate(() => {
    if (!event.timestamp) {
      return true;
    }
    void replay.throttledAddEvent({
      type: EventType.Custom,
      timestamp: event.timestamp * 1e3,
      data: {
        timestamp: event.timestamp,
        tag: "breadcrumb",
        payload: {
          category: "sentry.feedback",
          data: {
            feedbackId: event.event_id
          }
        }
      }
    });
    return false;
  });
}
function shouldSampleForBufferEvent(replay, event) {
  if (replay.recordingMode !== "buffer") {
    return false;
  }
  if (event.message === UNABLE_TO_SEND_REPLAY) {
    return false;
  }
  if (!event.exception || event.type) {
    return false;
  }
  return isSampled(replay.getOptions().errorSampleRate);
}
function handleGlobalEventListener(replay, includeAfterSendEventHandling = false) {
  const afterSendHandler = includeAfterSendEventHandling ? handleAfterSendEvent(replay) : void 0;
  return Object.assign(
    (event, hint) => {
      if (!replay.isEnabled()) {
        return event;
      }
      if (isReplayEvent(event)) {
        delete event.breadcrumbs;
        return event;
      }
      if (!isErrorEvent3(event) && !isTransactionEvent2(event) && !isFeedbackEvent(event)) {
        return event;
      }
      const isSessionActive = replay.checkAndHandleExpiredSession();
      if (!isSessionActive) {
        return event;
      }
      if (isFeedbackEvent(event)) {
        void replay.flush();
        event.contexts.feedback.replay_id = replay.getSessionId();
        addFeedbackBreadcrumb(replay, event);
        return event;
      }
      if (isRrwebError(event, hint) && !replay.getOptions()._experiments.captureExceptions) {
        DEBUG_BUILD4 && logger.log("[Replay] Ignoring error from rrweb internals", event);
        return null;
      }
      const isErrorEventSampled = shouldSampleForBufferEvent(replay, event);
      const shouldTagReplayId = isErrorEventSampled || replay.recordingMode === "session";
      if (shouldTagReplayId) {
        event.tags = { ...event.tags, replayId: replay.getSessionId() };
      }
      if (afterSendHandler) {
        afterSendHandler(event, { statusCode: 200 });
      }
      return event;
    },
    { id: "Replay" }
  );
}
function createPerformanceSpans(replay, entries) {
  return entries.map(({ type, start, end, name, data }) => {
    const response = replay.throttledAddEvent({
      type: EventType.Custom,
      timestamp: start,
      data: {
        tag: "performanceSpan",
        payload: {
          op: type,
          description: name,
          startTimestamp: start,
          endTimestamp: end,
          data
        }
      }
    });
    return typeof response === "string" ? Promise.resolve(null) : response;
  });
}
function handleHistory(handlerData) {
  const { from, to } = handlerData;
  const now = Date.now() / 1e3;
  return {
    type: "navigation.push",
    start: now,
    end: now,
    name: to,
    data: {
      previous: from
    }
  };
}
function handleHistorySpanListener(replay) {
  return (handlerData) => {
    if (!replay.isEnabled()) {
      return;
    }
    const result = handleHistory(handlerData);
    if (result === null) {
      return;
    }
    replay.getContext().urls.push(result.name);
    replay.triggerUserActivity();
    replay.addUpdate(() => {
      createPerformanceSpans(replay, [result]);
      return false;
    });
  };
}
function shouldFilterRequest(replay, url) {
  if (DEBUG_BUILD4 && replay.getOptions()._experiments.traceInternals) {
    return false;
  }
  return isSentryRequestUrl(url, getCurrentHub());
}
function addNetworkBreadcrumb(replay, result) {
  if (!replay.isEnabled()) {
    return;
  }
  if (result === null) {
    return;
  }
  if (shouldFilterRequest(replay, result.name)) {
    return;
  }
  replay.addUpdate(() => {
    createPerformanceSpans(replay, [result]);
    return true;
  });
}
function handleFetch(handlerData) {
  const { startTimestamp, endTimestamp, fetchData, response } = handlerData;
  if (!endTimestamp) {
    return null;
  }
  const { method, url } = fetchData;
  return {
    type: "resource.fetch",
    start: startTimestamp / 1e3,
    end: endTimestamp / 1e3,
    name: url,
    data: {
      method,
      statusCode: response ? response.status : void 0
    }
  };
}
function handleFetchSpanListener(replay) {
  return (handlerData) => {
    if (!replay.isEnabled()) {
      return;
    }
    const result = handleFetch(handlerData);
    addNetworkBreadcrumb(replay, result);
  };
}
function handleXhr(handlerData) {
  const { startTimestamp, endTimestamp, xhr } = handlerData;
  const sentryXhrData = xhr[SENTRY_XHR_DATA_KEY];
  if (!startTimestamp || !endTimestamp || !sentryXhrData) {
    return null;
  }
  const { method, url, status_code: statusCode } = sentryXhrData;
  if (url === void 0) {
    return null;
  }
  return {
    type: "resource.xhr",
    name: url,
    start: startTimestamp / 1e3,
    end: endTimestamp / 1e3,
    data: {
      method,
      statusCode
    }
  };
}
function handleXhrSpanListener(replay) {
  return (handlerData) => {
    if (!replay.isEnabled()) {
      return;
    }
    const result = handleXhr(handlerData);
    addNetworkBreadcrumb(replay, result);
  };
}
function getBodySize(body, textEncoder) {
  if (!body) {
    return void 0;
  }
  try {
    if (typeof body === "string") {
      return textEncoder.encode(body).length;
    }
    if (body instanceof URLSearchParams) {
      return textEncoder.encode(body.toString()).length;
    }
    if (body instanceof FormData) {
      const formDataStr = _serializeFormData(body);
      return textEncoder.encode(formDataStr).length;
    }
    if (body instanceof Blob) {
      return body.size;
    }
    if (body instanceof ArrayBuffer) {
      return body.byteLength;
    }
  } catch (e2) {
  }
  return void 0;
}
function parseContentLengthHeader(header) {
  if (!header) {
    return void 0;
  }
  const size = parseInt(header, 10);
  return isNaN(size) ? void 0 : size;
}
function getBodyString(body) {
  try {
    if (typeof body === "string") {
      return [body];
    }
    if (body instanceof URLSearchParams) {
      return [body.toString()];
    }
    if (body instanceof FormData) {
      return [_serializeFormData(body)];
    }
  } catch (e2) {
    DEBUG_BUILD4 && logger.warn("[Replay] Failed to serialize body", body);
    return [void 0, "BODY_PARSE_ERROR"];
  }
  DEBUG_BUILD4 && logger.info("[Replay] Skipping network body because of body type", body);
  return [void 0];
}
function mergeWarning(info, warning) {
  if (!info) {
    return {
      headers: {},
      size: void 0,
      _meta: {
        warnings: [warning]
      }
    };
  }
  const newMeta = { ...info._meta };
  const existingWarnings = newMeta.warnings || [];
  newMeta.warnings = [...existingWarnings, warning];
  info._meta = newMeta;
  return info;
}
function makeNetworkReplayBreadcrumb(type, data) {
  if (!data) {
    return null;
  }
  const { startTimestamp, endTimestamp, url, method, statusCode, request, response } = data;
  const result = {
    type,
    start: startTimestamp / 1e3,
    end: endTimestamp / 1e3,
    name: url,
    data: dropUndefinedKeys({
      method,
      statusCode,
      request,
      response
    })
  };
  return result;
}
function buildSkippedNetworkRequestOrResponse(bodySize) {
  return {
    headers: {},
    size: bodySize,
    _meta: {
      warnings: ["URL_SKIPPED"]
    }
  };
}
function buildNetworkRequestOrResponse(headers, bodySize, body) {
  if (!bodySize && Object.keys(headers).length === 0) {
    return void 0;
  }
  if (!bodySize) {
    return {
      headers
    };
  }
  if (!body) {
    return {
      headers,
      size: bodySize
    };
  }
  const info = {
    headers,
    size: bodySize
  };
  const { body: normalizedBody, warnings } = normalizeNetworkBody(body);
  info.body = normalizedBody;
  if (warnings && warnings.length > 0) {
    info._meta = {
      warnings
    };
  }
  return info;
}
function getAllowedHeaders(headers, allowedHeaders) {
  return Object.keys(headers).reduce((filteredHeaders, key) => {
    const normalizedKey = key.toLowerCase();
    if (allowedHeaders.includes(normalizedKey) && headers[key]) {
      filteredHeaders[normalizedKey] = headers[key];
    }
    return filteredHeaders;
  }, {});
}
function _serializeFormData(formData) {
  return new URLSearchParams(formData).toString();
}
function normalizeNetworkBody(body) {
  if (!body || typeof body !== "string") {
    return {
      body
    };
  }
  const exceedsSizeLimit = body.length > NETWORK_BODY_MAX_SIZE;
  const isProbablyJson = _strIsProbablyJson(body);
  if (exceedsSizeLimit) {
    const truncatedBody = body.slice(0, NETWORK_BODY_MAX_SIZE);
    if (isProbablyJson) {
      return {
        body: truncatedBody,
        warnings: ["MAYBE_JSON_TRUNCATED"]
      };
    }
    return {
      body: `${truncatedBody}\u2026`,
      warnings: ["TEXT_TRUNCATED"]
    };
  }
  if (isProbablyJson) {
    try {
      const jsonBody = JSON.parse(body);
      return {
        body: jsonBody
      };
    } catch (e3) {
    }
  }
  return {
    body
  };
}
function _strIsProbablyJson(str) {
  const first = str[0];
  const last = str[str.length - 1];
  return first === "[" && last === "]" || first === "{" && last === "}";
}
function urlMatches(url, urls) {
  const fullUrl = getFullUrl(url);
  return stringMatchesSomePattern(fullUrl, urls);
}
function getFullUrl(url, baseURI = WINDOW9.document.baseURI) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith(WINDOW9.location.origin)) {
    return url;
  }
  const fixedUrl = new URL(url, baseURI);
  if (fixedUrl.origin !== new URL(baseURI).origin) {
    return url;
  }
  const fullUrl = fixedUrl.href;
  if (!url.endsWith("/") && fullUrl.endsWith("/")) {
    return fullUrl.slice(0, -1);
  }
  return fullUrl;
}
async function captureFetchBreadcrumbToReplay(breadcrumb, hint, options) {
  try {
    const data = await _prepareFetchData(breadcrumb, hint, options);
    const result = makeNetworkReplayBreadcrumb("resource.fetch", data);
    addNetworkBreadcrumb(options.replay, result);
  } catch (error) {
    DEBUG_BUILD4 && logger.error("[Replay] Failed to capture fetch breadcrumb", error);
  }
}
function enrichFetchBreadcrumb(breadcrumb, hint, options) {
  const { input, response } = hint;
  const body = input ? _getFetchRequestArgBody(input) : void 0;
  const reqSize = getBodySize(body, options.textEncoder);
  const resSize = response ? parseContentLengthHeader(response.headers.get("content-length")) : void 0;
  if (reqSize !== void 0) {
    breadcrumb.data.request_body_size = reqSize;
  }
  if (resSize !== void 0) {
    breadcrumb.data.response_body_size = resSize;
  }
}
async function _prepareFetchData(breadcrumb, hint, options) {
  const now = Date.now();
  const { startTimestamp = now, endTimestamp = now } = hint;
  const {
    url,
    method,
    status_code: statusCode = 0,
    request_body_size: requestBodySize,
    response_body_size: responseBodySize
  } = breadcrumb.data;
  const captureDetails = urlMatches(url, options.networkDetailAllowUrls) && !urlMatches(url, options.networkDetailDenyUrls);
  const request = captureDetails ? _getRequestInfo(options, hint.input, requestBodySize) : buildSkippedNetworkRequestOrResponse(requestBodySize);
  const response = await _getResponseInfo(captureDetails, options, hint.response, responseBodySize);
  return {
    startTimestamp,
    endTimestamp,
    url,
    method,
    statusCode,
    request,
    response
  };
}
function _getRequestInfo({ networkCaptureBodies, networkRequestHeaders }, input, requestBodySize) {
  const headers = input ? getRequestHeaders(input, networkRequestHeaders) : {};
  if (!networkCaptureBodies) {
    return buildNetworkRequestOrResponse(headers, requestBodySize, void 0);
  }
  const requestBody = _getFetchRequestArgBody(input);
  const [bodyStr, warning] = getBodyString(requestBody);
  const data = buildNetworkRequestOrResponse(headers, requestBodySize, bodyStr);
  if (warning) {
    return mergeWarning(data, warning);
  }
  return data;
}
async function _getResponseInfo(captureDetails, {
  networkCaptureBodies,
  textEncoder,
  networkResponseHeaders
}, response, responseBodySize) {
  if (!captureDetails && responseBodySize !== void 0) {
    return buildSkippedNetworkRequestOrResponse(responseBodySize);
  }
  const headers = response ? getAllHeaders(response.headers, networkResponseHeaders) : {};
  if (!response || !networkCaptureBodies && responseBodySize !== void 0) {
    return buildNetworkRequestOrResponse(headers, responseBodySize, void 0);
  }
  const [bodyText, warning] = await _parseFetchResponseBody(response);
  const result = getResponseData(bodyText, {
    networkCaptureBodies,
    textEncoder,
    responseBodySize,
    captureDetails,
    headers
  });
  if (warning) {
    return mergeWarning(result, warning);
  }
  return result;
}
function getResponseData(bodyText, {
  networkCaptureBodies,
  textEncoder,
  responseBodySize,
  captureDetails,
  headers
}) {
  try {
    const size = bodyText && bodyText.length && responseBodySize === void 0 ? getBodySize(bodyText, textEncoder) : responseBodySize;
    if (!captureDetails) {
      return buildSkippedNetworkRequestOrResponse(size);
    }
    if (networkCaptureBodies) {
      return buildNetworkRequestOrResponse(headers, size, bodyText);
    }
    return buildNetworkRequestOrResponse(headers, size, void 0);
  } catch (error) {
    DEBUG_BUILD4 && logger.warn("[Replay] Failed to serialize response body", error);
    return buildNetworkRequestOrResponse(headers, responseBodySize, void 0);
  }
}
async function _parseFetchResponseBody(response) {
  const res = _tryCloneResponse(response);
  if (!res) {
    return [void 0, "BODY_PARSE_ERROR"];
  }
  try {
    const text = await _tryGetResponseText(res);
    return [text];
  } catch (error) {
    DEBUG_BUILD4 && logger.warn("[Replay] Failed to get text body from response", error);
    return [void 0, "BODY_PARSE_ERROR"];
  }
}
function _getFetchRequestArgBody(fetchArgs = []) {
  if (fetchArgs.length !== 2 || typeof fetchArgs[1] !== "object") {
    return void 0;
  }
  return fetchArgs[1].body;
}
function getAllHeaders(headers, allowedHeaders) {
  const allHeaders = {};
  allowedHeaders.forEach((header) => {
    if (headers.get(header)) {
      allHeaders[header] = headers.get(header);
    }
  });
  return allHeaders;
}
function getRequestHeaders(fetchArgs, allowedHeaders) {
  if (fetchArgs.length === 1 && typeof fetchArgs[0] !== "string") {
    return getHeadersFromOptions(fetchArgs[0], allowedHeaders);
  }
  if (fetchArgs.length === 2) {
    return getHeadersFromOptions(fetchArgs[1], allowedHeaders);
  }
  return {};
}
function getHeadersFromOptions(input, allowedHeaders) {
  if (!input) {
    return {};
  }
  const headers = input.headers;
  if (!headers) {
    return {};
  }
  if (headers instanceof Headers) {
    return getAllHeaders(headers, allowedHeaders);
  }
  if (Array.isArray(headers)) {
    return {};
  }
  return getAllowedHeaders(headers, allowedHeaders);
}
function _tryCloneResponse(response) {
  try {
    return response.clone();
  } catch (error) {
    DEBUG_BUILD4 && logger.warn("[Replay] Failed to clone response body", error);
  }
}
function _tryGetResponseText(response) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Timeout while trying to read response body")), 500);
    _getResponseText(response).then(
      (txt) => resolve(txt),
      (reason) => reject(reason)
    ).finally(() => clearTimeout(timeout));
  });
}
async function _getResponseText(response) {
  return await response.text();
}
async function captureXhrBreadcrumbToReplay(breadcrumb, hint, options) {
  try {
    const data = _prepareXhrData(breadcrumb, hint, options);
    const result = makeNetworkReplayBreadcrumb("resource.xhr", data);
    addNetworkBreadcrumb(options.replay, result);
  } catch (error) {
    DEBUG_BUILD4 && logger.error("[Replay] Failed to capture xhr breadcrumb", error);
  }
}
function enrichXhrBreadcrumb(breadcrumb, hint, options) {
  const { xhr, input } = hint;
  if (!xhr) {
    return;
  }
  const reqSize = getBodySize(input, options.textEncoder);
  const resSize = xhr.getResponseHeader("content-length") ? parseContentLengthHeader(xhr.getResponseHeader("content-length")) : getBodySize(xhr.response, options.textEncoder);
  if (reqSize !== void 0) {
    breadcrumb.data.request_body_size = reqSize;
  }
  if (resSize !== void 0) {
    breadcrumb.data.response_body_size = resSize;
  }
}
function _prepareXhrData(breadcrumb, hint, options) {
  const now = Date.now();
  const { startTimestamp = now, endTimestamp = now, input, xhr } = hint;
  const {
    url,
    method,
    status_code: statusCode = 0,
    request_body_size: requestBodySize,
    response_body_size: responseBodySize
  } = breadcrumb.data;
  if (!url) {
    return null;
  }
  if (!xhr || !urlMatches(url, options.networkDetailAllowUrls) || urlMatches(url, options.networkDetailDenyUrls)) {
    const request2 = buildSkippedNetworkRequestOrResponse(requestBodySize);
    const response2 = buildSkippedNetworkRequestOrResponse(responseBodySize);
    return {
      startTimestamp,
      endTimestamp,
      url,
      method,
      statusCode,
      request: request2,
      response: response2
    };
  }
  const xhrInfo = xhr[SENTRY_XHR_DATA_KEY];
  const networkRequestHeaders = xhrInfo ? getAllowedHeaders(xhrInfo.request_headers, options.networkRequestHeaders) : {};
  const networkResponseHeaders = getAllowedHeaders(getResponseHeaders(xhr), options.networkResponseHeaders);
  const [requestBody, requestWarning] = options.networkCaptureBodies ? getBodyString(input) : [void 0];
  const [responseBody, responseWarning] = options.networkCaptureBodies ? _getXhrResponseBody(xhr) : [void 0];
  const request = buildNetworkRequestOrResponse(networkRequestHeaders, requestBodySize, requestBody);
  const response = buildNetworkRequestOrResponse(networkResponseHeaders, responseBodySize, responseBody);
  return {
    startTimestamp,
    endTimestamp,
    url,
    method,
    statusCode,
    request: requestWarning ? mergeWarning(request, requestWarning) : request,
    response: responseWarning ? mergeWarning(response, responseWarning) : response
  };
}
function getResponseHeaders(xhr) {
  const headers = xhr.getAllResponseHeaders();
  if (!headers) {
    return {};
  }
  return headers.split("\r\n").reduce((acc, line) => {
    const [key, value] = line.split(": ");
    acc[key.toLowerCase()] = value;
    return acc;
  }, {});
}
function _getXhrResponseBody(xhr) {
  const errors = [];
  try {
    return [xhr.responseText];
  } catch (e2) {
    errors.push(e2);
  }
  try {
    const response = xhr.response;
    return getBodyString(response);
  } catch (e2) {
    errors.push(e2);
  }
  DEBUG_BUILD4 && logger.warn("[Replay] Failed to get xhr response body", ...errors);
  return [void 0];
}
function handleNetworkBreadcrumbs(replay) {
  const client = getClient();
  try {
    const textEncoder = new TextEncoder();
    const {
      networkDetailAllowUrls,
      networkDetailDenyUrls,
      networkCaptureBodies,
      networkRequestHeaders,
      networkResponseHeaders
    } = replay.getOptions();
    const options = {
      replay,
      textEncoder,
      networkDetailAllowUrls,
      networkDetailDenyUrls,
      networkCaptureBodies,
      networkRequestHeaders,
      networkResponseHeaders
    };
    if (client && client.on) {
      client.on("beforeAddBreadcrumb", (breadcrumb, hint) => beforeAddNetworkBreadcrumb(options, breadcrumb, hint));
    } else {
      addFetchInstrumentationHandler(handleFetchSpanListener(replay));
      addXhrInstrumentationHandler(handleXhrSpanListener(replay));
    }
  } catch (e2) {
  }
}
function beforeAddNetworkBreadcrumb(options, breadcrumb, hint) {
  if (!breadcrumb.data) {
    return;
  }
  try {
    if (_isXhrBreadcrumb(breadcrumb) && _isXhrHint(hint)) {
      enrichXhrBreadcrumb(breadcrumb, hint, options);
      void captureXhrBreadcrumbToReplay(breadcrumb, hint, options);
    }
    if (_isFetchBreadcrumb(breadcrumb) && _isFetchHint(hint)) {
      enrichFetchBreadcrumb(breadcrumb, hint, options);
      void captureFetchBreadcrumbToReplay(breadcrumb, hint, options);
    }
  } catch (e2) {
    DEBUG_BUILD4 && logger.warn("Error when enriching network breadcrumb");
  }
}
function _isXhrBreadcrumb(breadcrumb) {
  return breadcrumb.category === "xhr";
}
function _isFetchBreadcrumb(breadcrumb) {
  return breadcrumb.category === "fetch";
}
function _isXhrHint(hint) {
  return hint && hint.xhr;
}
function _isFetchHint(hint) {
  return hint && hint.response;
}
var _LAST_BREADCRUMB = null;
function isBreadcrumbWithCategory(breadcrumb) {
  return !!breadcrumb.category;
}
var handleScopeListener = (replay) => (scope) => {
  if (!replay.isEnabled()) {
    return;
  }
  const result = handleScope(scope);
  if (!result) {
    return;
  }
  addBreadcrumbEvent(replay, result);
};
function handleScope(scope) {
  const newBreadcrumb = scope.getLastBreadcrumb && scope.getLastBreadcrumb();
  if (_LAST_BREADCRUMB === newBreadcrumb || !newBreadcrumb) {
    return null;
  }
  _LAST_BREADCRUMB = newBreadcrumb;
  if (!isBreadcrumbWithCategory(newBreadcrumb) || ["fetch", "xhr", "sentry.event", "sentry.transaction"].includes(newBreadcrumb.category) || newBreadcrumb.category.startsWith("ui.")) {
    return null;
  }
  if (newBreadcrumb.category === "console") {
    return normalizeConsoleBreadcrumb(newBreadcrumb);
  }
  return createBreadcrumb(newBreadcrumb);
}
function normalizeConsoleBreadcrumb(breadcrumb) {
  const args = breadcrumb.data && breadcrumb.data.arguments;
  if (!Array.isArray(args) || args.length === 0) {
    return createBreadcrumb(breadcrumb);
  }
  let isTruncated = false;
  const normalizedArgs = args.map((arg) => {
    if (!arg) {
      return arg;
    }
    if (typeof arg === "string") {
      if (arg.length > CONSOLE_ARG_MAX_SIZE) {
        isTruncated = true;
        return `${arg.slice(0, CONSOLE_ARG_MAX_SIZE)}\u2026`;
      }
      return arg;
    }
    if (typeof arg === "object") {
      try {
        const normalizedArg = normalize(arg, 7);
        const stringified = JSON.stringify(normalizedArg);
        if (stringified.length > CONSOLE_ARG_MAX_SIZE) {
          isTruncated = true;
          return `${JSON.stringify(normalizedArg, null, 2).slice(0, CONSOLE_ARG_MAX_SIZE)}\u2026`;
        }
        return normalizedArg;
      } catch (e2) {
      }
    }
    return arg;
  });
  return createBreadcrumb({
    ...breadcrumb,
    data: {
      ...breadcrumb.data,
      arguments: normalizedArgs,
      ...isTruncated ? { _meta: { warnings: ["CONSOLE_ARG_TRUNCATED"] } } : {}
    }
  });
}
function addGlobalListeners(replay) {
  const scope = getCurrentHub().getScope();
  const client = getClient();
  scope.addScopeListener(handleScopeListener(replay));
  addClickKeypressInstrumentationHandler(handleDomListener(replay));
  addHistoryInstrumentationHandler(handleHistorySpanListener(replay));
  handleNetworkBreadcrumbs(replay);
  const eventProcessor = handleGlobalEventListener(replay, !hasHooks(client));
  if (client && client.addEventProcessor) {
    client.addEventProcessor(eventProcessor);
  } else {
    addGlobalEventProcessor(eventProcessor);
  }
  if (hasHooks(client)) {
    client.on("afterSendEvent", handleAfterSendEvent(replay));
    client.on("createDsc", (dsc) => {
      const replayId = replay.getSessionId();
      if (replayId && replay.isEnabled() && replay.recordingMode === "session") {
        const isSessionActive = replay.checkAndHandleExpiredSession();
        if (isSessionActive) {
          dsc.replay_id = replayId;
        }
      }
    });
    client.on("startTransaction", (transaction) => {
      replay.lastTransaction = transaction;
    });
    client.on("finishTransaction", (transaction) => {
      replay.lastTransaction = transaction;
    });
    client.on("beforeSendFeedback", (feedbackEvent, options) => {
      const replayId = replay.getSessionId();
      if (options && options.includeReplay && replay.isEnabled() && replayId) {
        void replay.flush();
        if (feedbackEvent.contexts && feedbackEvent.contexts.feedback) {
          feedbackEvent.contexts.feedback.replay_id = replayId;
        }
      }
    });
  }
}
function hasHooks(client) {
  return !!(client && client.on);
}
async function addMemoryEntry(replay) {
  try {
    return Promise.all(
      createPerformanceSpans(
        replay,
        [
          // @ts-expect-error memory doesn't exist on type Performance as the API is non-standard (we check that it exists above)
          createMemoryEntry(WINDOW9.performance.memory)
        ]
      )
    );
  } catch (error) {
    return [];
  }
}
function createMemoryEntry(memoryEntry) {
  const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = memoryEntry;
  const time = Date.now() / 1e3;
  return {
    type: "memory",
    name: "memory",
    start: time,
    end: time,
    data: {
      memory: {
        jsHeapSizeLimit,
        totalJSHeapSize,
        usedJSHeapSize
      }
    }
  };
}
function debounce(func, wait, options) {
  let callbackReturnValue;
  let timerId;
  let maxTimerId;
  const maxWait = options && options.maxWait ? Math.max(options.maxWait, wait) : 0;
  function invokeFunc() {
    cancelTimers();
    callbackReturnValue = func();
    return callbackReturnValue;
  }
  function cancelTimers() {
    timerId !== void 0 && clearTimeout(timerId);
    maxTimerId !== void 0 && clearTimeout(maxTimerId);
    timerId = maxTimerId = void 0;
  }
  function flush2() {
    if (timerId !== void 0 || maxTimerId !== void 0) {
      return invokeFunc();
    }
    return callbackReturnValue;
  }
  function debounced() {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(invokeFunc, wait);
    if (maxWait && maxTimerId === void 0) {
      maxTimerId = setTimeout(invokeFunc, maxWait);
    }
    return callbackReturnValue;
  }
  debounced.cancel = cancelTimers;
  debounced.flush = flush2;
  return debounced;
}
function getHandleRecordingEmit(replay) {
  let hadFirstEvent = false;
  return (event, _isCheckout) => {
    if (!replay.checkAndHandleExpiredSession()) {
      DEBUG_BUILD4 && logger.warn("[Replay] Received replay event after session expired.");
      return;
    }
    const isCheckout = _isCheckout || !hadFirstEvent;
    hadFirstEvent = true;
    if (replay.clickDetector) {
      updateClickDetectorForRecordingEvent(replay.clickDetector, event);
    }
    replay.addUpdate(() => {
      if (replay.recordingMode === "buffer" && isCheckout) {
        replay.setInitialState();
      }
      if (!addEventSync(replay, event, isCheckout)) {
        return true;
      }
      if (!isCheckout) {
        return false;
      }
      addSettingsEvent(replay, isCheckout);
      if (replay.session && replay.session.previousSessionId) {
        return true;
      }
      if (replay.recordingMode === "buffer" && replay.session && replay.eventBuffer) {
        const earliestEvent = replay.eventBuffer.getEarliestTimestamp();
        if (earliestEvent) {
          logInfo(
            `[Replay] Updating session start time to earliest event in buffer to ${new Date(earliestEvent)}`,
            replay.getOptions()._experiments.traceInternals
          );
          replay.session.started = earliestEvent;
          if (replay.getOptions().stickySession) {
            saveSession(replay.session);
          }
        }
      }
      if (replay.recordingMode === "session") {
        void replay.flush();
      }
      return true;
    });
  };
}
function createOptionsEvent(replay) {
  const options = replay.getOptions();
  return {
    type: EventType.Custom,
    timestamp: Date.now(),
    data: {
      tag: "options",
      payload: {
        sessionSampleRate: options.sessionSampleRate,
        errorSampleRate: options.errorSampleRate,
        useCompressionOption: options.useCompression,
        blockAllMedia: options.blockAllMedia,
        maskAllText: options.maskAllText,
        maskAllInputs: options.maskAllInputs,
        useCompression: replay.eventBuffer ? replay.eventBuffer.type === "worker" : false,
        networkDetailHasUrls: options.networkDetailAllowUrls.length > 0,
        networkCaptureBodies: options.networkCaptureBodies,
        networkRequestHasHeaders: options.networkRequestHeaders.length > 0,
        networkResponseHasHeaders: options.networkResponseHeaders.length > 0
      }
    }
  };
}
function addSettingsEvent(replay, isCheckout) {
  if (!isCheckout || !replay.session || replay.session.segmentId !== 0) {
    return;
  }
  addEventSync(replay, createOptionsEvent(replay), false);
}
function createReplayEnvelope(replayEvent, recordingData, dsn, tunnel) {
  return createEnvelope(
    createEventEnvelopeHeaders(replayEvent, getSdkMetadataForEnvelopeHeader(replayEvent), tunnel, dsn),
    [
      [{ type: "replay_event" }, replayEvent],
      [
        {
          type: "replay_recording",
          // If string then we need to encode to UTF8, otherwise will have
          // wrong size. TextEncoder has similar browser support to
          // MutationObserver, although it does not accept IE11.
          length: typeof recordingData === "string" ? new TextEncoder().encode(recordingData).length : recordingData.length
        },
        recordingData
      ]
    ]
  );
}
function prepareRecordingData({
  recordingData,
  headers
}) {
  let payloadWithSequence;
  const replayHeaders = `${JSON.stringify(headers)}
`;
  if (typeof recordingData === "string") {
    payloadWithSequence = `${replayHeaders}${recordingData}`;
  } else {
    const enc = new TextEncoder();
    const sequence = enc.encode(replayHeaders);
    payloadWithSequence = new Uint8Array(sequence.length + recordingData.length);
    payloadWithSequence.set(sequence);
    payloadWithSequence.set(recordingData, sequence.length);
  }
  return payloadWithSequence;
}
async function prepareReplayEvent({
  client,
  scope,
  replayId: event_id,
  event
}) {
  const integrations = typeof client._integrations === "object" && client._integrations !== null && !Array.isArray(client._integrations) ? Object.keys(client._integrations) : void 0;
  const eventHint = { event_id, integrations };
  if (client.emit) {
    client.emit("preprocessEvent", event, eventHint);
  }
  const preparedEvent = await prepareEvent(
    client.getOptions(),
    event,
    eventHint,
    scope,
    client
  );
  if (!preparedEvent) {
    return null;
  }
  preparedEvent.platform = preparedEvent.platform || "javascript";
  const metadata = client.getSdkMetadata && client.getSdkMetadata();
  const { name, version } = metadata && metadata.sdk || {};
  preparedEvent.sdk = {
    ...preparedEvent.sdk,
    name: name || "sentry.javascript.unknown",
    version: version || "0.0.0"
  };
  return preparedEvent;
}
async function sendReplayRequest({
  recordingData,
  replayId,
  segmentId: segment_id,
  eventContext,
  timestamp,
  session
}) {
  const preparedRecordingData = prepareRecordingData({
    recordingData,
    headers: {
      segment_id
    }
  });
  const { urls, errorIds, traceIds, initialTimestamp } = eventContext;
  const hub = getCurrentHub();
  const client = hub.getClient();
  const scope = hub.getScope();
  const transport = client && client.getTransport();
  const dsn = client && client.getDsn();
  if (!client || !transport || !dsn || !session.sampled) {
    return;
  }
  const baseEvent = {
    type: REPLAY_EVENT_NAME,
    replay_start_timestamp: initialTimestamp / 1e3,
    timestamp: timestamp / 1e3,
    error_ids: errorIds,
    trace_ids: traceIds,
    urls,
    replay_id: replayId,
    segment_id,
    replay_type: session.sampled
  };
  const replayEvent = await prepareReplayEvent({ scope, client, replayId, event: baseEvent });
  if (!replayEvent) {
    client.recordDroppedEvent("event_processor", "replay", baseEvent);
    logInfo("An event processor returned `null`, will not send event.");
    return;
  }
  delete replayEvent.sdkProcessingMetadata;
  const envelope = createReplayEnvelope(replayEvent, preparedRecordingData, dsn, client.getOptions().tunnel);
  let response;
  try {
    response = await transport.send(envelope);
  } catch (err) {
    const error = new Error(UNABLE_TO_SEND_REPLAY);
    try {
      error.cause = err;
    } catch (e2) {
    }
    throw error;
  }
  if (!response) {
    return response;
  }
  if (typeof response.statusCode === "number" && (response.statusCode < 200 || response.statusCode >= 300)) {
    throw new TransportStatusCodeError(response.statusCode);
  }
  const rateLimits = updateRateLimits({}, response);
  if (isRateLimited(rateLimits, "replay")) {
    throw new RateLimitError(rateLimits);
  }
  return response;
}
var TransportStatusCodeError = class extends Error {
  constructor(statusCode) {
    super(`Transport returned status code ${statusCode}`);
  }
};
var RateLimitError = class extends Error {
  constructor(rateLimits) {
    super("Rate limit hit");
    this.rateLimits = rateLimits;
  }
};
async function sendReplay(replayData, retryConfig = {
  count: 0,
  interval: RETRY_BASE_INTERVAL
}) {
  const { recordingData, options } = replayData;
  if (!recordingData.length) {
    return;
  }
  try {
    await sendReplayRequest(replayData);
    return true;
  } catch (err) {
    if (err instanceof TransportStatusCodeError || err instanceof RateLimitError) {
      throw err;
    }
    setContext("Replays", {
      _retryCount: retryConfig.count
    });
    if (DEBUG_BUILD4 && options._experiments && options._experiments.captureExceptions) {
      captureException(err);
    }
    if (retryConfig.count >= RETRY_MAX_COUNT) {
      const error = new Error(`${UNABLE_TO_SEND_REPLAY} - max retries exceeded`);
      try {
        error.cause = err;
      } catch (e2) {
      }
      throw error;
    }
    retryConfig.interval *= ++retryConfig.count;
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await sendReplay(replayData, retryConfig);
          resolve(true);
        } catch (err2) {
          reject(err2);
        }
      }, retryConfig.interval);
    });
  }
}
var THROTTLED = "__THROTTLED";
var SKIPPED = "__SKIPPED";
function throttle(fn, maxCount, durationSeconds) {
  const counter = /* @__PURE__ */ new Map();
  const _cleanup = (now) => {
    const threshold = now - durationSeconds;
    counter.forEach((_value, key) => {
      if (key < threshold) {
        counter.delete(key);
      }
    });
  };
  const _getTotalCount = () => {
    return [...counter.values()].reduce((a, b) => a + b, 0);
  };
  let isThrottled = false;
  return (...rest) => {
    const now = Math.floor(Date.now() / 1e3);
    _cleanup(now);
    if (_getTotalCount() >= maxCount) {
      const wasThrottled = isThrottled;
      isThrottled = true;
      return wasThrottled ? SKIPPED : THROTTLED;
    }
    isThrottled = false;
    const count = counter.get(now) || 0;
    counter.set(now, count + 1);
    return fn(...rest);
  };
}
var ReplayContainer = class {
  /**
   * Recording can happen in one of three modes:
   *   - session: Record the whole session, sending it continuously
   *   - buffer: Always keep the last 60s of recording, requires:
   *     - having replaysOnErrorSampleRate > 0 to capture replay when an error occurs
   *     - or calling `flush()` to send the replay
   */
  /**
   * The current or last active transcation.
   * This is only available when performance is enabled.
   */
  /**
   * These are here so we can overwrite them in tests etc.
   * @hidden
   */
  /**
   * Options to pass to `rrweb.record()`
   */
  /**
   * Timestamp of the last user activity. This lives across sessions.
   */
  /**
   * Is the integration currently active?
   */
  /**
   * Paused is a state where:
   * - DOM Recording is not listening at all
   * - Nothing will be added to event buffer (e.g. core SDK events)
   */
  /**
   * Have we attached listeners to the core SDK?
   * Note we have to track this as there is no way to remove instrumentation handlers.
   */
  /**
   * Function to stop recording
   */
  constructor({
    options,
    recordingOptions
  }) {
    ReplayContainer.prototype.__init.call(this);
    ReplayContainer.prototype.__init2.call(this);
    ReplayContainer.prototype.__init3.call(this);
    ReplayContainer.prototype.__init4.call(this);
    ReplayContainer.prototype.__init5.call(this);
    ReplayContainer.prototype.__init6.call(this);
    this.eventBuffer = null;
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    this.recordingMode = "session";
    this.timeouts = {
      sessionIdlePause: SESSION_IDLE_PAUSE_DURATION,
      sessionIdleExpire: SESSION_IDLE_EXPIRE_DURATION
    };
    this._lastActivity = Date.now();
    this._isEnabled = false;
    this._isPaused = false;
    this._hasInitializedCoreListeners = false;
    this._context = {
      errorIds: /* @__PURE__ */ new Set(),
      traceIds: /* @__PURE__ */ new Set(),
      urls: [],
      initialTimestamp: Date.now(),
      initialUrl: ""
    };
    this._recordingOptions = recordingOptions;
    this._options = options;
    this._debouncedFlush = debounce(() => this._flush(), this._options.flushMinDelay, {
      maxWait: this._options.flushMaxDelay
    });
    this._throttledAddEvent = throttle(
      (event, isCheckout) => addEvent(this, event, isCheckout),
      // Max 300 events...
      300,
      // ... per 5s
      5
    );
    const { slowClickTimeout, slowClickIgnoreSelectors } = this.getOptions();
    const slowClickConfig = slowClickTimeout ? {
      threshold: Math.min(SLOW_CLICK_THRESHOLD, slowClickTimeout),
      timeout: slowClickTimeout,
      scrollTimeout: SLOW_CLICK_SCROLL_TIMEOUT,
      ignoreSelector: slowClickIgnoreSelectors ? slowClickIgnoreSelectors.join(",") : ""
    } : void 0;
    if (slowClickConfig) {
      this.clickDetector = new ClickDetector(this, slowClickConfig);
    }
  }
  /** Get the event context. */
  getContext() {
    return this._context;
  }
  /** If recording is currently enabled. */
  isEnabled() {
    return this._isEnabled;
  }
  /** If recording is currently paused. */
  isPaused() {
    return this._isPaused;
  }
  /** Get the replay integration options. */
  getOptions() {
    return this._options;
  }
  /**
   * Initializes the plugin based on sampling configuration. Should not be
   * called outside of constructor.
   */
  initializeSampling(previousSessionId) {
    const { errorSampleRate, sessionSampleRate } = this._options;
    if (errorSampleRate <= 0 && sessionSampleRate <= 0) {
      return;
    }
    this._initializeSessionForSampling(previousSessionId);
    if (!this.session) {
      this._handleException(new Error("Unable to initialize and create session"));
      return;
    }
    if (this.session.sampled === false) {
      return;
    }
    this.recordingMode = this.session.sampled === "buffer" && this.session.segmentId === 0 ? "buffer" : "session";
    logInfoNextTick(
      `[Replay] Starting replay in ${this.recordingMode} mode`,
      this._options._experiments.traceInternals
    );
    this._initializeRecording();
  }
  /**
   * Start a replay regardless of sampling rate. Calling this will always
   * create a new session. Will throw an error if replay is already in progress.
   *
   * Creates or loads a session, attaches listeners to varying events (DOM,
   * _performanceObserver, Recording, Sentry SDK, etc)
   */
  start() {
    if (this._isEnabled && this.recordingMode === "session") {
      throw new Error("Replay recording is already in progress");
    }
    if (this._isEnabled && this.recordingMode === "buffer") {
      throw new Error("Replay buffering is in progress, call `flush()` to save the replay");
    }
    logInfoNextTick("[Replay] Starting replay in session mode", this._options._experiments.traceInternals);
    const session = loadOrCreateSession(
      {
        maxReplayDuration: this._options.maxReplayDuration,
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        traceInternals: this._options._experiments.traceInternals
      },
      {
        stickySession: this._options.stickySession,
        // This is intentional: create a new session-based replay when calling `start()`
        sessionSampleRate: 1,
        allowBuffering: false
      }
    );
    this.session = session;
    this._initializeRecording();
  }
  /**
   * Start replay buffering. Buffers until `flush()` is called or, if
   * `replaysOnErrorSampleRate` > 0, an error occurs.
   */
  startBuffering() {
    if (this._isEnabled) {
      throw new Error("Replay recording is already in progress");
    }
    logInfoNextTick("[Replay] Starting replay in buffer mode", this._options._experiments.traceInternals);
    const session = loadOrCreateSession(
      {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
        traceInternals: this._options._experiments.traceInternals
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: 0,
        allowBuffering: true
      }
    );
    this.session = session;
    this.recordingMode = "buffer";
    this._initializeRecording();
  }
  /**
   * Start recording.
   *
   * Note that this will cause a new DOM checkout
   */
  startRecording() {
    try {
      this._stopRecording = record({
        ...this._recordingOptions,
        // When running in error sampling mode, we need to overwrite `checkoutEveryNms`
        // Without this, it would record forever, until an error happens, which we don't want
        // instead, we'll always keep the last 60 seconds of replay before an error happened
        ...this.recordingMode === "buffer" && { checkoutEveryNms: BUFFER_CHECKOUT_TIME },
        emit: getHandleRecordingEmit(this),
        onMutation: this._onMutationHandler
      });
    } catch (err) {
      this._handleException(err);
    }
  }
  /**
   * Stops the recording, if it was running.
   *
   * Returns true if it was previously stopped, or is now stopped,
   * otherwise false.
   */
  stopRecording() {
    try {
      if (this._stopRecording) {
        this._stopRecording();
        this._stopRecording = void 0;
      }
      return true;
    } catch (err) {
      this._handleException(err);
      return false;
    }
  }
  /**
   * Currently, this needs to be manually called (e.g. for tests). Sentry SDK
   * does not support a teardown
   */
  async stop({ forceFlush = false, reason } = {}) {
    if (!this._isEnabled) {
      return;
    }
    this._isEnabled = false;
    try {
      logInfo(
        `[Replay] Stopping Replay${reason ? ` triggered by ${reason}` : ""}`,
        this._options._experiments.traceInternals
      );
      this._removeListeners();
      this.stopRecording();
      this._debouncedFlush.cancel();
      if (forceFlush) {
        await this._flush({ force: true });
      }
      this.eventBuffer && this.eventBuffer.destroy();
      this.eventBuffer = null;
      clearSession(this);
    } catch (err) {
      this._handleException(err);
    }
  }
  /**
   * Pause some replay functionality. See comments for `_isPaused`.
   * This differs from stop as this only stops DOM recording, it is
   * not as thorough of a shutdown as `stop()`.
   */
  pause() {
    if (this._isPaused) {
      return;
    }
    this._isPaused = true;
    this.stopRecording();
    logInfo("[Replay] Pausing replay", this._options._experiments.traceInternals);
  }
  /**
   * Resumes recording, see notes for `pause().
   *
   * Note that calling `startRecording()` here will cause a
   * new DOM checkout.`
   */
  resume() {
    if (!this._isPaused || !this._checkSession()) {
      return;
    }
    this._isPaused = false;
    this.startRecording();
    logInfo("[Replay] Resuming replay", this._options._experiments.traceInternals);
  }
  /**
   * If not in "session" recording mode, flush event buffer which will create a new replay.
   * Unless `continueRecording` is false, the replay will continue to record and
   * behave as a "session"-based replay.
   *
   * Otherwise, queue up a flush.
   */
  async sendBufferedReplayOrFlush({ continueRecording = true } = {}) {
    if (this.recordingMode === "session") {
      return this.flushImmediate();
    }
    const activityTime = Date.now();
    logInfo("[Replay] Converting buffer to session", this._options._experiments.traceInternals);
    await this.flushImmediate();
    const hasStoppedRecording = this.stopRecording();
    if (!continueRecording || !hasStoppedRecording) {
      return;
    }
    if (this.recordingMode === "session") {
      return;
    }
    this.recordingMode = "session";
    if (this.session) {
      this._updateUserActivity(activityTime);
      this._updateSessionActivity(activityTime);
      this._maybeSaveSession();
    }
    this.startRecording();
  }
  /**
   * We want to batch uploads of replay events. Save events only if
   * `<flushMinDelay>` milliseconds have elapsed since the last event
   * *OR* if `<flushMaxDelay>` milliseconds have elapsed.
   *
   * Accepts a callback to perform side-effects and returns true to stop batch
   * processing and hand back control to caller.
   */
  addUpdate(cb) {
    const cbResult = cb();
    if (this.recordingMode === "buffer") {
      return;
    }
    if (cbResult === true) {
      return;
    }
    this._debouncedFlush();
  }
  /**
   * Updates the user activity timestamp and resumes recording. This should be
   * called in an event handler for a user action that we consider as the user
   * being "active" (e.g. a mouse click).
   */
  triggerUserActivity() {
    this._updateUserActivity();
    if (!this._stopRecording) {
      if (!this._checkSession()) {
        return;
      }
      this.resume();
      return;
    }
    this.checkAndHandleExpiredSession();
    this._updateSessionActivity();
  }
  /**
   * Updates the user activity timestamp *without* resuming
   * recording. Some user events (e.g. keydown) can be create
   * low-value replays that only contain the keypress as a
   * breadcrumb. Instead this would require other events to
   * create a new replay after a session has expired.
   */
  updateUserActivity() {
    this._updateUserActivity();
    this._updateSessionActivity();
  }
  /**
   * Only flush if `this.recordingMode === 'session'`
   */
  conditionalFlush() {
    if (this.recordingMode === "buffer") {
      return Promise.resolve();
    }
    return this.flushImmediate();
  }
  /**
   * Flush using debounce flush
   */
  flush() {
    return this._debouncedFlush();
  }
  /**
   * Always flush via `_debouncedFlush` so that we do not have flushes triggered
   * from calling both `flush` and `_debouncedFlush`. Otherwise, there could be
   * cases of mulitple flushes happening closely together.
   */
  flushImmediate() {
    this._debouncedFlush();
    return this._debouncedFlush.flush();
  }
  /**
   * Cancels queued up flushes.
   */
  cancelFlush() {
    this._debouncedFlush.cancel();
  }
  /** Get the current sesion (=replay) ID */
  getSessionId() {
    return this.session && this.session.id;
  }
  /**
   * Checks if recording should be stopped due to user inactivity. Otherwise
   * check if session is expired and create a new session if so. Triggers a new
   * full snapshot on new session.
   *
   * Returns true if session is not expired, false otherwise.
   * @hidden
   */
  checkAndHandleExpiredSession() {
    if (this._lastActivity && isExpired(this._lastActivity, this.timeouts.sessionIdlePause) && this.session && this.session.sampled === "session") {
      this.pause();
      return;
    }
    if (!this._checkSession()) {
      return false;
    }
    return true;
  }
  /**
   * Capture some initial state that can change throughout the lifespan of the
   * replay. This is required because otherwise they would be captured at the
   * first flush.
   */
  setInitialState() {
    const urlPath = `${WINDOW9.location.pathname}${WINDOW9.location.hash}${WINDOW9.location.search}`;
    const url = `${WINDOW9.location.origin}${urlPath}`;
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    this._clearContext();
    this._context.initialUrl = url;
    this._context.initialTimestamp = Date.now();
    this._context.urls.push(url);
  }
  /**
   * Add a breadcrumb event, that may be throttled.
   * If it was throttled, we add a custom breadcrumb to indicate that.
   */
  throttledAddEvent(event, isCheckout) {
    const res = this._throttledAddEvent(event, isCheckout);
    if (res === THROTTLED) {
      const breadcrumb = createBreadcrumb({
        category: "replay.throttled"
      });
      this.addUpdate(() => {
        return !addEventSync(this, {
          type: ReplayEventTypeCustom,
          timestamp: breadcrumb.timestamp || 0,
          data: {
            tag: "breadcrumb",
            payload: breadcrumb,
            metric: true
          }
        });
      });
    }
    return res;
  }
  /**
   * This will get the parametrized route name of the current page.
   * This is only available if performance is enabled, and if an instrumented router is used.
   */
  getCurrentRoute() {
    const lastTransaction = this.lastTransaction || getCurrentHub().getScope().getTransaction();
    if (!lastTransaction || !["route", "custom"].includes(lastTransaction.metadata.source)) {
      return void 0;
    }
    return lastTransaction.name;
  }
  /**
   * Initialize and start all listeners to varying events (DOM,
   * Performance Observer, Recording, Sentry SDK, etc)
   */
  _initializeRecording() {
    this.setInitialState();
    this._updateSessionActivity();
    this.eventBuffer = createEventBuffer({
      useCompression: this._options.useCompression,
      workerUrl: this._options.workerUrl
    });
    this._removeListeners();
    this._addListeners();
    this._isEnabled = true;
    this._isPaused = false;
    this.startRecording();
  }
  /** A wrapper to conditionally capture exceptions. */
  _handleException(error) {
    DEBUG_BUILD4 && logger.error("[Replay]", error);
    if (DEBUG_BUILD4 && this._options._experiments && this._options._experiments.captureExceptions) {
      captureException(error);
    }
  }
  /**
   * Loads (or refreshes) the current session.
   */
  _initializeSessionForSampling(previousSessionId) {
    const allowBuffering = this._options.errorSampleRate > 0;
    const session = loadOrCreateSession(
      {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
        traceInternals: this._options._experiments.traceInternals,
        previousSessionId
      },
      {
        stickySession: this._options.stickySession,
        sessionSampleRate: this._options.sessionSampleRate,
        allowBuffering
      }
    );
    this.session = session;
  }
  /**
   * Checks and potentially refreshes the current session.
   * Returns false if session is not recorded.
   */
  _checkSession() {
    if (!this.session) {
      return false;
    }
    const currentSession = this.session;
    if (shouldRefreshSession(currentSession, {
      sessionIdleExpire: this.timeouts.sessionIdleExpire,
      maxReplayDuration: this._options.maxReplayDuration
    })) {
      void this._refreshSession(currentSession);
      return false;
    }
    return true;
  }
  /**
   * Refresh a session with a new one.
   * This stops the current session (without forcing a flush, as that would never work since we are expired),
   * and then does a new sampling based on the refreshed session.
   */
  async _refreshSession(session) {
    if (!this._isEnabled) {
      return;
    }
    await this.stop({ reason: "refresh session" });
    this.initializeSampling(session.id);
  }
  /**
   * Adds listeners to record events for the replay
   */
  _addListeners() {
    try {
      WINDOW9.document.addEventListener("visibilitychange", this._handleVisibilityChange);
      WINDOW9.addEventListener("blur", this._handleWindowBlur);
      WINDOW9.addEventListener("focus", this._handleWindowFocus);
      WINDOW9.addEventListener("keydown", this._handleKeyboardEvent);
      if (this.clickDetector) {
        this.clickDetector.addListeners();
      }
      if (!this._hasInitializedCoreListeners) {
        addGlobalListeners(this);
        this._hasInitializedCoreListeners = true;
      }
    } catch (err) {
      this._handleException(err);
    }
    this._performanceCleanupCallback = setupPerformanceObserver(this);
  }
  /**
   * Cleans up listeners that were created in `_addListeners`
   */
  _removeListeners() {
    try {
      WINDOW9.document.removeEventListener("visibilitychange", this._handleVisibilityChange);
      WINDOW9.removeEventListener("blur", this._handleWindowBlur);
      WINDOW9.removeEventListener("focus", this._handleWindowFocus);
      WINDOW9.removeEventListener("keydown", this._handleKeyboardEvent);
      if (this.clickDetector) {
        this.clickDetector.removeListeners();
      }
      if (this._performanceCleanupCallback) {
        this._performanceCleanupCallback();
      }
    } catch (err) {
      this._handleException(err);
    }
  }
  /**
   * Handle when visibility of the page content changes. Opening a new tab will
   * cause the state to change to hidden because of content of current page will
   * be hidden. Likewise, moving a different window to cover the contents of the
   * page will also trigger a change to a hidden state.
   */
  __init() {
    this._handleVisibilityChange = () => {
      if (WINDOW9.document.visibilityState === "visible") {
        this._doChangeToForegroundTasks();
      } else {
        this._doChangeToBackgroundTasks();
      }
    };
  }
  /**
   * Handle when page is blurred
   */
  __init2() {
    this._handleWindowBlur = () => {
      const breadcrumb = createBreadcrumb({
        category: "ui.blur"
      });
      this._doChangeToBackgroundTasks(breadcrumb);
    };
  }
  /**
   * Handle when page is focused
   */
  __init3() {
    this._handleWindowFocus = () => {
      const breadcrumb = createBreadcrumb({
        category: "ui.focus"
      });
      this._doChangeToForegroundTasks(breadcrumb);
    };
  }
  /** Ensure page remains active when a key is pressed. */
  __init4() {
    this._handleKeyboardEvent = (event) => {
      handleKeyboardEvent(this, event);
    };
  }
  /**
   * Tasks to run when we consider a page to be hidden (via blurring and/or visibility)
   */
  _doChangeToBackgroundTasks(breadcrumb) {
    if (!this.session) {
      return;
    }
    const expired = isSessionExpired(this.session, {
      maxReplayDuration: this._options.maxReplayDuration,
      sessionIdleExpire: this.timeouts.sessionIdleExpire
    });
    if (expired) {
      return;
    }
    if (breadcrumb) {
      this._createCustomBreadcrumb(breadcrumb);
    }
    void this.conditionalFlush();
  }
  /**
   * Tasks to run when we consider a page to be visible (via focus and/or visibility)
   */
  _doChangeToForegroundTasks(breadcrumb) {
    if (!this.session) {
      return;
    }
    const isSessionActive = this.checkAndHandleExpiredSession();
    if (!isSessionActive) {
      logInfo("[Replay] Document has become active, but session has expired");
      return;
    }
    if (breadcrumb) {
      this._createCustomBreadcrumb(breadcrumb);
    }
  }
  /**
   * Update user activity (across session lifespans)
   */
  _updateUserActivity(_lastActivity = Date.now()) {
    this._lastActivity = _lastActivity;
  }
  /**
   * Updates the session's last activity timestamp
   */
  _updateSessionActivity(_lastActivity = Date.now()) {
    if (this.session) {
      this.session.lastActivity = _lastActivity;
      this._maybeSaveSession();
    }
  }
  /**
   * Helper to create (and buffer) a replay breadcrumb from a core SDK breadcrumb
   */
  _createCustomBreadcrumb(breadcrumb) {
    this.addUpdate(() => {
      void this.throttledAddEvent({
        type: EventType.Custom,
        timestamp: breadcrumb.timestamp || 0,
        data: {
          tag: "breadcrumb",
          payload: breadcrumb
        }
      });
    });
  }
  /**
   * Observed performance events are added to `this.performanceEntries`. These
   * are included in the replay event before it is finished and sent to Sentry.
   */
  _addPerformanceEntries() {
    const performanceEntries = createPerformanceEntries(this.performanceEntries).concat(this.replayPerformanceEntries);
    this.performanceEntries = [];
    this.replayPerformanceEntries = [];
    return Promise.all(createPerformanceSpans(this, performanceEntries));
  }
  /**
   * Clear _context
   */
  _clearContext() {
    this._context.errorIds.clear();
    this._context.traceIds.clear();
    this._context.urls = [];
  }
  /** Update the initial timestamp based on the buffer content. */
  _updateInitialTimestampFromEventBuffer() {
    const { session, eventBuffer } = this;
    if (!session || !eventBuffer) {
      return;
    }
    if (session.segmentId) {
      return;
    }
    const earliestEvent = eventBuffer.getEarliestTimestamp();
    if (earliestEvent && earliestEvent < this._context.initialTimestamp) {
      this._context.initialTimestamp = earliestEvent;
    }
  }
  /**
   * Return and clear _context
   */
  _popEventContext() {
    const _context = {
      initialTimestamp: this._context.initialTimestamp,
      initialUrl: this._context.initialUrl,
      errorIds: Array.from(this._context.errorIds),
      traceIds: Array.from(this._context.traceIds),
      urls: this._context.urls
    };
    this._clearContext();
    return _context;
  }
  /**
   * Flushes replay event buffer to Sentry.
   *
   * Performance events are only added right before flushing - this is
   * due to the buffered performance observer events.
   *
   * Should never be called directly, only by `flush`
   */
  async _runFlush() {
    const replayId = this.getSessionId();
    if (!this.session || !this.eventBuffer || !replayId) {
      DEBUG_BUILD4 && logger.error("[Replay] No session or eventBuffer found to flush.");
      return;
    }
    await this._addPerformanceEntries();
    if (!this.eventBuffer || !this.eventBuffer.hasEvents) {
      return;
    }
    await addMemoryEntry(this);
    if (!this.eventBuffer) {
      return;
    }
    if (replayId !== this.getSessionId()) {
      return;
    }
    try {
      this._updateInitialTimestampFromEventBuffer();
      const timestamp = Date.now();
      if (timestamp - this._context.initialTimestamp > this._options.maxReplayDuration + 3e4) {
        throw new Error("Session is too long, not sending replay");
      }
      const eventContext = this._popEventContext();
      const segmentId = this.session.segmentId++;
      this._maybeSaveSession();
      const recordingData = await this.eventBuffer.finish();
      await sendReplay({
        replayId,
        recordingData,
        segmentId,
        eventContext,
        session: this.session,
        options: this.getOptions(),
        timestamp
      });
    } catch (err) {
      this._handleException(err);
      void this.stop({ reason: "sendReplay" });
      const client = getClient();
      if (client) {
        client.recordDroppedEvent("send_error", "replay");
      }
    }
  }
  /**
   * Flush recording data to Sentry. Creates a lock so that only a single flush
   * can be active at a time. Do not call this directly.
   */
  __init5() {
    this._flush = async ({
      force = false
    } = {}) => {
      if (!this._isEnabled && !force) {
        return;
      }
      if (!this.checkAndHandleExpiredSession()) {
        DEBUG_BUILD4 && logger.error("[Replay] Attempting to finish replay event after session expired.");
        return;
      }
      if (!this.session) {
        return;
      }
      const start = this.session.started;
      const now = Date.now();
      const duration = now - start;
      this._debouncedFlush.cancel();
      const tooShort = duration < this._options.minReplayDuration;
      const tooLong = duration > this._options.maxReplayDuration + 5e3;
      if (tooShort || tooLong) {
        logInfo(
          `[Replay] Session duration (${Math.floor(duration / 1e3)}s) is too ${tooShort ? "short" : "long"}, not sending replay.`,
          this._options._experiments.traceInternals
        );
        if (tooShort) {
          this._debouncedFlush();
        }
        return;
      }
      const eventBuffer = this.eventBuffer;
      if (eventBuffer && this.session.segmentId === 0 && !eventBuffer.hasCheckout) {
        logInfo("[Replay] Flushing initial segment without checkout.", this._options._experiments.traceInternals);
      }
      if (!this._flushLock) {
        this._flushLock = this._runFlush();
        await this._flushLock;
        this._flushLock = void 0;
        return;
      }
      try {
        await this._flushLock;
      } catch (err) {
        DEBUG_BUILD4 && logger.error(err);
      } finally {
        this._debouncedFlush();
      }
    };
  }
  /** Save the session, if it is sticky */
  _maybeSaveSession() {
    if (this.session && this._options.stickySession) {
      saveSession(this.session);
    }
  }
  /** Handler for rrweb.record.onMutation */
  __init6() {
    this._onMutationHandler = (mutations) => {
      const count = mutations.length;
      const mutationLimit = this._options.mutationLimit;
      const mutationBreadcrumbLimit = this._options.mutationBreadcrumbLimit;
      const overMutationLimit = mutationLimit && count > mutationLimit;
      if (count > mutationBreadcrumbLimit || overMutationLimit) {
        const breadcrumb = createBreadcrumb({
          category: "replay.mutations",
          data: {
            count,
            limit: overMutationLimit
          }
        });
        this._createCustomBreadcrumb(breadcrumb);
      }
      if (overMutationLimit) {
        void this.stop({ reason: "mutationLimit", forceFlush: this.recordingMode === "session" });
        return false;
      }
      return true;
    };
  }
};
function getOption(selectors, defaultSelectors, deprecatedClassOption, deprecatedSelectorOption) {
  const deprecatedSelectors = typeof deprecatedSelectorOption === "string" ? deprecatedSelectorOption.split(",") : [];
  const allSelectors = [
    ...selectors,
    // @deprecated
    ...deprecatedSelectors,
    // sentry defaults
    ...defaultSelectors
  ];
  if (typeof deprecatedClassOption !== "undefined") {
    if (typeof deprecatedClassOption === "string") {
      allSelectors.push(`.${deprecatedClassOption}`);
    }
    consoleSandbox(() => {
      console.warn(
        "[Replay] You are using a deprecated configuration item for privacy. Read the documentation on how to use the new privacy configuration."
      );
    });
  }
  return allSelectors.join(",");
}
function getPrivacyOptions({
  mask,
  unmask,
  block,
  unblock,
  ignore,
  // eslint-disable-next-line deprecation/deprecation
  blockClass,
  // eslint-disable-next-line deprecation/deprecation
  blockSelector,
  // eslint-disable-next-line deprecation/deprecation
  maskTextClass,
  // eslint-disable-next-line deprecation/deprecation
  maskTextSelector,
  // eslint-disable-next-line deprecation/deprecation
  ignoreClass
}) {
  const defaultBlockedElements = ['base[href="/"]'];
  const maskSelector = getOption(mask, [".sentry-mask", "[data-sentry-mask]"], maskTextClass, maskTextSelector);
  const unmaskSelector = getOption(unmask, [".sentry-unmask", "[data-sentry-unmask]"]);
  const options = {
    // We are making the decision to make text and input selectors the same
    maskTextSelector: maskSelector,
    unmaskTextSelector: unmaskSelector,
    blockSelector: getOption(
      block,
      [".sentry-block", "[data-sentry-block]", ...defaultBlockedElements],
      blockClass,
      blockSelector
    ),
    unblockSelector: getOption(unblock, [".sentry-unblock", "[data-sentry-unblock]"]),
    ignoreSelector: getOption(ignore, [".sentry-ignore", "[data-sentry-ignore]", 'input[type="file"]'], ignoreClass)
  };
  if (blockClass instanceof RegExp) {
    options.blockClass = blockClass;
  }
  if (maskTextClass instanceof RegExp) {
    options.maskTextClass = maskTextClass;
  }
  return options;
}
function maskAttribute({
  el,
  key,
  maskAttributes,
  maskAllText,
  privacyOptions,
  value
}) {
  if (!maskAllText) {
    return value;
  }
  if (privacyOptions.unmaskTextSelector && el.matches(privacyOptions.unmaskTextSelector)) {
    return value;
  }
  if (maskAttributes.includes(key) || // Need to mask `value` attribute for `<input>` if it's a button-like
  // type
  key === "value" && el.tagName === "INPUT" && ["submit", "button"].includes(el.getAttribute("type") || "")) {
    return value.replace(/[\S]/g, "*");
  }
  return value;
}
var MEDIA_SELECTORS = 'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]';
var DEFAULT_NETWORK_HEADERS = ["content-length", "content-type", "accept"];
var _initialized = false;
var Replay = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "Replay";
  }
  /**
   * @inheritDoc
   */
  /**
   * Options to pass to `rrweb.record()`
   */
  /**
   * Initial options passed to the replay integration, merged with default values.
   * Note: `sessionSampleRate` and `errorSampleRate` are not required here, as they
   * can only be finally set when setupOnce() is called.
   *
   * @private
   */
  constructor({
    flushMinDelay = DEFAULT_FLUSH_MIN_DELAY,
    flushMaxDelay = DEFAULT_FLUSH_MAX_DELAY,
    minReplayDuration = MIN_REPLAY_DURATION,
    maxReplayDuration = MAX_REPLAY_DURATION,
    stickySession = true,
    useCompression = true,
    workerUrl,
    _experiments = {},
    sessionSampleRate,
    errorSampleRate,
    maskAllText = true,
    maskAllInputs = true,
    blockAllMedia = true,
    mutationBreadcrumbLimit = 750,
    mutationLimit = 1e4,
    slowClickTimeout = 7e3,
    slowClickIgnoreSelectors = [],
    networkDetailAllowUrls = [],
    networkDetailDenyUrls = [],
    networkCaptureBodies = true,
    networkRequestHeaders = [],
    networkResponseHeaders = [],
    mask = [],
    maskAttributes = ["title", "placeholder"],
    unmask = [],
    block = [],
    unblock = [],
    ignore = [],
    maskFn,
    beforeAddRecordingEvent,
    beforeErrorSampling,
    // eslint-disable-next-line deprecation/deprecation
    blockClass,
    // eslint-disable-next-line deprecation/deprecation
    blockSelector,
    // eslint-disable-next-line deprecation/deprecation
    maskInputOptions,
    // eslint-disable-next-line deprecation/deprecation
    maskTextClass,
    // eslint-disable-next-line deprecation/deprecation
    maskTextSelector,
    // eslint-disable-next-line deprecation/deprecation
    ignoreClass
  } = {}) {
    this.name = Replay.id;
    const privacyOptions = getPrivacyOptions({
      mask,
      unmask,
      block,
      unblock,
      ignore,
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      ignoreClass
    });
    this._recordingOptions = {
      maskAllInputs,
      maskAllText,
      maskInputOptions: { ...maskInputOptions || {}, password: true },
      maskTextFn: maskFn,
      maskInputFn: maskFn,
      maskAttributeFn: (key, value, el) => maskAttribute({
        maskAttributes,
        maskAllText,
        privacyOptions,
        key,
        value,
        el
      }),
      ...privacyOptions,
      // Our defaults
      slimDOMOptions: "all",
      inlineStylesheet: true,
      // Disable inline images as it will increase segment/replay size
      inlineImages: false,
      // collect fonts, but be aware that `sentry.io` needs to be an allowed
      // origin for playback
      collectFonts: true,
      errorHandler: (err) => {
        try {
          err.__rrweb__ = true;
        } catch (error) {
        }
      }
    };
    this._initialOptions = {
      flushMinDelay,
      flushMaxDelay,
      minReplayDuration: Math.min(minReplayDuration, MIN_REPLAY_DURATION_LIMIT),
      maxReplayDuration: Math.min(maxReplayDuration, MAX_REPLAY_DURATION),
      stickySession,
      sessionSampleRate,
      errorSampleRate,
      useCompression,
      workerUrl,
      blockAllMedia,
      maskAllInputs,
      maskAllText,
      mutationBreadcrumbLimit,
      mutationLimit,
      slowClickTimeout,
      slowClickIgnoreSelectors,
      networkDetailAllowUrls,
      networkDetailDenyUrls,
      networkCaptureBodies,
      networkRequestHeaders: _getMergedNetworkHeaders(networkRequestHeaders),
      networkResponseHeaders: _getMergedNetworkHeaders(networkResponseHeaders),
      beforeAddRecordingEvent,
      beforeErrorSampling,
      _experiments
    };
    if (typeof sessionSampleRate === "number") {
      console.warn(
        `[Replay] You are passing \`sessionSampleRate\` to the Replay integration.
This option is deprecated and will be removed soon.
Instead, configure \`replaysSessionSampleRate\` directly in the SDK init options, e.g.:
Sentry.init({ replaysSessionSampleRate: ${sessionSampleRate} })`
      );
      this._initialOptions.sessionSampleRate = sessionSampleRate;
    }
    if (typeof errorSampleRate === "number") {
      console.warn(
        `[Replay] You are passing \`errorSampleRate\` to the Replay integration.
This option is deprecated and will be removed soon.
Instead, configure \`replaysOnErrorSampleRate\` directly in the SDK init options, e.g.:
Sentry.init({ replaysOnErrorSampleRate: ${errorSampleRate} })`
      );
      this._initialOptions.errorSampleRate = errorSampleRate;
    }
    if (this._initialOptions.blockAllMedia) {
      this._recordingOptions.blockSelector = !this._recordingOptions.blockSelector ? MEDIA_SELECTORS : `${this._recordingOptions.blockSelector},${MEDIA_SELECTORS}`;
    }
    if (this._isInitialized && isBrowser()) {
      throw new Error("Multiple Sentry Session Replay instances are not supported");
    }
    this._isInitialized = true;
  }
  /** If replay has already been initialized */
  get _isInitialized() {
    return _initialized;
  }
  /** Update _isInitialized */
  set _isInitialized(value) {
    _initialized = value;
  }
  /**
   * Setup and initialize replay container
   */
  setupOnce() {
    if (!isBrowser()) {
      return;
    }
    this._setup();
    setTimeout(() => this._initialize());
  }
  /**
   * Start a replay regardless of sampling rate. Calling this will always
   * create a new session. Will throw an error if replay is already in progress.
   *
   * Creates or loads a session, attaches listeners to varying events (DOM,
   * PerformanceObserver, Recording, Sentry SDK, etc)
   */
  start() {
    if (!this._replay) {
      return;
    }
    this._replay.start();
  }
  /**
   * Start replay buffering. Buffers until `flush()` is called or, if
   * `replaysOnErrorSampleRate` > 0, until an error occurs.
   */
  startBuffering() {
    if (!this._replay) {
      return;
    }
    this._replay.startBuffering();
  }
  /**
   * Currently, this needs to be manually called (e.g. for tests). Sentry SDK
   * does not support a teardown
   */
  stop() {
    if (!this._replay) {
      return Promise.resolve();
    }
    return this._replay.stop({ forceFlush: this._replay.recordingMode === "session" });
  }
  /**
   * If not in "session" recording mode, flush event buffer which will create a new replay.
   * Unless `continueRecording` is false, the replay will continue to record and
   * behave as a "session"-based replay.
   *
   * Otherwise, queue up a flush.
   */
  flush(options) {
    if (!this._replay || !this._replay.isEnabled()) {
      return Promise.resolve();
    }
    return this._replay.sendBufferedReplayOrFlush(options);
  }
  /**
   * Get the current session ID.
   */
  getReplayId() {
    if (!this._replay || !this._replay.isEnabled()) {
      return;
    }
    return this._replay.getSessionId();
  }
  /**
   * Initializes replay.
   */
  _initialize() {
    if (!this._replay) {
      return;
    }
    this._replay.initializeSampling();
  }
  /** Setup the integration. */
  _setup() {
    const finalOptions = loadReplayOptionsFromClient(this._initialOptions);
    this._replay = new ReplayContainer({
      options: finalOptions,
      recordingOptions: this._recordingOptions
    });
  }
};
Replay.__initStatic();
function loadReplayOptionsFromClient(initialOptions) {
  const client = getClient();
  const opt = client && client.getOptions();
  const finalOptions = { sessionSampleRate: 0, errorSampleRate: 0, ...dropUndefinedKeys(initialOptions) };
  if (!opt) {
    consoleSandbox(() => {
      console.warn("SDK client is not available.");
    });
    return finalOptions;
  }
  if (initialOptions.sessionSampleRate == null && // TODO remove once deprecated rates are removed
  initialOptions.errorSampleRate == null && // TODO remove once deprecated rates are removed
  opt.replaysSessionSampleRate == null && opt.replaysOnErrorSampleRate == null) {
    consoleSandbox(() => {
      console.warn(
        "Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set."
      );
    });
  }
  if (typeof opt.replaysSessionSampleRate === "number") {
    finalOptions.sessionSampleRate = opt.replaysSessionSampleRate;
  }
  if (typeof opt.replaysOnErrorSampleRate === "number") {
    finalOptions.errorSampleRate = opt.replaysOnErrorSampleRate;
  }
  return finalOptions;
}
function _getMergedNetworkHeaders(headers) {
  return [...DEFAULT_NETWORK_HEADERS, ...headers.map((header) => header.toLowerCase())];
}

// node_modules/@sentry/browser/esm/debug-build.js
var DEBUG_BUILD5 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;

// node_modules/@sentry/browser/esm/helpers.js
var WINDOW10 = GLOBAL_OBJ;
var ignoreOnError = 0;
function shouldIgnoreOnError() {
  return ignoreOnError > 0;
}
function ignoreNextOnError() {
  ignoreOnError++;
  setTimeout(() => {
    ignoreOnError--;
  });
}
function wrap(fn, options = {}, before) {
  if (typeof fn !== "function") {
    return fn;
  }
  try {
    const wrapper = fn.__sentry_wrapped__;
    if (wrapper) {
      return wrapper;
    }
    if (getOriginalFunction(fn)) {
      return fn;
    }
  } catch (e2) {
    return fn;
  }
  const sentryWrapped = function() {
    const args = Array.prototype.slice.call(arguments);
    try {
      if (before && typeof before === "function") {
        before.apply(this, arguments);
      }
      const wrappedArguments = args.map((arg) => wrap(arg, options));
      return fn.apply(this, wrappedArguments);
    } catch (ex) {
      ignoreNextOnError();
      withScope((scope) => {
        scope.addEventProcessor((event) => {
          if (options.mechanism) {
            addExceptionTypeValue(event, void 0, void 0);
            addExceptionMechanism(event, options.mechanism);
          }
          event.extra = {
            ...event.extra,
            arguments: args
          };
          return event;
        });
        captureException(ex);
      });
      throw ex;
    }
  };
  try {
    for (const property in fn) {
      if (Object.prototype.hasOwnProperty.call(fn, property)) {
        sentryWrapped[property] = fn[property];
      }
    }
  } catch (_oO) {
  }
  markFunctionWrapped(sentryWrapped, fn);
  addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped);
  try {
    const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, "name");
    if (descriptor.configurable) {
      Object.defineProperty(sentryWrapped, "name", {
        get() {
          return fn.name;
        }
      });
    }
  } catch (_oO) {
  }
  return sentryWrapped;
}

// node_modules/@sentry/browser/esm/stack-parsers.js
var UNKNOWN_FUNCTION = "?";
var CHROME_PRIORITY = 30;
var WINJS_PRIORITY = 40;
var GECKO_PRIORITY = 50;
function createFrame(filename, func, lineno, colno) {
  const frame = {
    filename,
    function: func,
    in_app: true
    // All browser frames are considered in_app
  };
  if (lineno !== void 0) {
    frame.lineno = lineno;
  }
  if (colno !== void 0) {
    frame.colno = colno;
  }
  return frame;
}
var chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
var chrome = (line) => {
  const parts = chromeRegex.exec(line);
  if (parts) {
    const isEval = parts[2] && parts[2].indexOf("eval") === 0;
    if (isEval) {
      const subMatch = chromeEvalRegex.exec(parts[2]);
      if (subMatch) {
        parts[2] = subMatch[1];
        parts[3] = subMatch[2];
        parts[4] = subMatch[3];
      }
    }
    const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
    return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
  }
  return;
};
var chromeStackLineParser = [CHROME_PRIORITY, chrome];
var geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
var gecko = (line) => {
  const parts = geckoREgex.exec(line);
  if (parts) {
    const isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
    if (isEval) {
      const subMatch = geckoEvalRegex.exec(parts[3]);
      if (subMatch) {
        parts[1] = parts[1] || "eval";
        parts[3] = subMatch[1];
        parts[4] = subMatch[2];
        parts[5] = "";
      }
    }
    let filename = parts[3];
    let func = parts[1] || UNKNOWN_FUNCTION;
    [func, filename] = extractSafariExtensionDetails(func, filename);
    return createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
  }
  return;
};
var geckoStackLineParser = [GECKO_PRIORITY, gecko];
var winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
var winjs = (line) => {
  const parts = winjsRegex.exec(line);
  return parts ? createFrame(parts[2], parts[1] || UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : void 0) : void 0;
};
var winjsStackLineParser = [WINJS_PRIORITY, winjs];
var defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser, winjsStackLineParser];
var defaultStackParser = createStackParser(...defaultStackLineParsers);
var extractSafariExtensionDetails = (func, filename) => {
  const isSafariExtension = func.indexOf("safari-extension") !== -1;
  const isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
  return isSafariExtension || isSafariWebExtension ? [
    func.indexOf("@") !== -1 ? func.split("@")[0] : UNKNOWN_FUNCTION,
    isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
  ] : [func, filename];
};

// node_modules/@sentry/browser/esm/eventbuilder.js
function exceptionFromError2(stackParser, ex) {
  const frames = parseStackFrames2(stackParser, ex);
  const exception = {
    type: ex && ex.name,
    value: extractMessage(ex)
  };
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  if (exception.type === void 0 && exception.value === "") {
    exception.value = "Unrecoverable error caught";
  }
  return exception;
}
function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
  const hub = getCurrentHub();
  const client = hub.getClient();
  const normalizeDepth = client && client.getOptions().normalizeDepth;
  const event = {
    exception: {
      values: [
        {
          type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
          value: getNonErrorObjectExceptionValue(exception, { isUnhandledRejection })
        }
      ]
    },
    extra: {
      __serialized__: normalizeToSize(exception, normalizeDepth)
    }
  };
  if (syntheticException) {
    const frames = parseStackFrames2(stackParser, syntheticException);
    if (frames.length) {
      event.exception.values[0].stacktrace = { frames };
    }
  }
  return event;
}
function eventFromError(stackParser, ex) {
  return {
    exception: {
      values: [exceptionFromError2(stackParser, ex)]
    }
  };
}
function parseStackFrames2(stackParser, ex) {
  const stacktrace = ex.stacktrace || ex.stack || "";
  const popSize = getPopSize(ex);
  try {
    return stackParser(stacktrace, popSize);
  } catch (e2) {
  }
  return [];
}
var reactMinifiedRegexp = /Minified React error #\d+;/i;
function getPopSize(ex) {
  if (ex) {
    if (typeof ex.framesToPop === "number") {
      return ex.framesToPop;
    }
    if (reactMinifiedRegexp.test(ex.message)) {
      return 1;
    }
  }
  return 0;
}
function extractMessage(ex) {
  const message = ex && ex.message;
  if (!message) {
    return "No error message";
  }
  if (message.error && typeof message.error.message === "string") {
    return message.error.message;
  }
  return message;
}
function eventFromException(stackParser, exception, hint, attachStacktrace) {
  const syntheticException = hint && hint.syntheticException || void 0;
  const event = eventFromUnknownInput2(stackParser, exception, syntheticException, attachStacktrace);
  addExceptionMechanism(event);
  event.level = "error";
  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }
  return resolvedSyncPromise(event);
}
function eventFromMessage2(stackParser, message, level = "info", hint, attachStacktrace) {
  const syntheticException = hint && hint.syntheticException || void 0;
  const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
  event.level = level;
  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }
  return resolvedSyncPromise(event);
}
function eventFromUnknownInput2(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
  let event;
  if (isErrorEvent(exception) && exception.error) {
    const errorEvent = exception;
    return eventFromError(stackParser, errorEvent.error);
  }
  if (isDOMError(exception) || isDOMException(exception)) {
    const domException = exception;
    if ("stack" in exception) {
      event = eventFromError(stackParser, exception);
    } else {
      const name = domException.name || (isDOMError(domException) ? "DOMError" : "DOMException");
      const message = domException.message ? `${name}: ${domException.message}` : name;
      event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
      addExceptionTypeValue(event, message);
    }
    if ("code" in domException) {
      event.tags = { ...event.tags, "DOMException.code": `${domException.code}` };
    }
    return event;
  }
  if (isError(exception)) {
    return eventFromError(stackParser, exception);
  }
  if (isPlainObject(exception) || isEvent(exception)) {
    const objectException = exception;
    event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
    addExceptionMechanism(event, {
      synthetic: true
    });
    return event;
  }
  event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
  addExceptionTypeValue(event, `${exception}`, void 0);
  addExceptionMechanism(event, {
    synthetic: true
  });
  return event;
}
function eventFromString(stackParser, input, syntheticException, attachStacktrace) {
  const event = {
    message: input
  };
  if (attachStacktrace && syntheticException) {
    const frames = parseStackFrames2(stackParser, syntheticException);
    if (frames.length) {
      event.exception = {
        values: [{ value: input, stacktrace: { frames } }]
      };
    }
  }
  return event;
}
function getNonErrorObjectExceptionValue(exception, { isUnhandledRejection }) {
  const keys = extractExceptionKeysForMessage(exception);
  const captureType = isUnhandledRejection ? "promise rejection" : "exception";
  if (isErrorEvent(exception)) {
    return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
  }
  if (isEvent(exception)) {
    const className = getObjectClassName(exception);
    return `Event \`${className}\` (type=${exception.type}) captured as ${captureType}`;
  }
  return `Object captured as ${captureType} with keys: ${keys}`;
}
function getObjectClassName(obj) {
  try {
    const prototype = Object.getPrototypeOf(obj);
    return prototype ? prototype.constructor.name : void 0;
  } catch (e2) {
  }
}

// node_modules/@sentry/browser/esm/userfeedback.js
function createUserFeedbackEnvelope(feedback, {
  metadata,
  tunnel,
  dsn
}) {
  const headers = {
    event_id: feedback.event_id,
    sent_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...metadata && metadata.sdk && {
      sdk: {
        name: metadata.sdk.name,
        version: metadata.sdk.version
      }
    },
    ...!!tunnel && !!dsn && { dsn: dsnToString(dsn) }
  };
  const item = createUserFeedbackEnvelopeItem(feedback);
  return createEnvelope(headers, [item]);
}
function createUserFeedbackEnvelopeItem(feedback) {
  const feedbackHeaders = {
    type: "user_report"
  };
  return [feedbackHeaders, feedback];
}

// node_modules/@sentry/browser/esm/client.js
var BrowserClient = class extends BaseClient {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    const sdkSource = WINDOW10.SENTRY_SDK_SOURCE || getSDKSource();
    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: "sentry.javascript.browser",
      packages: [
        {
          name: `${sdkSource}:@sentry/browser`,
          version: SDK_VERSION
        }
      ],
      version: SDK_VERSION
    };
    super(options);
    if (options.sendClientReports && WINDOW10.document) {
      WINDOW10.document.addEventListener("visibilitychange", () => {
        if (WINDOW10.document.visibilityState === "hidden") {
          this._flushOutcomes();
        }
      });
    }
  }
  /**
   * @inheritDoc
   */
  eventFromException(exception, hint) {
    return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */
  eventFromMessage(message, level = "info", hint) {
    return eventFromMessage2(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }
  /**
   * Sends user feedback to Sentry.
   */
  captureUserFeedback(feedback) {
    if (!this._isEnabled()) {
      DEBUG_BUILD5 && logger.warn("SDK not enabled, will not capture user feedback.");
      return;
    }
    const envelope = createUserFeedbackEnvelope(feedback, {
      metadata: this.getSdkMetadata(),
      dsn: this.getDsn(),
      tunnel: this.getOptions().tunnel
    });
    void this._sendEnvelope(envelope);
  }
  /**
   * @inheritDoc
   */
  _prepareEvent(event, hint, scope) {
    event.platform = event.platform || "javascript";
    return super._prepareEvent(event, hint, scope);
  }
  /**
   * Sends client reports as an envelope.
   */
  _flushOutcomes() {
    const outcomes = this._clearOutcomes();
    if (outcomes.length === 0) {
      DEBUG_BUILD5 && logger.log("No outcomes to send");
      return;
    }
    if (!this._dsn) {
      DEBUG_BUILD5 && logger.log("No dsn provided, will not send outcomes");
      return;
    }
    DEBUG_BUILD5 && logger.log("Sending outcomes:", outcomes);
    const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
    void this._sendEnvelope(envelope);
  }
};

// node_modules/@sentry/browser/esm/integrations/globalhandlers.js
var GlobalHandlers = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "GlobalHandlers";
  }
  /**
   * @inheritDoc
   */
  /** JSDoc */
  /**
   * Stores references functions to installing handlers. Will set to undefined
   * after they have been run so that they are not used twice.
   */
  /** JSDoc */
  constructor(options) {
    this.name = GlobalHandlers.id;
    this._options = {
      onerror: true,
      onunhandledrejection: true,
      ...options
    };
    this._installFunc = {
      onerror: _installGlobalOnErrorHandler,
      onunhandledrejection: _installGlobalOnUnhandledRejectionHandler
    };
  }
  /**
   * @inheritDoc
   */
  setupOnce() {
    Error.stackTraceLimit = 50;
    const options = this._options;
    for (const key in options) {
      const installFunc = this._installFunc[key];
      if (installFunc && options[key]) {
        globalHandlerLog(key);
        installFunc();
        this._installFunc[key] = void 0;
      }
    }
  }
};
GlobalHandlers.__initStatic();
function _installGlobalOnErrorHandler() {
  addGlobalErrorInstrumentationHandler((data) => {
    const [hub, stackParser, attachStacktrace] = getHubAndOptions();
    if (!hub.getIntegration(GlobalHandlers)) {
      return;
    }
    const { msg, url, line, column, error } = data;
    if (shouldIgnoreOnError()) {
      return;
    }
    const event = error === void 0 && isString(msg) ? _eventFromIncompleteOnError(msg, url, line, column) : _enhanceEventWithInitialFrame(
      eventFromUnknownInput2(stackParser, error || msg, void 0, attachStacktrace, false),
      url,
      line,
      column
    );
    event.level = "error";
    hub.captureEvent(event, {
      originalException: error,
      mechanism: {
        handled: false,
        type: "onerror"
      }
    });
  });
}
function _installGlobalOnUnhandledRejectionHandler() {
  addGlobalUnhandledRejectionInstrumentationHandler((e2) => {
    const [hub, stackParser, attachStacktrace] = getHubAndOptions();
    if (!hub.getIntegration(GlobalHandlers)) {
      return;
    }
    if (shouldIgnoreOnError()) {
      return true;
    }
    const error = _getUnhandledRejectionError(e2);
    const event = isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventFromUnknownInput2(stackParser, error, void 0, attachStacktrace, true);
    event.level = "error";
    hub.captureEvent(event, {
      originalException: error,
      mechanism: {
        handled: false,
        type: "onunhandledrejection"
      }
    });
    return;
  });
}
function _getUnhandledRejectionError(error) {
  if (isPrimitive(error)) {
    return error;
  }
  const e2 = error;
  try {
    if ("reason" in e2) {
      return e2.reason;
    } else if ("detail" in e2 && "reason" in e2.detail) {
      return e2.detail.reason;
    }
  } catch (e22) {
  }
  return error;
}
function _eventFromRejectionWithPrimitive(reason) {
  return {
    exception: {
      values: [
        {
          type: "UnhandledRejection",
          // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
          value: `Non-Error promise rejection captured with value: ${String(reason)}`
        }
      ]
    }
  };
}
function _eventFromIncompleteOnError(msg, url, line, column) {
  const ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
  let message = isErrorEvent(msg) ? msg.message : msg;
  let name = "Error";
  const groups = message.match(ERROR_TYPES_RE);
  if (groups) {
    name = groups[1];
    message = groups[2];
  }
  const event = {
    exception: {
      values: [
        {
          type: name,
          value: message
        }
      ]
    }
  };
  return _enhanceEventWithInitialFrame(event, url, line, column);
}
function _enhanceEventWithInitialFrame(event, url, line, column) {
  const e2 = event.exception = event.exception || {};
  const ev = e2.values = e2.values || [];
  const ev0 = ev[0] = ev[0] || {};
  const ev0s = ev0.stacktrace = ev0.stacktrace || {};
  const ev0sf = ev0s.frames = ev0s.frames || [];
  const colno = isNaN(parseInt(column, 10)) ? void 0 : column;
  const lineno = isNaN(parseInt(line, 10)) ? void 0 : line;
  const filename = isString(url) && url.length > 0 ? url : getLocationHref();
  if (ev0sf.length === 0) {
    ev0sf.push({
      colno,
      filename,
      function: "?",
      in_app: true,
      lineno
    });
  }
  return event;
}
function globalHandlerLog(type) {
  DEBUG_BUILD5 && logger.log(`Global Handler attached: ${type}`);
}
function getHubAndOptions() {
  const hub = getCurrentHub();
  const client = hub.getClient();
  const options = client && client.getOptions() || {
    stackParser: () => [],
    attachStacktrace: false
  };
  return [hub, options.stackParser, options.attachStacktrace];
}

// node_modules/@sentry/browser/esm/integrations/trycatch.js
var DEFAULT_EVENT_TARGET = [
  "EventTarget",
  "Window",
  "Node",
  "ApplicationCache",
  "AudioTrackList",
  "BroadcastChannel",
  "ChannelMergerNode",
  "CryptoOperation",
  "EventSource",
  "FileReader",
  "HTMLUnknownElement",
  "IDBDatabase",
  "IDBRequest",
  "IDBTransaction",
  "KeyOperation",
  "MediaController",
  "MessagePort",
  "ModalWindow",
  "Notification",
  "SVGElementInstance",
  "Screen",
  "SharedWorker",
  "TextTrack",
  "TextTrackCue",
  "TextTrackList",
  "WebSocket",
  "WebSocketWorker",
  "Worker",
  "XMLHttpRequest",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload"
];
var TryCatch = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "TryCatch";
  }
  /**
   * @inheritDoc
   */
  /** JSDoc */
  /**
   * @inheritDoc
   */
  constructor(options) {
    this.name = TryCatch.id;
    this._options = {
      XMLHttpRequest: true,
      eventTarget: true,
      requestAnimationFrame: true,
      setInterval: true,
      setTimeout: true,
      ...options
    };
  }
  /**
   * Wrap timer functions and event targets to catch errors
   * and provide better metadata.
   */
  setupOnce() {
    if (this._options.setTimeout) {
      fill(WINDOW10, "setTimeout", _wrapTimeFunction);
    }
    if (this._options.setInterval) {
      fill(WINDOW10, "setInterval", _wrapTimeFunction);
    }
    if (this._options.requestAnimationFrame) {
      fill(WINDOW10, "requestAnimationFrame", _wrapRAF);
    }
    if (this._options.XMLHttpRequest && "XMLHttpRequest" in WINDOW10) {
      fill(XMLHttpRequest.prototype, "send", _wrapXHR);
    }
    const eventTargetOption = this._options.eventTarget;
    if (eventTargetOption) {
      const eventTarget = Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET;
      eventTarget.forEach(_wrapEventTarget);
    }
  }
};
TryCatch.__initStatic();
function _wrapTimeFunction(original) {
  return function(...args) {
    const originalCallback = args[0];
    args[0] = wrap(originalCallback, {
      mechanism: {
        data: { function: getFunctionName(original) },
        handled: false,
        type: "instrument"
      }
    });
    return original.apply(this, args);
  };
}
function _wrapRAF(original) {
  return function(callback) {
    return original.apply(this, [
      wrap(callback, {
        mechanism: {
          data: {
            function: "requestAnimationFrame",
            handler: getFunctionName(original)
          },
          handled: false,
          type: "instrument"
        }
      })
    ]);
  };
}
function _wrapXHR(originalSend) {
  return function(...args) {
    const xhr = this;
    const xmlHttpRequestProps = ["onload", "onerror", "onprogress", "onreadystatechange"];
    xmlHttpRequestProps.forEach((prop) => {
      if (prop in xhr && typeof xhr[prop] === "function") {
        fill(xhr, prop, function(original) {
          const wrapOptions = {
            mechanism: {
              data: {
                function: prop,
                handler: getFunctionName(original)
              },
              handled: false,
              type: "instrument"
            }
          };
          const originalFunction = getOriginalFunction(original);
          if (originalFunction) {
            wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
          }
          return wrap(original, wrapOptions);
        });
      }
    });
    return originalSend.apply(this, args);
  };
}
function _wrapEventTarget(target) {
  const globalObject = WINDOW10;
  const proto = globalObject[target] && globalObject[target].prototype;
  if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty("addEventListener")) {
    return;
  }
  fill(proto, "addEventListener", function(original) {
    return function(eventName, fn, options) {
      try {
        if (typeof fn.handleEvent === "function") {
          fn.handleEvent = wrap(fn.handleEvent, {
            mechanism: {
              data: {
                function: "handleEvent",
                handler: getFunctionName(fn),
                target
              },
              handled: false,
              type: "instrument"
            }
          });
        }
      } catch (err) {
      }
      return original.apply(this, [
        eventName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wrap(fn, {
          mechanism: {
            data: {
              function: "addEventListener",
              handler: getFunctionName(fn),
              target
            },
            handled: false,
            type: "instrument"
          }
        }),
        options
      ]);
    };
  });
  fill(
    proto,
    "removeEventListener",
    function(originalRemoveEventListener) {
      return function(eventName, fn, options) {
        const wrappedEventHandler = fn;
        try {
          const originalEventHandler = wrappedEventHandler && wrappedEventHandler.__sentry_wrapped__;
          if (originalEventHandler) {
            originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
          }
        } catch (e2) {
        }
        return originalRemoveEventListener.call(this, eventName, wrappedEventHandler, options);
      };
    }
  );
}

// node_modules/@sentry/browser/esm/integrations/linkederrors.js
var DEFAULT_KEY2 = "cause";
var DEFAULT_LIMIT2 = 5;
var LinkedErrors2 = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "LinkedErrors";
  }
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    this.name = LinkedErrors2.id;
    this._key = options.key || DEFAULT_KEY2;
    this._limit = options.limit || DEFAULT_LIMIT2;
  }
  /** @inheritdoc */
  setupOnce() {
  }
  /**
   * @inheritDoc
   */
  preprocessEvent(event, hint, client) {
    const options = client.getOptions();
    applyAggregateErrorsToEvent(
      exceptionFromError2,
      options.stackParser,
      options.maxValueLength,
      this._key,
      this._limit,
      event,
      hint
    );
  }
};
LinkedErrors2.__initStatic();

// node_modules/@sentry/browser/esm/integrations/httpcontext.js
var HttpContext = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "HttpContext";
  }
  /**
   * @inheritDoc
   */
  constructor() {
    this.name = HttpContext.id;
  }
  /**
   * @inheritDoc
   */
  setupOnce() {
  }
  /** @inheritDoc */
  preprocessEvent(event) {
    if (!WINDOW10.navigator && !WINDOW10.location && !WINDOW10.document) {
      return;
    }
    const url = event.request && event.request.url || WINDOW10.location && WINDOW10.location.href;
    const { referrer } = WINDOW10.document || {};
    const { userAgent } = WINDOW10.navigator || {};
    const headers = {
      ...event.request && event.request.headers,
      ...referrer && { Referer: referrer },
      ...userAgent && { "User-Agent": userAgent }
    };
    const request = { ...event.request, ...url && { url }, headers };
    event.request = request;
  }
};
HttpContext.__initStatic();

// node_modules/@sentry/browser/esm/integrations/dedupe.js
var Dedupe = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "Dedupe";
  }
  /**
   * @inheritDoc
   */
  /**
   * @inheritDoc
   */
  constructor() {
    this.name = Dedupe.id;
  }
  /** @inheritDoc */
  setupOnce(_addGlobaleventProcessor, _getCurrentHub) {
  }
  /**
   * @inheritDoc
   */
  processEvent(currentEvent) {
    if (currentEvent.type) {
      return currentEvent;
    }
    try {
      if (_shouldDropEvent2(currentEvent, this._previousEvent)) {
        DEBUG_BUILD5 && logger.warn("Event dropped due to being a duplicate of previously captured event.");
        return null;
      }
    } catch (_oO) {
    }
    return this._previousEvent = currentEvent;
  }
};
Dedupe.__initStatic();
function _shouldDropEvent2(currentEvent, previousEvent) {
  if (!previousEvent) {
    return false;
  }
  if (_isSameMessageEvent(currentEvent, previousEvent)) {
    return true;
  }
  if (_isSameExceptionEvent(currentEvent, previousEvent)) {
    return true;
  }
  return false;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
  const currentMessage = currentEvent.message;
  const previousMessage = previousEvent.message;
  if (!currentMessage && !previousMessage) {
    return false;
  }
  if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
    return false;
  }
  if (currentMessage !== previousMessage) {
    return false;
  }
  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }
  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }
  return true;
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
  const previousException = _getExceptionFromEvent(previousEvent);
  const currentException = _getExceptionFromEvent(currentEvent);
  if (!previousException || !currentException) {
    return false;
  }
  if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
    return false;
  }
  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }
  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }
  return true;
}
function _isSameStacktrace(currentEvent, previousEvent) {
  let currentFrames = _getFramesFromEvent(currentEvent);
  let previousFrames = _getFramesFromEvent(previousEvent);
  if (!currentFrames && !previousFrames) {
    return true;
  }
  if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
    return false;
  }
  currentFrames = currentFrames;
  previousFrames = previousFrames;
  if (previousFrames.length !== currentFrames.length) {
    return false;
  }
  for (let i = 0; i < previousFrames.length; i++) {
    const frameA = previousFrames[i];
    const frameB = currentFrames[i];
    if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
      return false;
    }
  }
  return true;
}
function _isSameFingerprint(currentEvent, previousEvent) {
  let currentFingerprint = currentEvent.fingerprint;
  let previousFingerprint = previousEvent.fingerprint;
  if (!currentFingerprint && !previousFingerprint) {
    return true;
  }
  if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
    return false;
  }
  currentFingerprint = currentFingerprint;
  previousFingerprint = previousFingerprint;
  try {
    return !!(currentFingerprint.join("") === previousFingerprint.join(""));
  } catch (_oO) {
    return false;
  }
}
function _getExceptionFromEvent(event) {
  return event.exception && event.exception.values && event.exception.values[0];
}
function _getFramesFromEvent(event) {
  const exception = event.exception;
  if (exception) {
    try {
      return exception.values[0].stacktrace.frames;
    } catch (_oO) {
      return void 0;
    }
  }
  return void 0;
}

// node_modules/@sentry/browser/esm/integrations/breadcrumbs.js
var MAX_ALLOWED_STRING_LENGTH = 1024;
var Breadcrumbs = class {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = "Breadcrumbs";
  }
  /**
   * @inheritDoc
   */
  /**
   * Options of the breadcrumbs integration.
   */
  // This field is public, because we use it in the browser client to check if the `sentry` option is enabled.
  /**
   * @inheritDoc
   */
  constructor(options) {
    this.name = Breadcrumbs.id;
    this.options = {
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true,
      ...options
    };
  }
  /**
   * Instrument browser built-ins w/ breadcrumb capturing
   *  - Console API
   *  - DOM API (click/typing)
   *  - XMLHttpRequest API
   *  - Fetch API
   *  - History API
   */
  setupOnce() {
    if (this.options.console) {
      addConsoleInstrumentationHandler(_consoleBreadcrumb);
    }
    if (this.options.dom) {
      addClickKeypressInstrumentationHandler(_domBreadcrumb(this.options.dom));
    }
    if (this.options.xhr) {
      addXhrInstrumentationHandler(_xhrBreadcrumb);
    }
    if (this.options.fetch) {
      addFetchInstrumentationHandler(_fetchBreadcrumb);
    }
    if (this.options.history) {
      addHistoryInstrumentationHandler(_historyBreadcrumb);
    }
    if (this.options.sentry) {
      const client = getClient();
      client && client.on && client.on("beforeSendEvent", addSentryBreadcrumb);
    }
  }
};
Breadcrumbs.__initStatic();
function addSentryBreadcrumb(event) {
  getCurrentHub().addBreadcrumb(
    {
      category: `sentry.${event.type === "transaction" ? "transaction" : "event"}`,
      event_id: event.event_id,
      level: event.level,
      message: getEventDescription(event)
    },
    {
      event
    }
  );
}
function _domBreadcrumb(dom) {
  function _innerDomBreadcrumb(handlerData) {
    let target;
    let keyAttrs = typeof dom === "object" ? dom.serializeAttribute : void 0;
    let maxStringLength = typeof dom === "object" && typeof dom.maxStringLength === "number" ? dom.maxStringLength : void 0;
    if (maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH) {
      DEBUG_BUILD5 && logger.warn(
        `\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`
      );
      maxStringLength = MAX_ALLOWED_STRING_LENGTH;
    }
    if (typeof keyAttrs === "string") {
      keyAttrs = [keyAttrs];
    }
    try {
      const event = handlerData.event;
      target = _isEvent(event) ? htmlTreeAsString(event.target, { keyAttrs, maxStringLength }) : htmlTreeAsString(event, { keyAttrs, maxStringLength });
    } catch (e2) {
      target = "<unknown>";
    }
    if (target.length === 0) {
      return;
    }
    getCurrentHub().addBreadcrumb(
      {
        category: `ui.${handlerData.name}`,
        message: target
      },
      {
        event: handlerData.event,
        name: handlerData.name,
        global: handlerData.global
      }
    );
  }
  return _innerDomBreadcrumb;
}
function _consoleBreadcrumb(handlerData) {
  const breadcrumb = {
    category: "console",
    data: {
      arguments: handlerData.args,
      logger: "console"
    },
    level: severityLevelFromString(handlerData.level),
    message: safeJoin(handlerData.args, " ")
  };
  if (handlerData.level === "assert") {
    if (handlerData.args[0] === false) {
      breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1), " ") || "console.assert"}`;
      breadcrumb.data.arguments = handlerData.args.slice(1);
    } else {
      return;
    }
  }
  getCurrentHub().addBreadcrumb(breadcrumb, {
    input: handlerData.args,
    level: handlerData.level
  });
}
function _xhrBreadcrumb(handlerData) {
  const { startTimestamp, endTimestamp } = handlerData;
  const sentryXhrData = handlerData.xhr[SENTRY_XHR_DATA_KEY];
  if (!startTimestamp || !endTimestamp || !sentryXhrData) {
    return;
  }
  const { method, url, status_code, body } = sentryXhrData;
  const data = {
    method,
    url,
    status_code
  };
  const hint = {
    xhr: handlerData.xhr,
    input: body,
    startTimestamp,
    endTimestamp
  };
  getCurrentHub().addBreadcrumb(
    {
      category: "xhr",
      data,
      type: "http"
    },
    hint
  );
}
function _fetchBreadcrumb(handlerData) {
  const { startTimestamp, endTimestamp } = handlerData;
  if (!endTimestamp) {
    return;
  }
  if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === "POST") {
    return;
  }
  if (handlerData.error) {
    const data = handlerData.fetchData;
    const hint = {
      data: handlerData.error,
      input: handlerData.args,
      startTimestamp,
      endTimestamp
    };
    getCurrentHub().addBreadcrumb(
      {
        category: "fetch",
        data,
        level: "error",
        type: "http"
      },
      hint
    );
  } else {
    const response = handlerData.response;
    const data = {
      ...handlerData.fetchData,
      status_code: response && response.status
    };
    const hint = {
      input: handlerData.args,
      response,
      startTimestamp,
      endTimestamp
    };
    getCurrentHub().addBreadcrumb(
      {
        category: "fetch",
        data,
        type: "http"
      },
      hint
    );
  }
}
function _historyBreadcrumb(handlerData) {
  let from = handlerData.from;
  let to = handlerData.to;
  const parsedLoc = parseUrl2(WINDOW10.location.href);
  let parsedFrom = from ? parseUrl2(from) : void 0;
  const parsedTo = parseUrl2(to);
  if (!parsedFrom || !parsedFrom.path) {
    parsedFrom = parsedLoc;
  }
  if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) {
    to = parsedTo.relative;
  }
  if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) {
    from = parsedFrom.relative;
  }
  getCurrentHub().addBreadcrumb({
    category: "navigation",
    data: {
      from,
      to
    }
  });
}
function _isEvent(event) {
  return !!event && !!event.target;
}

// node_modules/@sentry/browser/esm/transports/utils.js
var cachedFetchImpl = void 0;
function getNativeFetchImplementation() {
  if (cachedFetchImpl) {
    return cachedFetchImpl;
  }
  if (isNativeFetch(WINDOW10.fetch)) {
    return cachedFetchImpl = WINDOW10.fetch.bind(WINDOW10);
  }
  const document2 = WINDOW10.document;
  let fetchImpl = WINDOW10.fetch;
  if (document2 && typeof document2.createElement === "function") {
    try {
      const sandbox = document2.createElement("iframe");
      sandbox.hidden = true;
      document2.head.appendChild(sandbox);
      const contentWindow = sandbox.contentWindow;
      if (contentWindow && contentWindow.fetch) {
        fetchImpl = contentWindow.fetch;
      }
      document2.head.removeChild(sandbox);
    } catch (e2) {
      DEBUG_BUILD5 && logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", e2);
    }
  }
  return cachedFetchImpl = fetchImpl.bind(WINDOW10);
}
function clearCachedFetchImplementation() {
  cachedFetchImpl = void 0;
}

// node_modules/@sentry/browser/esm/transports/fetch.js
function makeFetchTransport(options, nativeFetch = getNativeFetchImplementation()) {
  let pendingBodySize = 0;
  let pendingCount = 0;
  function makeRequest(request) {
    const requestSize = request.body.length;
    pendingBodySize += requestSize;
    pendingCount++;
    const requestOptions = {
      body: request.body,
      method: "POST",
      referrerPolicy: "origin",
      headers: options.headers,
      // Outgoing requests are usually cancelled when navigating to a different page, causing a "TypeError: Failed to
      // fetch" error and sending a "network_error" client-outcome - in Chrome, the request status shows "(cancelled)".
      // The `keepalive` flag keeps outgoing requests alive, even when switching pages. We want this since we're
      // frequently sending events right before the user is switching pages (eg. whenfinishing navigation transactions).
      // Gotchas:
      // - `keepalive` isn't supported by Firefox
      // - As per spec (https://fetch.spec.whatwg.org/#http-network-or-cache-fetch):
      //   If the sum of contentLength and inflightKeepaliveBytes is greater than 64 kibibytes, then return a network error.
      //   We will therefore only activate the flag when we're below that limit.
      // There is also a limit of requests that can be open at the same time, so we also limit this to 15
      // See https://github.com/getsentry/sentry-javascript/pull/7553 for details
      keepalive: pendingBodySize <= 6e4 && pendingCount < 15,
      ...options.fetchOptions
    };
    try {
      return nativeFetch(options.url, requestOptions).then((response) => {
        pendingBodySize -= requestSize;
        pendingCount--;
        return {
          statusCode: response.status,
          headers: {
            "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
            "retry-after": response.headers.get("Retry-After")
          }
        };
      });
    } catch (e2) {
      clearCachedFetchImplementation();
      pendingBodySize -= requestSize;
      pendingCount--;
      return rejectedSyncPromise(e2);
    }
  }
  return createTransport(options, makeRequest);
}

// node_modules/@sentry/browser/esm/transports/xhr.js
var XHR_READYSTATE_DONE = 4;
function makeXHRTransport(options) {
  function makeRequest(request) {
    return new SyncPromise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XHR_READYSTATE_DONE) {
          resolve({
            statusCode: xhr.status,
            headers: {
              "x-sentry-rate-limits": xhr.getResponseHeader("X-Sentry-Rate-Limits"),
              "retry-after": xhr.getResponseHeader("Retry-After")
            }
          });
        }
      };
      xhr.open("POST", options.url);
      for (const header in options.headers) {
        if (Object.prototype.hasOwnProperty.call(options.headers, header)) {
          xhr.setRequestHeader(header, options.headers[header]);
        }
      }
      xhr.send(request.body);
    });
  }
  return createTransport(options, makeRequest);
}

// node_modules/@sentry/browser/esm/sdk.js
var defaultIntegrations = [
  new integrations_exports.InboundFilters(),
  new integrations_exports.FunctionToString(),
  new TryCatch(),
  new Breadcrumbs(),
  new GlobalHandlers(),
  new LinkedErrors2(),
  new Dedupe(),
  new HttpContext()
];
function init(options = {}) {
  if (options.defaultIntegrations === void 0) {
    options.defaultIntegrations = defaultIntegrations;
  }
  if (options.release === void 0) {
    if (typeof __SENTRY_RELEASE__ === "string") {
      options.release = __SENTRY_RELEASE__;
    }
    if (WINDOW10.SENTRY_RELEASE && WINDOW10.SENTRY_RELEASE.id) {
      options.release = WINDOW10.SENTRY_RELEASE.id;
    }
  }
  if (options.autoSessionTracking === void 0) {
    options.autoSessionTracking = true;
  }
  if (options.sendClientReports === void 0) {
    options.sendClientReports = true;
  }
  const clientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || (supportsFetch() ? makeFetchTransport : makeXHRTransport)
  };
  initAndBind(BrowserClient, clientOptions);
  if (options.autoSessionTracking) {
    startSessionTracking();
  }
}
function startSessionOnHub(hub) {
  hub.startSession({ ignoreDuration: true });
  hub.captureSession();
}
function startSessionTracking() {
  if (typeof WINDOW10.document === "undefined") {
    DEBUG_BUILD5 && logger.warn("Session tracking in non-browser environment with @sentry/browser is not supported.");
    return;
  }
  const hub = getCurrentHub();
  if (!hub.captureSession) {
    return;
  }
  startSessionOnHub(hub);
  addHistoryInstrumentationHandler(({ from, to }) => {
    if (from !== void 0 && from !== to) {
      startSessionOnHub(getCurrentHub());
    }
  });
}

// node_modules/@sentry/browser/esm/profiling/utils.js
var MS_TO_NS = 1e6;
var THREAD_ID_STRING = String(0);
var THREAD_NAME = "main";
var OS_PLATFORM = "";
var OS_PLATFORM_VERSION = "";
var OS_ARCH = "";
var OS_BROWSER = WINDOW10.navigator && WINDOW10.navigator.userAgent || "";
var OS_MODEL = "";
var OS_LOCALE = WINDOW10.navigator && WINDOW10.navigator.language || WINDOW10.navigator && WINDOW10.navigator.languages && WINDOW10.navigator.languages[0] || "";
function isUserAgentData(data) {
  return typeof data === "object" && data !== null && "getHighEntropyValues" in data;
}
var userAgentData = WINDOW10.navigator && WINDOW10.navigator.userAgentData;
if (isUserAgentData(userAgentData)) {
  userAgentData.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"]).then((ua) => {
    OS_PLATFORM = ua.platform || "";
    OS_ARCH = ua.architecture || "";
    OS_MODEL = ua.model || "";
    OS_PLATFORM_VERSION = ua.platformVersion || "";
    if (ua.fullVersionList && ua.fullVersionList.length > 0) {
      const firstUa = ua.fullVersionList[ua.fullVersionList.length - 1];
      OS_BROWSER = `${firstUa.brand} ${firstUa.version}`;
    }
  }).catch((e2) => void 0);
}
function isProcessedJSSelfProfile(profile) {
  return !("thread_metadata" in profile);
}
function enrichWithThreadInformation(profile) {
  if (!isProcessedJSSelfProfile(profile)) {
    return profile;
  }
  return convertJSSelfProfileToSampledFormat(profile);
}
function getTraceId(event) {
  const traceId = event && event.contexts && event.contexts["trace"] && event.contexts["trace"]["trace_id"];
  if (typeof traceId === "string" && traceId.length !== 32) {
    if (DEBUG_BUILD5) {
      logger.log(`[Profiling] Invalid traceId: ${traceId} on profiled event`);
    }
  }
  if (typeof traceId !== "string") {
    return "";
  }
  return traceId;
}
function createProfilePayload(profile_id, start_timestamp, processed_profile, event) {
  if (event.type !== "transaction") {
    throw new TypeError("Profiling events may only be attached to transactions, this should never occur.");
  }
  if (processed_profile === void 0 || processed_profile === null) {
    throw new TypeError(
      `Cannot construct profiling event envelope without a valid profile. Got ${processed_profile} instead.`
    );
  }
  const traceId = getTraceId(event);
  const enrichedThreadProfile = enrichWithThreadInformation(processed_profile);
  const transactionStartMs = start_timestamp ? start_timestamp : typeof event.start_timestamp === "number" ? event.start_timestamp * 1e3 : Date.now();
  const transactionEndMs = typeof event.timestamp === "number" ? event.timestamp * 1e3 : Date.now();
  const profile = {
    event_id: profile_id,
    timestamp: new Date(transactionStartMs).toISOString(),
    platform: "javascript",
    version: "1",
    release: event.release || "",
    environment: event.environment || DEFAULT_ENVIRONMENT,
    runtime: {
      name: "javascript",
      version: WINDOW10.navigator.userAgent
    },
    os: {
      name: OS_PLATFORM,
      version: OS_PLATFORM_VERSION,
      build_number: OS_BROWSER
    },
    device: {
      locale: OS_LOCALE,
      model: OS_MODEL,
      manufacturer: OS_BROWSER,
      architecture: OS_ARCH,
      is_emulator: false
    },
    debug_meta: {
      images: applyDebugMetadata(processed_profile.resources)
    },
    profile: enrichedThreadProfile,
    transactions: [
      {
        name: event.transaction || "",
        id: event.event_id || uuid4(),
        trace_id: traceId,
        active_thread_id: THREAD_ID_STRING,
        relative_start_ns: "0",
        relative_end_ns: ((transactionEndMs - transactionStartMs) * 1e6).toFixed(0)
      }
    ]
  };
  return profile;
}
function isAutomatedPageLoadTransaction(transaction) {
  return transaction.op === "pageload";
}
function convertJSSelfProfileToSampledFormat(input) {
  let EMPTY_STACK_ID = void 0;
  let STACK_ID = 0;
  const profile = {
    samples: [],
    stacks: [],
    frames: [],
    thread_metadata: {
      [THREAD_ID_STRING]: { name: THREAD_NAME }
    }
  };
  if (!input.samples.length) {
    return profile;
  }
  const start = input.samples[0].timestamp;
  const origin = typeof performance.timeOrigin === "number" ? performance.timeOrigin : browserPerformanceTimeOrigin || 0;
  const adjustForOriginChange = origin - (browserPerformanceTimeOrigin || origin);
  for (let i = 0; i < input.samples.length; i++) {
    const jsSample = input.samples[i];
    if (jsSample.stackId === void 0) {
      if (EMPTY_STACK_ID === void 0) {
        EMPTY_STACK_ID = STACK_ID;
        profile.stacks[EMPTY_STACK_ID] = [];
        STACK_ID++;
      }
      profile["samples"][i] = {
        // convert ms timestamp to ns
        elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * MS_TO_NS).toFixed(0),
        stack_id: EMPTY_STACK_ID,
        thread_id: THREAD_ID_STRING
      };
      continue;
    }
    let stackTop = input.stacks[jsSample.stackId];
    const stack = [];
    while (stackTop) {
      stack.push(stackTop.frameId);
      const frame = input.frames[stackTop.frameId];
      if (profile.frames[stackTop.frameId] === void 0) {
        profile.frames[stackTop.frameId] = {
          function: frame.name,
          abs_path: typeof frame.resourceId === "number" ? input.resources[frame.resourceId] : void 0,
          lineno: frame.line,
          colno: frame.column
        };
      }
      stackTop = stackTop.parentId === void 0 ? void 0 : input.stacks[stackTop.parentId];
    }
    const sample = {
      // convert ms timestamp to ns
      elapsed_since_start_ns: ((jsSample.timestamp + adjustForOriginChange - start) * MS_TO_NS).toFixed(0),
      stack_id: STACK_ID,
      thread_id: THREAD_ID_STRING
    };
    profile["stacks"][STACK_ID] = stack;
    profile["samples"][i] = sample;
    STACK_ID++;
  }
  return profile;
}
function addProfilesToEnvelope(envelope, profiles) {
  if (!profiles.length) {
    return envelope;
  }
  for (const profile of profiles) {
    envelope[1].push([{ type: "profile" }, profile]);
  }
  return envelope;
}
function findProfiledTransactionsFromEnvelope(envelope) {
  const events = [];
  forEachEnvelopeItem(envelope, (item, type) => {
    if (type !== "transaction") {
      return;
    }
    for (let j = 1; j < item.length; j++) {
      const event = item[j];
      if (event && event.contexts && event.contexts["profile"] && event.contexts["profile"]["profile_id"]) {
        events.push(item[j]);
      }
    }
  });
  return events;
}
var debugIdStackParserCache2 = /* @__PURE__ */ new WeakMap();
function applyDebugMetadata(resource_paths) {
  const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  if (!debugIdMap) {
    return [];
  }
  const hub = getCurrentHub();
  if (!hub) {
    return [];
  }
  const client = hub.getClient();
  if (!client) {
    return [];
  }
  const options = client.getOptions();
  if (!options) {
    return [];
  }
  const stackParser = options.stackParser;
  if (!stackParser) {
    return [];
  }
  let debugIdStackFramesCache;
  const cachedDebugIdStackFrameCache = debugIdStackParserCache2.get(stackParser);
  if (cachedDebugIdStackFrameCache) {
    debugIdStackFramesCache = cachedDebugIdStackFrameCache;
  } else {
    debugIdStackFramesCache = /* @__PURE__ */ new Map();
    debugIdStackParserCache2.set(stackParser, debugIdStackFramesCache);
  }
  const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace) => {
    let parsedStack;
    const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
    if (cachedParsedStack) {
      parsedStack = cachedParsedStack;
    } else {
      parsedStack = stackParser(debugIdStackTrace);
      debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
    }
    for (let i = parsedStack.length - 1; i >= 0; i--) {
      const stackFrame = parsedStack[i];
      const file = stackFrame && stackFrame.filename;
      if (stackFrame && file) {
        acc[file] = debugIdMap[debugIdStackTrace];
        break;
      }
    }
    return acc;
  }, {});
  const images = [];
  for (const path of resource_paths) {
    if (path && filenameDebugIdMap[path]) {
      images.push({
        type: "sourcemap",
        code_file: path,
        debug_id: filenameDebugIdMap[path]
      });
    }
  }
  return images;
}
function isValidSampleRate2(rate) {
  if (typeof rate !== "number" && typeof rate !== "boolean" || typeof rate === "number" && isNaN(rate)) {
    DEBUG_BUILD5 && logger.warn(
      `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        rate
      )} of type ${JSON.stringify(typeof rate)}.`
    );
    return false;
  }
  if (rate === true || rate === false) {
    return true;
  }
  if (rate < 0 || rate > 1) {
    DEBUG_BUILD5 && logger.warn(`[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${rate}.`);
    return false;
  }
  return true;
}
function isValidProfile(profile) {
  if (profile.samples.length < 2) {
    if (DEBUG_BUILD5) {
      logger.log("[Profiling] Discarding profile because it contains less than 2 samples");
    }
    return false;
  }
  if (!profile.frames.length) {
    if (DEBUG_BUILD5) {
      logger.log("[Profiling] Discarding profile because it contains no frames");
    }
    return false;
  }
  return true;
}
var PROFILING_CONSTRUCTOR_FAILED = false;
var MAX_PROFILE_DURATION_MS = 3e4;
function isJSProfilerSupported(maybeProfiler) {
  return typeof maybeProfiler === "function";
}
function startJSSelfProfile() {
  const JSProfilerConstructor = WINDOW10.Profiler;
  if (!isJSProfilerSupported(JSProfilerConstructor)) {
    if (DEBUG_BUILD5) {
      logger.log(
        "[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object."
      );
    }
    return;
  }
  const samplingIntervalMS = 10;
  const maxSamples = Math.floor(MAX_PROFILE_DURATION_MS / samplingIntervalMS);
  try {
    return new JSProfilerConstructor({ sampleInterval: samplingIntervalMS, maxBufferSize: maxSamples });
  } catch (e2) {
    if (DEBUG_BUILD5) {
      logger.log(
        "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header."
      );
      logger.log("[Profiling] Disabling profiling for current user session.");
    }
    PROFILING_CONSTRUCTOR_FAILED = true;
  }
  return;
}
function shouldProfileTransaction(transaction) {
  if (PROFILING_CONSTRUCTOR_FAILED) {
    if (DEBUG_BUILD5) {
      logger.log("[Profiling] Profiling has been disabled for the duration of the current user session.");
    }
    return false;
  }
  if (!transaction.sampled) {
    if (DEBUG_BUILD5) {
      logger.log("[Profiling] Discarding profile because transaction was not sampled.");
    }
    return false;
  }
  const client = getClient();
  const options = client && client.getOptions();
  if (!options) {
    DEBUG_BUILD5 && logger.log("[Profiling] Profiling disabled, no options found.");
    return false;
  }
  const profilesSampleRate = options.profilesSampleRate;
  if (!isValidSampleRate2(profilesSampleRate)) {
    DEBUG_BUILD5 && logger.warn("[Profiling] Discarding profile because of invalid sample rate.");
    return false;
  }
  if (!profilesSampleRate) {
    DEBUG_BUILD5 && logger.log(
      "[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0"
    );
    return false;
  }
  const sampled = profilesSampleRate === true ? true : Math.random() < profilesSampleRate;
  if (!sampled) {
    DEBUG_BUILD5 && logger.log(
      `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(
        profilesSampleRate
      )})`
    );
    return false;
  }
  return true;
}
function createProfilingEvent(profile_id, start_timestamp, profile, event) {
  if (!isValidProfile(profile)) {
    return null;
  }
  return createProfilePayload(profile_id, start_timestamp, profile, event);
}
var PROFILE_MAP = /* @__PURE__ */ new Map();
function getActiveProfilesCount() {
  return PROFILE_MAP.size;
}
function takeProfileFromGlobalCache(profile_id) {
  const profile = PROFILE_MAP.get(profile_id);
  if (profile) {
    PROFILE_MAP.delete(profile_id);
  }
  return profile;
}
function addProfileToGlobalCache(profile_id, profile) {
  PROFILE_MAP.set(profile_id, profile);
  if (PROFILE_MAP.size > 30) {
    const last = PROFILE_MAP.keys().next().value;
    PROFILE_MAP.delete(last);
  }
}

// node_modules/@sentry/browser/esm/profiling/hubextensions.js
function startProfileForTransaction(transaction) {
  let startTimestamp;
  if (isAutomatedPageLoadTransaction(transaction)) {
    startTimestamp = timestampInSeconds() * 1e3;
  }
  const profiler = startJSSelfProfile();
  if (!profiler) {
    return transaction;
  }
  if (DEBUG_BUILD5) {
    logger.log(`[Profiling] started profiling transaction: ${transaction.name || transaction.description}`);
  }
  const profileId = uuid4();
  async function onProfileHandler() {
    if (!transaction) {
      return null;
    }
    if (!profiler) {
      return null;
    }
    return profiler.stop().then((profile) => {
      if (maxDurationTimeoutID) {
        WINDOW10.clearTimeout(maxDurationTimeoutID);
        maxDurationTimeoutID = void 0;
      }
      if (DEBUG_BUILD5) {
        logger.log(`[Profiling] stopped profiling of transaction: ${transaction.name || transaction.description}`);
      }
      if (!profile) {
        if (DEBUG_BUILD5) {
          logger.log(
            `[Profiling] profiler returned null profile for: ${transaction.name || transaction.description}`,
            "this may indicate an overlapping transaction or a call to stopProfiling with a profile title that was never started"
          );
        }
        return null;
      }
      addProfileToGlobalCache(profileId, profile);
      return null;
    }).catch((error) => {
      if (DEBUG_BUILD5) {
        logger.log("[Profiling] error while stopping profiler:", error);
      }
      return null;
    });
  }
  let maxDurationTimeoutID = WINDOW10.setTimeout(() => {
    if (DEBUG_BUILD5) {
      logger.log(
        "[Profiling] max profile duration elapsed, stopping profiling for:",
        transaction.name || transaction.description
      );
    }
    void onProfileHandler();
  }, MAX_PROFILE_DURATION_MS);
  const originalFinish = transaction.finish.bind(transaction);
  function profilingWrappedTransactionFinish() {
    if (!transaction) {
      return originalFinish();
    }
    void onProfileHandler().then(
      () => {
        transaction.setContext("profile", { profile_id: profileId, start_timestamp: startTimestamp });
        originalFinish();
      },
      () => {
        originalFinish();
      }
    );
    return transaction;
  }
  transaction.finish = profilingWrappedTransactionFinish;
  return transaction;
}

// node_modules/@sentry/browser/esm/profiling/integration.js
var BrowserProfilingIntegration = class {
  static __initStatic() {
    this.id = "BrowserProfilingIntegration";
  }
  constructor() {
    this.name = BrowserProfilingIntegration.id;
  }
  /**
   * @inheritDoc
   */
  setupOnce(_addGlobalEventProcessor, getCurrentHub2) {
    this.getCurrentHub = getCurrentHub2;
    const hub = this.getCurrentHub();
    const client = hub.getClient();
    const scope = hub.getScope();
    const transaction = scope.getTransaction();
    if (transaction && isAutomatedPageLoadTransaction(transaction)) {
      if (shouldProfileTransaction(transaction)) {
        startProfileForTransaction(transaction);
      }
    }
    if (client && typeof client.on === "function") {
      client.on("startTransaction", (transaction2) => {
        if (shouldProfileTransaction(transaction2)) {
          startProfileForTransaction(transaction2);
        }
      });
      client.on("beforeEnvelope", (envelope) => {
        if (!getActiveProfilesCount()) {
          return;
        }
        const profiledTransactionEvents = findProfiledTransactionsFromEnvelope(envelope);
        if (!profiledTransactionEvents.length) {
          return;
        }
        const profilesToAddToEnvelope = [];
        for (const profiledTransaction of profiledTransactionEvents) {
          const context = profiledTransaction && profiledTransaction.contexts;
          const profile_id = context && context["profile"] && context["profile"]["profile_id"];
          const start_timestamp = context && context["profile"] && context["profile"]["start_timestamp"];
          if (typeof profile_id !== "string") {
            DEBUG_BUILD5 && logger.log("[Profiling] cannot find profile for a transaction without a profile context");
            continue;
          }
          if (!profile_id) {
            DEBUG_BUILD5 && logger.log("[Profiling] cannot find profile for a transaction without a profile context");
            continue;
          }
          if (context && context["profile"]) {
            delete context.profile;
          }
          const profile = takeProfileFromGlobalCache(profile_id);
          if (!profile) {
            DEBUG_BUILD5 && logger.log(`[Profiling] Could not retrieve profile for transaction: ${profile_id}`);
            continue;
          }
          const profileEvent = createProfilingEvent(
            profile_id,
            start_timestamp,
            profile,
            profiledTransaction
          );
          if (profileEvent) {
            profilesToAddToEnvelope.push(profileEvent);
          }
        }
        addProfilesToEnvelope(envelope, profilesToAddToEnvelope);
      });
    } else {
      logger.warn("[Profiling] Client does not support hooks, profiling will be disabled");
    }
  }
};
BrowserProfilingIntegration.__initStatic();

// node_modules/@sentry/browser/esm/integrations/index.js
var integrations_exports2 = {};
__export(integrations_exports2, {
  Breadcrumbs: () => Breadcrumbs,
  Dedupe: () => Dedupe,
  GlobalHandlers: () => GlobalHandlers,
  HttpContext: () => HttpContext,
  LinkedErrors: () => LinkedErrors2,
  TryCatch: () => TryCatch
});

// node_modules/@sentry/browser/esm/index.js
var windowIntegrations = {};
if (WINDOW10.Sentry && WINDOW10.Sentry.Integrations) {
  windowIntegrations = WINDOW10.Sentry.Integrations;
}
var INTEGRATIONS = {
  ...windowIntegrations,
  ...integrations_exports,
  ...integrations_exports2
};

// node_modules/@sentry/react/esm/sdk.js
function init2(options) {
  const opts = {
    _metadata: {},
    ...options
  };
  opts._metadata.sdk = opts._metadata.sdk || {
    name: "sentry.javascript.react",
    packages: [
      {
        name: "npm:@sentry/react",
        version: SDK_VERSION
      }
    ],
    version: SDK_VERSION
  };
  init(opts);
}

// node_modules/@sentry/remix/esm/client/performance.js
var React = __toESM(require_react());
var DEFAULT_TAGS = {
  "routing.instrumentation": "remix-router"
};
var activeTransaction;
var _useEffect;
var _useLocation;
var _useMatches;
var _customStartTransaction;
var _startTransactionOnLocationChange;
function getInitPathName() {
  if (WINDOW10 && WINDOW10.location) {
    return WINDOW10.location.pathname;
  }
  return void 0;
}
function remixRouterInstrumentation(useEffect, useLocation, useMatches) {
  return (customStartTransaction, startTransactionOnPageLoad = true, startTransactionOnLocationChange = true) => {
    const initPathName = getInitPathName();
    if (startTransactionOnPageLoad && initPathName) {
      activeTransaction = customStartTransaction({
        name: initPathName,
        op: "pageload",
        origin: "auto.pageload.remix",
        tags: DEFAULT_TAGS,
        metadata: {
          source: "url"
        }
      });
    }
    _useEffect = useEffect;
    _useLocation = useLocation;
    _useMatches = useMatches;
    _customStartTransaction = customStartTransaction;
    _startTransactionOnLocationChange = startTransactionOnLocationChange;
  };
}

// node_modules/@sentry/remix/esm/utils/metadata.js
var PACKAGE_NAME_PREFIX = "npm:@sentry/";
function buildMetadata(options, names) {
  options._metadata = options._metadata || {};
  options._metadata.sdk = options._metadata.sdk || {
    name: "sentry.javascript.remix",
    packages: names.map((name) => ({
      name: `${PACKAGE_NAME_PREFIX}${name}`,
      version: SDK_VERSION
    })),
    version: SDK_VERSION
  };
}

// node_modules/@sentry/remix/esm/utils/vendor/response.js
function isRouteErrorResponse(value) {
  const error = value;
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

// node_modules/@sentry/remix/esm/client/errors.js
function captureRemixErrorBoundaryError(error) {
  let eventId;
  const isClientSideRuntimeError = !isNodeEnv() && error instanceof Error;
  const isRemixErrorResponse = isRouteErrorResponse(error) && error.status >= 500;
  if (isRemixErrorResponse || isClientSideRuntimeError) {
    const eventData = isRemixErrorResponse ? {
      function: "ErrorResponse",
      ...getErrorData(error)
    } : {
      function: "ReactError"
    };
    const actualError = isRemixErrorResponse ? getExceptionToCapture(error) : error;
    eventId = captureException(actualError, {
      mechanism: {
        type: "instrument",
        handled: false,
        data: eventData
      }
    });
  }
  return eventId;
}
function getErrorData(error) {
  if (isString(error.data)) {
    return {
      error: error.data
    };
  }
  return error.data;
}
function getExceptionToCapture(error) {
  if (isString(error.data)) {
    return error.data;
  }
  if (error.statusText) {
    return error.statusText;
  }
  return error;
}

// node_modules/@sentry/remix/esm/index.client.js
function init3(options) {
  buildMetadata(options, ["remix", "react"]);
  options.environment = options.environment || "development";
  init2(options);
  configureScope((scope) => {
    scope.setTag("runtime", "browser");
  });
}

export {
  BrowserTracing,
  Replay,
  BrowserProfilingIntegration,
  remixRouterInstrumentation,
  captureRemixErrorBoundaryError,
  init3 as init
};
//# sourceMappingURL=/build/_shared/chunk-YYXIFXT3.js.map
