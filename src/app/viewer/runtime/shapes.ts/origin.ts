import { Vector3 } from 'three';
import { Color } from '../../utils/cube';
import { Cube } from '../cube';
import { Flow } from '../flow';
import { Shape } from '../shape';

export class Origin implements Shape {
  constructor(private cubes: Cube[]) {}

  propagation(flows: Flow[]): Flow[] {
    return flows.map((flow) => {
        flow.position = flow.position.add(flow.direction);
        return flow;
    })
  }

  static tryApplyShape(cube: Cube): boolean {
    const black_cubes = cube.recursiveNeighbors(
      (cube) => cube.color == Color.black
    );
    if (black_cubes.length != 1) return false;

    const origin = new Origin(black_cubes);
    black_cubes.forEach((cube) => (cube.shape = origin));
    console.log("Origin", origin);
    return true;
  }
}
