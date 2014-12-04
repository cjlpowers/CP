/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class Element implements Graphics.CanvasElement {
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

        public render(ctx: CanvasRenderingContext2D, options?: any) {
            var fillColor = new Graphics.Color(100, 100, 100);
            var lineColor = new Graphics.Color(0, 0, 0);

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = lineColor;
            ctx.moveTo(this.nodes[0].position.x, this.nodes[0].position.y);
            ctx.lineTo(this.nodes[1].position.x, this.nodes[1].position.y);
            ctx.stroke();
        }
    }
}