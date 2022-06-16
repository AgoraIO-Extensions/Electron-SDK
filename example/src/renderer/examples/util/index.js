import path from 'path'
export const objToArray = (obj) =>
  Object.keys(obj).map((key) => ({ key, value: obj[key] }))

export const configMapToOptions = (obj) =>
  objToArray(obj).map(({ key, value }) => ({
    dropId: value,
    dropText: key,
  }))

export const isDebug = () => {
  return process.env.NODE_ENV === 'development'
}

export const getResourcePath = (filePath = './') => {
  let resourcePath
  if (isDebug()) {
    resourcePath = path.resolve(
      `${__dirname}`,
      '../../../../extraResources/',
      filePath
    )
  } else {
    resourcePath = path.resolve(
      `${process.resourcesPath}/extraResources`,
      filePath
    )
  }
  return resourcePath
}

export const getRandomInt = (min = 1, max = 99999) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export default {}
