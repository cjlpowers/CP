/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class Node {
        public force: Mathematics.Vector3;
        public position: Mathematics.Vector3;
        public displacement: Mathematics.Vector3;
        public reactionForce: Mathematics.Vector3;
        public reactionDisplacement: Mathematics.Vector3;

        constructor(public number: number) {
            this.force = new Mathematics.Vector3();
            this.force.x = undefined;
            this.force.y = undefined;
            this.force.z = undefined;
            this.force.unit = "N";
            this.position = new Mathematics.Vector3();
            this.position.x = undefined;
            this.position.y = undefined;
            this.position.z = undefined;
            this.position.unit = "m";
            this.displacement = new Mathematics.Vector3();
            this.displacement.x = undefined;
            this.displacement.y = undefined;
            this.displacement.z = undefined;
            this.displacement.unit = "m";
            this.reactionDisplacement = new Mathematics.Vector3();
            this.reactionDisplacement.x = undefined;
            this.reactionDisplacement.y = undefined;
            this.reactionDisplacement.z = undefined;
            this.reactionDisplacement.unit = "m";
            this.reactionForce = new Mathematics.Vector3();
            this.reactionForce.x = undefined;
            this.reactionForce.y = undefined;
            this.reactionForce.z = undefined;
            this.reactionForce.unit = "N";
        }
    }
}