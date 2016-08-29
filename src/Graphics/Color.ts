
module CP.Graphics {

    export class Color {
        static black = new Color(0, 0, 0);
        static white = new Color(255, 255, 255);

        private strValue: string;

        constructor(public r: number, public g: number, public b: number, public a: number = 1) {
            this.r = Math.round(this.r);
            this.g = Math.round(this.g);
            this.b = Math.round(this.b);
        }

        toString() {
            if (this.strValue === undefined) {
                this.strValue = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
            }
            return this.strValue;
        }
    }
}