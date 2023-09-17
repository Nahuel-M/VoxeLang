import { Cube } from './cube';
import { Flow } from './flow';
import { Add } from './shapes.ts/add';
import { Negate } from './shapes.ts/negate';
import { Origin } from './shapes.ts/origin';
import { Path } from './shapes.ts/path';
import { Splitter } from './shapes.ts/splitter';
// import { AlphaNumeric } from './shapes.ts/alpha_numeric';

export interface Shape {
  propagation(flows: Flow[]): Flow[];
}

export class Shapes {
  static tryApplyShapes(cube: Cube): boolean {
    return Add.tryApplyShape(cube) 
        || Negate.tryApplyShape(cube) 
        || Path.tryApplyShape(cube)
        || Origin.tryApplyShape(cube)
        || Splitter.tryApplyShape(cube);
        // || AlphaNumeric.tryApplyShape(cube);
  }
}
