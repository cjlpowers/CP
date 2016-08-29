
module CP.Mechanical {
    export class TrussStructure extends Structure<TrussElement>{
        constructor(dof: number, elements: Array<TrussElement>, nodes: Array<Node>) {
            super(dof, elements, nodes);
        }

        public solve() {
            super.solve();
            this.elements.forEach(x => x.solve());
            
            // determine the min and max stress
            var minStress = Math.min.apply(null, this.elements.map(x=> x.stress.magnitude));
            var maxStress = Math.max.apply(null, this.elements.map(x=> x.stress.magnitude));

            var deltaStress = maxStress - minStress;
            // set the stress factor in each element
            this.elements.forEach(x=> {
                if (x.stress.magnitude > 0 && maxStress > 0)
                    x.stressFactor = x.stress.magnitude / maxStress;
                else if (x.stress.magnitude < 0 && minStress < 0)
                    x.stressFactor = -x.stress.magnitude / minStress;
                else
                    x.stressFactor = 0;
            });
        }

        static load(definition: StructureDefinition) {
            var nodes = definition.nodes.map((e, i) => {
                var node = new Node(i + 1);

                if (e.position) {
                    node.position.x = e.position.x !== undefined ? e.position.x : node.position.x;
                    node.position.y = e.position.y !== undefined ? e.position.y : node.position.y;
                    node.position.z = e.position.z !== undefined ? e.position.z : node.position.z;
                }

                if (e.force) {
                    node.force.x = e.force.x !== undefined ? e.force.x : node.force.x;
                    node.force.y = e.force.y !== undefined ? e.force.y : node.force.y;
                    node.force.z = e.force.z !== undefined ? e.force.z : node.force.z;
                }

                if (e.displacement) {
                    node.displacement.x = e.displacement.x !== undefined ? e.displacement.x : node.displacement.x;
                    node.displacement.y = e.displacement.y !== undefined ? e.displacement.y : node.displacement.y;
                    node.displacement.z = e.displacement.z !== undefined ? e.displacement.z : node.displacement.z;
                }

                return node;
            });

            var materials = definition.materials.map((e) => {
                return new Material(e.name, new Mathematics.Value(e.elasticModulus));
            });

            var elements = definition.elements.map((e, i) => {
                return new TrussElement(i+1, materials[e.material || 0], new Mathematics.Value(e.area, null), nodes[e.nodes[0]], nodes[e.nodes[1]]);
            });

            var structure = new TrussStructure(2, elements, nodes);
            return structure;
        }
    }
}