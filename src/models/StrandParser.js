/**
 * Algorithm:
 * - sort raw data by year
 * - make a sequence array for each language
 * - replace null-values in the middle with 0-values
 *
 *
 * Target format:
 * [
 *   {
 *     key: "js",
 *     data: [null, 1, 2, 2, 3, 1, 0, 0, 0, 1, null],
 *   },
 *   {
 *     key: "php",
 *     data: [0, 1, 2, 3, 3, 4, 4, 3, 0, 1, 0],
 *   },
 *   ...
 * ]
 */

const getYear = d => (d && d.year ? d.year : null)

const getData = d => (d && d.data ? d.data : [])

const makeValueSelector = d => value => getData(d)[value] || 0

const asc = selector => (a, b) => selector(a) - selector(b)

const uniqueList = (list, key) =>
  list.includes(key) ? [...list] : [...list, key]

const makeKeyFilter = selector => arr =>
  arr.reduce(
    (list, entry) => Object.keys(selector(entry)).reduce(uniqueList, list),
    []
  )

const filterKeys = makeKeyFilter(getData)

const reduceKeysToObject = (acc, key) => ({ ...acc, [key]: [] })

const keysToObject = keys => keys.reduce(reduceKeysToObject, {})

const toArray = obj =>
  Object.entries(obj).map(([key, data]) => ({
    key,
    data,
  }))

const putValuesIntoList = keys => (acc, d) => {
  const getValue = makeValueSelector(d)
  keys.forEach(key => acc[key].push(getValue(key))) // FIXME: push() is IMPURE!
  return acc
}

export const importData = input => {
  const sorted = [...input].sort(asc(getYear))
  const keys = filterKeys(sorted)
  const keyListObj = sorted.reduce(putValuesIntoList(keys), keysToObject(keys))
  return toArray(keyListObj)
}
