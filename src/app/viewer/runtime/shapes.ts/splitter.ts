import { Vector3 } from 'three';
import { Color } from '../../utils/cube';
import { Cube } from '../cube';
import { Flow } from '../flow';
import { Shape } from '../shape';

export class Splitter implements Shape {
  constructor(private cubes: Cube[]) {}

  static tryApplyShape(cube: Cube): boolean {
    const red_cubes = cube.recursiveNeighbors(
      (cube) => cube.color == Color.red
    );
    if (red_cubes.length != 1) return false;

    const splitter = new Splitter(red_cubes);
    red_cubes.forEach((cube) => (cube.shape = splitter));
    console.log('Splitter', splitter);
    return true;
  }

  propagation(flows: Flow[]): Flow[] {
    return flows.flatMap((flow) => {
        const flow1 = flow.clone();
        flow1.direction = rotate90(flow1.direction);
        flow1.position.add(flow1.direction);
        const flow2 = flow.clone();
        flow2.direction = rotate90CC(flow2.direction);
        flow2.position.add(flow2.direction);
        return [flow1, flow2];
    });

  }
}

function rotate90(vector: Vector3): Vector3 {
  return new Vector3(-vector.z, vector.y, vector.x);
}

function rotate90CC(vector: Vector3): Vector3 {
    return new Vector3(vector.z, vector.y, -vector.x);
  }
