
module CP.Mathematics {
    export class Value {
        constructor(public magnitude: number, public unit: string = "") {
        }

        toString(): string {
            if (this.unit)
                return this.magnitude.toString() + ' ' + this.unit;
            else
                return this.magnitude.toString();
        }
    }
}