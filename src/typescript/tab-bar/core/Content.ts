namespace Workspace.Tabs {
    export class Content {

        public tab: Tab;

        protected _element: HTMLDivElement;

        public get element(): HTMLElement {
            return this._element;
        }

        public constructor(parent: Tab) {
            this.tab = parent;
        }

        public activate() {
            this._element ? this._element.classList.add('selected') : null;
        }

        public deactivate() {
            this._element ? this._element.classList.remove('selected') : null;
        }

        public createContent(html: string | HTMLElement) {
            let content = document.createElement('div');
            content.classList.add('content');
            if (html instanceof HTMLElement) {
                content.innerHTML = '';
                content.appendChild(html);
            } else {
                content.innerHTML = html;
            }
            this._element = content;
            if (this.tab.isActive) {
                this.tab.tabGroup.activate(this.tab);
            }
            this.tab.tabGroup.contentContainer.element.appendChild(content);
        }

        public removeContent() {
            let parent = this._element.parentElement;
            if (parent) {
                parent.removeChild(this._element);
            }
        }

    }
}