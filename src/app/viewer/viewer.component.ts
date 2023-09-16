import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { ThreeScene } from './three/three_scene';
import { History, Add, Remove } from './utils/history';
import { Color, Cube } from './utils/cube';
import { VectorMap } from './utils/vectormap';
import { readTextFromClipboard, writeTextToClipboard } from './utils/clipboard';
import { cubesToText, textToCubeData } from './utils/text_parser';
import { RunTime } from './runtime/runtime';



@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit {
  cubes: VectorMap<Cube> = new VectorMap();
  runtime: RunTime = new RunTime();
  scene!: ThreeScene;
  beingDragged: boolean = false;
  colors = [Color.white, Color.red, Color.green, Color.blue, Color.purple];
  origin_color = Color.black;
  selectedColorIndex = 0;
  hoveredCube: Cube | null = null;
  history: History = new History();

  ngOnInit() {
    this.scene = new ThreeScene();
    this.makeCube(this.origin_color, new THREE.Vector3(0, 0, 0));

    window.onkeydown = this.onKeyDown.bind(this);
    window.onmousemove = this.onMouseMove.bind(this);
    window.onmousedown = () => {
      this.beingDragged = false;
    };
    window.onmouseup = (event) => {
      if (!this.beingDragged) this.mouseClick.call(this, event);
    };
  }

  onKeyDown(event: KeyboardEvent) {
    // if key is between 1 and 5, change selected color
    const number_key = parseInt(event.key);
    if (number_key >= 1 && number_key <= 5) {
      this.selectColorIndex(number_key - 1);
    }

    const ctrlOrMetaKey = event.ctrlKey || event.metaKey;
    const yOrShiftZKey = event.key === 'y' || event.key === 'Z' || (event.key === 'z' && event.shiftKey);

    if (event.key === 'z' && ctrlOrMetaKey && !event.shiftKey) {
      const action = this.history.undo();
      if (action instanceof Add) {
        this.removeCube(action.position);
      } else if (action instanceof Remove) {
        this.makeCube(action.color, action.position);
      }
    }

    if (yOrShiftZKey && ctrlOrMetaKey) {
      const action = this.history.redo();
      if (action instanceof Add) {
        this.makeCube(action.color, action.position);
      } else if (action instanceof Remove) {
        this.removeCube(action.position);
      }
    }

    if (event.key === 'c' && ctrlOrMetaKey) {
      this.onToClipboard();
    }

    if (event.key === 'v' && ctrlOrMetaKey) {
      this.onFromClipboard();
    }

    if (event.key === 'f') {
      const flows = this.runtime.debug_step();
      for (const cube of this.cubes.values()) {
        this.scene.unhighlightCube(cube);
      }
      for (const flow of flows) {
        this.scene.highlightCube(this.cubes.get(flow.position)!);
      }
    }
  }

  /**
   * Writes the current program to the clipboard.
   */
  onToClipboard(): void {
    const text: string = cubesToText(this.cubes);
    writeTextToClipboard(text);
  }

  /**
   * Loads a program from the clipboard.
   * 
   * This will clear the current program.
   */
  async onFromClipboard(): Promise<void> {
    const text: string = await readTextFromClipboard();
    const cubes: Cube[] = textToCubeData(text)
      .map(({ color, position }) => this.makeCube(color, position));
    this.scene.removeAllCubes();
    this.scene.addCubes(cubes);
  }

  onMouseMove(event: MouseEvent) {
    this.beingDragged = true;
    const mouse = glMouse(event);
    const intersects = this.scene.rayTrace(mouse);

    // Early return if not hovering cube or still hovering cube
    const closest = intersects[0] ?? null;
    if (closest?.object == this.hoveredCube) return;

    this.highlightCube(closest?.object as Cube | null);
  }

  highlightCube(cube: Cube | null): void {
    if (this.hoveredCube != null) {
      this.scene.unhighlightCube(this.hoveredCube);
    }
    this.hoveredCube = cube;
    if (this.hoveredCube != null) {
      this.scene.highlightCube(this.hoveredCube);
    }
  }

  makeCube(
    color: Color,
    position: THREE.Vector3
  ): Cube {
    const cube = this.scene.addCube(color, position);
    this.cubes.set(position, cube);
    const runtimeCubes = this.cubes.values().map((cube) => { return {position: cube.position, color: cube.color}});
    this.runtime.initState(runtimeCubes);
    return cube;
  }

  removeCube(position: THREE.Vector3): void {
    this.scene.removeCube(this.cubes.get(position)!);
    this.cubes.delete(position);
    const runtimeCubes = this.cubes.values().map((cube) => { return {position: cube.position, color: cube.color}});
    this.runtime.initState(runtimeCubes);
  }

  mouseClick(event: MouseEvent) {
    // Cast ray from camera to mouse position
    const mouse = glMouse(event);
    const intersects = this.scene.rayTrace(mouse);
    if (intersects.length == 0) return;

    // Get the closest cube
    const closest = intersects[0];
    const cube = closest.object as Cube;

    if (event.button == 0) {
      // Left click
      const cube = this.makeCube(
        this.colors[this.selectedColorIndex],
        closest.object.position.clone().add(closest.face!.normal)
      );
      this.history.addAction(new Add(cube.position.clone(), cube.color));
      this.highlightCube(cube);
    } else if (event.button == 2) {
      // Right click
      if (closest.object.position.equals(new THREE.Vector3(0, 0, 0))) return; // Protect origin block
      this.history.addAction(new Remove(cube.position.clone(), cube.color));
      this.removeCube(cube.position);
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
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  return mouse;
}
