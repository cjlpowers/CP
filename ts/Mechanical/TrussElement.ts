/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class TrussElement extends Element {
        private vector: Mathematics.Vector3;
        private a: number;
        private b: number;
        private a2: number;
        private b2: number;
        private ab: number;

        public stress: Mathematics.Value;
        public stressFactor: number;

        get length(): number {
            return this.nodes[0].position.subtract(this.nodes[1].position).magnitude();
        }

        get coefficient(): number {
            return this.area.magnitude * this.material.elasticModulus.magnitude / this.length
        }

        constructor(number: number, material: Mechanical.Material, public area: Mathematics.Value, node1: Node, node2: Node) {
            super(number, material);
            this.nodes.push(node1);
            this.nodes.push(node2);
            this.vector = this.nodes[1].position.subtract(this.nodes[0].position);
            this.a = this.vector.x / this.vector.magnitude();
            this.b = this.vector.y / this.vector.magnitude();
            this.a2 = this.a * this.a;
            this.b2 = this.b * this.b;
            this.ab = this.a * this.b;
        }

        public calculateCoefficientMatrix(): Mathematics.Matrix {

            var k = Mathematics.Matrix.new(4, 4);
            k.setValue(0, 0, this.a2);
            k.setValue(0, 1, this.ab);
            k.setValue(0, 2, -this.a2);
            k.setValue(0, 3, -this.ab);

            k.setValue(1, 0, this.ab);
            k.setValue(1, 1, this.b2);
            k.setValue(1, 2, -this.ab);
            k.setValue(1, 3, -this.b2);

            k.setValue(2, 0, -this.a2);
            k.setValue(2, 1, -this.ab);
            k.setValue(2, 2, this.a2);
            k.setValue(2, 3, this.ab);

            k.setValue(3, 0, -this.ab);
            k.setValue(3, 1, -this.b2);
            k.setValue(3, 2, this.ab);
            k.setValue(3, 3, this.b2);

            return k;
        }

        public calculateStiffnessMatrix(): Mathematics.Matrix {
            var k = this.calculateCoefficientMatrix();
            var c = this.coefficient;
            k = k.scale(c);
            return k;
        }

        public calcualteTransformMatrix(): Mathematics.Matrix {
            var k = Mathematics.Matrix.new(4, 4);
            k.setValue(0, 0, this.a);
            k.setValue(0, 1, this.b);

            k.setValue(1, 0, -this.b);
            k.setValue(1, 1, this.a);

            k.setValue(2, 2, this.a);
            k.setValue(2, 3, this.b);

            k.setValue(3, 2, -this.b);
            k.setValue(3, 3, this.a);

            return k;
        }

        public calcualteGlobalDisplacementMatrix(): Mathematics.Matrix {
            var globalDisplacementMatrix = Mathematics.Matrix.new(this.nodes.length * 2, 1);

            var row = 0;
            this.nodes.forEach((node) => {
                if (node.reactionDisplacement && node.reactionDisplacement.isDefined()) {
                    globalDisplacementMatrix.setValue(row++, 0, node.reactionDisplacement.x);
                    globalDisplacementMatrix.setValue(row++, 0, node.reactionDisplacement.y);
                }
                else if (node.displacement && node.displacement.isDefined()) {
                    globalDisplacementMatrix.setValue(row++, 0, node.displacement.x);
                    globalDisplacementMatrix.setValue(row++, 0, node.displacement.y);
                }
            });
            return globalDisplacementMatrix;
        }

        public calculateStress(): Mathematics.Value {
            var displacementMatrix = this.calcualteGlobalDisplacementMatrix();
            var transformationMatrix = this.calcualteTransformMatrix();
            var linearMatrix = new Mathematics.Matrix([-1, 1]);

            var matrix = linearMatrix.multiply(transformationMatrix);
            matrix = matrix.multiply(displacementMatrix);

            return new Mathematics.Value((this.material.elasticModulus.magnitude / this.length) * matrix.getValue(0, 0));
        }

        public solve() {
            this.stress = this.calculateStress();
        }

        public render(ctx: CanvasRenderingContext2D, options?: IRenderOptions) {
            var fillColor = new Graphics.Color(100, 100, 100);
            var lineColor = Graphics.Color.black;

            var stressColor = new Graphics.Color(this.stressFactor > 0 ? this.stressFactor * 200 : 0, 0, this.stressFactor > 0 ? 0 : -this.stressFactor * 200);

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = stressColor;
            if (options.showDisplacement && options.displacementMultiplier) {
                ctx.moveTo(this.nodes[0].position.x + this.nodes[0].reactionDisplacement.x * options.displacementMultiplier, this.nodes[0].position.y + this.nodes[0].reactionDisplacement.y * options.displacementMultiplier);
                ctx.lineTo(this.nodes[1].position.x + this.nodes[1].reactionDisplacement.x * options.displacementMultiplier, this.nodes[1].position.y + this.nodes[1].reactionDisplacement.y * options.displacementMultiplier);
            }
            else {
                ctx.moveTo(this.nodes[0].position.x, this.nodes[0].position.y);
                ctx.lineTo(this.nodes[1].position.x, this.nodes[1].position.y);
            }
            ctx.stroke();

            var middle = new Mathematics.Vector3(this.nodes[0].position.x + this.vector.x / 2, this.nodes[0].position.y + this.vector.y / 2);
            ctx.beginPath();
            ctx.fillStyle = Graphics.Color.white;
            ctx.arc(middle.x, middle.y, 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = "3px serif";
            ctx.fillStyle = Graphics.Color.black;
            ctx.fillText(this.number.toString(), middle.x - 1, middle.y + 1);
        }
    }
}