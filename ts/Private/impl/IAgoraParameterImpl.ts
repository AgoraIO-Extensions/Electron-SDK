import IrisApiEngine from '../internal/IrisApiEngine'
import { IAgoraParameter } from '../IAgoraParameter'
export class IAgoraParameterImpl implements IAgoraParameter {
  release (): void {
    const apiType = 'AgoraParameter_release'
    const jsonParams = {
    }
    IrisApiEngine.callApi(apiType, jsonParams)
  }

  setBool (key: string, value: boolean): number {
    const apiType = 'AgoraParameter_setBool'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setInt (key: string, value: number): number {
    const apiType = 'AgoraParameter_setInt'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setUInt (key: string, value: number): number {
    const apiType = 'AgoraParameter_setUInt'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setNumber (key: string, value: number): number {
    const apiType = 'AgoraParameter_setNumber'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setString (key: string, value: string): number {
    const apiType = 'AgoraParameter_setString'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setObject (key: string, value: string): number {
    const apiType = 'AgoraParameter_setObject'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  setArray (key: string, value: string): number {
    const apiType = 'AgoraParameter_setArray'
    const jsonParams = {
      key,
      value,
      toJSON: () => {
        return {
          key,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  getBool (key: string): boolean {
    const apiType = 'AgoraParameter_getBool'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getInt (key: string): number {
    const apiType = 'AgoraParameter_getInt'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getUInt (key: string): number {
    const apiType = 'AgoraParameter_getUInt'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getNumber (key: string): number {
    const apiType = 'AgoraParameter_getNumber'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getString (key: string): string {
    const apiType = 'AgoraParameter_getString'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getObject (key: string): string {
    const apiType = 'AgoraParameter_getObject'
    const jsonParams = {
      key,
      toJSON: () => {
        return { key }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  getArray (key: string, args: string): string {
    const apiType = 'AgoraParameter_getArray'
    const jsonParams = {
      key,
      args,
      toJSON: () => {
        return {
          key,
          args
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    const value = jsonResults.value
    return value
  }

  setParameters (parameters: string): number {
    const apiType = 'AgoraParameter_setParameters'
    const jsonParams = {
      parameters,
      toJSON: () => {
        return { parameters }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }

  convertPath (filePath: string, value: string): number {
    const apiType = 'AgoraParameter_convertPath'
    const jsonParams = {
      filePath,
      value,
      toJSON: () => {
        return {
          filePath,
          value
        }
      }
    }
    const jsonResults = IrisApiEngine.callApi(apiType, jsonParams)
    return jsonResults.result
  }
}
