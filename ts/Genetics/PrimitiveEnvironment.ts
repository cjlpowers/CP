
module CP.Genetics {

    export class PrimitiveEnvironment extends Environment<PrimitiveOrganism> implements Graphics.CanvasElement {        
        static EnergyInflowRate = 0.03;
        static MinOrganismPopulation = 100;
        size: Vector;
        availableEnergyDensity: number = 0;
        onExecute: () => void;
        private neighbourLookup: number[];
        private neighbourDistances: number[];
        private neighbourPairs: NeighbourPair[];

        constructor(size:Vector) {
            super();
            this.size = size;
        }

        execute() {

            // minimum population control
            var underpopulationCount = PrimitiveEnvironment.MinOrganismPopulation - this.organisms.length;
            for (var i = 0; i < underpopulationCount; i++)
                this.spawnOrganism();

            // compute the current available energy density
            var totalOrganismSize = 0;
            this.organisms.forEach(x=> totalOrganismSize += x.size);
            if (totalOrganismSize === 0)
                totalOrganismSize = 1;
            this.availableEnergyDensity = PrimitiveEnvironment.EnergyInflowRate / (totalOrganismSize);

            // compute neighbours
            this.computeNeighbours();

            // resolve contact
            this.neighbourPairs.forEach((pair) => {
                if (pair.distance < pair.a.size + pair.b.size) {
                    var aAttack = pair.a.aggression < 0 ? 0 : pair.a.aggression * pair.a.size;
                    var aDefence = pair.a.aggression > 0 ? 0 : -pair.a.aggression * pair.a.size;
                    var bAttack = pair.b.aggression < 0 ? 0 : pair.b.aggression * pair.b.size;
                    var bDefence = pair.b.aggression > 0 ? 0 : -pair.b.aggression * pair.b.size;

                    // determine energy exchange
                    var aAttackDelta = (aAttack - bDefence);
                    var bAttackDelta = (bAttack - aDefence);

                    if (aAttackDelta > 0) {
                        var massConsumed = aAttackDelta > pair.b.size ? pair.b.size : aAttackDelta;
                        pair.b.size -= massConsumed;
                        pair.a.aggression = 0;
                        pair.a.energy += massConsumed * PrimitiveOrganism.DigestionEfficiency;
                        if (bDefence > 0)
                            pair.b.aggression = 0;
                    }
                    else {
                        pair.b.aggression = -aAttackDelta / pair.b.size;
                    }
                    if (bAttackDelta > 0) {
                        var massConsumed = bAttackDelta > pair.a.size ? pair.a.size : bAttackDelta;
                        pair.a.size -= massConsumed;
                        pair.b.aggression = 0;
                        pair.b.energy += massConsumed * PrimitiveOrganism.DigestionEfficiency;
                        if (aDefence > 0)
                            pair.a.aggression = 0;
                    }
                    else {
                        pair.a.aggression = -bAttackDelta / pair.a.size;
                    }
                }
            }); 

            super.execute();
            this.onExecute();
        }

        getEnergy(location: Vector) {
            return this.availableEnergyDensity;
        }

        getNeighbour(organism: PrimitiveOrganism) : PrimitiveOrganism {
            var index = this.organisms.indexOf(organism);
            var neighbourIndex = this.neighbourLookup[index];
            if (neighbourIndex >= 0) {
                return this.organisms[neighbourIndex];
            }
            return null;
        }

        spawnOrganism() {
            var organism = new CP.Genetics.PrimitiveOrganism(this);
            organism.location = new CP.Vector(Math.random() * this.size.x, Math.random() * this.size.y);
            organism.size = Math.random();
            this.addOrganism(organism);
            return organism;
        }

        computeNewLocation(location: Vector, velocity: Vector) {
            var newLocation = new Vector(location.x + velocity.x, location.y + velocity.y);

            if (newLocation.x < 0)
                newLocation.x += this.size.x;
            else if (newLocation.x > this.size.x)
                newLocation.x -= this.size.x;

            if (newLocation.y < 0)
                newLocation.y += this.size.y;
            else if (newLocation.y > this.size.y)
                newLocation.y -= this.size.y;

            return newLocation;
        }

        private getEnvironmentIndex(location: Vector) {
            return location.x * location.y + location.x;
        }

        render(ctx: CanvasRenderingContext2D) {
            ctx.clearRect(0, 0, this.size.x, this.size.y);
            this.organisms.forEach((member) => {
                member.render(ctx);
            });
        }

        private computeNeighbours() {
            this.neighbourDistances = new Array<number>(this.organisms.length);
            this.neighbourLookup = new Array<number>(this.organisms.length);
            this.neighbourPairs = new Array<NeighbourPair>();
            for (var i = 0; i < this.neighbourLookup.length; i++)
                this.neighbourLookup[i] = -1;

            for (var x = 0; x < this.organisms.length; x++) {
                if (this.neighbourLookup[x] !== -1)
                    continue;

                var nearest = -1;
                var distance = -1;
                for (var y = 0; y < this.organisms.length; y++) {
                    if (x === y)
                        continue;

                    var dist = this.organisms[x].location.subtract(this.organisms[y].location).magnitude();
                    if (dist < distance || distance === -1) {
                        nearest = y;
                        distance = dist;
                    }
                }

                this.neighbourLookup[x] = nearest;
                this.neighbourDistances[x] = distance;
                if (nearest !== -1 && this.neighbourLookup[nearest] == -1) {

                    // store the pairs
                    this.neighbourPairs.push({a: this.organisms[x], b: this.organisms[nearest], distance: distance});

                    // store the reverse lookup
                    this.neighbourLookup[nearest] = x;
                    this.neighbourDistances[nearest] = distance;
                }
            }
        }
    }

    interface NeighbourPair {
        a: PrimitiveOrganism;
        b: PrimitiveOrganism;
        distance: number;
    }
}