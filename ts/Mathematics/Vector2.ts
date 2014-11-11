
module CP.Mathematics {
    export class Vector2 extends Vector {

        constructor(x: number = 0, y: number= 0) {
            super([x, y]);
        }

        get x(): number {
            return this.getComponent(0);
        }

        get y(): number {
            return this.getComponent(1);
        }

        add(vector: Vector2) : Vector2 {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }

        subtract(vector: Vector2) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
    }
}