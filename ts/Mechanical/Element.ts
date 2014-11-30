/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class Element {
        public nodes: Node[];
        public number: number;

        constructor(public material: Material) {
            this.nodes = new Array<Node>();
        }

        public calculateStiffnessMatrix(): Mathematics.Matrix {
            throw new Error("Not implemented");
        }

        public calcualteTransformMatrix(): Mathematics.Matrix {
            throw new Error("Not implemented");
        }

        public calcualteGlobalDisplacementMatrix(): Mathematics.Matrix {
            throw new Error("Not implemented");
        }

        public calcualteLocalDisplacementMatrix(): Mathematics.Matrix {
            var transformMatrix = this.calcualteTransformMatrix();
            var globalDisplacementMatrix = this.calcualteGlobalDisplacementMatrix();
            return transformMatrix.multiply(globalDisplacementMatrix);
        }
    }
}