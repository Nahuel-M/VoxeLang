import { Vector3 } from 'three';
import { Color } from '../../utils/cube';
import { Cube } from '../cube';
import { Flow } from '../flow';
import { Shape } from '../shape';

export class Path implements Shape {
  constructor(private cubes: Cube[]) {}

  static tryApplyShape(cube: Cube): boolean {
    const white_cubes = cube.recursiveNeighbors(
      (cube) => cube.color == Color.white
    );
    if (white_cubes.length == 0) return false;

    const path = new Path(white_cubes);
    white_cubes.forEach((cube) => (cube.shape = path));
    return true;
  }

  propagation(flows: Flow[]): Flow[] {
    const outputFlows = [];
    for (const flow of flows){
        // Find cube at position
        const cube = this.cubes.find((cube) =>
            cube.position.equals(flow.position)
        );
        if (cube == undefined) continue;
        // Find if there is another neighboring cube that is not the previous cube
        let nextCube = cube.neighbors.find((neighbor) => !neighbor.position.equals(flow.position.clone().sub(flow.direction)));
        if (nextCube){
            outputFlows.push(new Flow(nextCube.position, nextCube.position.clone().sub(flow.position), flow.state));
        }
    }
    return outputFlows;
  }
}

function stateNegation(state: number | string): number | string {
  if (typeof state === 'string') {
    return state.split('').reverse().join('');
  } else {
    return -state;
  }
}
