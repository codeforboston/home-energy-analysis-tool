import {
  ZodAny,
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodEffects,
  ZodEnum,
  ZodIntersection,
  ZodLazy,
  ZodLiteral,
  ZodNativeEnum,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodPipeline,
  ZodString,
  ZodTuple,
  ZodUnion,
  anyType,
  lazyType
} from "/build/_shared/chunk-YTDRTWMN.js";
import {
  formatPaths,
  parse
} from "/build/_shared/chunk-JXJ2XXPJ.js";

// node_modules/@conform-to/zod/_virtual/_rollupPluginBabelHelpers.mjs
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
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

// node_modules/@conform-to/zod/constraint.mjs
function getConstraint(schema) {
  function inferConstraint(schema2) {
    var constraint = {};
    if (schema2 instanceof ZodEffects) {
      constraint = _objectSpread2({}, inferConstraint(schema2.innerType()));
    } else if (schema2 instanceof ZodPipeline) {
      constraint = _objectSpread2({}, inferConstraint(schema2._def.out));
    } else if (schema2 instanceof ZodOptional) {
      constraint = _objectSpread2(_objectSpread2({}, inferConstraint(schema2.unwrap())), {}, {
        required: false
      });
    } else if (schema2 instanceof ZodDefault) {
      constraint = _objectSpread2(_objectSpread2({}, inferConstraint(schema2.removeDefault())), {}, {
        required: false
      });
    } else if (schema2 instanceof ZodArray) {
      constraint = _objectSpread2(_objectSpread2({}, inferConstraint(schema2.element)), {}, {
        multiple: true
      });
    } else if (schema2 instanceof ZodString) {
      for (var check of schema2._def.checks) {
        switch (check.kind) {
          case "min":
            if (!constraint.minLength || constraint.minLength < check.value) {
              constraint.minLength = check.value;
            }
            break;
          case "max":
            if (!constraint.maxLength || constraint.maxLength > check.value) {
              constraint.maxLength = check.value;
            }
            break;
          case "regex":
            if (!constraint.pattern) {
              constraint.pattern = check.regex.source;
            }
            break;
        }
      }
    } else if (schema2 instanceof ZodNumber) {
      for (var _check of schema2._def.checks) {
        switch (_check.kind) {
          case "min":
            if (!constraint.min || constraint.min < _check.value) {
              constraint.min = _check.value;
            }
            break;
          case "max":
            if (!constraint.max || constraint.max > _check.value) {
              constraint.max = _check.value;
            }
            break;
        }
      }
    } else if (schema2 instanceof ZodEnum) {
      constraint.pattern = schema2.options.map((option) => (
        // To escape unsafe characters on regex
        option.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
      )).join("|");
    }
    if (typeof constraint.required === "undefined") {
      constraint.required = true;
    }
    return constraint;
  }
  var keys = ["required", "minLength", "maxLength", "min", "max", "step", "multiple", "pattern"];
  function resolveFieldsetConstraint(schema2) {
    if (schema2 instanceof ZodObject) {
      var result = {};
      for (var [key, def] of Object.entries(schema2.shape)) {
        result[key] = inferConstraint(def);
      }
      return result;
    }
    if (schema2 instanceof ZodEffects) {
      return resolveFieldsetConstraint(schema2.innerType());
    } else if (schema2 instanceof ZodOptional) {
      return resolveFieldsetConstraint(schema2.unwrap());
    } else if (schema2 instanceof ZodIntersection) {
      return _objectSpread2(_objectSpread2({}, resolveFieldsetConstraint(schema2._def.left)), resolveFieldsetConstraint(schema2._def.right));
    } else if (schema2 instanceof ZodUnion || schema2 instanceof ZodDiscriminatedUnion) {
      var options = schema2.options;
      return options.map(resolveFieldsetConstraint).reduce((prev, next) => {
        var list = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(next)]);
        var result2 = {};
        for (var name of list) {
          var prevConstraint = prev[name];
          var nextConstraint = next[name];
          if (prevConstraint && nextConstraint) {
            result2[name] = {};
            for (var _key of keys) {
              if (typeof prevConstraint[_key] !== "undefined" && typeof nextConstraint[_key] !== "undefined" && prevConstraint[_key] === nextConstraint[_key]) {
                result2[name][_key] = prevConstraint[_key];
              }
            }
          } else {
            result2[name] = _objectSpread2(_objectSpread2(_objectSpread2({}, prevConstraint), nextConstraint), {}, {
              required: false
            });
          }
        }
        return result2;
      });
    }
    return {};
  }
  return resolveFieldsetConstraint(schema);
}

