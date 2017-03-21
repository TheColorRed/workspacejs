namespace Workspace {
    export class Log {
        public static warning(message: string) {
            console.warn(`[WORKSPACE] ${message}`);
        }
        public static error(message: string) {
            console.error(`[WORKSPACE] ${message}`);
        }
        public static log(message: string) {
            console.log(`[WORKSPACE] ${message}`);
        }
        public static debug(message: any) {
            console.debug(message);
        }
    }
}