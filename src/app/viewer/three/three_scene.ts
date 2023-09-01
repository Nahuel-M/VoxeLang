import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class ThreeScene{
    public scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    camControls: OrbitControls;
    rayCaster: THREE.Raycaster;

    constructor(){
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
    
        const light3 = new THREE.DirectionalLight(0xffffaa, 0.8);
        light3.position.set(100, 0, 0);
        this.scene.add(light3);
        const light2 = new THREE.DirectionalLight(0x9090a0, 0.5);
        light2.position.set(-100, 50, -200);
        this.scene.add(light2);
        const ambient = new THREE.AmbientLight(0x808090, 1);
        this.scene.add(ambient);
        const light = new THREE.HemisphereLight( 0xffff44, 0x080808, 1 );
        this.scene.add( light );
    
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
        }
    }

  render(): void {
    this.camControls.update();
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  addCube(color: THREE.ColorRepresentation, position: THREE.Vector3): THREE.Mesh{
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);
    this.scene.add(cube);
    return cube;
  }

  removeCube(cube: THREE.Mesh): void{
    this.scene.remove(cube);
  }

  rayTrace(mouse: THREE.Vector2): THREE.Intersection[]{
    this.rayCaster.setFromCamera(mouse, this.camera);
    return this.rayCaster.intersectObjects(this.scene.children);
  }
}