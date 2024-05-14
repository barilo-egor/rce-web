Ext.define('Dashboard.view.main.DashboardNavigation', {
    extend: 'Ext.Panel',
    xtype: 'dashboardnavigation',
    reference: 'dashboardNavigation',
    requires: [
        'Dashboard.view.main.DashboardController',
        'Ext.list.Tree'
    ],
    controller: 'dashboardController',

    title: 'Навигация',
    titleAlign: 'right',
    margin: '10 10 10 10',
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
                    me.setSelection('qweqweqwe')
                }
            },

            store: {
                root: {
                    expanded: true,
                    children: [
                        {
                            text: 'Сделки',
                            cls: 'fontSizeTest',
                            iconCls: 'x-fa fa-list-alt',
                            expanded: true,
                            children: [
                                {
                                    reference: 'botDealsMenu',
                                    text: 'Сделки из бота',
                                    cls: 'fontSizeTest',
                                    id: 'qweqweqwe',
                                    leaf: true,
                                    iconCls: 'x-fa fa-robot'
                                }
                            ]
                        }
                    ]
                }
            },
        }
    ]
})