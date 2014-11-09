declare module CP.Genetics {
    class Environment<TOrganism extends Organism> {
        organisms: TOrganism[];
        epoch: number;
        constructor();
        execute(): void;
        addOrganism(organism: TOrganism): void;
        removeOrganism(organism: TOrganism): void;
    }
}
declare module CP.Genetics {
    class Genome {
        constructor();
        getSize(): number;
        execute(inputSensors: Sensor[], outputSensors: Sensor[]): void;
    }
}
declare module CP.Genetics {
    class Organism {
        inputs: Sensor[];
        outputs: Sensor[];
        genome: Genome;
        constructor();
        execute(): void;
    }
}
declare module CP.Genetics {
    class PrimitiveEnvironment extends Environment<PrimitiveOrganism> implements Graphics.CanvasElement {
        static EnergyInflowRate: number;
        static MinOrganismPopulation: number;
        size: Vector;
        availableEnergyDensity: number;
        onExecute: () => void;
        private neighbourLookup;
        private neighbourDistances;
        private neighbourPairs;
        constructor(size: Vector);
        execute(): void;
        getEnergy(location: Vector): number;
        getNeighbour(organism: PrimitiveOrganism): PrimitiveOrganism;
        spawnOrganism(): PrimitiveOrganism;
        computeNewLocation(location: Vector, velocity: Vector): Vector;
        private getEnvironmentIndex(location);
        render(ctx: CanvasRenderingContext2D): void;
        private computeNeighbours();
    }
}
declare module CP.Genetics {
    class PrimitiveGene {
        private triggerIndex;
        private triggerThreshold;
        constructor();
        execute(organism: PrimitiveOrganism, inputSensors: Sensor[], outputSensors: Sensor[]): void;
        isActive(inputSensors: Sensor[]): boolean;
        getSensor(sensors: Sensor[], sensorIndex: any): Sensor;
        getRandomIndex(): number;
        normalize(value: number, min?: number, max?: number): number;
        limit(delta: number, value: number, min: number, max: number): number;
        static AllGenes: {
            (): PrimitiveGene;
        }[];
    }
}
declare module CP.Genetics {
    class PrimitiveGenome extends Genome {
        private organism;
        genes: PrimitiveGene[];
        static MaxGeneSize: number;
        static MutationProbability: number;
        constructor(organism: PrimitiveOrganism, genes?: PrimitiveGene[]);
        generate(size: number): void;
        getSize(): number;
        private static randomGene();
        execute(inputSensors: Sensor[], outputSensors: Sensor[]): void;
        static generateGenome(organism: PrimitiveOrganism, ancestors?: PrimitiveGenome[]): PrimitiveGenome;
    }
}
declare module CP.Genetics {
    class PrimitiveOrganism extends Organism implements Graphics.CanvasElement {
        size: number;
        energy: number;
        age: number;
        location: Vector;
        velocity: Vector;
        aggression: number;
        environment: PrimitiveEnvironment;
        feedEnergy: number;
        private isAlive;
        static MaxAge: number;
        static StartingEnergy: number;
        static MovementEnergyFactor: number;
        static GenomeEnergyFactor: number;
        static EnergyDensity: number;
        static DigestionEfficiency: number;
        constructor(environment: PrimitiveEnvironment, parent?: PrimitiveOrganism);
        execute(): void;
        canExpendEnergy(energy: number): boolean;
        updateLocation(): void;
        render(ctx: CanvasRenderingContext2D): void;
        private getFillColor();
        private getLineColor();
        private initializeSensors();
    }
}
declare module CP.Genetics {
    class Sensor {
        getValue: () => number;
        setValue: (value: number) => void;
        constructor(getValue: () => number, setValue?: (number: any) => void);
    }
}
declare module CP.Graphics {
    interface CanvasElement {
        render(context: CanvasRenderingContext2D): any;
    }
}
declare module CP.Graphics {
    class Color {
        r: number;
        g: number;
        b: number;
        a: number;
        static black: Color;
        static white: Color;
        private strValue;
        constructor(r: number, g: number, b: number, a?: number);
        toString(): string;
    }
}
declare module CP {
    class Vector {
        x: number;
        y: number;
        z: number;
        private magnitudeValue;
        constructor(x?: number, y?: number, z?: number);
        magnitude(): number;
        add(vector: Vector): Vector;
        subtract(vector: Vector): Vector;
        isZero(): boolean;
    }
}
