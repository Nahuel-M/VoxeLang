import { Color } from "./cube";

export class Add {  constructor(public position: THREE.Vector3, public color: Color){} };
export class Remove { constructor(public position: THREE.Vector3, public color: Color){} };

export type Action = Add | Remove;
const HISTORY = 50;
export class History{
    buffer: Array<Action> = new Array<Action>(HISTORY)
    currentPosition: number = 0;
    minPosition: number = 0;
    maxPosition: number = 0;

    addAction(action: Action): void{
        this.buffer[this.currentPosition] = action;
        this.currentPosition = (this.currentPosition + 1) % this.buffer.length;
        this.maxPosition = this.currentPosition;
        if (this.maxPosition == this.minPosition){
            this.minPosition = (this.minPosition + 1) % this.buffer.length;
        }
        console.log(action);
    }

    undo(): Action | null{
        if (this.currentPosition == this.minPosition) return null;
        this.currentPosition = (this.currentPosition - 1) % this.buffer.length;
        console.log(this.buffer[this.currentPosition]);
        return this.buffer[this.currentPosition];
    }

    redo(): Action | null{
        if (this.currentPosition == this.maxPosition) return null;
        const action = this.buffer[this.currentPosition];
        this.currentPosition = (this.currentPosition + 1) % this.buffer.length;
        console.log(action);
        return action;
    }
}