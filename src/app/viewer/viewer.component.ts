import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  cubes: THREE.Mesh[] = []; 
  name = 'Angular';
  camControls!: OrbitControls;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  beingDragged: boolean = false;
  rayCaster: THREE.Raycaster = new THREE.Raycaster();

  ngOnInit() {
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
    this.makeCube(0x333333, new THREE.Vector3(0, 0, 0));

    const light3 = new THREE.DirectionalLight(0xffffaa, 1.0);
    light3.position.set(100, 0, 0);
    this.scene.add(light3);
    const light2 = new THREE.DirectionalLight(0x9090F0, 0.5);
    light2.position.set(-100, 50, -200);
    this.scene.add(light2);
    const ambient = new THREE.AmbientLight(0x4040f0, 2);
    this.scene.add(ambient);
    const light = new THREE.HemisphereLight( 0xffff44, 0x080810, 1 );
    this.scene.add( light );

    this.camera.position.z = 5;
    this.camControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camControls.enableDamping = true;
    this.camControls.dampingFactor = 0.5;
    this.render();

    window.onresize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.onmousedown = () => {this.beingDragged = false};
    window.onmousemove = () => {this.beingDragged = true};
    window.onmouseup = (event) => {
      if (!this.beingDragged) this.mouseClick.call(this, event);
    };
  }


  makeCube(color: THREE.ColorRepresentation, position: THREE.Vector3): void{
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);
    this.scene.add(cube);
    this.cubes.push(cube);
  }

  mouseClick(event: MouseEvent){
    console.log(event)
  }

  render(): void {
    this.camControls.update();
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
