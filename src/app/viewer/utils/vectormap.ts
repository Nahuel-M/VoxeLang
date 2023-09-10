import { Vector3 } from 'three';

export class VectorMap<T> {
  data: { [key: number]: { [key: number]: { [key: number]: T } } } = {};

  set(vector: Vector3, value: T) {
    if (!this.data[vector.x]) {
      this.data[vector.x] = {};
    }
    if (!this.data[vector.x][vector.y]) {
      this.data[vector.x][vector.y] = {};
    }

    this.data[vector.x][vector.y][vector.z] = value;
  }

  get(vector: Vector3) {
    if (this.data[vector.x] === undefined) {
      return undefined;
    } else {
      return this.data[vector.x][vector.y][vector.z];
    }
  }

  delete(vector: Vector3) {
    if (this.data[vector.x] === undefined ||
       this.data[vector.x][vector.y] === undefined) {
      return;
    }

    delete this.data[vector.x][vector.y][vector.z];
    
    if (Object.keys(this.data[vector.x]).length === 0) {
      delete this.data[vector.x];
    }
    if (Object.keys(this.data[vector.x][vector.y]).length === 0) {
      delete this.data[vector.x][vector.y];
    }
  }
}
