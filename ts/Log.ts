/// <reference path="Includes.ts" />

module CP {
    export class Log {
        
        static debug(message?: any, ...optionalParams: any[]): void {
            (console.debug || Log.log)(message, optionalParams);
        }

        static log(message?: any, ...optionalParams: any[]): void{
            console.log(message, optionalParams);
        }

        static info(message?: any, ...optionalParams: any[]): void {
            (console.info || Log.log)(message, optionalParams);
        }

        static warn(message?: any, ...optionalParams: any[]): void {
            (console.warn || Log.log)(message, optionalParams);
        }

        static error(message?: any, ...optionalParams: any[]): void {
            (console.error || Log.log)(message, optionalParams);
        }
    }
}