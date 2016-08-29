
module CP.Mathematics {
    export class Vector2 extends Vector {

        constructor(x: number = 0, y: number= 0) {
            super({"x":x, "y":y});
        }

        get x(): number {
            return this.getComponent("x");
        }
        set x(value:number) {
            this.setComponent("x", value);
        }

        get y(): number {
            return this.getComponent("y");
        }
        set y(value:number) {
            this.setComponent("y", value);
        }

        add(vector: Vector2) : Vector2 {
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }

        subtract(vector: Vector2) {
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
    }
}