const MENU_ITEMS = {
    BOT_DEALS: 'Сделки из бота',
    API_DEALS: 'API сделки'
}

Ext.define('Dashboard.view.main.DashboardNavigation', {
    extend: 'Ext.Panel',
    xtype: 'dashboardnavigation',
    reference: 'dashboardNavigation',
    requires: [
        'Dashboard.view.main.DashboardController',
        'Ext.list.Tree',
        'Dashboard.view.deal.bot.BotDealsContainer',
        'Dashboard.view.deal.api.ApiDealsContainer'
    ],
    controller: 'dashboardController',

    title: 'Навигация',
    margin: '5 5 10 10',
    shadow: true,
    scrollable: true,

    collapsible: {
        direction: 'left',
        expandToolText: 'Раскрыть навигацию',
        collapseToolText: 'Скрыть навигацию'
    },

    items: [
        {
            xtype: 'treelist',
            reference: 'treelist',

            height: '100%',
            ui: 'nav',
            listeners: {
                painted: function (me) {
                    me.setSelection('botDealsMenuNode')
                },
                itemclick: function (sender, info) {
                    if (!info.item.getLeaf()) return
                    switch (info.item.getText()) {
                        case MENU_ITEMS.BOT_DEALS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'botdealscontainer'
                            })
                            break
                        case MENU_ITEMS.API_DEALS:
                            ExtUtil.referenceQuery('dashboardWorkspace').getItems().items.forEach(item => item.destroy())
                            ExtUtil.referenceQuery('dashboardWorkspace').add({
                                xtype: 'apidealscontainer'
                            })
                            break
                    }
                }
            },

            store: {
                root: {
                    expanded: true,
                    children: [
                        {
                            text: 'Сделки',
                            iconCls: 'x-fa fa-list-alt',
                            expanded: true,
                            children: [
                                {
                                    text: MENU_ITEMS.BOT_DEALS,
                                    id: 'botDealsMenuNode',
                                    leaf: true,
                                    iconCls: 'x-fa fa-robot'
                                },
                                {
                                    text: MENU_ITEMS.API_DEALS,
                                    iconCls: 'x-fa fa-laptop-code',
                                    id: 'apiDealsMenuNode',
                                    leaf: true
                                }
                            ]
                        }
                    ]
                }
            },
        }
    ]
})