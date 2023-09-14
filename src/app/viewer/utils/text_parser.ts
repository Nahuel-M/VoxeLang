import { Vector3 } from 'three';
import { Color, Cube } from './cube';
import { VectorMap } from './vectormap';

export function textToCubeData(text: string): { color: Color, position: Vector3 }[] {
    return text.split('\n').filter(s => s.length !== 0).map(lineToCubeData);
}

function lineToCubeData(line: string): { color: Color, position: Vector3 } {
    const [color, x, y, z]: string[] = line.split(',');
    const position: Vector3 = new Vector3(parseInt(x), parseInt(y), parseInt(z));
    return { color: parseInt(color), position };
}

export function cubesToText(vectorMap: VectorMap<Cube>): string {
    let text: string = '';

    for (const x in vectorMap.data) {
        for (const y in vectorMap.data[x]) {
            for (const z in vectorMap.data[x][y]) {
                // Ignore origin block.
                if (+x !== 0 || +y !== 0 || +z !== 0) {
                    const cube: Cube = vectorMap.data[x][y][z];
                    text += `${cube.color},${x},${y},${z}\n`;
                }
            }
        }
    }

    return text;
}
