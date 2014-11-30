/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class TrussElement extends Element {
        
        get length(): number {
            return this.nodes[0].position.subtract(this.nodes[1].position).magnitude();
        }

        get coefficient(): number {
            return this.area.magnitude * this.material.elasticModulus.magnitude / this.length
        }

        constructor(material: Mechanical.Material, public area: Mathematics.Value, node1: Node, node2: Node ) {
            super(material);
            this.nodes.push(node1);
            this.nodes.push(node2);
        }

        public calculateCoefficientMatrix(): Mathematics.Matrix {
            var length = this.nodes[1].position.subtract(this.nodes[0].position);

            var x = length.x;
            var y = length.y;

            var a = x / Math.sqrt(x * x + y * y);
            var b = y / Math.sqrt(x * x + y * y);

            var a2 = a * a;
            var b2 = b * b;
            var ab = a * b;

            var k = Mathematics.Matrix.new(4, 4);
            k.setValue(0, 0, a2);
            k.setValue(0, 1, ab);
            k.setValue(0, 2, -a2);
            k.setValue(0, 3, -ab);

            k.setValue(1, 0, ab);
            k.setValue(1, 1, b2);
            k.setValue(1, 2, -ab);
            k.setValue(1, 3, -b2);

            k.setValue(2, 0, -a2);
            k.setValue(2, 1, -ab);
            k.setValue(2, 2, a2);
            k.setValue(2, 3, ab);

            k.setValue(3, 0, -ab);
            k.setValue(3, 1, -b2);
            k.setValue(3, 2, ab);
            k.setValue(3, 3, b2);

            return k;
        }

        public calculateStiffnessMatrix(): Mathematics.Matrix {
            var k = this.calculateCoefficientMatrix();
            var c = this.coefficient;
            k = k.scale(c);
            return k;
        }

        public calcualteTransformMatrix(): Mathematics.Matrix {
            var length = this.nodes[1].position.subtract(this.nodes[0].position);

            var x = length.x;
            var y = length.y;

            var a = x / Math.sqrt(x * x + y * y);
            var b = y / Math.sqrt(x * x + y * y);

            var k = Mathematics.Matrix.new(4, 4);
            k.setValue(0, 0, a);
            k.setValue(0, 1, b);
           
            k.setValue(1, 0, -b);
            k.setValue(1, 1, a);

            k.setValue(2, 2, a);
            k.setValue(2, 3, b);

            k.setValue(3, 2, -b);
            k.setValue(3, 3, a);

            return k;
        }

        public calcualteGlobalDisplacementMatrix(): Mathematics.Matrix {
            var globalDisplacementMatrix = Mathematics.Matrix.new(this.nodes.length * 2, 1);

            var row = 0;
            this.nodes.forEach((node) => {
                globalDisplacementMatrix.setValue(row++, 0, node.displacement.x);
                globalDisplacementMatrix.setValue(row++, 0, node.displacement.y);
            });
            return globalDisplacementMatrix;
        }
    }
}