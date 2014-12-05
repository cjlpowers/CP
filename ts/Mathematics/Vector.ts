
module CP.Mathematics {
    export class Vector {
        private magnitudeValue: number;
        public unit: string;

        constructor(private components: number[]) {
        }

        magnitude() : number {
            if (this.magnitudeValue === undefined) {
                this.magnitudeValue = Math.sqrt(this.components.reduce((prev, current) => {
                    return prev + (current ? current * current : 0);
                }, 0));
            }
            return this.magnitudeValue;
        }

        isZero() : boolean {
            return this.components.every((value) => value === 0);
        }

        isDefined(): boolean {
            return this.components.some((value) => value !== undefined);
        }

        getComponent(n: number) : number {
            return this.components[n];
        }

        protected setComponent(n: number, value: number) {
            this.components[n] = value;
        }

        getDimensions(): number {
            return this.components.length;
        }

        toString(): string {
            var str = '[';
            var dimensions = this.getDimensions();
            for (var i = 0; i < dimensions; i++) {
                var component = this.getComponent(i);
                if (component === undefined)
                    continue;
                str = str + Math.round(component * 1000) / 1000;
                if (i < dimensions - 1)
                    str = str + ', ';
            }
            str = str + ']';
            if (this.unit)
                str = str + ' ' + this.unit;
            return str;
        }
    }
}