window.addEventListener('DOMContentLoaded', e => {
    let items = document.querySelectorAll('.workspace-tabs') as NodeListOf<HTMLDivElement>;
    for (let i = 0, l = items.length; i < l; i++) {
        let wsTabGroup = items[i];
        let tabGroup = new Workspace.TabGroup(wsTabGroup);
        Workspace.tabGroups.push(tabGroup);
    }
});