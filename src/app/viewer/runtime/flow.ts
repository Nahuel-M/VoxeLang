import { Vector3 } from "three";
import { Cube } from "./cube";

export class Flow{
    position: Vector3;
    direction: Vector3;
    state: number | string;
    constructor(position: Vector3, direction: Vector3, state: number | string){
        this.position = position;
        this.direction = direction;
        this.state = state;
    }

    clone(): Flow{
        return new Flow(this.position.clone(), this.direction.clone(), this.state);
    }
}