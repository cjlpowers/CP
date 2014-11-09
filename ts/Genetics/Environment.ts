
module CP.Genetics {

    export class Environment<TOrganism extends Organism> {
        organisms: TOrganism[];
        epoch: number;
        
        constructor() {
            this.organisms = new Array<TOrganism>();
            this.epoch = 0;
        }

        execute(): void {
            this.epoch++;

            // allow each organism to execute
            this.organisms.forEach((member) => {
                member.execute();
            });
        }

        addOrganism(organism: TOrganism) {
            this.organisms.push(organism);
        }

        removeOrganism(organism: TOrganism) {
            var index = this.organisms.indexOf(organism);
            this.organisms.splice(index, 1);
        }
    }
}