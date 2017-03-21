namespace Workspace.Tabs {

    export interface TabOptions {
        title?: string,
        icon?: HTMLImageElement,
        content?: HTMLElement | string,
        contentUrl?: string,
        index?: number,
        tooltip?: string,

        closable?: boolean,
        movable?: boolean,
        enabled?: boolean
    }

    export class Tab {

        public tabGroup: TabGroup;

        protected _element: HTMLDivElement;
        protected _icon: HTMLImageElement;
        protected _title: string = 'Tab';
        protected _initIndex: number | undefined;
        protected _init: boolean = false;
        protected _content: Content;

        protected _options: TabOptions | undefined;

        protected _isSelected: boolean = false;
        protected _isEnabled: boolean = true;
        protected _isClosable: boolean = true;
        protected _isMovable: boolean = true;

        public get element(): HTMLDivElement { return this._element; }
        public get content(): Content { return this._content; }

        ////////////////////////////////////////////////////////////////////////
        /// Tab toggles
        ////////////////////////////////////////////////////////////////////////

        public get isSelected(): boolean { return this._isSelected; }

        public get isEnabled(): boolean { return this._isEnabled; }
        public set isEnabled(value: boolean) {
            this._isEnabled = value;
            if (!value) {
                this.element.classList.add('disabled');
            } else {
                this.element.classList.remove('disabled');
            }
        }

        public get isClosable(): boolean { return this._isClosable; }
        public set isClosable(value: boolean) {
            this._isClosable = value;
            if (value) {
                this._createTabCloseButton(this.element);
            } else {
                this._removeTabCloseButton(this.element);
            }
        }

        public get isMovable(): boolean { return this._isMovable; }
        public set isMovable(value: boolean) {
            this._isMovable = value;
            this.element.draggable = value;
        }

        public set title(value: string) {
            this._title = value;
            let title = this._element.querySelector('span.title') as HTMLSpanElement;
            if (title) { title.innerText = value; }
        }

        public set tooltip(value: string) {
            this.element.title = value;
        }

        public constructor(options?: TabOptions) {
            this._options = options;
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
            if (this._isClosable) {
                this._createTabCloseButton(tab);
            }

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
            this._isSelected = true;
            this._element ? this._element.classList.add('selected') : null;
            this.content ? this.content.activate() : null;
        }

        public deactivate() {
            this._isSelected = false;
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
            if (!this._isEnabled) { return; }
            this.tabGroup.dispatchEvent(Evt.TabDeactivate)
            this.tabGroup.activate(this);
        }

        private onTabCloseClick(e: MouseEvent) {
            e.stopPropagation();
            e.preventDefault();
            if (!this._isClosable) { return; }
            let isSelected = this._element.classList.contains('selected');
            let idx = this.tabGroup.tabIndex(this);
            this.removeTab();
            if (this.content) {
                this.content.removeContent();
            }
            if (isSelected) {
                this.tabGroup.activate(idx);
            }
        }

        private onTabDragStart(e: DragEvent) {
            if (e.target && this._isMovable) {
                e.dataTransfer.setData('id', (<HTMLDivElement>e.target).id);
            }
        }

        private onTabDragOver(e: DragEvent) {
            e.preventDefault();
        }

        private onTabDragEnter(e: DragEvent) {
            if (!this.isMovable) { return; }
            let target = <HTMLElement>e.currentTarget;
            target.classList.add('drag-hover');
        }

        private onTabDragLeave(e: DragEvent) {
            if (!this.isMovable) { return; }
            let target = <HTMLElement>e.currentTarget;
            target.classList.remove('drag-hover');
        }

        private onTabDrop(e: DragEvent) {
            e.preventDefault();
            if (!this._isMovable) { return; }
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

            this.setTitle(this._options && this._options.title ? this._options.title : this._title);
            this.setIcon(this._options && this._options.icon ? this._options.icon : new Image);
            this._initIndex = this._options && this._options.index ? this._options.index : this._initIndex;
            this.isClosable = this._options && typeof this._options.closable == 'boolean' ? this._options.closable : this._isClosable;
            this.isMovable = this._options && typeof this._options.movable == 'boolean' ? this._options.movable : this._isMovable;
            this.isEnabled = this._options && typeof this._options.enabled == 'boolean' ? this._options.enabled : this._isEnabled;

            tab.draggable = this.isMovable;
            if (this._options && this._options.tooltip) {
                tab.title = this._options.tooltip;
            }
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
            this.tabGroup.element.addEventListener(Evt.TabDeactivate, this.deactivate.bind(this));
        }

        private _createTabTitle(tab: HTMLDivElement, title: string) {
            let t = tab.querySelector('span.title') as HTMLSpanElement;
            if (!t) {
                t = document.createElement('span');
                t.classList.add('title');
                t.innerText = title;
                tab.insertAdjacentElement('afterbegin', t);
            }
        }

        private _createTabCloseButton(tab: HTMLDivElement) {
            let c = tab.querySelector('span.close') as HTMLSpanElement;
            if (!c) {
                c = document.createElement('span');
                c.classList.add('close');
                c.onclick = this.onTabCloseClick.bind(this);
                tab.insertAdjacentElement('beforeend', c);
            }
        }

        private _removeTabTitle(tab: HTMLDivElement) {
            let c = tab.querySelector('span.title') as HTMLSpanElement;
            if (c) {
                tab.removeChild(c);
            }
        }

        private _removeTabCloseButton(tab: HTMLDivElement) {
            let c = tab.querySelector('span.close') as HTMLSpanElement;
            if (c) {
                tab.removeChild(c);
            }
        }
    }
}