// Ext.define('DisableColumnHideOverride', {
//     override: 'Ext.grid.Panel',
//     enableColumnHide: false
// });
// Ext.define('FixedWindows', {
//     override: 'Ext.window.Window',
//     draggable: false,
//     resizable: false
// })
Ext.application({
    name: 'Ticket',
    extend: 'Ext.app.Application',
    appFolder: '/js/user/form/ticket',
    title: 'Оформление тикета',
    autoCreateViewport: true
});