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

  clear() {
    this.data = {};
  }

  values() : T[]{
    const data = this.data;
    return Object.keys(data).map((x) => {
      return Object.keys(data[Number(x)]).map((y) => {
        return Object.keys(data[Number(x)][Number(y)]).map((z) => {
          return data[Number(x)][Number(y)][Number(z)];
        });
      });
    }).flat(2);
  }

  iterator(): IterableIterator<T> {
    const data = this.data;
    return {
      [Symbol.iterator]: function* () {
        for (const x of Object.keys(data).map(Number)) {
          for (const y of Object.keys(data[x]).map(Number)) {
            for (const z of Object.keys(data[x][y]).map(Number)) {
              yield data[x][y][z];
            }
          }
        }
      }
    } as IterableIterator<T>;
  }
}
