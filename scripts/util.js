import logger from './logger'
import fs from 'fs-extra'
import path from 'path'
import { exec } from 'shelljs'
import os from 'os'

const tmpDir = os.tmpdir()
const productSrc = '../build/Release/agora_node_ext.node'

const lipoCreate = async (file1, file2) => {
  const cmd = `lipo -create ${file1.src} ${file2.src} -output ${path.join(
    __dirname,
    productSrc
  )}`
  await exec(cmd, { silent: false })
  await fs.remove(file1.src)
  await fs.remove(file2.src)
}
const createTmpProduct = async () => {
  const fileName = `agora_node_ext_${new Date().getTime()}.node`
  const fileConfig = {
    src: path.join(__dirname, `../${fileName}`),
    fileName,
  }
  await fs.move(path.join(__dirname, productSrc), fileConfig.src)
  return fileConfig
}

const getOS = () => {
  const platform = process.platform
  if (platform === 'darwin') {
    return 'mac'
  } else if (platform === 'win32') {
    return 'win32'
  } else {
    // not supported in temp
    logger.error('Unsupported platform!')
    throw new Error('Unsupported platform!')
  }
}

const createTmpDir = async () => await fs.mkdtemp(`${tmpDir}Tmp`)

module.exports = {
  lipoCreate,
  createTmpProduct,
  getOS,
  createTmpDir,
}
