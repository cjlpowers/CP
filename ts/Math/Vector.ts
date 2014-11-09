
module CP {
    export class Vector {
        private magnitudeValue: number;

        constructor(public x: number = 0, public y: number= 0, public z: number = 0) {
        }

        magnitude() {
            if (this.magnitudeValue === undefined)
                this.magnitudeValue = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            return this.magnitudeValue;
        }

        add(vector: Vector) {
            return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }

        subtract(vector: Vector) {
            return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
        }

        isZero() {
            return this.x == 0 && this.y == 0;
        }
    }
}