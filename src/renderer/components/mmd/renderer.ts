import * as THREE from 'three';

export class Renderer {
  private _renderer: THREE.Renderer;

  init(container: HTMLElement) {
    const { clientHeight, clientWidth } = container;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    container.appendChild(renderer.domElement);

    this._renderer = renderer;
  }

  getRenderer() {
    return this._renderer;
  }
}

export default new Renderer();
