import * as THREE from 'three';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';

import scene from './scene';
import camera from './camera';

export const helper = new MMDAnimationHelper();
 helper.enable('ik', false);
export class Loader {
  loadModels() {
    const loader = new MMDLoader();
    loader.loadWithAnimation(
      'E:/keli/可莉.pmx', // called when the resource is loaded
      'E:/git/cat/catcat-dm-react/src/renderer/assets/mmd/yaozi.vmd',
      function onLoad(mmd) {
        console.info(mmd);
        helper.add(mmd.mesh, {
          animation: mmd.animation,
          physics: true,
        });
		    scene.getScene().add(mmd.mesh );
      }
    );
    // loader.loadAnimation(
    //   'E:/git/cat/catcat-dm-react/src/renderer/assets/mmd/ayaka-camera.vmd',
    //   camera.getCamera(),
    //   function (cameraAnimation) {
    //     helper.add(camera.getCamera(), {
    //       animation: cameraAnimation as THREE.AnimationClip,
    //     });
    //   }
    // );
  }
}

export default new Loader();
