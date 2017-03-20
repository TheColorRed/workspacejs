namespace Workspace.Tabs {
    export class TabBar {

        private _element: HTMLElement;
        private _tabs: Tab[] = [];

        public get element(): HTMLElement {
            return this._element;
        }

        public constructor(element: HTMLElement) {
            this._element = element;
        }

        public addTab(tab: Tab) {
            this._tabs.push(tab);
            tab.tabBar = this;
            tab.initTab();
            this.update();
        }

        public removeTab(tab: Tab) {
            let idx = this._tabs.indexOf(tab);
            this._tabs.splice(idx, 1);
        }

        public moveTab(tab: Tab, position: number) {
            let idx = this._tabs.indexOf(tab);
            this._tabs.splice(idx, 1);
            this._tabs.splice(position, 0, tab);
            this.update();
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
            this._tabs[this._tabs.length - 1].activate();
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

        public update() {
            let tabbar = this._createTabBar();
            for (let i = 0, l = this._tabs.length; i < l; i++) {
                let t = this._tabs[i];
                t.element = t.createTab(tabbar, t.title);
            }
            this._element.innerHTML = '';
            this._element.appendChild(tabbar);
        }

        private _createTabBar(): HTMLDivElement {
            let tabbar = document.createElement('div');
            tabbar.classList.add('tab-bar');
            return tabbar;
        }
    }
}
