import get from "lodash/get"

export const ATTR_COLOR = "color"
export const ATTR_DATA = "data"
export const ATTR_DIRECTION = "dir"
export const ATTR_HEIGHT = "height"
export const ATTR_KEY = "key"
export const ATTR_TIME = "time"
export const ATTR_Y = "y"

export const getColor = d => get(d, ATTR_COLOR)
export const getData = d => get(d, ATTR_DATA, [])
export const getDirection = d => get(d, ATTR_DIRECTION)
export const getHeight = d => get(d, ATTR_HEIGHT)
export const getKey = d => get(d, ATTR_KEY)
export const getTime = d => d[ATTR_TIME]
export const getY = d => get(d, ATTR_Y)
