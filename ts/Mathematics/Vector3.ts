
module CP.Mathematics {
    export class Vector3 extends Vector {

        constructor(x: number = 0, y: number= 0, z: number = 0) {
            super([x, y, z]);
        }

        get x(): number {
            return this.getComponent(0);
        }

        get y(): number {
            return this.getComponent(1);
        }

        get z(): number {
            return this.getComponent(2);
        }

        add(vector: Vector3) : Vector3 {
            return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }

        subtract(vector: Vector3) {
            return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
        }
    }
}