/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class Material {
        public static Aluminium = new Material("Aluminium", new Mathematics.Value(69, "GPa"));
        public static Steel = new Material("Steel", new Mathematics.Value(200, "GPa"));
        public static Glass = new Material("Glass", new Mathematics.Value(72, "GPa"));

        constructor(public name: string, public elasticModulus: Mathematics.Value) {
        }

        toString(): string {
            return this.name.toString() + ' (' + this.elasticModulus.toString() + ')';
        }
    }
}