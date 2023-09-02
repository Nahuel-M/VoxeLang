import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
export class ThreeScene {
  public scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  camControls: OrbitControls;
  rayCaster: THREE.Raycaster;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light3 = new THREE.DirectionalLight(0xdddddd, 0.8);
    light3.position.set(100, 0, 0);
    this.scene.add(light3);
    const light2 = new THREE.DirectionalLight(0x909090, 0.5);
    light2.position.set(-100, 50, -200);
    this.scene.add(light2);
    const ambient = new THREE.AmbientLight(0xaaaaaa, 1);
    this.scene.add(ambient);
    const light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5);
    this.scene.add(light);

    this.camera.position.z = 5;
    this.camControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camControls.enableDamping = true;
    this.camControls.dampingFactor = 0.5;
    this.rayCaster = new THREE.Raycaster();
    this.render();

    window.onresize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
  }

  render(): void {
    this.camControls.update();
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  addCube(
    color: THREE.ColorRepresentation,
    position: THREE.Vector3
  ): THREE.Mesh {
    const threeColor = new THREE.Color(color);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const wireframe = new THREE.EdgesGeometry(geometry);
    const cube_material = new THREE.MeshPhongMaterial({
      color: threeColor.clone(),
      specular: 0x111111,
      shininess: 30,
    });
    const cube = new THREE.Mesh(geometry, cube_material);
    // const line = new LineGeometry().fromEdgesGeometry(wireframe);

    // const line_material = new LineMaterial( {
    //     linewidth: 0.01,
    //     color: 0x000000} );
    // // line_material.color.addScalar(0.1);
    // const line_mesh = new THREE.Mesh(line, line_material);
    // cube.add(line_mesh);

    cube.position.copy(position);
    this.scene.add(cube);
    return cube;
  }

  removeCube(cube: THREE.Mesh): void {
    this.scene.remove(cube);
  }

  highlightCube(cube: THREE.Mesh): void {
    const material: THREE.MeshPhongMaterial = Array.isArray(cube.material)
      ? cube.material[0] as THREE.MeshPhongMaterial
      : cube.material as THREE.MeshPhongMaterial; 
    material.emissive.set(material.color.clone().multiplyScalar(0.3))
  }

  unhighlightCube(cube: THREE.Mesh): void {
    const material: THREE.Material = Array.isArray(cube.material)
      ? cube.material[0]
      : cube.material;
    (material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
  }

  rayTrace(mouse: THREE.Vector2): THREE.Intersection[] {
    this.rayCaster.setFromCamera(mouse, this.camera);
    return this.rayCaster.intersectObjects(this.scene.children);
  }
}