// node_modules/@conform-to/zod/coercion.mjs
function coerceString(value, transform) {
  if (typeof value !== "string") {
    return value;
  }
  if (value === "") {
    return void 0;
  }
  if (typeof transform !== "function") {
    return value;
  }
  return transform(value);
}
function coerceFile(file) {
  if (typeof File !== "undefined" && file instanceof File && file.name === "" && file.size === 0) {
    return void 0;
  }
  return file;
}
function isFileSchema(schema) {
  if (typeof File === "undefined") {
    return false;
  }
  return schema._def.effect.type === "refinement" && schema.innerType() instanceof ZodAny && schema.safeParse(new File([], "")).success && !schema.safeParse("").success;
}
function enableTypeCoercion(type) {
  var cache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Map();
  var result = cache.get(type);
  if (result) {
    return result;
  }
  var schema = type;
  if (type instanceof ZodString || type instanceof ZodLiteral || type instanceof ZodEnum || type instanceof ZodNativeEnum) {
    schema = anyType().transform((value) => coerceString(value)).pipe(type);
  } else if (type instanceof ZodNumber) {
    schema = anyType().transform((value) => coerceString(value, Number)).pipe(type);
  } else if (type instanceof ZodBoolean) {
    schema = anyType().transform((value) => coerceString(value, (text) => text === "on" ? true : text)).pipe(type);
  } else if (type instanceof ZodDate) {
    schema = anyType().transform((value) => coerceString(value, (timestamp) => {
      var date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp;
      }
      return date;
    })).pipe(type);
  } else if (type instanceof ZodBigInt) {
    schema = anyType().transform((value) => coerceString(value, BigInt)).pipe(type);
  } else if (type instanceof ZodArray) {
    schema = anyType().transform((value) => {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "undefined" || typeof coerceFile(value) === "undefined") {
        return [];
      }
      return [value];
    }).pipe(new ZodArray(_objectSpread2(_objectSpread2({}, type._def), {}, {
      type: enableTypeCoercion(type.element, cache)
    })));
  } else if (type instanceof ZodObject) {
    var _shape = Object.fromEntries(Object.entries(type.shape).map((_ref) => {
      var [key, def] = _ref;
      return [
        key,
        // @ts-expect-error see message above
        enableTypeCoercion(def, cache)
      ];
    }));
    schema = new ZodObject(_objectSpread2(_objectSpread2({}, type._def), {}, {
      shape: () => _shape
    }));
  } else if (type instanceof ZodEffects) {
    if (isFileSchema(type)) {
      schema = anyType().transform((value) => coerceFile(value)).pipe(type);
    } else {
      schema = new ZodEffects(_objectSpread2(_objectSpread2({}, type._def), {}, {
        schema: enableTypeCoercion(type.innerType(), cache)
      }));
    }
  } else if (type instanceof ZodOptional) {
    schema = anyType().transform((value) => coerceFile(coerceString(value))).pipe(new ZodOptional(_objectSpread2(_objectSpread2({}, type._def), {}, {
      innerType: enableTypeCoercion(type.unwrap(), cache)
    })));
  } else if (type instanceof ZodDefault) {
    schema = anyType().transform((value) => coerceFile(coerceString(value))).pipe(new ZodDefault(_objectSpread2(_objectSpread2({}, type._def), {}, {
      innerType: enableTypeCoercion(type.removeDefault(), cache)
    })));
  } else if (type instanceof ZodIntersection) {
    schema = new ZodIntersection(_objectSpread2(_objectSpread2({}, type._def), {}, {
      left: enableTypeCoercion(type._def.left, cache),
      right: enableTypeCoercion(type._def.right, cache)
    }));
  } else if (type instanceof ZodUnion) {
    schema = new ZodUnion(_objectSpread2(_objectSpread2({}, type._def), {}, {
      options: type.options.map((option) => enableTypeCoercion(option, cache))
    }));
  } else if (type instanceof ZodDiscriminatedUnion) {
    schema = new ZodDiscriminatedUnion(_objectSpread2(_objectSpread2({}, type._def), {}, {
      options: type.options.map((option) => enableTypeCoercion(option, cache))
    }));
  } else if (type instanceof ZodTuple) {
    schema = new ZodTuple(_objectSpread2(_objectSpread2({}, type._def), {}, {
      items: type.items.map((item) => enableTypeCoercion(item, cache))
    }));
  } else if (type instanceof ZodNullable) {
    schema = new ZodNullable(_objectSpread2(_objectSpread2({}, type._def), {}, {
      innerType: enableTypeCoercion(type.unwrap(), cache)
    }));
  } else if (type instanceof ZodPipeline) {
    schema = new ZodPipeline(_objectSpread2(_objectSpread2({}, type._def), {}, {
      in: enableTypeCoercion(type._def.in, cache),
      out: enableTypeCoercion(type._def.out, cache)
    }));
  } else if (type instanceof ZodLazy) {
    schema = lazyType(() => enableTypeCoercion(type.schema, cache));
  }
  if (type !== schema) {
    cache.set(type, schema);
  }
  return schema;
}

// node_modules/@conform-to/zod/parse.mjs
function parse2(payload, config) {
  return parse(payload, {
    resolve(payload2, intent) {
      var schema = enableTypeCoercion(typeof config.schema === "function" ? config.schema(intent) : config.schema);
      var resolveResult = (result) => {
        if (result.success) {
          return {
            value: result.data
          };
        }
        return {
          error: result.error.errors.reduce((result2, e) => {
            var _result$name;
            var name = formatPaths(e.path);
            result2[name] = [...(_result$name = result2[name]) !== null && _result$name !== void 0 ? _result$name : [], e.message];
            return result2;
          }, {})
        };
      };
      return config.async ? schema.safeParseAsync(payload2, {
        errorMap: config.errorMap
      }).then(resolveResult) : resolveResult(schema.safeParse(payload2, {
        errorMap: config.errorMap
      }));
    }
  });
}

export {
  getConstraint,
  parse2 as parse
};
//# sourceMappingURL=/build/_shared/chunk-FSA34KBF.js.map
