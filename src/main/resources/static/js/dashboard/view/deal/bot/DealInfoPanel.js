Ext.define('Dashboard.view.deal.bot.DealInfoPanel', {
    extend: 'Ext.panel.Accordion',
    xtype: 'dealinfopanel',

    title: 'Сделка',

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
    openable: 3,
    items: [
        {
            title: 'Чек',
            collapsible: {
                direction: 'top',
            },
        },
        {
            title: 'Верификация',
            collapsible: {
                direction: 'top',
            },
        },
        {
            title: 'Информация о пользователе',
            collapsible: {
                direction: 'top',
            }
        }
    ]
})