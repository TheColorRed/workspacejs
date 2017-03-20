window.addEventListener('DOMContentLoaded', e => {
    let items = document.querySelectorAll('.workspace-tabs') as NodeListOf<HTMLDivElement>;
    for (let i = 0, l = items.length; i < l; i++) {
        let wsTabGroup = items[i];
        let tabbar = new Workspace.Tabs.TabGroup(wsTabGroup);
        let iframe = document.createElement('iframe') as HTMLIFrameElement;
        iframe.src = 'http://r.ddmcdn.com/s_f/o_1/cx_633/cy_0/cw_1725/ch_1725/w_720/APL/uploads/2014/11/too-cute-doggone-it-video-playlist.jpg';
        iframe.width = '800'
        iframe.height = '800';
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Usage', contentUrl: './ajax/usage.html' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'iFrame Test', content: iframe }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 3' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 4' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 5' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 6' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 7' }));
        tabbar.addTab(new Workspace.Tabs.Tab({ title: 'Tab 8' }));
        tabbar.activate();
    }
});