
module CP.Genetics {
    export class Sensor {
        getValue: () => number;
        setValue: (value: number) => void;

        constructor(getValue: () => number, setValue?: (number) => void) {
            this.getValue = getValue;
            this.setValue = setValue || (() => { });
        }
    }
}