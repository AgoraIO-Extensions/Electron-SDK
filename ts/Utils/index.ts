const deprecate = (replaceApi?: string) => {
  console.warn('This method will be deprecated soon. ', replaceApi ? `Please use ${replaceApi} instead` : '');
};

class Config {
  glDebug: boolean
  constructor(){
    this.glDebug = false
  }

  setGlDebug(enable:boolean){
    this.glDebug = enable
  }

  getGlDebug() {
    return this.glDebug
  }
}

const config = new Config()
export {config, Config, deprecate}