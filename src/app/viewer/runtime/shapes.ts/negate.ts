import { Vector3 } from "three";
import { Color } from "../../utils/cube";
import { Cube } from "../cube";
import { Flow } from "../flow";
import { Shape } from "../shape";

export class Negate implements Shape {
    constructor(private cubes: Cube[]){};

    propagation(flows: Flow[]): Flow[] {
      return flows.map((flow) => {
        // Simply propagate flows forward
        flow.position = flow.position.add(flow.direction);
        // If the flow is in the center of the shape, negate it
        if (this.cubes.find((cube) => cube.position.equals(flow.position))?.neighbors.length == 2) {
          flow.state = stateNegation(flow.state);
        }
        return flow;
      });
    }

    static tryApplyShape(cube: Cube): boolean {
      const blue_cubes = cube
        .recursiveNeighbors((cube) => cube.color == Color.blue);
      if (blue_cubes.length != 3) return false;
  
      const center_cube = blue_cubes.find((cube) => cube.neighbors.length == 2);
      if (center_cube == undefined) return false;
  
      const same_height = blue_cubes
        .map((cube) => cube.position.y)
        .every((y) => y == center_cube.position.y);
      if (!same_height) return false;
      const negate = new Negate(blue_cubes);
      blue_cubes.forEach((cube) => cube.shape = negate);
      console.log("Negate", negate);
      
      return true;
    }
  }

  function stateNegation(
    state: number | string,
  ): number | string {
    if (typeof state === 'string') {
      return state.split('').reverse().join('');
    } else {
      return -state;
    }
  }
  