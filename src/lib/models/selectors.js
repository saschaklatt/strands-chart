export const ATTR_TIME = "time"
export const ATTR_HEIGHT = "height"
export const ATTR_Y = "y"
export const ATTR_DATA = "data"
export const ATTR_KEY = "key"
export const ATTR_COLOR = "color"
export const ATTR_DIRECTION = "dir"

export const getTime = d => d[ATTR_TIME]

export const getData = d => (d && d[ATTR_DATA] ? d[ATTR_DATA] : [])
