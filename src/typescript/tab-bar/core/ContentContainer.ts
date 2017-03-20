namespace Workspace.Tabs {
    export class ContentContainer {

        public _element: HTMLDivElement;

        public get element(): HTMLDivElement {
            return this._element;
        }

        public constructor(parent: TabGroup) {
            let element = parent.element.querySelector('.tab-content') as HTMLDivElement;
            if (!element) {
                element = document.createElement('div');
                element.classList.add('tab-content');
                parent.element.insertAdjacentElement('beforeend', element);
            }
            this._element = element;
        }
    }
}