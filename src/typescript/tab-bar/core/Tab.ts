namespace Workspace.Tabs {

    export interface TabItem {
        title?: string,
        icon?: HTMLImageElement,
        content?: HTMLElement | string,
        contentUrl?: string,
        index?: number
    }

    export class Tab {

        public tabGroup: TabGroup;

        protected _element: HTMLDivElement;
        protected _icon: HTMLImageElement;
        protected _title: string = '';
        protected _initIndex: number | undefined;
        protected _init: boolean = false;
        protected _content: Content;

        protected _options: TabItem | undefined;
        protected _isActive: boolean = false;

        public get isActive(): boolean {
            return this._isActive;
        }

        public get element(): HTMLDivElement {
            return this._element;
        }

        public get content(): Content {
            return this._content;
        }

        public constructor(options?: TabItem) {
            this._options = options;
            this.setTitle((options || {}).title || 'Tab');
            this.setIcon((options || {}).icon || new Image);
            this._initIndex = (options || {}).index || undefined;
        }

        public setTabGroup(tabGroup: TabGroup) {
            this.tabGroup = tabGroup;
        }

        public initTab() {
            if (!this._init) {
                this._init = true;
                this._initIndex != undefined && this._initIndex > -1 ?
                    this.tabGroup.moveTab(this, this._initIndex) : null;
            }
        }

        public setTitle(title: string) {
            this._title = title;
        }

        public setIcon(icon: HTMLImageElement) {
            this._icon = icon;
        }

        private setContent(content?: HTMLElement | string) {
            this._content = new Content(this);
            this._content.createContent(content || '');
        }

        public createTab(tabbar: HTMLDivElement): HTMLDivElement {
            // Initialize the tab
            let tab = this._initTab();

            // Add tab events
            this._initEvents(tab);

            // Add title and close button
            this._createTabTitle(tab, this._title);
            this._createTabClose(tab);

            // Set the content
            if (this._options && this._options.contentUrl) {
                Http.request(this._options.contentUrl).success(response => {
                    this.setContent(response);
                });
            } else if (this._options && this._options.content) {
                this.setContent(this._options.content);
            }

            // Append to the tab bar
            tabbar.appendChild(tab);
            return tab;
        }

        public removeTab() {
            let parent = this._element.parentElement;
            if (parent) {
                parent.removeChild(this._element);
                this.tabGroup.removeTab(this);
            }
        }

        public activate() {
            this._isActive = true;
            this._element ? this._element.classList.add('selected') : null;
            this.content ? this.content.activate() : null;
        }

        public deactivate() {
            this._isActive = false;
            this._element ? this._element.classList.remove('selected') : null;
            this.content ? this.content.deactivate() : null;
        }

        ////////////////////////////////////////////////////////////////////////
        /// Tab Events
        ////////////////////////////////////////////////////////////////////////

        private onTabMouseDown(e: MouseEvent) {
            e.stopPropagation();
            if (e.which == 2 || e.button == 4) {
                this.onTabCloseClick(e);
            }
        }

        private onTabClick(e: MouseEvent) {
            e.stopPropagation();
            this.tabGroup.element.dispatchEvent(new CustomEvent('workspace.tab.deactivate'));
            this.tabGroup.activate(this);
        }

        private onTabCloseClick(e: MouseEvent) {
            e.stopPropagation();
            e.preventDefault();
            let isSelected = this._element.classList.contains('selected');
            let idx = this.tabGroup.tabIndex(this);
            this.removeTab();
            this.content.removeContent();
            if (isSelected) {
                this.tabGroup.activate(idx);
            }
        }

        private onTabDragStart(e: DragEvent) {
            console.log('start')
            if (e.target) {
                e.dataTransfer.setData('id', (<HTMLDivElement>e.target).id);
            }
        }

        private onTabDragOver(e: DragEvent) {
            e.preventDefault();
        }

        private onTabDragEnter(e: DragEvent) {
            let target = <HTMLElement>e.currentTarget;
            target.classList.add('drag-hover');
        }

        private onTabDragLeave(e: DragEvent) {
            let target = <HTMLElement>e.currentTarget;
            target.classList.remove('drag-hover');
        }

        private onTabDrop(e: DragEvent) {
            e.preventDefault();
            let id = e.dataTransfer.getData('id');
            let tab = this.tabGroup.getTabById(id);
            if (tab) {
                let droptab = this.tabGroup.getTabById((<HTMLElement>e.currentTarget).id);
                if (droptab) {
                    let idx = this.tabGroup.tabIndex(droptab);
                    this.tabGroup.moveTab(tab, idx);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////
        /// Tab creation
        ////////////////////////////////////////////////////////////////////////

        private _initTab(): HTMLDivElement {
            let tab = document.createElement('div');
            this._element = tab;
            tab.draggable = true;
            tab.classList.add('tab');
            tab.setAttribute('id', (Math.random().toString(36) + Math.random().toString(36)).substr(2, 6));
            return tab;
        }

        private _initEvents(tab: HTMLDivElement) {
            tab.ondragstart = this.onTabDragStart.bind(this);
            tab.ondragover = this.onTabDragOver.bind(this);
            tab.ondragenter = this.onTabDragEnter.bind(this);
            tab.ondragleave = this.onTabDragLeave.bind(this);
            tab.ondrop = this.onTabDrop.bind(this);
            tab.onmousedown = this.onTabMouseDown.bind(this);
            tab.onclick = this.onTabClick.bind(this);
            this.tabGroup.element.addEventListener('workspace.tab.deactivate', this.deactivate.bind(this));
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
            c.onclick = this.onTabCloseClick.bind(this);
            tab.appendChild(c);
        }
    }
}