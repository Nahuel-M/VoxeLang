import { Vector3 } from 'three';
import { Color } from '../../utils/cube';
import { Cube } from '../cube';
import { Flow } from '../flow';
import { Shape } from '../shape';

export class Add implements Shape {
  constructor(private cubes: Cube[]) {}

  static tryApplyShape(cube: Cube): boolean {
    const blue_cubes = cube.recursiveNeighbors(
      (cube) => cube.color == Color.blue
    );
    if (blue_cubes.length != 5) return false;

    const center_cube = blue_cubes.find((cube) => cube.neighbors.length == 4);
    if (center_cube == undefined) return false;

    const same_height = blue_cubes
      .map((cube) => cube.position.y)
      .every((y) => y == center_cube.position.y);
    if (!same_height) return false;
    const add = new Add(blue_cubes);
    blue_cubes.forEach((cube) => (cube.shape = add));
    console.log("Add", add);
    return true;
  }

  propagation(flows: Flow[]): Flow[] {
    if (flows.length == 2) {
      if (
        flows[0].position
          .add(flows[0].direction)
          .equals(flows[1].position.add(flows[1].direction))
      ) {
        const center_position = flows[0].position.add(flows[0].direction);
        // When flows are facing eachother, add them to the center position
        return flows.map((flow: Flow) => {
          return new Flow(
            center_position,
            rotate90(flow.direction),
            stateAddition(flows[0].state, flows[1].state)
          );
        });
      } else {
        return flows.map((flow) => {
          // Simply propagate flows forward
          flow.position = flow.position.add(flow.direction);
          return flow;
        });
      }
    } else {
      // Return untouched flows
      return flows;
    }
  }
}

function rotate90(vector: Vector3): Vector3 {
  return new Vector3(-vector.z, vector.y, vector.x);
}

function stateAddition(
  state1: number | string,
  state2: number | string
): number | string {
  if (typeof state1 === 'number' && typeof state2 === 'number') {
    return state1 + state2;
  } else {
    return state1.toString() + state2.toString();
  }
}
