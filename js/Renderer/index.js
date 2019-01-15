"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoftwareRenderer_1 = __importDefault(require("./SoftwareRenderer"));
exports.SoftwareRenderer = SoftwareRenderer_1.default;
const GlRenderer_1 = __importDefault(require("./GlRenderer"));
class GlRenderer {
    constructor() {
        this.self = GlRenderer_1.default.apply(this);
        this.contentMode = 0;
    }
    bind(element) {
        return this.self.bind(element);
    }
    unbind() {
        return this.self.unbind();
    }
    drawFrame(imageData) {
        return this.self.drawFrame(imageData);
    }
}
exports.GlRenderer = GlRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9SZW5kZXJlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBFQUFrRDtBQTZCaEQsMkJBN0JLLDBCQUFnQixDQTZCTDtBQTVCbEIsOERBQTRDO0FBUzVDLE1BQU0sVUFBVTtJQUdkO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFnQjtRQUNuQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFDRCxTQUFTLENBQUMsU0FBaUI7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUFHbUIsZ0NBQVUifQ==