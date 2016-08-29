
module CP.Mathematics {
    export class Vector {
        private magnitudeValue: number;
        public unit: string;
        private components: any = {};
        private namedComponents = false;
        private dimensions: number;

        constructor(components:number[] | {[key:string] : number}) {
            this.components = {};
            if(components instanceof Array)
            {
                for(var i = 0; i <components.length; i++)
                    this.components[i] = components[i];
            }
            else
            {
                this.namedComponents = true;
                for(var prop in components) {
                    if(components.hasOwnProperty(prop))
                        this.components[prop] =components[prop];
                }
            }

            var v = new Vector({"x":1, "y": 1});
            var v2 = new Vector([1,2,3]);
        }

        magnitude() : number {
            if (this.magnitudeValue === undefined) {
                var result = 0;
                for(var prop in this.components)
                    result = result + (this.components[prop] ? this.components[prop] * this.components[prop]: 0);
                this.magnitudeValue = Math.sqrt(result);
            }
            return this.magnitudeValue;
        }

        isZero() : boolean {
            for(var prop in this.components) {
                if(this.components[prop] !== 0)
                    return false;
            }
            return true;
        }

        isDefined(): boolean {
            for(var prop in this.components) {
                if(this.components[prop] !== undefined)
                    return true;
            }
            return false;
        }

        getComponent(component: string | number) : number {
            return this.components[component];
        }

        protected setComponent(component: string | number, value: number) {
            this.components[component] = value;
        }

        getDimensions(): number {
            if (this.dimensions === undefined) {
                var result = 0;
                for(var prop in this.components)
                    result += 1;
                this.dimensions = result;
            }
            return this.dimensions;
        }

        toString(): string {
            var str = '[';
            var firstPass = true;
            for(var prop in this.components)
            {
                if(!firstPass)
                    str = str + ', ';
                if(this.namedComponents)
                    str = str + prop + ':';    
                str = str + Math.round(this.components[prop] * 1000) / 1000;
                firstPass = false;
            }
            str = str + ']';
            if (this.unit)
                str = str + ' ' + this.unit;
            return str;
        }
        
        add(vector: Vector) : Vector {
            var resultComponents: any = {};
            
            for(var prop in this.components) {
                if(this.components.hasOwnProperty(prop))
                    resultComponents[prop] = this.components[prop];
            }

            for(var prop in vector.components) {
                if(vector.components.hasOwnProperty(prop))
                    resultComponents[prop] = (resultComponents[prop] || 0) + vector.components[prop];
            }

            return new Vector(resultComponents);
        }

        subtract(vector: Vector) {
           var resultComponents: any = {};
            
            for(var prop in this.components) {
                if(this.components.hasOwnProperty(prop))
                    resultComponents[prop] = this.components[prop];
            }

            for(var prop in vector.components) {
                if(vector.components.hasOwnProperty(prop))
                    resultComponents[prop] = (resultComponents[prop] || 0) - vector.components[prop];
            }

            return new Vector(resultComponents);
        }
    }
}