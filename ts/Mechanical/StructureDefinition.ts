/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class StructureDefinition {
        //materials: Array<{ 
        //    name: string; 
        //    elasticModulus: number 
        //}>;

        nodes: Array<{ 
            force?: {
                x?: number;
                y?: number;
                z?: number;
            };

            position: {
                x: number;
                y: number;
                z?: number;
            };

            displacement?: {
                x?: number;
                y?: number;
                z?: number;
            };
        }>;

        elements: Array<{
            area: number;
            nodes: Array<number>;
            material?: number;
        }>;
    }
}