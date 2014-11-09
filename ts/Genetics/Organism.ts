
module CP.Genetics {
    
    export class Organism {
        inputs: Sensor[];
        outputs: Sensor[];
        genome: Genome;
        
        constructor() {
            this.inputs = new Array<Sensor>();
            this.outputs = new Array<Sensor>();
        }

        execute(): void {
            if(this.genome)
                this.genome.execute(this.inputs, this.outputs);
        }
    }
}