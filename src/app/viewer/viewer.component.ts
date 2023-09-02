import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
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
  colors: number[] = [0xffffff, 0xf2490d, 0x44f20d, 0x0db6f2, 0xbb0df2];
  origin_color = 0x444444;
  selectedColorIndex = 0;
  hoveredCube: THREE.Mesh | null = null;

  ngOnInit() {
    this.scene = new ThreeScene();
    this.makeCube(this.origin_color, new THREE.Vector3(0, 0, 0));

    window.onkeydown = this.onKeyDown.bind(this);
    window.onmousedown = () => {
      this.beingDragged = false;
    };
    window.onmouseup = (event) => {
      if (!this.beingDragged) this.mouseClick.call(this, event);
    };
    window.onmousemove = this.onMouseMove.bind(this);
  }

  onKeyDown(event: KeyboardEvent) {
    // if key is between 1 and 5, change selected color
    const number_key = parseInt(event.key);
    this.selectColorIndex(number_key - 1);

    console.log(event);
  }

  onMouseMove(event: MouseEvent) {
    this.beingDragged = true;
    const mouse = glMouse(event);
    const intersects = this.scene.rayTrace(mouse);

    // Early return if not hovering cube or still hovering cube
    const closest = intersects[0] ?? null;
    if (closest?.object == this.hoveredCube) return;

    this.highlightCube(closest?.object as THREE.Mesh | null);
  }

  highlightCube(cube: THREE.Mesh | null): void {
    if (this.hoveredCube != null) {
      this.scene.unhighlightCube(this.hoveredCube);
    }
    this.hoveredCube = cube;
    if (this.hoveredCube != null) {
      this.scene.highlightCube(this.hoveredCube);
    }
  }

  makeCube(color: THREE.ColorRepresentation, position: THREE.Vector3): THREE.Mesh {
    const cube = this.scene.addCube(color, position);
    this.cubes.add(cube);
    return cube;
  }

  removeCube(cube: THREE.Mesh): void {
    this.scene.removeCube(cube);
    this.cubes.delete(cube);
  }

  mouseClick(event: MouseEvent) {
    // Cast ray from camera to mouse position
    const mouse = glMouse(event);
    const intersects = this.scene.rayTrace(mouse);
    if (intersects.length == 0) return;

    // Get the closest cube
    const closest = intersects[0];

    if (event.button == 0) { // Left click
      const cube = this.makeCube(
        this.colors[this.selectedColorIndex],
        closest.object.position.clone().add(closest.face!.normal)
      );
      this.highlightCube(cube);
    } else if (event.button == 2) { // Right click
      if (closest.object.position == new THREE.Vector3(0, 0, 0)) return; // Protect origin block
      this.removeCube(closest.object as THREE.Mesh);
      this.onMouseMove(event);
    }
  }

  selectColorIndex(index: number | null) {
    if (index == null) return;
    if (index < 0 || index >= this.colors.length) return;
    this.selectedColorIndex = index;
  }
}

function glMouse(event: MouseEvent): THREE.Vector2 {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  return mouse;
}
