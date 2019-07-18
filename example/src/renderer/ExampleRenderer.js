import {CustomRenderer} from '../../../js/Renderer'

class ExampleRenderer extends CustomRenderer {
  constructor(){
    super()
    this.element = null
  }
  bind(element) {
    this.element = element
  }

  unbind() {
    this.element = null
  }

  drawFrame(imageData) {
    //视频裸数据
    console.log("drawFrame")
  }
  getBindingElement() {
    return this.element
  }
  setContentMode(mode) {
    //在这里实现fill/fit模式的实现
  }
  refreshCanvas() {
    //马上就当前数据做一次重绘
  }
}

export default ExampleRenderer