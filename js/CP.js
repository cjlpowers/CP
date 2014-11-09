var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var Environment = (function () {
            function Environment() {
                this.organisms = new Array();
                this.epoch = 0;
            }
            Environment.prototype.execute = function () {
                this.epoch++;
                // allow each organism to execute
                this.organisms.forEach(function (member) {
                    member.execute();
                });
            };
            Environment.prototype.addOrganism = function (organism) {
                this.organisms.push(organism);
            };
            Environment.prototype.removeOrganism = function (organism) {
                var index = this.organisms.indexOf(organism);
                this.organisms.splice(index, 1);
            };
            return Environment;
        })();
        Genetics.Environment = Environment;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var Genome = (function () {
            function Genome() {
            }
            Genome.prototype.getSize = function () {
                return 0;
            };
            Genome.prototype.execute = function (inputSensors, outputSensors) {
            };
            return Genome;
        })();
        Genetics.Genome = Genome;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var Organism = (function () {
            function Organism() {
                this.inputs = new Array();
                this.outputs = new Array();
            }
            Organism.prototype.execute = function () {
                if (this.genome)
                    this.genome.execute(this.inputs, this.outputs);
            };
            return Organism;
        })();
        Genetics.Organism = Organism;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var PrimitiveEnvironment = (function (_super) {
            __extends(PrimitiveEnvironment, _super);
            function PrimitiveEnvironment(size) {
                _super.call(this);
                this.availableEnergyDensity = 0;
                this.size = size;
            }
            PrimitiveEnvironment.prototype.execute = function () {
                // minimum population control
                var underpopulationCount = PrimitiveEnvironment.MinOrganismPopulation - this.organisms.length;
                for (var i = 0; i < underpopulationCount; i++)
                    this.spawnOrganism();
                // compute the current available energy density
                var totalOrganismSize = 0;
                this.organisms.forEach(function (x) { return totalOrganismSize += x.size; });
                if (totalOrganismSize === 0)
                    totalOrganismSize = 1;
                this.availableEnergyDensity = PrimitiveEnvironment.EnergyInflowRate / (totalOrganismSize);
                // compute neighbours
                this.computeNeighbours();
                // resolve contact
                this.neighbourPairs.forEach(function (pair) {
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
                            pair.a.energy += massConsumed * Genetics.PrimitiveOrganism.DigestionEfficiency;
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
                            pair.b.energy += massConsumed * Genetics.PrimitiveOrganism.DigestionEfficiency;
                            if (aDefence > 0)
                                pair.a.aggression = 0;
                        }
                        else {
                            pair.a.aggression = -bAttackDelta / pair.a.size;
                        }
                    }
                });
                _super.prototype.execute.call(this);
                this.onExecute();
            };
            PrimitiveEnvironment.prototype.getEnergy = function (location) {
                return this.availableEnergyDensity;
            };
            PrimitiveEnvironment.prototype.getNeighbour = function (organism) {
                var index = this.organisms.indexOf(organism);
                var neighbourIndex = this.neighbourLookup[index];
                if (neighbourIndex >= 0) {
                    return this.organisms[neighbourIndex];
                }
                return null;
            };
            PrimitiveEnvironment.prototype.spawnOrganism = function () {
                var organism = new CP.Genetics.PrimitiveOrganism(this);
                organism.location = new CP.Vector(Math.random() * this.size.x, Math.random() * this.size.y);
                organism.size = Math.random();
                this.addOrganism(organism);
                return organism;
            };
            PrimitiveEnvironment.prototype.computeNewLocation = function (location, velocity) {
                var newLocation = new CP.Vector(location.x + velocity.x, location.y + velocity.y);
                if (newLocation.x < 0)
                    newLocation.x += this.size.x;
                else if (newLocation.x > this.size.x)
                    newLocation.x -= this.size.x;
                if (newLocation.y < 0)
                    newLocation.y += this.size.y;
                else if (newLocation.y > this.size.y)
                    newLocation.y -= this.size.y;
                return newLocation;
            };
            PrimitiveEnvironment.prototype.getEnvironmentIndex = function (location) {
                return location.x * location.y + location.x;
            };
            PrimitiveEnvironment.prototype.render = function (ctx) {
                ctx.clearRect(0, 0, this.size.x, this.size.y);
                this.organisms.forEach(function (member) {
                    member.render(ctx);
                });
            };
            PrimitiveEnvironment.prototype.computeNeighbours = function () {
                this.neighbourDistances = new Array(this.organisms.length);
                this.neighbourLookup = new Array(this.organisms.length);
                this.neighbourPairs = new Array();
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
                        this.neighbourPairs.push({ a: this.organisms[x], b: this.organisms[nearest], distance: distance });
                        // store the reverse lookup
                        this.neighbourLookup[nearest] = x;
                        this.neighbourDistances[nearest] = distance;
                    }
                }
            };
            PrimitiveEnvironment.EnergyInflowRate = 0.03;
            PrimitiveEnvironment.MinOrganismPopulation = 100;
            return PrimitiveEnvironment;
        })(Genetics.Environment);
        Genetics.PrimitiveEnvironment = PrimitiveEnvironment;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var PrimitiveGene = (function () {
            function PrimitiveGene() {
                this.triggerIndex = this.getRandomIndex();
                this.triggerThreshold = Math.random();
            }
            PrimitiveGene.prototype.execute = function (organism, inputSensors, outputSensors) {
            };
            PrimitiveGene.prototype.isActive = function (inputSensors) {
                var sensor = this.getSensor(inputSensors, this.triggerIndex);
                return Math.abs(sensor.getValue()) >= this.triggerThreshold;
            };
            PrimitiveGene.prototype.getSensor = function (sensors, sensorIndex) {
                return sensors[sensorIndex % sensors.length];
            };
            PrimitiveGene.prototype.getRandomIndex = function () {
                return Math.ceil(Math.random() * 100000);
            };
            PrimitiveGene.prototype.normalize = function (value, min, max) {
                if (min === void 0) { min = 0; }
                if (max === void 0) { max = 1; }
                if (value < min)
                    return min;
                if (value > max)
                    return max;
                return value;
            };
            PrimitiveGene.prototype.limit = function (delta, value, min, max) {
                if (value + delta > max)
                    return max - value;
                else if (value + delta < min)
                    return min - value;
                return delta;
            };
            PrimitiveGene.AllGenes = [
                function () {
                    return new TransferGene();
                },
                function () {
                    return new VelocityGene();
                },
                function () {
                    return new FeedGene();
                },
                function () {
                    return new GrowthGene();
                },
                function () {
                    return new RandomGene();
                },
                function () {
                    return new SpawnGene();
                },
                function () {
                    return new AggressionGene();
                }
            ];
            return PrimitiveGene;
        })();
        Genetics.PrimitiveGene = PrimitiveGene;
        var TransferGene = (function (_super) {
            __extends(TransferGene, _super);
            function TransferGene() {
                _super.call(this);
                this.inputIndex = this.getRandomIndex();
                this.outputIndex = this.getRandomIndex();
                this.transferFactor = 1 - Math.random() * 2;
            }
            TransferGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                var inputSensor = this.getSensor(inputSensors, this.inputIndex);
                var outputSensor = this.getSensor(outputSensors, this.outputIndex);
                var newValue = outputSensor.getValue();
                newValue += inputSensor.getValue() * this.transferFactor;
                outputSensor.setValue(newValue);
            };
            return TransferGene;
        })(PrimitiveGene);
        var VelocityGene = (function (_super) {
            __extends(VelocityGene, _super);
            function VelocityGene() {
                _super.call(this);
                this.directionIndex = this.getRandomIndex();
                this.velocityIndex = this.getRandomIndex();
            }
            VelocityGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                var directionSensor = this.getSensor(outputSensors, this.directionIndex);
                var velocitySensor = this.getSensor(outputSensors, this.velocityIndex);
                var impulse = velocitySensor.getValue() * VelocityGene.ImpulseFactor;
                var directionValue = directionSensor.getValue();
                if (directionValue > 0)
                    organism.velocity = organism.velocity.add(new CP.Vector(impulse, 0));
                else if (directionValue < 0)
                    organism.velocity = organism.velocity.add(new CP.Vector(0, impulse));
                else
                    return;
                organism.velocity.x = this.normalize(organism.velocity.x, -1, 1);
                organism.velocity.y = this.normalize(organism.velocity.y, -1, 1);
            };
            VelocityGene.ImpulseFactor = 0.01;
            return VelocityGene;
        })(PrimitiveGene);
        var FeedGene = (function (_super) {
            __extends(FeedGene, _super);
            function FeedGene() {
                _super.apply(this, arguments);
            }
            FeedGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                if (organism.energy < 1) {
                    var energy = organism.environment.getEnergy(organism.location);
                    organism.feedEnergy += energy * organism.size * FeedGene.FeedingEfficiency;
                }
            };
            FeedGene.FeedingEfficiency = 1;
            return FeedGene;
        })(PrimitiveGene);
        var GrowthGene = (function (_super) {
            __extends(GrowthGene, _super);
            function GrowthGene() {
                _super.call(this);
                this.growthFactor = (1 - Math.random() * 2) * GrowthGene.MaxGrowthRate;
            }
            GrowthGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                var potential = 0;
                if (this.growthFactor > 0)
                    potential = 1 - organism.size;
                else if (this.growthFactor < 0)
                    potential = organism.size;
                if (potential !== 0) {
                    var growth = potential * this.growthFactor;
                    var growthEnergy = growth * Genetics.PrimitiveOrganism.EnergyDensity;
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
            };
            GrowthGene.MaxGrowthRate = 0.01;
            GrowthGene.ConversionEfficiency = 0.9;
            return GrowthGene;
        })(PrimitiveGene);
        var RandomGene = (function (_super) {
            __extends(RandomGene, _super);
            function RandomGene() {
                _super.call(this);
                this.outputIndex = this.getRandomIndex();
            }
            RandomGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                var sensor = this.getSensor(outputSensors, this.outputIndex);
                sensor.setValue(1 - Math.random() * 2);
            };
            return RandomGene;
        })(PrimitiveGene);
        var SpawnGene = (function (_super) {
            __extends(SpawnGene, _super);
            function SpawnGene() {
                _super.call(this);
                this.sizeFactor = Math.random();
                if (this.sizeFactor < SpawnGene.MinSpawnSize)
                    this.sizeFactor = SpawnGene.MinSpawnSize;
            }
            SpawnGene.prototype.execute = function (organism, inputSensors, outputSensors) {
                if (organism.age < SpawnGene.MinAge)
                    return;
                if (organism.size < SpawnGene.MinSize)
                    return;
                var environment = organism.environment;
                var spawnSize = organism.size * this.sizeFactor * SpawnGene.MaxSpawnSize;
                var spawnEnergy = Genetics.PrimitiveOrganism.EnergyDensity * spawnSize * 1 / SpawnGene.SpawnEfficiency;
                if (organism.canExpendEnergy(spawnEnergy)) {
                    organism.energy -= spawnEnergy;
                    var spawn = new Genetics.PrimitiveOrganism(environment, organism);
                    spawn.energy = spawnEnergy;
                    spawn.size = spawnSize;
                    //spawn.location.x = organism.location.x;
                    //spawn.location.y = organism.location.y;
                    spawn.location = new CP.Vector(Math.random() * environment.size.x, Math.random() * environment.size.y);
                    environment.addOrganism(spawn);
                }
            };
            SpawnGene.MaxSpawnSize = 0.3;
            SpawnGene.MinAge = 0.3;
            SpawnGene.MinSpawnSize = 0.25;
            SpawnGene.MinSize = 0.3;
            SpawnGene.SpawnEfficiency = 0.3;
            return SpawnGene;
        })(PrimitiveGene);
        var AggressionGene = (function (_super) {
            __extends(AggressionGene, _super);
            function AggressionGene() {
                _super.call(this);
                this.inputIndex = this.getRandomIndex();
            }
            AggressionGene.prototype.execute = function (organism, inputSensors, outputSensors) {
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
            };
            AggressionGene.ChangeRate = 0.1;
            AggressionGene.EnergyRate = 0.125;
            return AggressionGene;
        })(PrimitiveGene);
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var PrimitiveGenome = (function (_super) {
            __extends(PrimitiveGenome, _super);
            function PrimitiveGenome(organism, genes) {
                _super.call(this);
                this.organism = organism;
                if (genes)
                    this.genes = genes;
                else
                    this.generate(Math.random() * PrimitiveGenome.MaxGeneSize);
            }
            PrimitiveGenome.prototype.generate = function (size) {
                this.genes = new Array();
                for (var i = 0; i < size; i++)
                    this.genes.push(PrimitiveGenome.randomGene());
            };
            PrimitiveGenome.prototype.getSize = function () {
                return this.genes.length;
            };
            PrimitiveGenome.randomGene = function () {
                var index = Math.floor((Math.random() * 100000)) % Genetics.PrimitiveGene.AllGenes.length;
                return (Genetics.PrimitiveGene.AllGenes[index])();
            };
            PrimitiveGenome.prototype.execute = function (inputSensors, outputSensors) {
                var _this = this;
                if (this.genes) {
                    this.genes.forEach(function (gene) {
                        if (gene.isActive(inputSensors))
                            gene.execute(_this.organism, inputSensors, outputSensors);
                    });
                }
            };
            PrimitiveGenome.generateGenome = function (organism, ancestors) {
                var genes;
                if (ancestors) {
                    genes = ancestors[0].genes.map(function (x) { return x; });
                    if (Math.random() < PrimitiveGenome.MutationProbability) {
                        var index = Math.floor((Math.random() * 100000) % genes.length);
                        if (Math.random() > 0.5 && genes.length > 1) {
                            genes.splice(index, 1);
                        }
                        else if (genes.length < PrimitiveGenome.MaxGeneSize) {
                            var newGenes = genes.slice(0, index);
                            newGenes.push(this.randomGene());
                            newGenes = newGenes.concat(genes.slice(index));
                            genes = newGenes;
                        }
                    }
                }
                var genome = new PrimitiveGenome(organism, genes);
                return genome;
            };
            PrimitiveGenome.MaxGeneSize = 1000;
            PrimitiveGenome.MutationProbability = 0.1;
            return PrimitiveGenome;
        })(Genetics.Genome);
        Genetics.PrimitiveGenome = PrimitiveGenome;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var PrimitiveOrganism = (function (_super) {
            __extends(PrimitiveOrganism, _super);
            function PrimitiveOrganism(environment, parent) {
                _super.call(this);
                this.age = 0;
                this.energy = PrimitiveOrganism.StartingEnergy;
                if (parent)
                    this.genome = Genetics.PrimitiveGenome.generateGenome(this, [parent.genome]);
                else
                    this.genome = Genetics.PrimitiveGenome.generateGenome(this);
                this.location = new CP.Vector(0, 0);
                this.velocity = new CP.Vector(0, 0);
                this.aggression = 0;
                this.isAlive = true;
                this.environment = environment;
                this.initializeSensors();
            }
            PrimitiveOrganism.prototype.execute = function () {
                this.age += 1 / PrimitiveOrganism.MaxAge;
                this.feedEnergy = 0;
                if (this.energy <= 0 || this.size <= 0)
                    this.isAlive = false;
                if (this.age >= 1)
                    this.isAlive = false;
                if (this.isAlive) {
                    this.updateLocation();
                    _super.prototype.execute.call(this);
                    // compute the energy consumption related to movement
                    var movementEnergy = this.size * PrimitiveOrganism.MovementEnergyFactor * this.velocity.magnitude();
                    if (movementEnergy < this.energy)
                        this.energy -= movementEnergy;
                    else
                        this.velocity = new CP.Vector(0, 0);
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
            };
            PrimitiveOrganism.prototype.canExpendEnergy = function (energy) {
                return energy < this.energy;
            };
            PrimitiveOrganism.prototype.updateLocation = function () {
                this.location = this.environment.computeNewLocation(this.location, this.velocity);
            };
            PrimitiveOrganism.prototype.render = function (ctx) {
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
            };
            PrimitiveOrganism.prototype.getFillColor = function () {
                var energyLevel = this.energy;
                energyLevel = 0.5;
                var aggressionLevel = Math.floor((this.aggression > 0 ? this.aggression : 0) * 255);
                var defenceLevel = Math.floor((this.aggression < 0 ? -this.aggression : 0) * 255);
                return new CP.Graphics.Color(aggressionLevel, 0, defenceLevel, energyLevel);
            };
            PrimitiveOrganism.prototype.getLineColor = function () {
                return CP.Graphics.Color.black;
            };
            PrimitiveOrganism.prototype.initializeSensors = function () {
                var _this = this;
                // create the output sensors
                var outputSensorValues = new Array(5);
                var me = this;
                for (var x = 0; x < outputSensorValues.length; x++) {
                    outputSensorValues[x] = 0;
                    (function (index) {
                        var outputSensor = new Genetics.Sensor(function () {
                            return outputSensorValues[index];
                        }, function (value) {
                            outputSensorValues[index] = value;
                        });
                        me.outputs.push(outputSensor);
                        me.inputs.push(outputSensor);
                    })(x);
                }
                // energy
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.energy;
                }));
                // age
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.age;
                }));
                // size
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.size;
                }));
                // aggression
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.aggression;
                }));
                // velocity x
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.velocity.x;
                }));
                // velocity y
                this.inputs.push(new Genetics.Sensor(function () {
                    return _this.velocity.y;
                }));
                // neighbour distance x
                this.inputs.push(new Genetics.Sensor(function () {
                    var neighbour = _this.environment.getNeighbour(_this);
                    if (!neighbour)
                        return 1;
                    return (neighbour.location.x - _this.location.x) / _this.environment.size.x;
                }));
                // neighbour distance y
                this.inputs.push(new Genetics.Sensor(function () {
                    var neighbour = _this.environment.getNeighbour(_this);
                    if (!neighbour)
                        return 1;
                    return (neighbour.location.y - _this.location.y) / _this.environment.size.y;
                }));
                // neighbour size
                this.inputs.push(new Genetics.Sensor(function () {
                    var neighbour = _this.environment.getNeighbour(_this);
                    if (!neighbour)
                        return 0;
                    return neighbour.size;
                }));
                // neighbour age
                this.inputs.push(new Genetics.Sensor(function () {
                    var neighbour = _this.environment.getNeighbour(_this);
                    if (!neighbour)
                        return 0;
                    return neighbour.age;
                }));
                // neighbour aggression
                this.inputs.push(new Genetics.Sensor(function () {
                    var neighbour = _this.environment.getNeighbour(_this);
                    if (!neighbour)
                        return 0;
                    return neighbour.aggression;
                }));
            };
            PrimitiveOrganism.MaxAge = 2000;
            PrimitiveOrganism.StartingEnergy = 1;
            PrimitiveOrganism.MovementEnergyFactor = 1 / 100;
            PrimitiveOrganism.GenomeEnergyFactor = 1 / 50000;
            PrimitiveOrganism.EnergyDensity = PrimitiveOrganism.StartingEnergy;
            PrimitiveOrganism.DigestionEfficiency = 0.75;
            return PrimitiveOrganism;
        })(Genetics.Organism);
        Genetics.PrimitiveOrganism = PrimitiveOrganism;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Genetics;
    (function (Genetics) {
        var Sensor = (function () {
            function Sensor(getValue, setValue) {
                this.getValue = getValue;
                this.setValue = setValue || (function () {
                });
            }
            return Sensor;
        })();
        Genetics.Sensor = Sensor;
    })(Genetics = CP.Genetics || (CP.Genetics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Graphics;
    (function (Graphics) {
        var Color = (function () {
            function Color(r, g, b, a) {
                if (a === void 0) { a = 1; }
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
                this.r = Math.round(this.r);
                this.g = Math.round(this.g);
                this.b = Math.round(this.b);
            }
            Color.prototype.toString = function () {
                if (this.strValue === undefined) {
                    this.strValue = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
                }
                return this.strValue;
            };
            Color.black = new Color(0, 0, 0);
            Color.white = new Color(255, 255, 255);
            return Color;
        })();
        Graphics.Color = Color;
    })(Graphics = CP.Graphics || (CP.Graphics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Vector = (function () {
        function Vector(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector.prototype.magnitude = function () {
            if (this.magnitudeValue === undefined)
                this.magnitudeValue = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            return this.magnitudeValue;
        };
        Vector.prototype.add = function (vector) {
            return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        };
        Vector.prototype.subtract = function (vector) {
            return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
        };
        Vector.prototype.isZero = function () {
            return this.x == 0 && this.y == 0;
        };
        return Vector;
    })();
    CP.Vector = Vector;
})(CP || (CP = {}));
