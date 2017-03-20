namespace Workspace.Tabs {
    export class TabContainer {

        private _element: HTMLDivElement;
        public tabGroup: TabGroup;

        public get element(): HTMLDivElement {
            return this._element;
        }

        public constructor(parent: TabGroup) {
            this.tabGroup = parent;
            let element = parent.element.querySelector('.tab-bar') as HTMLDivElement;
            if (!element) {
                element = document.createElement('div');
                element.classList.add('tab-bar');
                parent.element.insertAdjacentElement('afterbegin', element);
            }
            this._element = element;
            this._element.onmousewheel = this.onMouseWheel.bind(this);
            this._element.ondblclick = this.onDoubleClick.bind(this);
        }

        private onDoubleClick(e: MouseEvent) {
            e.preventDefault();
            if (e.target == this._element) {
                this.tabGroup.addTab(new Tab);
            }
        }

        private onMouseWheel(e: MouseWheelEvent) {
            e.preventDefault();
            if ((e.wheelDelta || e.detail) > 0) {
                this._element.scrollLeft -= 50;
            } else {
                this._element.scrollLeft += 50;
            }
        }
    }
}
