Ext.define('ApiDashboard.view.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'maincontainer',
    requires: [
        'ApiDashboard.view.grid.DealGrid',
        'ApiDashboard.view.MainToolbar',
        'ApiDashboard.view.grid.DealFilterPanel'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'maintoolbar',
            docked: 'top',
            margin: '10 10 5 10'
        },
        {
            xtype: 'dealfilterpanel',
            margin: '5 10 5 10'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-chevron-up',
                    handler: function (me) {
                        let panel = ExtUtil.referenceQuery('dealFilterPanel')
                        if (panel.getHidden()) {
                            me.setIconCls('x-fa fa-chevron-up')
                            panel.show()
                        } else {
                            me.setIconCls('x-fa fa-chevron-down')
                            panel.hide()
                        }
                    }
                }
            ]
        },
        {
            flex: 1,
            xtype: 'dealgrid',
            margin: '5 10 10 10'
        }
    ]
})