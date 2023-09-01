import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeScene } from './three/three_scene';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  cubes: Set<THREE.Mesh> = new Set(); 
  scene!: ThreeScene;
  beingDragged: boolean = false;
  colors = [0xFFFFFF, 0xF2490D, 0x44F20D, 0x0DB6F2, 0xBB0DF2]
  origin_color = 0x444444;
  selectedColorIndex = 0;

  ngOnInit() {
    this.scene = new ThreeScene();
    this.makeCube(this.origin_color, new THREE.Vector3(0, 0, 0));

    window.onmousedown = () => {this.beingDragged = false};
    window.onmousemove = () => {this.beingDragged = true};
    window.onmouseup = (event) => {
      if (!this.beingDragged) this.mouseClick.call(this, event);
    };

    window.onkeydown = this.onKeyDown.bind(this);
  }

  onKeyDown(event: KeyboardEvent){
    // if key is between 1 and 5, change selected color
    const number_key = parseInt(event.key);
    if (number_key >= 1 && number_key <= 5){
      this.selectedColorIndex = parseInt(event.key) - 1;
    }
    
    console.log(event);
  }

  makeCube(color: THREE.ColorRepresentation, position: THREE.Vector3): void{
    const cube = this.scene.addCube(color, position);
    this.cubes.add(cube);
  }

  removeCube(cube: THREE.Mesh): void{
    this.scene.removeCube(cube);
    this.cubes.delete(cube);
  }

  mouseClick(event: MouseEvent){
    // Cast ray from camera to mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    const intersects = this.scene.rayTrace(mouse);
    if (intersects.length == 0) return;

    // Get the closest cube
    const closest = intersects[0];

    if (event.button == 0){ // Left click
      this.makeCube(this.colors[this.selectedColorIndex], closest.object.position.clone().add(closest.face!.normal));
    } else if (event.button == 2) { // Right click
      if (closest.object.position.equals(new THREE.Vector3(0, 0, 0))) return; // Protect origin block
      this.removeCube(closest.object as THREE.Mesh);
    }
  }
}
