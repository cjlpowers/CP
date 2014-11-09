
module CP.Genetics {

    export class PrimitiveGenome extends Genome {
        private organism: PrimitiveOrganism;
        genes: PrimitiveGene[];
        static MaxGeneSize = 1000;
        static MutationProbability = 0.1;

        constructor(organism: PrimitiveOrganism, genes?: PrimitiveGene[]) {
            super();
            this.organism = organism;
            if (genes)
                this.genes = genes;
            else
                this.generate(Math.random() * PrimitiveGenome.MaxGeneSize);
        }

        generate(size: number) {
            this.genes = new Array<PrimitiveGene>();
            for (var i = 0; i < size; i++)
                this.genes.push(PrimitiveGenome.randomGene());
        }

        getSize() {
            return this.genes.length;
        }

        private static randomGene() {
            var index = Math.floor((Math.random() * 100000)) % PrimitiveGene.AllGenes.length;
            return (PrimitiveGene.AllGenes[index])();
        }

        execute(inputSensors: Sensor[], outputSensors: Sensor[]) {
            if (this.genes) {
                this.genes.forEach((gene) => {
                    if(gene.isActive(inputSensors))
                        gene.execute(this.organism, inputSensors, outputSensors);
                });
            }
        }

        static generateGenome(organism: PrimitiveOrganism, ancestors?: PrimitiveGenome[]) {
            var genes: PrimitiveGene[];
            if (ancestors) {
                genes = ancestors[0].genes.map(x=> x);
                if (Math.random() < PrimitiveGenome.MutationProbability) {
                    var index = Math.floor((Math.random() * 100000) % genes.length);
                    if (Math.random() > 0.5 && genes.length > 1) {
                        genes.splice(index, 1);
                    }
                    else if(genes.length < PrimitiveGenome.MaxGeneSize) {
                        var newGenes = genes.slice(0, index);
                        newGenes.push(this.randomGene());
                        newGenes = newGenes.concat(genes.slice(index));
                        genes = newGenes;
                    }
                }
            }
            var genome = new PrimitiveGenome(organism, genes);
            return genome;
        }
    }
}