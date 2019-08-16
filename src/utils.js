export const isNil = v => v === null || v === undefined

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

export const isNilDomain = d => isNil(d) || isNil(d[0]) || isNil(d[1])

export const getDomainSize = d =>
  isNilDomain(d) ? null : Math.abs(d[1] - d[0])

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
