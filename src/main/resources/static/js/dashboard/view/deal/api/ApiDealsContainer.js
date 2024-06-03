Ext.define('Dashboard.view.deal.api.ApiDealsContainer', {
    extend: 'Ext.Container',
    xtype: 'apidealscontainer',
    requires: [
        'Dashboard.view.deal.api.ApiDealsFilterPanel',
        'Dashboard.view.deal.api.ApiDealsUserInfoPanel',
        'Dashboard.view.deal.api.ApiDealsGrid'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'apidealsfilterpanel',
                    title: 'Фильтрация'
                },
                {
                    xtype: 'apidealsgrid',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'apidealsuserinfopanel',
            shadow: true,
            margin: '10 10 10 5'
        }
    ]
})