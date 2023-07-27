// 项目中的全局 scene
import * as THREE from 'three';

export class Scene {
  private scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  getScene() {
    return this.scene;
  }

  init(container: HTMLElement) {}
}

export default new Scene();
