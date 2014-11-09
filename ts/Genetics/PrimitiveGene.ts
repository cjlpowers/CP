
module CP.Genetics {

    export class PrimitiveGene {

        private triggerIndex: number;
        private triggerThreshold: number;

        constructor() {
            this.triggerIndex = this.getRandomIndex();
            this.triggerThreshold = Math.random();
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
        }

        isActive(inputSensors: Sensor[]) {
            var sensor = this.getSensor(inputSensors, this.triggerIndex);
            return Math.abs(sensor.getValue()) >= this.triggerThreshold;
        }

        getSensor(sensors: Sensor[], sensorIndex) {
            return sensors[sensorIndex % sensors.length];
        }

        getRandomIndex() {
            return Math.ceil(Math.random() * 100000);
        }

        normalize(value: number, min: number = 0, max: number = 1) {
            if (value < min)
                return min;
            if (value > max)
                return max;
            return value;
        }

        limit(delta: number, value: number, min: number, max: number) {
            if (value + delta > max)
                return max - value;
            else if (value + delta < min)
                return min - value;
            return delta;
        }

        static AllGenes: Array<() => PrimitiveGene> = [
            () => {return new TransferGene() },
            () => {return new VelocityGene() },
            () => {return new FeedGene() },
            () => {return new GrowthGene() },
            () => {return new RandomGene() },
            () => {return new SpawnGene() },
            () => {return new AggressionGene() }
        ];
    }

    class TransferGene extends PrimitiveGene {
        private inputIndex: number;
        private outputIndex: number;
        private transferFactor: number;

        constructor() {
            super();

            this.inputIndex = this.getRandomIndex();
            this.outputIndex = this.getRandomIndex();
            this.transferFactor = 1 - Math.random() * 2;
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            var inputSensor = this.getSensor(inputSensors, this.inputIndex);
            var outputSensor = this.getSensor(outputSensors, this.outputIndex);
            var newValue = outputSensor.getValue();
            newValue += inputSensor.getValue() * this.transferFactor;
            outputSensor.setValue(newValue);
        }
    }

    class VelocityGene extends PrimitiveGene {
        static ImpulseFactor = 0.01;
        private directionIndex: number;
        private velocityIndex: number;

        constructor() {
            super();
            this.directionIndex = this.getRandomIndex();
            this.velocityIndex = this.getRandomIndex();
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            var directionSensor = this.getSensor(outputSensors, this.directionIndex);
            var velocitySensor = this.getSensor(outputSensors, this.velocityIndex);
            var impulse = velocitySensor.getValue() * VelocityGene.ImpulseFactor;
            var directionValue = directionSensor.getValue();
            if (directionValue > 0)
                organism.velocity = organism.velocity.add(new Vector(impulse, 0));
            else if (directionValue < 0)
                organism.velocity = organism.velocity.add(new Vector(0, impulse));
            else
                return;

            organism.velocity.x = this.normalize(organism.velocity.x, -1, 1);
            organism.velocity.y = this.normalize(organism.velocity.y, -1, 1);
        }
    }

    class FeedGene extends PrimitiveGene {

        static FeedingEfficiency = 1;

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            if (organism.energy < 1) {
                var energy = organism.environment.getEnergy(organism.location);
                organism.feedEnergy += energy * organism.size * FeedGene.FeedingEfficiency;
            }
        }
    }

    class GrowthGene extends PrimitiveGene {
        private growthFactor: number;
        static MaxGrowthRate = 0.01;
        static ConversionEfficiency = 0.9;

        constructor() {
            super();
            this.growthFactor = (1 - Math.random() * 2) * GrowthGene.MaxGrowthRate;
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            var potential = 0;

            if (this.growthFactor > 0)
                potential = 1 - organism.size;
            else if (this.growthFactor < 0)
                potential = organism.size;

            if (potential !== 0) {
                var growth = potential * this.growthFactor;
                var growthEnergy = growth * PrimitiveOrganism.EnergyDensity;
                if (growth > 0) {
                    growthEnergy = growthEnergy / GrowthGene.ConversionEfficiency;
                    if (organism.canExpendEnergy(growthEnergy)) {
                        organism.size += growth;
                        organism.energy -= growthEnergy;
                    }
                }
                else {
                    growthEnergy = growthEnergy * GrowthGene.ConversionEfficiency;
                    if (organism.energy - growthEnergy < 1) {
                        organism.size += growth;
                        organism.energy -= growthEnergy;
                    }
                }
                organism.size = this.normalize(organism.size);
                organism.energy = this.normalize(organism.energy);
            }
        }
    }

    class RandomGene extends PrimitiveGene {

        private outputIndex: number;

        constructor() {
            super();
            this.outputIndex = this.getRandomIndex();
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            var sensor = this.getSensor(outputSensors, this.outputIndex);
            sensor.setValue(1 - Math.random() * 2);
        }
    }

    class SpawnGene extends PrimitiveGene {

        private sizeFactor: number;
        static MaxSpawnSize = 0.3;
        static MinAge = 0.3;
        static MinSpawnSize = 0.25;
        static MinSize = 0.3;
        static SpawnEfficiency = 0.3;

        constructor() {
            super();
            this.sizeFactor = Math.random();
            if (this.sizeFactor < SpawnGene.MinSpawnSize)
                this.sizeFactor = SpawnGene.MinSpawnSize;
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            if (organism.age < SpawnGene.MinAge)
                return;

            if (organism.size < SpawnGene.MinSize)
                return;

            var environment = organism.environment;
            var spawnSize = organism.size * this.sizeFactor * SpawnGene.MaxSpawnSize;
            var spawnEnergy = PrimitiveOrganism.EnergyDensity * spawnSize * 1 / SpawnGene.SpawnEfficiency;
            if (organism.canExpendEnergy(spawnEnergy)) {
                organism.energy -= spawnEnergy;
                var spawn = new PrimitiveOrganism(environment, organism);
                spawn.energy = spawnEnergy;
                spawn.size = spawnSize;
                //spawn.location.x = organism.location.x;
                //spawn.location.y = organism.location.y;
                spawn.location = new CP.Vector(Math.random() * environment.size.x, Math.random() * environment.size.y);
                environment.addOrganism(spawn);
            }
        }
    }

    class AggressionGene extends PrimitiveGene {
        static ChangeRate = 0.1;
        static EnergyRate = 0.125;
        private inputIndex: number;        

        constructor() {
            super();
            this.inputIndex = this.getRandomIndex();
        }

        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]) {
            var inputSensor = this.getSensor(outputSensors, this.inputIndex);
            var aggressionDelta = inputSensor.getValue() * AggressionGene.ChangeRate;
            aggressionDelta = this.limit(aggressionDelta, organism.aggression, -1, 1);
            if (aggressionDelta != 0) {
                var aggressionDeltaEnergy = Math.abs(aggressionDelta * AggressionGene.EnergyRate * organism.size);
                if (organism.canExpendEnergy(aggressionDeltaEnergy)) {
                    organism.energy -= aggressionDeltaEnergy;
                    organism.aggression += aggressionDelta;
                    organism.aggression = this.normalize(organism.aggression, -1, 1);
                }
            }
        }
    }
}