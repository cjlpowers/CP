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
                organism.location = new CP.Mathematics.Vector2(Math.random() * this.size.x, Math.random() * this.size.y);
                organism.size = Math.random();
                this.addOrganism(organism);
                return organism;
            };
            PrimitiveEnvironment.prototype.computeNewLocation = function (location, velocity) {
                var newLocation = new CP.Mathematics.Vector2(location.x + velocity.x, location.y + velocity.y);
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
                    organism.velocity = organism.velocity.add(new CP.Mathematics.Vector2(impulse, 0));
                else if (directionValue < 0)
                    organism.velocity = organism.velocity.add(new CP.Mathematics.Vector2(0, impulse));
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
                    spawn.location = new CP.Mathematics.Vector2(Math.random() * environment.size.x, Math.random() * environment.size.y);
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
                this.location = new CP.Mathematics.Vector2(0, 0);
                this.velocity = new CP.Mathematics.Vector2(0, 0);
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
                        this.velocity = new CP.Mathematics.Vector2(0, 0);
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
    var Mathematics;
    (function (Mathematics) {
        var Value = (function () {
            function Value(magnitude, unit) {
                if (unit === void 0) { unit = ""; }
                this.magnitude = magnitude;
                this.unit = unit;
            }
            Value.prototype.toString = function () {
                var mag = Math.round(this.magnitude * 1000) / 1000;
                if (this.unit)
                    return mag.toString() + ' ' + this.unit;
                else
                    return mag.toString();
            };
            return Value;
        })();
        Mathematics.Value = Value;
    })(Mathematics = CP.Mathematics || (CP.Mathematics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Mathematics;
    (function (Mathematics) {
        var Matrix = (function () {
            function Matrix(matrix) {
                this.matrix = matrix;
                if (!matrix) {
                    throw new Error("Must provide a matrix");
                }
                this.rowCount = matrix.length;
                this.columnCount = this.rowCount > 0 ? matrix[0].length : 0;
            }
            Object.defineProperty(Matrix.prototype, "rowCount", {
                get: function () {
                    return this.matrix.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Matrix.prototype, "columnCount", {
                get: function () {
                    return this.matrix.length > 0 ? this.matrix[0].length : 0;
                },
                enumerable: true,
                configurable: true
            });
            Matrix.prototype.toString = function () {
                return this.matrix.toString();
            };
            Matrix.prototype.getValue = function (row, column) {
                var obj = this.matrix[row];
                if (column === 0 && !Array.isArray(obj))
                    return obj;
                return obj[column];
            };
            Matrix.prototype.setValue = function (row, column, value) {
                this.matrix[row][column] = value;
            };
            Matrix.prototype.addValue = function (row, column, value) {
                this.setValue(row, column, this.getValue(row, column) + value);
            };
            Matrix.prototype.multiply = function (b) {
                return new Matrix(numeric.dot(this.matrix, b.matrix));
            };
            Matrix.prototype.scale = function (multiplier) {
                return new Matrix(numeric.mul(multiplier, this.matrix));
            };
            Matrix.prototype.inverse = function () {
                return new Matrix(numeric.inv(this.matrix));
            };
            Matrix.prototype.transpose = function () {
                return new Matrix(numeric.transpose(this.matrix));
            };
            Matrix.prototype.clone = function () {
                return this.scale(1);
            };
            Matrix.new = function (rows, cols) {
                var result = new Array(rows);
                for (var r = 0; r < rows; r++) {
                    result[r] = new Array(cols);
                    for (var c = 0; c < cols; c++)
                        result[r][c] = 0;
                }
                return new Matrix(result);
            };
            Matrix.solveAxEqualsB = function (a, b) {
                return new CP.Mathematics.Matrix(numeric.solve(a.matrix, b.matrix));
            };
            return Matrix;
        })();
        Mathematics.Matrix = Matrix;
    })(Mathematics = CP.Mathematics || (CP.Mathematics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Mathematics;
    (function (Mathematics) {
        var Vector = (function () {
            function Vector(components) {
                this.components = components;
            }
            Vector.prototype.magnitude = function () {
                if (this.magnitudeValue === undefined) {
                    this.magnitudeValue = Math.sqrt(this.components.reduce(function (prev, current) {
                        return prev + (current ? current * current : 0);
                    }, 0));
                }
                return this.magnitudeValue;
            };
            Vector.prototype.isZero = function () {
                return this.components.every(function (value) { return value === 0; });
            };
            Vector.prototype.isDefined = function () {
                return this.components.some(function (value) { return value !== undefined; });
            };
            Vector.prototype.getComponent = function (n) {
                return this.components[n];
            };
            Vector.prototype.setComponent = function (n, value) {
                this.components[n] = value;
            };
            Vector.prototype.getDimensions = function () {
                return this.components.length;
            };
            Vector.prototype.toString = function () {
                var str = '[';
                var dimensions = this.getDimensions();
                for (var i = 0; i < dimensions; i++) {
                    var component = this.getComponent(i);
                    if (component === undefined)
                        continue;
                    str = str + Math.round(component * 1000) / 1000;
                    if (i < dimensions - 1)
                        str = str + ', ';
                }
                str = str + ']';
                if (this.unit)
                    str = str + ' ' + this.unit;
                return str;
            };
            return Vector;
        })();
        Mathematics.Vector = Vector;
    })(Mathematics = CP.Mathematics || (CP.Mathematics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Mathematics;
    (function (Mathematics) {
        var Vector2 = (function (_super) {
            __extends(Vector2, _super);
            function Vector2(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                _super.call(this, [x, y]);
            }
            Object.defineProperty(Vector2.prototype, "x", {
                get: function () {
                    return this.getComponent(0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector2.prototype, "y", {
                get: function () {
                    return this.getComponent(1);
                },
                enumerable: true,
                configurable: true
            });
            Vector2.prototype.add = function (vector) {
                return new Vector2(this.x + vector.x, this.y + vector.y);
            };
            Vector2.prototype.subtract = function (vector) {
                return new Vector2(this.x - vector.x, this.y - vector.y);
            };
            return Vector2;
        })(Mathematics.Vector);
        Mathematics.Vector2 = Vector2;
    })(Mathematics = CP.Mathematics || (CP.Mathematics = {}));
})(CP || (CP = {}));
var CP;
(function (CP) {
    var Mathematics;
    (function (Mathematics) {
        var Vector3 = (function (_super) {
            __extends(Vector3, _super);
            function Vector3(x, y, z) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (z === void 0) { z = 0; }
                _super.call(this, [x, y, z]);
            }
            Object.defineProperty(Vector3.prototype, "x", {
                get: function () {
                    return this.getComponent(0);
                },
                set: function (value) {
                    this.setComponent(0, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector3.prototype, "y", {
                get: function () {
                    return this.getComponent(1);
                },
                set: function (value) {
                    this.setComponent(1, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vector3.prototype, "z", {
                get: function () {
                    return this.getComponent(2);
                },
                set: function (value) {
                    this.setComponent(2, value);
                },
                enumerable: true,
                configurable: true
            });
            Vector3.prototype.add = function (vector) {
                return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
            };
            Vector3.prototype.subtract = function (vector) {
                return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
            };
            return Vector3;
        })(Mathematics.Vector);
        Mathematics.Vector3 = Vector3;
    })(Mathematics = CP.Mathematics || (CP.Mathematics = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var Material = (function () {
            function Material(name, elasticModulus) {
                this.name = name;
                this.elasticModulus = elasticModulus;
            }
            Material.prototype.toString = function () {
                return this.name.toString() + ' (' + this.elasticModulus.toString() + ')';
            };
            Material.Aluminium = new Material("Aluminium", new CP.Mathematics.Value(69, "GPa"));
            Material.Steel = new Material("Steel", new CP.Mathematics.Value(200, "GPa"));
            Material.Glass = new Material("Glass", new CP.Mathematics.Value(72, "GPa"));
            return Material;
        })();
        Mechanical.Material = Material;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var Node = (function () {
            function Node(number) {
                this.number = number;
                this.force = new CP.Mathematics.Vector3();
                this.force.x = undefined;
                this.force.y = undefined;
                this.force.z = undefined;
                this.force.unit = "N";
                this.position = new CP.Mathematics.Vector3();
                this.position.x = undefined;
                this.position.y = undefined;
                this.position.z = undefined;
                this.position.unit = "m";
                this.displacement = new CP.Mathematics.Vector3();
                this.displacement.x = undefined;
                this.displacement.y = undefined;
                this.displacement.z = undefined;
                this.displacement.unit = "m";
                this.reactionDisplacement = new CP.Mathematics.Vector3();
                this.reactionDisplacement.x = undefined;
                this.reactionDisplacement.y = undefined;
                this.reactionDisplacement.z = undefined;
                this.reactionDisplacement.unit = "m";
                this.reactionForce = new CP.Mathematics.Vector3();
                this.reactionForce.x = undefined;
                this.reactionForce.y = undefined;
                this.reactionForce.z = undefined;
                this.reactionForce.unit = "N";
            }
            Node.prototype.render = function (ctx, options) {
                var fillColor = new CP.Graphics.Color(100, 100, 100);
                var lineColor = new CP.Graphics.Color(0, 0, 0);
                var size = 1;
                // draw the input force
                this.drawForce(ctx, this.force, new CP.Graphics.Color(50, 50, 50), 0.5);
                // draw the reaction force if present
                if (!this.force.x && !this.force.y)
                    this.drawForce(ctx, this.reactionForce, new CP.Graphics.Color(0, 200, 0), 0.5);
                // draw the node
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, size, 0, 2 * Math.PI);
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = lineColor;
                ctx.stroke();
                ctx.fillStyle = lineColor;
                ctx.font = "3px serif";
                ctx.fillText(this.number.toString(), this.position.x + 1, this.position.y + 3);
            };
            Node.prototype.drawForce = function (ctx, force, color, width) {
                var forceLineLength = 10;
                if (force) {
                    if (force.x && Math.abs(force.x) > 0.00001) {
                        this.drawForceLine(ctx, this.position, this.position.add(new CP.Mathematics.Vector3(forceLineLength * (force.x > 0 ? 1 : -1), 0)), color, width, force.x.toString());
                    }
                    if (force.y && Math.abs(force.y) > 0.00001) {
                        this.drawForceLine(ctx, this.position, this.position.add(new CP.Mathematics.Vector3(0, forceLineLength * (force.y > 0 ? 1 : -1))), color, width, force.y.toString());
                    }
                }
            };
            Node.prototype.drawForceLine = function (ctx, start, end, color, width, text) {
                ctx.beginPath();
                ctx.lineWidth = width;
                ctx.strokeStyle = color;
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                //ctx.font = "4px serif";
                //ctx.fillText(text, end.x, end.y);
            };
            return Node;
        })();
        Mechanical.Node = Node;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var Element = (function () {
            function Element(number, material) {
                this.number = number;
                this.material = material;
                this.nodes = new Array();
            }
            Element.prototype.calculateStiffnessMatrix = function () {
                throw new Error("Not implemented");
            };
            Element.prototype.calcualteTransformMatrix = function () {
                throw new Error("Not implemented");
            };
            Element.prototype.calcualteGlobalDisplacementMatrix = function () {
                throw new Error("Not implemented");
            };
            Element.prototype.calcualteLocalDisplacementMatrix = function () {
                var transformMatrix = this.calcualteTransformMatrix();
                var globalDisplacementMatrix = this.calcualteGlobalDisplacementMatrix();
                return transformMatrix.multiply(globalDisplacementMatrix);
            };
            Element.prototype.render = function (ctx, options) {
                throw new Error("Not Implemented");
            };
            return Element;
        })();
        Mechanical.Element = Element;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var Structure = (function (_super) {
            __extends(Structure, _super);
            function Structure(dof, elements, nodes) {
                _super.call(this, 0, Mechanical.Material.Aluminium);
                this.dof = dof;
                this.elements = elements;
                this.showElements = true;
                this.showNodes = true;
                this.nodes = nodes;
            }
            Structure.prototype.calculateStiffnessMatrix = function () {
                var k = CP.Mathematics.Matrix.new(this.nodes.length * this.dof, this.nodes.length * this.dof);
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
            };
            Structure.prototype.calculateForceMatrix = function () {
                var f = CP.Mathematics.Matrix.new(this.nodes.length * this.dof, 1);
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
            };
            Structure.prototype.calculateDisplacementMatrix = function (globalK, globalF) {
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
            };
            Structure.prototype.calculateReactionDisplacements = function (globalQ) {
                var _this = this;
                this.nodes.forEach(function (node) {
                    var globalNumber = node.number - 1;
                    if (_this.dof === 1)
                        node.reactionDisplacement = new CP.Mathematics.Vector3(globalQ.getValue(globalNumber * _this.dof, 0));
                    else if (_this.dof === 2)
                        node.reactionDisplacement = new CP.Mathematics.Vector3(globalQ.getValue(globalNumber * _this.dof, 0), globalQ.getValue(globalNumber * _this.dof + 1, 0));
                    else if (_this.dof === 3)
                        node.reactionDisplacement = new CP.Mathematics.Vector3(globalQ.getValue(globalNumber * _this.dof, 0), globalQ.getValue(globalNumber * _this.dof + 1, 0), globalQ.getValue(globalNumber * _this.dof + 2, 0));
                    else
                        throw new Error("DOF not supported");
                });
            };
            Structure.prototype.calculateReactionForces = function (globalK, globalQ) {
                var _this = this;
                var globalR = globalK.multiply(globalQ);
                var rowCount = 0;
                this.nodes.forEach(function (node) {
                    var x, y, z = undefined;
                    if (_this.dof >= 1)
                        x = globalR.getValue(rowCount++, 0);
                    if (_this.dof >= 2)
                        y = globalR.getValue(rowCount++, 0);
                    if (_this.dof >= 3)
                        z = globalR.getValue(rowCount++, 0);
                    node.reactionForce = new CP.Mathematics.Vector3(x, y, z);
                });
            };
            Structure.prototype.solve = function () {
                // computing global stiffness matrix
                var globalK = this.calculateStiffnessMatrix();
                var globalF = this.calculateForceMatrix();
                var globalQ = this.calculateDisplacementMatrix(globalK, globalF);
                // compute reaction
                this.calculateReactionDisplacements(globalQ);
                this.calculateReactionForces(globalK, globalQ);
            };
            Structure.prototype.render = function (ctx, options) {
                options = options || Structure.getDefaultRenderOptions();
                if (options.showElements) {
                    this.elements.forEach(function (element) {
                        element.render(ctx, options);
                    });
                }
                if (options.showNodes) {
                    this.nodes.forEach(function (node) {
                        node.render(ctx, options);
                    });
                }
            };
            Structure.getDefaultRenderOptions = function () {
                return {
                    showNodes: true,
                    showElements: true,
                    showDisplacement: true,
                    displacementMultiplier: 5,
                };
            };
            return Structure;
        })(Mechanical.Element);
        Mechanical.Structure = Structure;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
/// <reference path="Includes.ts" />
var CP;
(function (CP) {
    var Log = (function () {
        function Log() {
        }
        Log.debug = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            (console.debug || Log.log)(message, optionalParams);
        };
        Log.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message, optionalParams);
        };
        Log.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            (console.info || Log.log)(message, optionalParams);
        };
        Log.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            (console.warn || Log.log)(message, optionalParams);
        };
        Log.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            (console.error || Log.log)(message, optionalParams);
        };
        return Log;
    })();
    CP.Log = Log;
})(CP || (CP = {}));
/// <reference path="Graphics/CanvasElement.ts" />
/// <reference path="Graphics/Color.ts" />
/// <reference path="Mathematics/Value.ts" />
/// <reference path="Mathematics/Matrix.ts" />
/// <reference path="Mathematics/Vector.ts" />
/// <reference path="Mathematics/Vector2.ts" />
/// <reference path="Mathematics/Vector3.ts" />
/// <reference path="Mechanical/Material.ts" />
/// <reference path="Mechanical/Node.ts" />
/// <reference path="Mechanical/Element.ts" />
/// <reference path="Mechanical/Structure.ts" />
/// <reference path="Mechanical/IRenderOptions.ts" />
/// <reference path="Log.ts" />
var numeric;
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var StructureDefinition = (function () {
            function StructureDefinition() {
            }
            return StructureDefinition;
        })();
        Mechanical.StructureDefinition = StructureDefinition;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var TrussElement = (function (_super) {
            __extends(TrussElement, _super);
            function TrussElement(number, material, area, node1, node2) {
                _super.call(this, number, material);
                this.area = area;
                this.nodes.push(node1);
                this.nodes.push(node2);
                this.vector = this.nodes[1].position.subtract(this.nodes[0].position);
                this.a = this.vector.x / this.vector.magnitude();
                this.b = this.vector.y / this.vector.magnitude();
                this.a2 = this.a * this.a;
                this.b2 = this.b * this.b;
                this.ab = this.a * this.b;
            }
            Object.defineProperty(TrussElement.prototype, "length", {
                get: function () {
                    return this.nodes[0].position.subtract(this.nodes[1].position).magnitude();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrussElement.prototype, "coefficient", {
                get: function () {
                    return this.area.magnitude * this.material.elasticModulus.magnitude / this.length;
                },
                enumerable: true,
                configurable: true
            });
            TrussElement.prototype.calculateCoefficientMatrix = function () {
                var k = CP.Mathematics.Matrix.new(4, 4);
                k.setValue(0, 0, this.a2);
                k.setValue(0, 1, this.ab);
                k.setValue(0, 2, -this.a2);
                k.setValue(0, 3, -this.ab);
                k.setValue(1, 0, this.ab);
                k.setValue(1, 1, this.b2);
                k.setValue(1, 2, -this.ab);
                k.setValue(1, 3, -this.b2);
                k.setValue(2, 0, -this.a2);
                k.setValue(2, 1, -this.ab);
                k.setValue(2, 2, this.a2);
                k.setValue(2, 3, this.ab);
                k.setValue(3, 0, -this.ab);
                k.setValue(3, 1, -this.b2);
                k.setValue(3, 2, this.ab);
                k.setValue(3, 3, this.b2);
                return k;
            };
            TrussElement.prototype.calculateStiffnessMatrix = function () {
                var k = this.calculateCoefficientMatrix();
                var c = this.coefficient;
                k = k.scale(c);
                return k;
            };
            TrussElement.prototype.calcualteTransformMatrix = function () {
                var k = CP.Mathematics.Matrix.new(4, 4);
                k.setValue(0, 0, this.a);
                k.setValue(0, 1, this.b);
                k.setValue(1, 0, -this.b);
                k.setValue(1, 1, this.a);
                k.setValue(2, 2, this.a);
                k.setValue(2, 3, this.b);
                k.setValue(3, 2, -this.b);
                k.setValue(3, 3, this.a);
                return k;
            };
            TrussElement.prototype.calcualteGlobalDisplacementMatrix = function () {
                var globalDisplacementMatrix = CP.Mathematics.Matrix.new(this.nodes.length * 2, 1);
                var row = 0;
                this.nodes.forEach(function (node) {
                    if (node.reactionDisplacement && node.reactionDisplacement.isDefined()) {
                        globalDisplacementMatrix.setValue(row++, 0, node.reactionDisplacement.x);
                        globalDisplacementMatrix.setValue(row++, 0, node.reactionDisplacement.y);
                    }
                    else if (node.displacement && node.displacement.isDefined()) {
                        globalDisplacementMatrix.setValue(row++, 0, node.displacement.x);
                        globalDisplacementMatrix.setValue(row++, 0, node.displacement.y);
                    }
                });
                return globalDisplacementMatrix;
            };
            TrussElement.prototype.calculateStress = function () {
                var displacementMatrix = this.calcualteGlobalDisplacementMatrix();
                var transformationMatrix = this.calcualteTransformMatrix();
                var linearMatrix = new CP.Mathematics.Matrix([-1, 1]);
                var matrix = linearMatrix.multiply(transformationMatrix);
                matrix = matrix.multiply(displacementMatrix);
                return new CP.Mathematics.Value((this.material.elasticModulus.magnitude / this.length) * matrix.getValue(0, 0));
            };
            TrussElement.prototype.solve = function () {
                this.stress = this.calculateStress();
            };
            TrussElement.prototype.render = function (ctx, options) {
                var fillColor = new CP.Graphics.Color(100, 100, 100);
                var lineColor = CP.Graphics.Color.black;
                var stressColor = new CP.Graphics.Color(this.stressFactor > 0 ? 0 : -this.stressFactor * 200, 0, this.stressFactor > 0 ? this.stressFactor * 200 : 0);
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = stressColor;
                if (options.showDisplacement && options.displacementMultiplier) {
                    ctx.moveTo(this.nodes[0].position.x + this.nodes[0].reactionDisplacement.x * options.displacementMultiplier, this.nodes[0].position.y + this.nodes[0].reactionDisplacement.y * options.displacementMultiplier);
                    ctx.lineTo(this.nodes[1].position.x + this.nodes[1].reactionDisplacement.x * options.displacementMultiplier, this.nodes[1].position.y + this.nodes[1].reactionDisplacement.y * options.displacementMultiplier);
                }
                else {
                    ctx.moveTo(this.nodes[0].position.x, this.nodes[0].position.y);
                    ctx.lineTo(this.nodes[1].position.x, this.nodes[1].position.y);
                }
                ctx.stroke();
                var middle = new CP.Mathematics.Vector3(this.nodes[0].position.x + this.vector.x / 2, this.nodes[0].position.y + this.vector.y / 2);
                ctx.beginPath();
                ctx.fillStyle = CP.Graphics.Color.white;
                ctx.arc(middle.x, middle.y, 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.font = "3px serif";
                ctx.fillStyle = CP.Graphics.Color.black;
                ctx.fillText(this.number.toString(), middle.x - 1, middle.y + 1);
            };
            return TrussElement;
        })(Mechanical.Element);
        Mechanical.TrussElement = TrussElement;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
/// <reference path="../Includes.ts" />
var CP;
(function (CP) {
    var Mechanical;
    (function (Mechanical) {
        var TrussStructure = (function (_super) {
            __extends(TrussStructure, _super);
            function TrussStructure(dof, elements, nodes) {
                _super.call(this, dof, elements, nodes);
            }
            TrussStructure.prototype.solve = function () {
                _super.prototype.solve.call(this);
                this.elements.forEach(function (x) { return x.solve(); });
                // determine the min and max stress
                var minStress = Math.min.apply(null, this.elements.map(function (x) { return x.stress.magnitude; }));
                var maxStress = Math.max.apply(null, this.elements.map(function (x) { return x.stress.magnitude; }));
                var deltaStress = maxStress - minStress;
                // set the stress factor in each element
                this.elements.forEach(function (x) {
                    if (x.stress.magnitude > 0 && maxStress > 0)
                        x.stressFactor = x.stress.magnitude / maxStress;
                    else if (x.stress.magnitude < 0 && minStress < 0)
                        x.stressFactor = -x.stress.magnitude / minStress;
                    else
                        x.stressFactor = 0;
                });
            };
            TrussStructure.load = function (definition) {
                var nodes = definition.nodes.map(function (e, i) {
                    var node = new Mechanical.Node(i + 1);
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
                var materials = definition.materials.map(function (e) {
                    return new Mechanical.Material(e.name, new CP.Mathematics.Value(e.elasticModulus));
                });
                var elements = definition.elements.map(function (e, i) {
                    return new Mechanical.TrussElement(i + 1, materials[e.material || 0], new CP.Mathematics.Value(e.area, null), nodes[e.nodes[0]], nodes[e.nodes[1]]);
                });
                var structure = new TrussStructure(2, elements, nodes);
                return structure;
            };
            return TrussStructure;
        })(Mechanical.Structure);
        Mechanical.TrussStructure = TrussStructure;
    })(Mechanical = CP.Mechanical || (CP.Mechanical = {}));
})(CP || (CP = {}));
