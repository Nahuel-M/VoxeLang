import { BoxGeometry, Material, Mesh, MeshPhongMaterial, Texture } from "three";

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
    constructor(color: Color, texture?: Texture){
        const material = new MeshPhongMaterial({
            bumpMap: texture,
            color,
            specular: 0x111111,
            shininess: 30,
        });
        material.needsUpdate = true;
        const geometry = new BoxGeometry(1, 1, 1);
        super(geometry, material);
        this.color = color;
    }
}