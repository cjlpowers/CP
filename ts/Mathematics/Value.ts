
module CP.Mathematics {
    export class Value {
        constructor(public magnitude: number, public unit: string = "") {
        }

        toString(): string {
            var mag = Math.round(this.magnitude * 1000) / 1000
            if (this.unit)
                return mag.toString() + ' ' + this.unit;
            else
                return mag.toString();
        }
    }
}