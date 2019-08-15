export const isNil = v => v === null || v === undefined

export const isNotNil = v => v !== null && v !== undefined

export const reverse = ([head, ...tail]) =>
  tail.length === 0 ? [head] : [...reverse(tail), head]

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
