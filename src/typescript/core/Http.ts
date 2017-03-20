namespace Workspace {
    export class Http {

        private _success: (response: string) => void;

        public static request(url: string): Http {
            let http = new Http;
            let req = new XMLHttpRequest;
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    http._success(req.responseText);
                }
            }
            req.open('get', url);
            req.send();
            return http;
        }

        public success(callback: (respose: string) => void) {
            this._success = callback;
        }
    }
}