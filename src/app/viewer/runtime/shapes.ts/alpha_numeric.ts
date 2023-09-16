import { Vector3 } from "three";
import { Color } from "../../utils/cube";
import { Cube } from "../cube";
import { Flow } from "../flow";
import { Shape } from "../shape";

export class AlphaNumeric implements Shape {
    constructor(private cubes: Cube[]){}
    
    propagation(flows: Flow[]): Flow[] {
    
    }

    static tryApplyShape(cube: Cube): boolean {
      const an_cubes = cube
        .recursiveNeighboursInDirections(
          [new Vector3(0, 1, 0), new Vector3(0, -1, 0)],
          (cube) => cube.color != Color.white && cube.color != Color.black
        );
      if (an_cubes.length != 4) return false;
  
      const alphaNumeric = new AlphaNumeric(an_cubes);
      an_cubes.forEach((cube) => cube.shape = alphaNumeric);
      return true;
    }

    
  }