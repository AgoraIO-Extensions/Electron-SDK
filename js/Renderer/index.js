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
    setContentMode(mode) {
        return this.self.setContentMode(mode);
    }
    refreshCanvas() {
        return this.self.refreshCanvas();
    }
}
exports.GlRenderer = GlRenderer;
