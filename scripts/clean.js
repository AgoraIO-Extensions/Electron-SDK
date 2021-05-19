import path from 'path'
import { getOS } from './util'
import fs from 'fs-extra'
export const destSDKDir = path.join(__dirname, `../sdk/lib/${getOS()}`)
export const cleanLibsDir = async () => await fs.remove(destSDKDir)

export const cleanBuildDir = async () =>
  await fs.remove(`${path.resolve(__dirname, '../build')}`)

export const cleanJSDir = async () =>
  await fs.remove(`${path.resolve(__dirname, '../js')}`)

export const cleanTypesDir = async ()=>
  await fs.remove(`${path.resolve(__dirname, '../types')}`)
