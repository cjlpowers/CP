
module CP.Mathematics {
    export class Vector {
        private magnitudeValue: number;

        constructor(private components: number[]) {
        }

        magnitude() : number {
            if (this.magnitudeValue === undefined) {
                this.magnitudeValue = Math.sqrt(this.components.reduce((prev, current) => {
                    return prev + current * current;
                }, 0));
            }
            return this.magnitudeValue;
        }

        isZero() : boolean {
            return this.components.every((value) => {
                return value === 0;
            });
        }

        getComponent(n: number) : number {
            return this.components[n];
        }

        getDimensions(): number {
            return this.components.length;
        }
    }
}