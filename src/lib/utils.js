export const isNotNil = v => v !== null && v !== undefined

export const reverse = arr => {
  if (arr.length === 0) {
    return []
  }
  const [head, ...tail] = arr
  return tail.length === 0 ? [head] : [...reverse(tail), head]
}

export const getBemClassName = block => (element, modifier) => {
  if (element && modifier) {
    return `${block}--${element}__${modifier}`
  }
  if (element) {
    return `${block}--${element}`
  }
  return `${block}`
}

export const isLast = (arr, idx) => idx === arr.length - 1

export const trace = (msg = "trace") => v => {
  console.log(msg, v)
  return v
}

/**
 * Copied from:
 * https://stackoverflow.com/questions/48293642/js-curry-function-with-recursion
 */
export function curry(func, arity = func.length) {
  return function(...args) {
    if (args.length >= arity) {
      return func(...args)
    } else {
      return curry(func.bind(this, ...args), arity - args.length)
    }
  }
}

export const add = a => b => a + b

export const increase = add(1)

export const nest = key => d => ({ [key]: d })

export const inject = curry((target, key, data) => ({
  ...target,
  [key]: data,
}))

export const getCenter = d => d[0] + (d[1] - d[0]) / 2

export const attrDiffers = curry(
  (base, target, attr) => base[attr] !== target[attr]
)

const checkOneDiffers = (isDifferent, attrs, idx = 0) => {
  if (idx === attrs.length) {
    return false
  }
  return isDifferent(attrs[idx])
    ? true
    : checkOneDiffers(isDifferent, attrs, idx + 1)
}

export const atLeastOneDiffers = (base, target, attrs) =>
  checkOneDiffers(attrDiffers(base, target), attrs)
