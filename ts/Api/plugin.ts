/** 
 * @ignore
 */
export interface PluginInfo {
  id: string;
  path: string;
}
/** 
 * @ignore
 */
export interface Plugin {
  id: string;
  enable: () => number;
  disable: () => number;
  setParameter: (param: string) => number;
}