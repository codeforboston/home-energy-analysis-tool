import {
  Checkbox
} from "/build/_shared/chunk-XCP7KESD.js";
import {
  Input,
  Label
} from "/build/_shared/chunk-Q7H7MHNO.js";
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
  require_react
} from "/build/_shared/chunk-BOXFZXVX.js";
import {
  __export,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// node_modules/@conform-to/react/_virtual/_rollupPluginBabelHelpers.mjs
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input2, hint) {
  if (typeof input2 !== "object" || input2 === null)
    return input2;
  var prim = input2[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input2, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input2);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

// node_modules/@conform-to/dom/dom.mjs
function isFormControl(element) {
  return element instanceof Element && (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA" || element.tagName === "BUTTON");
}
function isFocusableFormControl(element) {
  return isFormControl(element) && element.willValidate && element.type !== "submit";
}
function getFormAction(event) {
  var _ref, _submitter$getAttribu;
  var form = event.target;
  var submitter = event.submitter;
  return (_ref = (_submitter$getAttribu = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) !== null && _submitter$getAttribu !== void 0 ? _submitter$getAttribu : form.getAttribute("action")) !== null && _ref !== void 0 ? _ref : "".concat(location.pathname).concat(location.search);
}
function getFormEncType(event) {
  var _submitter$getAttribu2;
  var form = event.target;
  var submitter = event.submitter;
  var encType = (_submitter$getAttribu2 = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formenctype")) !== null && _submitter$getAttribu2 !== void 0 ? _submitter$getAttribu2 : form.enctype;
  if (encType === "multipart/form-data") {
    return encType;
  }
  return "application/x-www-form-urlencoded";
}
function getFormMethod(event) {
  var _submitter$getAttribu3;
  var form = event.target;
  var submitter = event.submitter;
  var method = (_submitter$getAttribu3 = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) !== null && _submitter$getAttribu3 !== void 0 ? _submitter$getAttribu3 : form.getAttribute("method");
  switch (method) {
    case "post":
    case "put":
    case "patch":
    case "delete":
      return method;
  }
  return "get";
}
function getFormElement(element) {
  var _element$form;
  return element instanceof HTMLFormElement ? element : (_element$form = element === null || element === void 0 ? void 0 : element.form) !== null && _element$form !== void 0 ? _element$form : null;
}
function getFormControls(form) {
  return Array.from(form.elements).filter(isFormControl);
}
function createSubmitter(config) {
  var button = document.createElement("button");
  button.name = config.name;
  button.value = config.value;
  if (config.hidden) {
    button.hidden = true;
  }
  if (config.formAction) {
    button.formAction = config.formAction;
  }
  if (config.formEnctype) {
    button.formEnctype = config.formEnctype;
  }
  if (config.formMethod) {
    button.formMethod = config.formMethod;
  }
  if (config.formNoValidate) {
    button.formNoValidate = true;
  }
  return button;
}
function requestSubmit(form, submitter) {
  var shouldRemoveSubmitter = false;
  if (submitter && !submitter.isConnected) {
    shouldRemoveSubmitter = true;
    form.appendChild(submitter);
  }
  if (typeof form.requestSubmit === "function") {
    form.requestSubmit(submitter);
  } else {
    var event = new SubmitEvent("submit", {
      bubbles: true,
      cancelable: true,
      submitter
    });
    form.dispatchEvent(event);
  }
  if (submitter && shouldRemoveSubmitter) {
    form.removeChild(submitter);
  }
}
function focusFirstInvalidControl(form) {
  for (var element of form.elements) {
    if (isFocusableFormControl(element) && !element.validity.valid) {
      element.focus();
      break;
    }
  }
}

// node_modules/@conform-to/dom/formdata.mjs
function getFormData(form, submitter) {
  var payload = new FormData(form);
  if (submitter && submitter.type === "submit" && submitter.name !== "") {
    payload.append(submitter.name, submitter.value);
  }
  return payload;
}
function getPaths(name) {
  if (!name) {
    return [];
  }
  return name.split(/\.|(\[\d*\])/).reduce((result, segment) => {
    if (typeof segment !== "undefined" && segment !== "") {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        var index = segment.slice(1, -1);
        result.push(Number(index));
      } else {
        result.push(segment);
      }
    }
    return result;
  }, []);
}
function formatPaths(paths) {
  return paths.reduce((name, path) => {
    if (typeof path === "number") {
      return "".concat(name, "[").concat(path, "]");
    }
    if (name === "" || path === "") {
      return [name, path].join("");
    }
    return [name, path].join(".");
  }, "");
}
function setValue(target, name, valueFn) {
  var paths = getPaths(name);
  var length = paths.length;
  var lastIndex = length - 1;
  var index = -1;
  var pointer = target;
  while (pointer != null && ++index < length) {
    var _pointer$key;
    var key = paths[index];
    var nextKey = paths[index + 1];
    var newValue = index != lastIndex ? (_pointer$key = pointer[key]) !== null && _pointer$key !== void 0 ? _pointer$key : typeof nextKey === "number" ? [] : {} : valueFn(pointer[key]);
    pointer[key] = newValue;
    pointer = pointer[key];
  }
}
function resolve(payload) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var data = {};
  var _loop = function _loop2(value2) {
    var _options$ignoreKeys;
    if ((_options$ignoreKeys = options.ignoreKeys) !== null && _options$ignoreKeys !== void 0 && _options$ignoreKeys.includes(key)) {
      return "continue";
    }
    setValue(data, key, (prev) => {
      if (!prev) {
        return value2;
      } else if (Array.isArray(prev)) {
        return prev.concat(value2);
      } else {
        return [prev, value2];
      }
    });
  };
  for (var [key, value] of payload.entries()) {
    var _ret = _loop(value);
    if (_ret === "continue")
      continue;
  }
  return data;
}
function getValidationMessage(errors) {
  var _errors$join;
  return (_errors$join = errors === null || errors === void 0 ? void 0 : errors.join(String.fromCharCode(31))) !== null && _errors$join !== void 0 ? _errors$join : "";
}
function getErrors(validationMessage) {
  if (!validationMessage) {
    return [];
  }
  return validationMessage.split(String.fromCharCode(31));
}

// node_modules/@conform-to/dom/_virtual/_rollupPluginBabelHelpers.mjs
function ownKeys2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread22(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys2(Object(source), true).forEach(function(key) {
      _defineProperty2(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys2(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty2(obj, key, value) {
  key = _toPropertyKey2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive2(input2, hint) {
  if (typeof input2 !== "object" || input2 === null)
    return input2;
  var prim = input2[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input2, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input2);
}
function _toPropertyKey2(arg) {
  var key = _toPrimitive2(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

// node_modules/@conform-to/dom/intent.mjs
var list = new Proxy({}, {
  get(_target, operation) {
    return function(name) {
      var payload = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return {
        name: INTENT,
        value: "list/".concat(JSON.stringify(_objectSpread22({
          name,
          operation
        }, payload))),
        formNoValidate: true
      };
    };
  }
});
var INTENT = "__intent__";
function getIntent(payload) {
  if (!payload.has(INTENT)) {
    return "submit";
  }
  var [intent, secondIntent, ...rest] = payload.getAll(INTENT);
  if (typeof intent !== "string" || secondIntent && intent !== secondIntent || rest.length > 0) {
    throw new Error("The intent could only be set on a button");
  }
  return intent;
}
function validate(field) {
  return {
    name: INTENT,
    value: "validate/".concat(field),
    formNoValidate: true
  };
}
function requestIntent(form, buttonProps) {
  if (!form) {
    console.warn("No form element is provided");
    return;
  }
  var submitter = createSubmitter({
    name: INTENT,
    value: buttonProps.value,
    hidden: true,
    formNoValidate: buttonProps.formNoValidate
  });
  requestSubmit(form, submitter);
}
function parseIntent(intent) {
  var seperatorIndex = intent.indexOf("/");
  if (seperatorIndex > -1) {
    var type = intent.slice(0, seperatorIndex);
    var _payload = intent.slice(seperatorIndex + 1);
    if (typeof _payload !== "undefined") {
      try {
        switch (type) {
          case "validate":
            return {
              type,
              payload: _payload
            };
          case "list":
            return {
              type,
              payload: JSON.parse(_payload)
            };
        }
      } catch (error) {
        throw new Error("Failed parsing intent: ".concat(intent), {
          cause: error
        });
      }
    }
  }
  return null;
}
function updateList(list2, payload) {
  var _payload$index;
  switch (payload.operation) {
    case "prepend":
      list2.unshift(payload.defaultValue);
      break;
    case "append":
      list2.push(payload.defaultValue);
      break;
    case "insert":
      list2.splice((_payload$index = payload.index) !== null && _payload$index !== void 0 ? _payload$index : list2.length, 0, payload.defaultValue);
      break;
    case "replace":
      list2.splice(payload.index, 1, payload.defaultValue);
      break;
    case "remove":
      list2.splice(payload.index, 1);
      break;
    case "reorder":
      list2.splice(payload.to, 0, ...list2.splice(payload.from, 1));
      break;
    default:
      throw new Error("Unknown list intent received");
  }
  return list2;
}

// node_modules/@conform-to/dom/parse.mjs
var VALIDATION_UNDEFINED = "__undefined__";
var VALIDATION_SKIPPED = "__skipped__";
function parse(payload, options) {
  var submission = {
    intent: getIntent(payload),
    payload: resolve(payload, {
      ignoreKeys: [INTENT]
    }),
    error: {}
  };
  var intent = parseIntent(submission.intent);
  if (intent && intent.type === "list") {
    setValue(submission.payload, intent.payload.name, (list2) => {
      if (typeof list2 !== "undefined" && !Array.isArray(list2)) {
        throw new Error("The list intent can only be applied to a list");
      }
      return updateList(list2 !== null && list2 !== void 0 ? list2 : [], intent.payload);
    });
  }
  if (typeof (options === null || options === void 0 ? void 0 : options.resolve) === "undefined") {
    return submission;
  }
  var result = options.resolve(submission.payload, submission.intent);
  var mergeResolveResult = (resolved) => {
    return _objectSpread22(_objectSpread22({}, submission), resolved);
  };
  if (result instanceof Promise) {
    return result.then(mergeResolveResult);
  }
  return mergeResolveResult(result);
}

// node_modules/@conform-to/react/hooks.mjs
var import_react = __toESM(require_react(), 1);
function useNoValidate(defaultNoValidate, validateBeforeHydrate) {
  var [noValidate, setNoValidate] = (0, import_react.useState)(defaultNoValidate || !validateBeforeHydrate);
  (0, import_react.useEffect)(() => {
    setNoValidate(true);
  }, []);
  return noValidate;
}
function useFormRef(userProvidedRef) {
  var formRef = (0, import_react.useRef)(null);
  return userProvidedRef !== null && userProvidedRef !== void 0 ? userProvidedRef : formRef;
}
function useConfigRef(config) {
  var ref = (0, import_react.useRef)(config);
  useSafeLayoutEffect(() => {
    ref.current = config;
  });
  return ref;
}
function useFormReporter(ref, lastSubmission) {
  var [submission, setSubmission] = (0, import_react.useState)(lastSubmission);
  var report = (0, import_react.useCallback)((form, submission2) => {
    var event = new CustomEvent("conform", {
      detail: submission2.intent
    });
    form.dispatchEvent(event);
    setSubmission(submission2);
  }, []);
  (0, import_react.useEffect)(() => {
    var form = ref.current;
    if (!form || !lastSubmission) {
      return;
    }
    if (!lastSubmission.payload) {
      form.reset();
      return;
    }
    report(form, lastSubmission);
  }, [ref, lastSubmission, report]);
  (0, import_react.useEffect)(() => {
    var form = ref.current;
    if (!form || !submission) {
      return;
    }
    reportSubmission(form, submission);
  }, [ref, submission]);
  return report;
}
function useFormError(ref, config) {
  var [error, setError] = (0, import_react.useState)(() => {
    if (!config.initialError) {
      return {};
    }
    var result = {};
    for (var [name, message] of Object.entries(config.initialError)) {
      var [path, ...restPaths] = getPaths(name);
      if (typeof path !== "undefined" && restPaths.length === 0) {
        result[path] = message;
      }
    }
    return result;
  });
  (0, import_react.useEffect)(() => {
    var handleInvalid = (event) => {
      var _config$name;
      var form = getFormElement(ref.current);
      var element = event.target;
      var prefix = (_config$name = config.name) !== null && _config$name !== void 0 ? _config$name : "";
      if (!isFormControl(element) || element.form !== form || !element.name.startsWith(prefix) || !element.dataset.conformTouched) {
        return;
      }
      var name = element.name.slice(prefix.length);
      var [path, ...restPaths] = getPaths(name);
      if (typeof path === "undefined" || restPaths.length > 0) {
        return;
      }
      setError((prev) => {
        if (element.validationMessage === getValidationMessage(prev[path])) {
          return prev;
        }
        return _objectSpread2(_objectSpread2({}, prev), {}, {
          [path]: getErrors(element.validationMessage)
        });
      });
      event.preventDefault();
    };
    var handleReset = (event) => {
      var form = getFormElement(ref.current);
      if (form && event.target === form) {
        setError({});
      }
    };
    document.addEventListener("reset", handleReset);
    document.addEventListener("invalid", handleInvalid, true);
    return () => {
      document.removeEventListener("reset", handleReset);
      document.removeEventListener("invalid", handleInvalid, true);
    };
  }, [ref, config.name]);
  return [error, setError];
}
function useForm() {
  var _config$lastSubmissio3, _config$lastSubmissio4;
  var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var configRef = useConfigRef(config);
  var ref = useFormRef(config.ref);
  var noValidate = useNoValidate(config.noValidate, config.fallbackNative);
  var report = useFormReporter(ref, config.lastSubmission);
  var [errors, setErrors] = (0, import_react.useState)(() => {
    var _config$lastSubmissio, _config$lastSubmissio2;
    return (_config$lastSubmissio = (_config$lastSubmissio2 = config.lastSubmission) === null || _config$lastSubmissio2 === void 0 ? void 0 : _config$lastSubmissio2.error[""]) !== null && _config$lastSubmissio !== void 0 ? _config$lastSubmissio : [];
  });
  var initialError = (0, import_react.useMemo)(() => {
    var _submission$error$sco;
    var submission = config.lastSubmission;
    if (!submission) {
      return {};
    }
    var intent = parseIntent(submission.intent);
    var scope = getScope(intent);
    if (typeof scope !== "string") {
      return submission.error;
    }
    return {
      [scope]: (_submission$error$sco = submission.error[scope]) !== null && _submission$error$sco !== void 0 ? _submission$error$sco : []
    };
  }, [config.lastSubmission]);
  var [defaultValueFromLastSubmission, setDefaultValueFromLastSubmission] = (0, import_react.useState)(
    // @ts-expect-error defaultValue is not in Submission type
    (_config$lastSubmissio3 = (_config$lastSubmissio4 = config.lastSubmission) === null || _config$lastSubmissio4 === void 0 ? void 0 : _config$lastSubmissio4.payload) !== null && _config$lastSubmissio3 !== void 0 ? _config$lastSubmissio3 : null
  );
  var fieldset2 = useFieldset(ref, {
    defaultValue: defaultValueFromLastSubmission !== null && defaultValueFromLastSubmission !== void 0 ? defaultValueFromLastSubmission : config.defaultValue,
    initialError,
    constraint: config.constraint,
    form: config.id
  });
  (0, import_react.useEffect)(() => {
    var createValidateHandler = (type) => (event) => {
      var field = event.target;
      var form2 = ref.current;
      var {
        shouldValidate = "onSubmit",
        shouldRevalidate = shouldValidate
      } = configRef.current;
      if (!form2 || !isFocusableFormControl(field) || field.form !== form2 || !field.name) {
        return;
      }
      if (field.dataset.conformTouched ? shouldRevalidate === type : shouldValidate === type) {
        requestIntent(form2, validate(field.name));
      }
    };
    var handleInvalid = (event) => {
      var form2 = ref.current;
      var field = event.target;
      if (!form2 || !isFormControl(field) || field.form !== form2 || field.name !== FORM_ERROR_ELEMENT_NAME) {
        return;
      }
      event.preventDefault();
      if (field.dataset.conformTouched) {
        setErrors(getErrors(field.validationMessage));
      }
    };
    var handleReset = (event) => {
      var form2 = ref.current;
      if (!form2 || event.target !== form2) {
        return;
      }
      for (var _element of getFormControls(form2)) {
        delete _element.dataset.conformTouched;
        _element.setCustomValidity("");
      }
      setErrors([]);
      setDefaultValueFromLastSubmission(null);
    };
    var handleInput = createValidateHandler("onInput");
    var handleBlur = createValidateHandler("onBlur");
    document.addEventListener("input", handleInput, true);
    document.addEventListener("blur", handleBlur, true);
    document.addEventListener("invalid", handleInvalid, true);
    document.addEventListener("reset", handleReset);
    return () => {
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("blur", handleBlur, true);
      document.removeEventListener("invalid", handleInvalid, true);
      document.removeEventListener("reset", handleReset);
    };
  }, [ref, configRef]);
  var form = {
    ref,
    error: errors[0],
    errors,
    props: {
      ref,
      noValidate,
      onSubmit(event) {
        var form2 = event.currentTarget;
        var nativeEvent = event.nativeEvent;
        var submitter = nativeEvent.submitter;
        if (event.defaultPrevented) {
          return;
        }
        try {
          var _config$onValidate, _config$onValidate2;
          var formData = getFormData(form2, submitter);
          var submission = (_config$onValidate = (_config$onValidate2 = config.onValidate) === null || _config$onValidate2 === void 0 ? void 0 : _config$onValidate2.call(config, {
            form: form2,
            formData
          })) !== null && _config$onValidate !== void 0 ? _config$onValidate : parse(formData);
          var {
            errors: _errors,
            shouldServerValidate
          } = Object.entries(submission.error).reduce((result, _ref) => {
            var [, error] = _ref;
            for (var message of error) {
              if (message === VALIDATION_UNDEFINED) {
                result.shouldServerValidate = true;
              } else if (message !== VALIDATION_SKIPPED) {
                result.errors.push(message);
              }
            }
            return result;
          }, {
            errors: [],
            shouldServerValidate: false
          });
          if (
            // has client validation
            typeof config.onValidate !== "undefined" && // not necessary to validate on the server
            !shouldServerValidate && // client validation failed or non submit intent
            (!config.noValidate && !(submitter !== null && submitter !== void 0 && submitter.formNoValidate) && _errors.length > 0 || parseIntent(submission.intent) !== null)
          ) {
            report(form2, submission);
            event.preventDefault();
          } else {
            var _config$onSubmit;
            (_config$onSubmit = config.onSubmit) === null || _config$onSubmit === void 0 ? void 0 : _config$onSubmit.call(config, event, {
              formData,
              submission,
              action: getFormAction(nativeEvent),
              encType: getFormEncType(nativeEvent),
              method: getFormMethod(nativeEvent)
            });
          }
        } catch (error) {
          console.warn("Client validation failed", error);
        }
      }
    }
  };
  if (config.id) {
    form.id = config.id;
    form.errorId = "".concat(config.id, "-error");
    form.props.id = form.id;
  }
  if (form.errorId && form.errors.length > 0) {
    form.props["aria-invalid"] = "true";
    form.props["aria-describedby"] = form.errorId;
  }
  return [form, fieldset2];
}
function useFieldset(ref, config) {
  var [error] = useFormError(ref, {
    initialError: config.initialError,
    name: config.name
  });
  return new Proxy({}, {
    get(_target, key) {
      var _fieldsetConfig$const, _fieldsetConfig$initi, _fieldsetConfig$defau;
      if (typeof key !== "string") {
        return;
      }
      var fieldsetConfig = config;
      var constraint = (_fieldsetConfig$const = fieldsetConfig.constraint) === null || _fieldsetConfig$const === void 0 ? void 0 : _fieldsetConfig$const[key];
      var errors = error === null || error === void 0 ? void 0 : error[key];
      var initialError = Object.entries((_fieldsetConfig$initi = fieldsetConfig.initialError) !== null && _fieldsetConfig$initi !== void 0 ? _fieldsetConfig$initi : {}).reduce((result, _ref2) => {
        var [name, message] = _ref2;
        var [field2, ...paths] = getPaths(name);
        if (field2 === key) {
          result[formatPaths(paths)] = message;
        }
        return result;
      }, {});
      var field = _objectSpread2(_objectSpread2({}, constraint), {}, {
        name: fieldsetConfig.name ? "".concat(fieldsetConfig.name, ".").concat(key) : key,
        // @ts-expect-error The FieldValue type might need a rework
        defaultValue: (_fieldsetConfig$defau = fieldsetConfig.defaultValue) === null || _fieldsetConfig$defau === void 0 ? void 0 : _fieldsetConfig$defau[key],
        initialError,
        error: errors === null || errors === void 0 ? void 0 : errors[0],
        errors
      });
      if (fieldsetConfig.form) {
        field.form = fieldsetConfig.form;
        field.id = "".concat(fieldsetConfig.form, "-").concat(field.name);
        field.errorId = "".concat(field.id, "-error");
        field.descriptionId = "".concat(field.id, "-description");
      }
      return field;
    }
  });
}
function useFieldList(ref, config) {
  var configRef = useConfigRef(config);
  var [error, setError] = useFormError(ref, {
    initialError: config.initialError,
    name: config.name
  });
  var [entries, setEntries] = (0, import_react.useState)(() => {
    var _config$defaultValue;
    return Object.entries((_config$defaultValue = config.defaultValue) !== null && _config$defaultValue !== void 0 ? _config$defaultValue : []);
  });
  (0, import_react.useEffect)(() => {
    var conformHandler = (event) => {
      var form = getFormElement(ref.current);
      if (!form || event.target !== form) {
        return;
      }
      var intent = parseIntent(event.detail);
      if ((intent === null || intent === void 0 ? void 0 : intent.type) !== "list" || (intent === null || intent === void 0 ? void 0 : intent.payload.name) !== configRef.current.name) {
        return;
      }
      setEntries((entries2) => {
        var list2 = [...entries2];
        switch (intent.payload.operation) {
          case "append":
          case "prepend":
          case "insert":
          case "replace":
            return updateList(list2, _objectSpread2(_objectSpread2({}, intent.payload), {}, {
              defaultValue: [
                // Generate a random key to avoid conflicts
                getUniqueKey(),
                intent.payload.defaultValue
              ]
            }));
          default:
            return updateList(list2, intent.payload);
        }
      });
      setError((error2) => {
        var errorList = [];
        for (var [key, messages] of Object.entries(error2)) {
          if (typeof key === "number") {
            errorList[key] = messages;
          }
        }
        switch (intent.payload.operation) {
          case "append":
          case "prepend":
          case "insert":
          case "replace":
            errorList = updateList(errorList, _objectSpread2(_objectSpread2({}, intent.payload), {}, {
              defaultValue: void 0
            }));
            break;
          default:
            errorList = updateList(errorList, intent.payload);
            break;
        }
        return Object.assign({}, errorList);
      });
    };
    var resetHandler = (event) => {
      var _configRef$current$de;
      var form = getFormElement(ref.current);
      if (!form || event.target !== form) {
        return;
      }
      setEntries(Object.entries((_configRef$current$de = configRef.current.defaultValue) !== null && _configRef$current$de !== void 0 ? _configRef$current$de : []));
    };
    document.addEventListener("conform", conformHandler, true);
    document.addEventListener("reset", resetHandler);
    return () => {
      document.removeEventListener("conform", conformHandler, true);
      document.removeEventListener("reset", resetHandler);
    };
  }, [ref, configRef, setError]);
  return entries.map((_ref3, index) => {
    var _config$initialError;
    var [key, defaultValue] = _ref3;
    var errors = error[index];
    var initialError = Object.entries((_config$initialError = config.initialError) !== null && _config$initialError !== void 0 ? _config$initialError : {}).reduce((result, _ref4) => {
      var [name, message] = _ref4;
      var [field, ...paths] = getPaths(name);
      if (field === index) {
        result[formatPaths(paths)] = message;
      }
      return result;
    }, {});
    var fieldConfig = {
      name: "".concat(config.name, "[").concat(index, "]"),
      defaultValue,
      initialError,
      error: errors === null || errors === void 0 ? void 0 : errors[0],
      errors
    };
    if (config.form) {
      fieldConfig.form = config.form;
      fieldConfig.id = "".concat(config.form, "-").concat(config.name, "-").concat(index);
      fieldConfig.errorId = "".concat(fieldConfig.id, "-error");
      fieldConfig.descriptionId = "".concat(fieldConfig.id, "-description");
    }
    return _objectSpread2({
      key
    }, fieldConfig);
  });
}
var useSafeLayoutEffect = typeof document === "undefined" ? import_react.useEffect : import_react.useLayoutEffect;
function useInputEvent(options) {
  var optionsRef = useConfigRef(options);
  var eventDispatched = (0, import_react.useRef)({
    onInput: false,
    onFocus: false,
    onBlur: false
  });
  useSafeLayoutEffect(() => {
    var createEventListener = (listener) => {
      return (event) => {
        var _optionsRef$current, _optionsRef$current2, _optionsRef$current3;
        var element = typeof ((_optionsRef$current = optionsRef.current) === null || _optionsRef$current === void 0 ? void 0 : _optionsRef$current.ref) === "function" ? (_optionsRef$current2 = optionsRef.current) === null || _optionsRef$current2 === void 0 ? void 0 : _optionsRef$current2.ref() : (_optionsRef$current3 = optionsRef.current) === null || _optionsRef$current3 === void 0 ? void 0 : _optionsRef$current3.ref.current;
        if (isFormControl(element) && (listener === "onReset" ? event.target === element.form : event.target === element)) {
          var _optionsRef$current4, _optionsRef$current4$;
          if (listener !== "onReset") {
            eventDispatched.current[listener] = true;
          }
          (_optionsRef$current4 = optionsRef.current) === null || _optionsRef$current4 === void 0 || (_optionsRef$current4$ = _optionsRef$current4[listener]) === null || _optionsRef$current4$ === void 0 ? void 0 : _optionsRef$current4$.call(_optionsRef$current4, event);
        }
      };
    };
    var inputHandler = createEventListener("onInput");
    var focusHandler = createEventListener("onFocus");
    var blurHandler = createEventListener("onBlur");
    var resetHandler = createEventListener("onReset");
    document.addEventListener("input", inputHandler, true);
    document.addEventListener("focus", focusHandler, true);
    document.addEventListener("blur", blurHandler, true);
    document.addEventListener("reset", resetHandler);
    return () => {
      document.removeEventListener("input", inputHandler, true);
      document.removeEventListener("focus", focusHandler, true);
      document.removeEventListener("blur", blurHandler, true);
      document.removeEventListener("reset", resetHandler);
    };
  }, []);
  var control = (0, import_react.useMemo)(() => {
    var dispatch = (listener, fn) => {
      if (!eventDispatched.current[listener]) {
        var _optionsRef$current5, _optionsRef$current6, _optionsRef$current7;
        var _element2 = typeof ((_optionsRef$current5 = optionsRef.current) === null || _optionsRef$current5 === void 0 ? void 0 : _optionsRef$current5.ref) === "function" ? (_optionsRef$current6 = optionsRef.current) === null || _optionsRef$current6 === void 0 ? void 0 : _optionsRef$current6.ref() : (_optionsRef$current7 = optionsRef.current) === null || _optionsRef$current7 === void 0 ? void 0 : _optionsRef$current7.ref.current;
        if (!isFormControl(_element2)) {
          console.warn("Failed to dispatch event; is the input mounted?");
          return;
        }
        eventDispatched.current[listener] = true;
        fn(_element2);
      }
      eventDispatched.current[listener] = false;
    };
    return {
      change(eventOrValue) {
        dispatch("onInput", (element) => {
          if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
            if (typeof eventOrValue !== "boolean") {
              throw new Error("You should pass a boolean when changing a checkbox or radio input");
            }
            element.checked = eventOrValue;
          } else {
            if (typeof eventOrValue === "boolean") {
              throw new Error("You can pass a boolean only when changing a checkbox or radio input");
            }
            var _value = typeof eventOrValue === "string" ? eventOrValue : eventOrValue.target.value;
            if (element.value !== _value) {
              var {
                set: valueSetter
              } = Object.getOwnPropertyDescriptor(element, "value") || {};
              var prototype = Object.getPrototypeOf(element);
              var {
                set: prototypeValueSetter
              } = Object.getOwnPropertyDescriptor(prototype, "value") || {};
              if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, _value);
              } else {
                if (valueSetter) {
                  valueSetter.call(element, _value);
                } else {
                  throw new Error("The given element does not have a value setter");
                }
              }
            }
          }
          element.dispatchEvent(new InputEvent("input", {
            bubbles: true
          }));
          element.dispatchEvent(new Event("change", {
            bubbles: true
          }));
        });
      },
      focus() {
        dispatch("onFocus", (element) => {
          element.dispatchEvent(new FocusEvent("focusin", {
            bubbles: true
          }));
          element.dispatchEvent(new FocusEvent("focus"));
        });
      },
      blur() {
        dispatch("onBlur", (element) => {
          element.dispatchEvent(new FocusEvent("focusout", {
            bubbles: true
          }));
          element.dispatchEvent(new FocusEvent("blur"));
        });
      }
    };
  }, [optionsRef]);
  return control;
}
var FORM_ERROR_ELEMENT_NAME = "__form__";
function getUniqueKey() {
  var [value] = crypto.getRandomValues(new Uint32Array(1));
  if (!value) {
    throw new Error("Fail to generate an unique key");
  }
  return value.toString(36);
}
function reportSubmission(form, submission) {
  for (var [name, message] of Object.entries(submission.error)) {
    if (message.length === 0) {
      continue;
    }
    var elementName = name ? name : FORM_ERROR_ELEMENT_NAME;
    var item = form.elements.namedItem(elementName);
    if (item === null) {
      var button = document.createElement("button");
      button.name = elementName;
      button.hidden = true;
      button.dataset.conformTouched = "true";
      form.appendChild(button);
    }
  }
  var intent = parseIntent(submission.intent);
  var scope = getScope(intent);
  for (var _element4 of getFormControls(form)) {
    var _submission$error$_el;
    var _elementName = _element4.name !== FORM_ERROR_ELEMENT_NAME ? _element4.name : "";
    var messages = (_submission$error$_el = submission.error[_elementName]) !== null && _submission$error$_el !== void 0 ? _submission$error$_el : [];
    if (scope === null || scope === _elementName) {
      _element4.dataset.conformTouched = "true";
    }
    if (!messages.includes(VALIDATION_SKIPPED) && !messages.includes(VALIDATION_UNDEFINED)) {
      var invalidEvent = new Event("invalid", {
        cancelable: true
      });
      _element4.setCustomValidity(getValidationMessage(messages));
      _element4.dispatchEvent(invalidEvent);
    }
  }
  if (!intent) {
    focusFirstInvalidControl(form);
  }
}
function getScope(intent) {
  switch (intent === null || intent === void 0 ? void 0 : intent.type) {
    case "validate":
      return intent.payload;
    case "list":
      return intent.payload.name;
  }
  return null;
}

// node_modules/@conform-to/react/helpers.mjs
var helpers_exports = {};
__export(helpers_exports, {
  INTENT: () => INTENT,
  VALIDATION_SKIPPED: () => VALIDATION_SKIPPED,
  VALIDATION_UNDEFINED: () => VALIDATION_UNDEFINED,
  collection: () => collection,
  fieldset: () => fieldset,
  hiddenProps: () => hiddenProps,
  input: () => input,
  select: () => select,
  textarea: () => textarea
});
function cleanup(props) {
  for (var key in props) {
    if (props[key] === void 0) {
      delete props[key];
    }
  }
  return props;
}
function getFormElementProps(config) {
  var _options$ariaAttribut, _config$error, _config$error2;
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var hasAriaAttributes = (_options$ariaAttribut = options.ariaAttributes) !== null && _options$ariaAttribut !== void 0 ? _options$ariaAttribut : true;
  return cleanup({
    id: config.id,
    name: config.name,
    form: config.form,
    "aria-invalid": hasAriaAttributes && config.errorId && (_config$error = config.error) !== null && _config$error !== void 0 && _config$error.length ? true : void 0,
    "aria-describedby": hasAriaAttributes ? [config.errorId && (_config$error2 = config.error) !== null && _config$error2 !== void 0 && _config$error2.length ? config.errorId : void 0, config.descriptionId && options.ariaAttributes !== false && options.description ? config.descriptionId : void 0].reduce((result, id) => {
      if (!result) {
        return id;
      }
      if (!id) {
        return result;
      }
      return "".concat(result, " ").concat(id);
    }) : void 0
  });
}
function getFormControlProps(config, options) {
  return cleanup(_objectSpread2(_objectSpread2({}, getFormElementProps(config, options)), {}, {
    required: config.required,
    autoFocus: config.initialError && Object.entries(config.initialError).length > 0 ? true : void 0
  }, options !== null && options !== void 0 && options.hidden ? hiddenProps : void 0));
}
var hiddenProps = {
  /**
   * Style to make the input element visually hidden
   * Based on the `sr-only` class from tailwindcss
   */
  style: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0
  },
  tabIndex: -1,
  "aria-hidden": true
};
function input(config) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var props = _objectSpread2(_objectSpread2({}, getFormControlProps(config, options)), {}, {
    type: options.type,
    minLength: config.minLength,
    maxLength: config.maxLength,
    min: config.min,
    max: config.max,
    step: config.step,
    pattern: config.pattern,
    multiple: config.multiple
  });
  if (options.type === "checkbox" || options.type === "radio") {
    var _options$value;
    props.value = (_options$value = options.value) !== null && _options$value !== void 0 ? _options$value : "on";
    props.defaultChecked = config.defaultValue === props.value;
  } else if (options.type !== "file") {
    props.defaultValue = config.defaultValue;
  }
  return cleanup(props);
}
function select(config, options) {
  return cleanup(_objectSpread2(_objectSpread2({}, getFormControlProps(config, options)), {}, {
    defaultValue: config.defaultValue,
    multiple: config.multiple
  }));
}
function textarea(config, options) {
  return cleanup(_objectSpread2(_objectSpread2({}, getFormControlProps(config, options)), {}, {
    defaultValue: config.defaultValue,
    minLength: config.minLength,
    maxLength: config.maxLength
  }));
}
function fieldset(config, options) {
  return getFormElementProps(config, options);
}
function collection(config, options) {
  return options.options.map((value) => cleanup(_objectSpread2(_objectSpread2({}, getFormControlProps(config, options)), {}, {
    id: config.id ? "".concat(config.id, "-").concat(value) : void 0,
    type: options.type,
    value,
    defaultChecked: options.type === "checkbox" && Array.isArray(config.defaultValue) ? config.defaultValue.includes(value) : config.defaultValue === value,
    // The required attribute doesn't make sense for checkbox group
    // As it would require all checkboxes to be checked instead of at least one
    // overriden with `undefiend` so it gets cleaned up
    required: options.type === "checkbox" ? void 0 : config.required
  })));
}

// app/components/forms.tsx
var import_react3 = __toESM(require_react(), 1);

// app/components/ui/textarea.tsx
var React = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/ui/textarea.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/ui/textarea.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
var Textarea = React.forwardRef(_c = ({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { className: cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid", className), ref, ...props }, void 0, false, {
    fileName: "app/components/ui/textarea.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
});
_c2 = Textarea;
Textarea.displayName = "Textarea";
var _c;
var _c2;
$RefreshReg$(_c, "Textarea$React.forwardRef");
$RefreshReg$(_c2, "Textarea");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/forms.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/forms.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/forms.tsx"
  );
  import.meta.hot.lastModified = "1706218436648.8835";
}
function ErrorList({
  id,
  errors
}) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length)
    return null;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { id, className: "flex flex-col gap-1", children: errorsToRender.map((e) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { className: "text-foreground-destructive text-[10px]", children: e }, e, false, {
    fileName: "app/components/forms.tsx",
    lineNumber: 37,
    columnNumber: 29
  }, this)) }, void 0, false, {
    fileName: "app/components/forms.tsx",
    lineNumber: 36,
    columnNumber: 10
  }, this);
}
_c3 = ErrorList;
function Field({
  labelProps,
  inputProps,
  errors,
  className
}) {
  _s();
  const fallbackId = (0, import_react3.useId)();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : void 0;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Label, { htmlFor: id, ...labelProps }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 54,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Input, { id, "aria-invalid": errorId ? true : void 0, "aria-describedby": errorId, ...inputProps }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 55,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ErrorList, { id: errorId, errors }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 57,
      columnNumber: 16
    }, this) : null }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 56,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/forms.tsx",
    lineNumber: 53,
    columnNumber: 10
  }, this);
}
_s(Field, "i2GpmVP4tZRTGa8NQ93f/KVTRgI=", false, function() {
  return [import_react3.useId];
});
_c22 = Field;
function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className
}) {
  _s2();
  const fallbackId = (0, import_react3.useId)();
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : void 0;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Label, { htmlFor: id, ...labelProps }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 76,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Textarea, { id, "aria-invalid": errorId ? true : void 0, "aria-describedby": errorId, ...textareaProps }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 77,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "min-h-[32px] px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ErrorList, { id: errorId, errors }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 79,
      columnNumber: 16
    }, this) : null }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 78,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/forms.tsx",
    lineNumber: 75,
    columnNumber: 10
  }, this);
}
_s2(TextareaField, "i2GpmVP4tZRTGa8NQ93f/KVTRgI=", false, function() {
  return [import_react3.useId];
});
_c32 = TextareaField;
function CheckboxField({
  labelProps,
  buttonProps,
  errors,
  className
}) {
  _s3();
  const fallbackId = (0, import_react3.useId)();
  const buttonRef = (0, import_react3.useRef)(null);
  const control = useInputEvent({
    // Retrieve the checkbox element by name instead as Radix does not expose the internal checkbox element
    // See https://github.com/radix-ui/primitives/discussions/874
    ref: () => buttonRef.current?.form?.elements.namedItem(buttonProps.name ?? ""),
    onFocus: () => buttonRef.current?.focus()
  });
  const id = buttonProps.id ?? buttonProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : void 0;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Checkbox, { id, ref: buttonRef, "aria-invalid": errorId ? true : void 0, "aria-describedby": errorId, ...buttonProps, onCheckedChange: (state) => {
        control.change(Boolean(state.valueOf()));
        buttonProps.onCheckedChange?.(state);
      }, onFocus: (event) => {
        control.focus();
        buttonProps.onFocus?.(event);
      }, onBlur: (event) => {
        control.blur();
        buttonProps.onBlur?.(event);
      }, type: "button" }, void 0, false, {
        fileName: "app/components/forms.tsx",
        lineNumber: 108,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("label", { htmlFor: id, ...labelProps, className: "self-center text-body-xs text-muted-foreground" }, void 0, false, {
        fileName: "app/components/forms.tsx",
        lineNumber: 118,
        columnNumber: 5
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/forms.tsx",
      lineNumber: 107,
      columnNumber: 4
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "px-4 pb-3 pt-1", children: errorId ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(ErrorList, { id: errorId, errors }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 121,
      columnNumber: 16
    }, this) : null }, void 0, false, {
      fileName: "app/components/forms.tsx",
      lineNumber: 120,
      columnNumber: 4
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/forms.tsx",
    lineNumber: 106,
    columnNumber: 10
  }, this);
}
_s3(CheckboxField, "P3rpOYnvF60eer3KKfUZiwb3Ef0=", false, function() {
  return [import_react3.useId, useInputEvent];
});
_c4 = CheckboxField;
var _c3;
var _c22;
var _c32;
var _c4;
$RefreshReg$(_c3, "ErrorList");
$RefreshReg$(_c22, "Field");
$RefreshReg$(_c32, "TextareaField");
$RefreshReg$(_c4, "CheckboxField");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  formatPaths,
  list,
  parse,
  useForm,
  useFieldset,
  useFieldList,
  helpers_exports,
  Textarea,
  ErrorList,
  Field,
  TextareaField,
  CheckboxField
};
//# sourceMappingURL=/build/_shared/chunk-JXJ2XXPJ.js.map
