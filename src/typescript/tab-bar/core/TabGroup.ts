namespace Workspace {
    export function tabGroup(selector: string): TabGroup | null {
        let tabGroupElements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        for (let i = 0, l = tabGroupElements.length; i < l; i++) {
            let groupElement = tabGroupElements[i];
            for (let i = 0, l = tabGroups.length; i < l; i++) {
                let group = tabGroups[i];
                if (groupElement == group.element) {
                    return group;
                }
            }
        }
        return null;
    }

    export const tabGroups: TabGroup[] = [];

    export class Evt {
        public static TabDeactivate = 'workspace.tab.deactivate';
        public static UpdateTabBar = 'workspace.tab.update';
    }

    export class TabGroup {

        public tabContainer: Tabs.TabContainer;
        public contentContainer: Tabs.ContentContainer;

        protected _element: HTMLDivElement;

        private _tabs: Tab[] = [];

        public get element(): HTMLDivElement {
            return this._element;
        }

        public set id(value: string) { this.element.id = value; }
        public get id(): string { return this.element.id; }

        public constructor(element: HTMLDivElement) {
            this._element = element;
            this.tabContainer = new Tabs.TabContainer(this);
            this.contentContainer = new Tabs.ContentContainer(this);
            // this.id = (Math.random().toString(36) + Math.random().toString(36)).substr(2, 6);
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
            this.dispatchEvent(Evt.TabDeactivate);
        }

        public dispatchEvent(event: string) {
            this._element.dispatchEvent(new CustomEvent(event));
        }

        public activate(tab: number | Tab) {
            if (this._tabs.length > 0 && (tab instanceof Tab || typeof tab == 'number')) {
                this.deactivate();
                if (tab instanceof Tab) {
                    tab.activate();
                } else if (typeof tab == 'number' && tab >= 0) {
                    if (this._tabs[tab]) {
                        this._tabs[tab].activate();
                    } else {
                        Log.warning(`A tab at index ${tab} does not exist with max index of ${this._tabs.length - 1}.`);
                    }
                }
            } else {
                Log.warning('No tab could be activated.');
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