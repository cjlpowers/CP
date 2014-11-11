module CP.Genetics {
    
    export class PrimitiveOrganism extends Organism implements Graphics.CanvasElement {
        size: number;
        energy: number;
        age: number;
        location: Mathematics.Vector2;
        velocity: Mathematics.Vector2;
        aggression: number;
        environment: PrimitiveEnvironment;
        feedEnergy: number;
        private isAlive: boolean;
        static MaxAge = 2000;
        static StartingEnergy = 1;
        static MovementEnergyFactor = 1 / 100;
        static GenomeEnergyFactor = 1 / 50000;
        static EnergyDensity = PrimitiveOrganism.StartingEnergy;
        static DigestionEfficiency = 0.75;

        constructor(environment: PrimitiveEnvironment, parent?: PrimitiveOrganism) {
            super();
            this.age = 0;
            this.energy = PrimitiveOrganism.StartingEnergy;
            if (parent)
                this.genome = PrimitiveGenome.generateGenome(this, [<PrimitiveGenome>parent.genome]);
            else
                this.genome = PrimitiveGenome.generateGenome(this);
            this.location = new Mathematics.Vector2(0, 0);

            this.velocity = new Mathematics.Vector2(0, 0);
            this.aggression = 0;
            this.isAlive = true;
            this.environment = environment;
            this.initializeSensors();
        }

        execute(): void {
            this.age += 1 / PrimitiveOrganism.MaxAge;
            this.feedEnergy = 0;

            if (this.energy <= 0 || this.size <= 0)
                this.isAlive = false;
            if (this.age >= 1)
                this.isAlive = false;

            if (this.isAlive) {
                this.updateLocation();
                super.execute();

                // compute the energy consumption related to movement
                var movementEnergy = this.size * PrimitiveOrganism.MovementEnergyFactor * this.velocity.magnitude();
                if (movementEnergy < this.energy)
                    this.energy -= movementEnergy;
                else
                    this.velocity = new Mathematics.Vector2(0, 0);

                // compute the energy related to gene length
                var geneomeEnergy = PrimitiveOrganism.GenomeEnergyFactor * this.genome.getSize() * this.size;
                this.energy -= geneomeEnergy;

                // add the feed energy
                this.energy += this.feedEnergy;

                if (this.energy > 1)
                    this.energy = 1;
            }
            else {
                this.environment.removeOrganism(this);
            }
        }

        canExpendEnergy(energy: number) {
            return energy < this.energy;
        }
        
        updateLocation() {
            this.location = this.environment.computeNewLocation(this.location, this.velocity);
        }

        render(ctx: CanvasRenderingContext2D) {
            var fillColor = this.getFillColor();
            var lineColor = this.getLineColor();

            ctx.beginPath();
            ctx.arc(this.location.x, this.location.y, this.size * 10, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.lineWidth = 1 + this.energy * 4;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            if (!this.velocity.isZero()) {
                ctx.lineWidth = 1;
                ctx.moveTo(this.location.x, this.location.y);
                ctx.lineTo(this.location.x + this.velocity.x, this.location.y + this.velocity.y);
            }
            ctx.stroke();
        }

        private getFillColor() {
            var energyLevel = this.energy;
            energyLevel = 0.5;
            var aggressionLevel = Math.floor((this.aggression > 0 ? this.aggression : 0) * 255);
            var defenceLevel = Math.floor((this.aggression < 0 ? -this.aggression : 0) * 255);
            return new Graphics.Color(aggressionLevel, 0, defenceLevel, energyLevel);
        }

        private getLineColor() {
            return Graphics.Color.black;
        }

        private initializeSensors() {

            // create the output sensors
            var outputSensorValues = new Array<number>(5);
            var me = this;
            for (var x = 0; x < outputSensorValues.length; x++) {
                outputSensorValues[x] = 0;
                (function (index) {
                    var outputSensor = new Sensor(
                        () => {
                            return outputSensorValues[index];
                        },
                        (value) => {
                            outputSensorValues[index] = value;
                        });

                    me.outputs.push(outputSensor);
                    me.inputs.push(outputSensor);
                })(x);
            }

            // energy
            this.inputs.push(new Sensor(() => {
                return this.energy;
            }));
            // age
            this.inputs.push(new Sensor(() => {
                return this.age;
            }));
            // size
            this.inputs.push(new Sensor(() => {
                return this.size;
            }));
            // aggression
            this.inputs.push(new Sensor(() => {
                return this.aggression;
            }));
            // velocity x
            this.inputs.push(new Sensor(() => {
                return this.velocity.x;
            }));
            // velocity y
            this.inputs.push(new Sensor(() => {
                return this.velocity.y;
            }));
            // neighbour distance x
            this.inputs.push(new Sensor(() => {
                var neighbour = this.environment.getNeighbour(this);
                if (!neighbour)
                    return 1;
                return (neighbour.location.x - this.location.x) / this.environment.size.x;
            }));
            // neighbour distance y
            this.inputs.push(new Sensor(() => {
                var neighbour = this.environment.getNeighbour(this);
                if (!neighbour)
                    return 1;
                return (neighbour.location.y - this.location.y) / this.environment.size.y;
            }));
            // neighbour size
            this.inputs.push(new Sensor(() => {
                var neighbour = this.environment.getNeighbour(this);
                if (!neighbour)
                    return 0;
                return neighbour.size;
            }));
            // neighbour age
            this.inputs.push(new Sensor(() => {
                var neighbour = this.environment.getNeighbour(this);
                if (!neighbour)
                    return 0;
                return neighbour.age;
            }));
            // neighbour aggression
            this.inputs.push(new Sensor(() => {
                var neighbour = this.environment.getNeighbour(this);
                if (!neighbour)
                    return 0;
                return neighbour.aggression;
            }));
            
        }
    }
}