window.addEventListener('DOMContentLoaded', e => {
    let items = document.querySelectorAll('.workspace-tabs') as NodeListOf<HTMLElement>;
    for (let i = 0, l = items.length; i < l; i++) {
        let wsTabGroup = items[i];
        let tabbar = new Workspace.Tabs.TabBar(wsTabGroup);
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 1' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 2' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 3' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 4' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 5' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 6' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 7' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 8', index: 1 }));
        tabbar.activate();
    }
});