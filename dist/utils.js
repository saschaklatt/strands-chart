import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _toArray from "@babel/runtime/helpers/esm/toArray";
export var isNotNil = function isNotNil(v) {
  return v !== null && v !== undefined;
};
export var reverse = function reverse(arr) {
  if (arr.length === 0) {
    return [];
  }

  var _arr = _toArray(arr),
      head = _arr[0],
      tail = _arr.slice(1);

  return tail.length === 0 ? [head] : [].concat(_toConsumableArray(reverse(tail)), [head]);
};
export var getBemClassName = function getBemClassName(block) {
  return function (element, modifier) {
    if (element && modifier) {
      return "".concat(block, "--").concat(element, "__").concat(modifier);
    }

    if (element) {
      return "".concat(block, "--").concat(element);
    }

    return "".concat(block);
  };
};
export var isLast = function isLast(arr, idx) {
  return idx === arr.length - 1;
};
export var trace = function trace() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "trace";
  return function (v) {
    console.log(msg, v);
    return v;
  };
};
/**
 * Copied from:
 * https://stackoverflow.com/questions/48293642/js-curry-function-with-recursion
 */

export function curry(func) {
  var arity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : func.length;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= arity) {
      return func.apply(void 0, args);
    } else {
      return curry(func.bind.apply(func, [this].concat(args)), arity - args.length);
    }
  };
}
export var add = function add(a) {
  return function (b) {
    return a + b;
  };
};
export var increase = add(1);
export var nest = function nest(key) {
  return function (d) {
    return _defineProperty({}, key, d);
  };
};
export var inject = curry(function (target, key, data) {
  return _objectSpread({}, target, _defineProperty({}, key, data));
});
export var getCenter = function getCenter(d) {
  return d[0] + (d[1] - d[0]) / 2;
};
export var attrDiffers = curry(function (base, target, attr) {
  return base[attr] !== target[attr];
});

var checkOneDiffers = function checkOneDiffers(isDifferent, attrs) {
  var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (idx === attrs.length) {
    return false;
  }

  return isDifferent(attrs[idx]) ? true : checkOneDiffers(isDifferent, attrs, idx + 1);
};

export var atLeastOneDiffers = function atLeastOneDiffers(base, target, attrs) {
  return checkOneDiffers(attrDiffers(base, target), attrs);
};