namespace Workspace.Tabs {
    export class TabGroup {

        public tabContainer: TabContainer;
        public contentContainer: ContentContainer;

        protected _element: HTMLDivElement;

        private _tabs: Tab[] = [];

        public get element(): HTMLDivElement {
            return this._element;
        }

        public constructor(element: HTMLDivElement) {
            this._element = element;
            this.tabContainer = new TabContainer(this);
            this.contentContainer = new ContentContainer(this);
        }

        public addTab(tab: Tab): number {
            this._tabs.push(tab);
            tab.setTabGroup(this);
            tab.createTab(this.tabContainer.element);
            return this.tabIndex(tab);
        }

        public tabIndex(tab: Tab): number {
            return this._tabs.indexOf(tab);
        }

        public deactivate() {
            this._element.dispatchEvent(new CustomEvent('workspace.tab.deactivate'));
        }

        public activate(tab: number | Tab = 0) {
            if (this._tabs.length > 0 && (tab instanceof Tab || typeof tab == 'number')) {
                this.deactivate();
                if (tab instanceof Tab) {
                    tab.activate();
                } else if (typeof tab == 'number') {
                    this._tabs[tab].activate();
                }
            }
        }

        public activateLast() {
            this.deactivate();
            // this._tabs[this._tabs.length - 1].activate();
        }

        public moveTab(tab: Tab, position: number) {
            let idx = this._tabs.indexOf(tab);
            this._tabs.splice(idx, 1);
            this._tabs.splice(position, 0, tab);
            this.update();
        }

        public getTabById(id: string): Tab | null {
            for (let i = 0, l = this._tabs.length; i < l; i++) {
                let tab = this._tabs[i];
                if (tab.element && tab.element.id && tab.element.id == id) {
                    return tab;
                }
            }
            return null;
        }

        public removeTab(tab: Tab) {
            let idx = this._tabs.indexOf(tab);
            this._tabs.splice(idx, 1);
        }

        public update() {
            this.tabContainer.element.innerHTML = '';
            for (let i = 0, l = this._tabs.length; i < l; i++) {
                let t = this._tabs[i];
                t.element.classList.remove('drag-hover');
                this.tabContainer.element.appendChild(t.element);
            }
        }
    }
}