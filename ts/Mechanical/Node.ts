/// <reference path="../Includes.ts" />

module CP.Mechanical {
    export class Node implements Graphics.CanvasElement {
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

        public render(ctx: CanvasRenderingContext2D) {
            var fillColor = new Graphics.Color(100, 100, 100);
            var lineColor = new Graphics.Color(0, 0, 0);
            var forceColor = new Graphics.Color(255, 0, 0);
            
            var size = 1;

            // draw the node
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.fillStyle = lineColor;
            ctx.font = "4px serif";
            ctx.fillText(this.number.toString(), this.position.x, this.position.y);

            this.drawForce(ctx, this.force, new Graphics.Color(0, 0, 255));
            this.drawForce(ctx, this.reactionForce, new Graphics.Color(255, 0, 0));
        }

        drawForce(ctx: CanvasRenderingContext2D, force: Mathematics.Vector3, color: Graphics.Color) {
            var forceLineLength = 10;
            if (force) {
                if (force.x) {
                    this.drawForceLine(ctx, this.position, this.position.add(new Mathematics.Vector3(forceLineLength * (force.x > 0 ? 1 : -1), 0)), color, force.x.toString());
                }
                if (force.y) {
                    this.drawForceLine(ctx, this.position, this.position.add(new Mathematics.Vector3(0, forceLineLength * (force.y > 0 ? 1 : -1))), color, force.y.toString());
                }
            }
        }

        drawForceLine(ctx: CanvasRenderingContext2D, start: Mathematics.Vector3, end: Mathematics.Vector3, color: Graphics.Color, text: string) {
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = color;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            //ctx.font = "4px serif";
            //ctx.fillText(text, end.x, end.y);
        }
    }
}