import { Vector3 } from "three";
import { Color } from "../utils/cube";
import { Flow } from "./flow";
import { Shape } from "./shape";

export class Cube{
    position: Vector3;
    color: Color;
    constructor(position: Vector3, color: Color){
        this.position = position;
        this.color = color;
    }
    shape: Shape | null = null;
    neighbors: Cube[] = [];

    recursiveNeighbors(condition: (cube: Cube) => boolean): Cube[]{
        const result: Cube[] = [];
        const visited: Cube[] = [];
        const stack: Cube[] = [this];
        while (stack.length > 0){
            const cube = stack.pop()!;
            if (visited.includes(cube)) continue;
            visited.push(cube);
            if (!condition(cube)) continue;
            result.push(cube);
            for (const neighbor of cube.neighbors){
                stack.push(neighbor);
            }
        }
        return result;
    }

    recursiveNeighboursInDirections(directions: Vector3[], condition: (cube: Cube) => boolean): Cube[]{
        const result: Cube[] = [];
        const visited: Cube[] = [];
        const stack: Cube[] = [this];
        while (stack.length > 0){
            const cube = stack.pop()!;
            if (visited.includes(cube)) continue;
            visited.push(cube);
            if (condition(cube)) result.push(cube);
            for (const neighbor of cube.neighbors){
                if (directions.includes(neighbor.position.clone().sub(cube.position))){
                    stack.push(neighbor);
                }
            }
        }
        return result;
    }
}