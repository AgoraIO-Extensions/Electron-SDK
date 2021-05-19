import { cleanJSDir, cleanTypesDir } from './clean'
import logger from './logger';
import { exec } from 'shelljs'

const buildJS = async (cb) => {
  logger.info('Build js from typescript')
  await cleanJSDir()
  await cleanTypesDir()
  await exec('tsc', {silent: false})
  await exec('tsc -p dtsconfig.json', { silent: false })

  cb()
}

export default buildJS
