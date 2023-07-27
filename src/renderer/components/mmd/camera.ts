import * as THREE from 'three';
import scene from './scene';

export class Camera {
  private _camera: THREE.PerspectiveCamera;

  constructor() {}

  getCamera() {
    return this._camera;
  }

  init(container: HTMLElement) {
    const { clientHeight, clientWidth } = container;
    this._camera = new THREE.PerspectiveCamera(
      90,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    // 预设的位置
    // const position = {
    //   x: -2,
    //   y: 16,
    //   z: 6,
    // };
    // this._camera.position.set(position.x, position.y, position.z);

    this._camera.lookAt(1.6, 14, -4);
  }
}

export default new Camera();
