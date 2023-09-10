import { BoxGeometry, Material, Mesh, MeshPhongMaterial } from "three";

export enum Color{
    white = 0xffffff,
    black = 0x444444,
    red = 0xf2490d,
    green = 0x44f20d,
    blue = 0x0db6f2,
    purple = 0xbb0df2
}
export class Cube extends Mesh{
    color: Color;
    constructor(color: Color){
        const material = new MeshPhongMaterial({
            color,
            specular: 0x111111,
            shininess: 30,
        });
        const geometry = new BoxGeometry(1, 1, 1);
        super(geometry, material);
        this.color = color;
    }
}