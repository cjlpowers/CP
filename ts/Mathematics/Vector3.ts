
module CP.Mathematics {
    export class Vector3 extends Vector {

        constructor(x: number = 0, y: number= 0, z: number = 0) {
            super([x, y, z]);
        }

        get x(): number {
            return this.getComponent(0);
        }
        set x(value:number) {
            this.setComponent(0, value);
        }

        get y(): number {
            return this.getComponent(1);
        }
        set y(value: number) {
            this.setComponent(1, value);
        }

        get z(): number {
            return this.getComponent(2);
        }
        set z(value: number) {
            this.setComponent(2, value);
        }

        add(vector: Vector3) : Vector3 {
            return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }

        subtract(vector: Vector3) {
            return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
        }
    }
}