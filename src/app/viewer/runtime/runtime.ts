import { Vector3 } from 'three';
import { Color } from '../utils/cube';
import { VectorMap } from '../utils/vectormap';
import { Cube } from './cube';
import { Shape, Shapes } from './shape';
import { Flow } from './flow';

export class RunTime {
  cubes: VectorMap<Cube> = new VectorMap();
  control_flows: Flow[] = [];

  initState(cubes: { position: Vector3; color: Color }[]): void {
    this.cubes.clear();
    this.control_flows = [];
    // Create runtime internal cubes
    for (const cube of cubes) {
      this.cubes.set(cube.position, new Cube(cube.position, cube.color));
    }
    // Find neighbors for each cube
    for (const cube of this.cubes.values()) {
      cube.neighbors = this.findNeighbors(cube.position);
    }
    // Find shapes for each cube
    for (const cube of this.cubes.values()) {
      if (cube.shape != null) continue;
      Shapes.tryApplyShapes(cube);
    }

    const origin_block = this.cubes.get(new Vector3(0, 0, 0))!;
    for (const origin_neighbor of origin_block.neighbors) {
      const control_flow = new Flow(
        origin_block.position,
        origin_neighbor.position.clone().sub(origin_block.position),
        0
      );
      this.control_flows.push(control_flow);
    }
  }

  debug_step(): Flow[] {
    let flows: Flow[] = [];
    let shapes: Map<Shape, Flow[]> = new Map();
    // Group flows by shape
    for (const flow of this.control_flows) {
      const block = this.cubes.get(flow.position)!;
      const shape = block.shape!;
      if (!shapes.has(shape)) shapes.set(shape, []);
      shapes.get(shape)!.push(flow.clone());
    }
    // Propagate flows
    for (const [shape, shape_flows] of shapes) {
      const new_flows = shape.propagation(shape_flows);
      flows.push(...new_flows);
    }
    // Remove flows that are out of bounds
    flows = flows.filter((flow) => {
      const block = this.cubes.get(flow.position);
      return block != undefined;
    });
    this.control_flows = flows;
    return flows;
  }

  private findNeighbors(position: Vector3): Cube[] {
    const neighbors: Cube[] = [];
    for (const cube of this.cubes.iterator()) {
      if (
        Math.abs(cube.position.x - position.x) +
          Math.abs(cube.position.y - position.y) +
          Math.abs(cube.position.z - position.z) ==
        1
      ) {
        neighbors.push(cube);
      }
    }
    return neighbors;
  }
}
