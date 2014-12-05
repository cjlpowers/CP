
module CP.Mathematics {
    export class Matrix {
        get rowCount(): number {
            return this.matrix.length;
        }

        get columnCount(): number {
            return this.matrix.length > 0 ? this.matrix[0].length : 0;
        }

        constructor(public matrix: any) {
            if (!matrix) {
                throw new Error("Must provide a matrix");
            }
            this.rowCount = matrix.length;
            this.columnCount = this.rowCount > 0 ? matrix[0].length : 0;
        }

        toString(): string {
            return this.matrix.toString();
        }

        getValue(row: number, column: number): number {
            var obj = this.matrix[row];
            if(column === 0 && !Array.isArray(obj))
                return obj;
            return obj[column];
        }

        setValue(row: number, column: number, value: number) {
            this.matrix[row][column] = value;
        }

        addValue(row: number, column: number, value: number) {
            this.setValue(row, column, this.getValue(row, column) + value);
        }

        multiply(b: Matrix): Matrix {
            return new Matrix(numeric.dot(this.matrix, b.matrix));
        }

        scale(multiplier: number): Matrix {
            return new Matrix(numeric.mul(multiplier, this.matrix));
        }

        inverse(): Matrix {
            return new Matrix(numeric.inv(this.matrix));
        }

        transpose(): Matrix {
            return new Matrix(numeric.transpose(this.matrix));
        }

        clone(): Matrix {
            return this.scale(1);
        }

        static new(rows: number, cols: number): Matrix {
            var result = new Array<Array<number>>(rows);
            for (var r = 0; r < rows; r++) {
                result[r] = new Array<number>(cols);
                for (var c = 0; c < cols; c++)
                    result[r][c] = 0;
            }
            return new Matrix(result);
        }

        static solveAxEqualsB(a: CP.Mathematics.Matrix, b: CP.Mathematics.Matrix) : CP.Mathematics.Matrix {
            return new CP.Mathematics.Matrix(numeric.solve(a.matrix, b.matrix));
        }
    }
}