import * as THREE from 'three';

export class Renderer {
  private _renderer: THREE.Renderer;

  init(container: HTMLElement) {
    const { clientHeight, clientWidth } = container;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    this._renderer = renderer;
  }

  getRenderer() {
    return this._renderer;
  }
}

export default new Renderer();
