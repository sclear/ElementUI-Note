const hasOwnProperty = Object.prototype.hasOwnProperty;

export function noop() {};

/**
 * @description 截取Object prototype hasOwnProperty 判定是否拥有属性 !(prototype || __proto__)
 * @param { Object } 
 * @param { Key    }
 */
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};


/**
 * @description 将数组对象内的对象属性注入到to中
 * @param {*} to 
 * @param {*} _from 
 */
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

/**
 * @description 意图根据prop传递的String,find Value
 *              const object = { ary: [ { name: ''jc } ] }
 *              path: ary.0.name === 'jc'
 * @param { object } findValue by path in the Object
 * @param { prop   } prop for Path
 */
export const getValueByPath = function(object, prop) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

/**
 * @description 意图类似 getValueByPaht
 * @param { obj  } 
 * @param { path } 
 * @param {strict}  use strict
 */
export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  // [0]  ToBe  .0
  path = path.replace(/\[(\w+)\]/g, '.$1');
  // remove 开头 .
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,                            // obj
    k: keyArr[i],                          // key
    v: tempObj ? tempObj[keyArr[i]] : null // value
  };
};

/**
 * @description 万内数字生成器
 */
export const generateId = function() {
  return Math.floor(Math.random() * 10000);
};

/**
 * @description 判定 arrayA equal arrayB, 可能非同HEAP path
 * @param {*} a 
 * @param {*} b 
 */
export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// 特殊字符串转义
export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

// TODO: use native Array.find, Array.findIndex when IE support is dropped
export const arrayFindIndex = function(arr, pred) {
  for (let i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i;
    }
  }
  return -1;
};

/**
 * @description Find target in arr
 * @param { arr  } 
 * @param { pred }
 */
export const arrayFind = function(arr, pred) {
  const idx = arrayFindIndex(arr, pred);
  return idx !== -1 ? arr[idx] : undefined;
};

// coerce truthy value to array
/**
 * @description 真是Value: if val.type === object,  return [ value ]
 * @param { val }
 */
export const coerceTruthyValueToArray = function(val) {
  if (Array.isArray(val)) {
    return val;
  } else if (val) {
    return [val];
  } else {
    return [];
  }
};

/**
 * 判定浏览器
 */
export const isIE = function() {
  return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode));
};

export const isEdge = function() {
  return !Vue.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1;
};

export const isFirefox = function() {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
};

/**
 * @description 兼容Css
 * @param { style }
 */
export const autoprefixer = function(style) {
  if (typeof style !== 'object') return style;
  const rules = ['transform', 'transition', 'animation'];
  const prefixes = ['ms-', 'webkit-'];
  rules.forEach(rule => {
    const value = style[rule];
    if (rule && value) {
      prefixes.forEach(prefix => {
        style[prefix + rule] = value;
      });
    }
  });
  return style;
};

/**
 * @description 短横线分割命名
 *              'myComponent' ToBe 'my-component'
 * @param {*} str 
 */
export const kebabCase = function(str) {
  const hyphenateRE = /([^-])([A-Z])/g;
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
};

/**
 * @description 首字母大写
 * @param {*} str 
 */
export const capitalize = function(str) {
  if (!isString(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @description 弱等于 对比两对象是否"弱等", 非对比引用地址, 只对比值
 * @param {*} a 
 * @param {*} b 
 */
export const looseEqual = function(a, b) {
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    return JSON.stringify(a) === JSON.stringify(b);
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
};

/**
 * @description 判定两数组是否"弱等"
 * @param {*} arrayA 
 * @param {*} arrayB 
 */
export const arrayEquals = function(arrayA, arrayB) {
  arrayA = arrayA || [];
  arrayB = arrayB || [];

  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < arrayA.length; i++) {
    if (!looseEqual(arrayA[i], arrayB[i])) {
      return false;
    }
  }

  return true;
};

/**
 * @description 判定对比对象是否"弱等"
 * @param {*} value1 
 * @param {*} value2 
 */
export const isEqual = function(value1, value2) {
  // Array 
  if (Array.isArray(value1) && Array.isArray(value2)) {
    return arrayEquals(value1, value2);
  }
  // 非Array
  return looseEqual(value1, value2);
};

/**
 * @description 判定值是否为空(null '' ) 无效值
 * @param {*} val 
 */
export const isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};

/**
 * @description 通过闭包实现节流函数
 * @param {*} fn 
 */
export function rafThrottle(fn) {
  // 闭包缓存值, requestAnimationFrame 控制函数调用
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      // 此次完成 初始化缓存locked
      locked = false;
    });
  };
}

/**
 * @description Object转Array，
 *              {} ToBe [ {} ]
 * @param {*} obj 
 */
export function objToArray(obj) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return isEmpty(obj) ? [] : [obj];
}
