/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class TrussStructure extends Structure<TrussElement>{
        constructor(public dof: number, elements: Array<TrussElement>, nodes: Array<Node>) {
            super(dof, elements, nodes);
        }
    }
}