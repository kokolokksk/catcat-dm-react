import * as THREE from 'three';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';

import scene from './scene';
import camera from './camera';

export const helper = new MMDAnimationHelper();
export class Loader {
  loadModels() {
    const loader = new MMDLoader();
    // loader.load('E:/keli/可莉.pmx', function (mesh) {
    //   scene.getScene().add(mesh);
    //   loader.loadVPD('E:/keli/04.vpd', false, function (vpd) {});
    // });

    loader.loadWithAnimation(
      'E:/mmd/gen/lyl/莱依拉.pmx', // called when the resource is loaded
      'E:/mmd/vmd/bh3/GHG_无烘培.vmd',
      function onLoad(mmd) {
        console.info(mmd);
        // helper.add(mmd.mesh, {
        //   animation: mmd.animation,
        //   physics: true,
        // });
        // loader.loadVPD('E:/keli/04.vpd', false, function (vpd) {});
        scene.getScene().add(mmd.mesh);
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
