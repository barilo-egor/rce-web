Ext.define('Dashboard.view.deal.bot.DealInfoPanel', {
    extend: 'Ext.panel.Accordion',
    xtype: 'dealinfopanel',
    reference: 'dealInfoPanel',

    title: 'Пользователь',

    defaults: {
        xtype: 'panel'
    },
    collapsible: {
        direction: 'right',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    titleCollapse: false,
    scrollable: 'y',
    openable: 1,
    items: [
    ]
})