
module CP.Mechanical {
    export class Structure<T extends Element> extends Element implements Graphics.CanvasElement {
        showElements: boolean = true;
        showNodes: boolean = true;

        constructor(protected dof: number, public elements: Array<T>, nodes: Array<Node>) {
            super(0, Material.Aluminium);
            this.nodes = nodes;
        }

        public calculateStiffnessMatrix(): Mathematics.Matrix {
            var k = Mathematics.Matrix.new(this.nodes.length * this.dof, this.nodes.length * this.dof);
            for (var e = 0; e < this.elements.length; e++) {
                var element = this.elements[e];
                var elementK = element.calculateStiffnessMatrix();
                for (var i = 0; i < element.nodes.length; i++) {
                    var globalNumber = element.nodes[i].number - 1;

                    for (var r = 0; r < this.dof; r++) {
                        for (var c = 0; c < this.dof; c++)
                            k.addValue(globalNumber * this.dof + r, globalNumber * this.dof + c, elementK.getValue(i * this.dof + r, i * this.dof + c));
                    }
                    for (var j = 0; j < element.nodes.length; j++) {
                        if (j != i) {
                            var gNumber = element.nodes[j].number - 1;
                            for (var r = 0; r < this.dof; r++) {
                                for (var c = 0; c < this.dof; c++) {
                                    k.addValue(gNumber * this.dof + r, globalNumber * this.dof + c, elementK.getValue(j * this.dof + r, i * this.dof + c));
                                }
                            }
                        }
                    }
                }
            }
            return k;
        }

        public calculateForceMatrix(): Mathematics.Matrix {
            var f = Mathematics.Matrix.new(this.nodes.length * this.dof, 1);
            for (var r = 0; r < this.nodes.length; r++) {
                var n = this.nodes[r];
                if (n.force.x !== undefined)
                    f.setValue(r * this.dof, 0, n.force.x);

                if (this.dof >= 2 && n.force.y !== undefined)
                    f.setValue(r * this.dof + 1, 0, n.force.y);

                if (this.dof >= 3 && n.force.z !== undefined)
                    f.setValue(r * this.dof + 2, 0, n.force.z);
            }
            return f;
        }

        public calculateDisplacementMatrix(globalK: Mathematics.Matrix, globalF: Mathematics.Matrix): Mathematics.Matrix {
            globalK = globalK.clone();
            globalF = globalF.clone();

            // now use the penalty approach to apply boundary conditions
            var coeff = 0;
            for (var r = 0; r < globalK.rowCount; r++)
                for (var c = 0; c < globalK.columnCount; c++)
                    if (coeff < globalK.getValue(r, c))
                        coeff = globalK.getValue(r, c);

            coeff *= 10000;

            for (var n = 0; n < this.nodes.length; n++) {
                var node = this.nodes[n];
                var globalNumber = node.number - 1;

                if (node.displacement.x !== undefined) {
                    globalK.addValue(globalNumber * this.dof, globalNumber * this.dof, coeff);
                    globalF.addValue(globalNumber * this.dof, 0, node.displacement.x * coeff);
                }

                if (this.dof >= 2 && node.displacement.y !== undefined) {
                    globalK.addValue(globalNumber * this.dof + 1, globalNumber * this.dof + 1, coeff);
                    globalF.addValue(globalNumber * this.dof + 1, 0, node.displacement.y * coeff);
                }

                if (this.dof >= 3 && node.displacement.z !== undefined) {
                    globalK.addValue(globalNumber * this.dof + 2, globalNumber * this.dof + 2, coeff);
                    globalF.addValue(globalNumber * this.dof + 2, 0, node.displacement.z * coeff);
                }
            }

            var globalQ = CP.Mathematics.Matrix.solveAxEqualsB(globalK, globalF);
            return globalQ;
        }

        public calculateReactionDisplacements(globalQ: Mathematics.Matrix) {
            this.nodes.forEach((node) => {
                var globalNumber = node.number - 1;
                if (this.dof === 1)
                    node.reactionDisplacement = new Mathematics.Vector3(globalQ.getValue(globalNumber * this.dof, 0));
                else if (this.dof === 2)
                    node.reactionDisplacement = new Mathematics.Vector3(globalQ.getValue(globalNumber * this.dof, 0), globalQ.getValue(globalNumber * this.dof + 1, 0));
                else if (this.dof === 3)
                    node.reactionDisplacement = new Mathematics.Vector3(globalQ.getValue(globalNumber * this.dof, 0), globalQ.getValue(globalNumber * this.dof + 1, 0), globalQ.getValue(globalNumber * this.dof + 2, 0));
                else
                    throw new Error("DOF not supported");
            });
        }

        public calculateReactionForces(globalK: Mathematics.Matrix, globalQ: Mathematics.Matrix) {
            var globalR = globalK.multiply(globalQ);
            var rowCount = 0;
            this.nodes.forEach((node) => {
                var x: any, y: any, z: any = undefined;

                if (this.dof >= 1)
                    x = globalR.getValue(rowCount++, 0);
                if (this.dof >= 2)
                    y = globalR.getValue(rowCount++, 0);
                if (this.dof >= 3)
                    z = globalR.getValue(rowCount++, 0);

                node.reactionForce = new Mathematics.Vector3(x, y, z);
            });
        }

        public solve() {
            // computing global stiffness matrix
            var globalK = this.calculateStiffnessMatrix();
            var globalF = this.calculateForceMatrix();
            var globalQ = this.calculateDisplacementMatrix(globalK, globalF);

            // compute reaction
            this.calculateReactionDisplacements(globalQ);
            this.calculateReactionForces(globalK, globalQ);
        }

        public render(ctx: CanvasRenderingContext2D, options?: IRenderOptions) {
            options = options || Structure.getDefaultRenderOptions();

            if (options.showElements) {
                this.elements.forEach((element) => {
                    element.render(ctx, options);
                });
            }

            if (options.showNodes) {
                this.nodes.forEach((node) => {
                    node.render(ctx, options);
                });
            }
        }

        static getDefaultRenderOptions(): IRenderOptions {
            return {
                showNodes: true,
                showElements: true,
                showDisplacement: true,
                displacementMultiplier: 5,
            };
        }
    }
}