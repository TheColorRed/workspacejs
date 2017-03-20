namespace Workspace.Tabs {

    export interface TabItem {
        title?: string,
        icon?: HTMLImageElement,
        content?: Content,
        index?: number
    }

    export class Tab {

        public tabBar: TabBar;

        protected _element: HTMLElement;
        protected _content: Content;
        protected _icon: HTMLImageElement;
        protected _title: string = '';
        protected _initIndex: number | undefined;
        protected _init: boolean = false;

        public set element(value: HTMLElement) {
            this._element = value;
            this.tabBar.element.removeEventListener('workspace.tab.deactivate', this.deactivate.bind(this));
            this.tabBar.element.addEventListener('workspace.tab.deactivate', this.deactivate.bind(this));
        }

        public get element(): HTMLElement {
            return this._element;
        }

        public get title(): string {
            return this._title;
        }

        public constructor(options: TabItem) {
            this.setTitle(options.title || 'Tab');
            this.setIcon(options.icon || new Image);
            this.setContent(options.content || new Content);
            this._initIndex = options.index;
        }

        public initTab() {
            if (!this._init) {
                this._init = true;
                this._initIndex != undefined && this._initIndex > -1 ?
                    this.tabBar.moveTab(this, this._initIndex) : null;
            }
        }

        public setTitle(title: string) {
            this._title = title;
        }

        public setContent(content: Content) {
            this._content = content;
        }

        public setIcon(icon: HTMLImageElement) {
            this._icon = icon;
        }

        public createTab(tabbar: HTMLDivElement, title: string): HTMLDivElement {
            let tab = document.createElement('div');
            tab.onmousedown = this.onTabClick.bind(this);
            tab.ondragstart = this.onTabDragStart.bind(this);
            tab.ondragover = this.onTabDragOver.bind(this);
            tab.ondragenter = this.onTabDragEnter.bind(this);
            tab.ondragleave = this.onTabDragLeave.bind(this);
            tab.ondrop = this.onTabDrop.bind(this);
            tab.draggable = true;
            tab.classList.add('tab');
            tab.setAttribute('id', (Math.random().toString(36) + Math.random().toString(36)).substr(2, 6));
            this._createTabTitle(tab, title);
            this._createTabClose(tab);
            tabbar.appendChild(tab);
            return tab;
        }

        public activate() {
            this._element.classList.add('selected');
        }

        public deactivate() {
            this._element.classList.remove('selected');
        }

        private onTabClick(e: MouseEvent) {
            e.stopPropagation();
            if (e.which == 2 || e.button == 4) {
                this.onCloseClick(e);
            } else {
                this.tabBar.element.dispatchEvent(new CustomEvent('workspace.tab.deactivate'));
                this.activate();
            }
        }

        private onCloseClick(e: MouseEvent) {
            e.stopPropagation();
            let isSelected = this._element.classList.contains('selected');
            let idx = this.tabBar.tabIndex(this);
            let p = this._element.parentElement
            p ? p.removeChild(this._element) : null;
            this.tabBar.removeTab(this);
            if (isSelected) {
                this.tabBar.activate(idx);
            }
        }

        private onTabDragStart(e: DragEvent) {
            if (e.target) {
                e.dataTransfer.setData('id', (<HTMLDivElement>e.target).id);
            }
        }

        private onTabDragOver(e: DragEvent) {
            e.preventDefault();
        }

        private onTabDragEnter(e: DragEvent) {
            // e.stopPropagation();
            let target = <HTMLElement>e.currentTarget;
            target.classList.add('drag-hover');
        }

        private onTabDragLeave(e: DragEvent) {
            // e.stopPropagation();
            let target = <HTMLElement>e.currentTarget;
            target.classList.remove('drag-hover');
        }

        private onTabDrop(e: DragEvent) {
            e.preventDefault();
            let id = e.dataTransfer.getData('id');
            let tab = this.tabBar.getTabById(id);
            if (tab) {
                let droptab = this.tabBar.getTabById((<HTMLElement>e.currentTarget).id);
                if (droptab) {
                    let idx = this.tabBar.tabIndex(droptab);
                    this.tabBar.moveTab(tab, idx);
                }
            }
        }

        private _createTabTitle(tab: HTMLDivElement, title: string) {
            let t = document.createElement('span');
            t.classList.add('title');
            t.innerText = title;
            tab.appendChild(t);
        }

        private _createTabClose(tab: HTMLDivElement) {
            let c = document.createElement('span');
            c.classList.add('close');
            c.onclick = this.onCloseClick.bind(this);
            tab.appendChild(c);
        }
    }
}