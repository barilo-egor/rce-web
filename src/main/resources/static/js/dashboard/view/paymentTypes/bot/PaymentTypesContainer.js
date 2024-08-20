Ext.define('Dashboard.view.paymentTypes.bot.PaymentTypesContainer', {
    extend: 'Ext.Container',
    xtype: 'paymenttypescontainer',
    requires: [
        'Dashboard.view.paymentTypes.bot.type.PaymentTypesPanel',
        'Dashboard.view.paymentTypes.bot.requisite.RequisitesPanel'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 0.6,
            xtype: 'container',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 0.6,
                    xtype: 'paymenttypespanel',
                    margin: '10 5 5 10',
                },
                {
                    flex: 0.4,
                    xtype: 'requisitespanel',
                    margin: '10 10 5 5',
                }
            ]
        },
        {
            flex: 0.4,
            xtype: 'panel',
            title: 'Защитные реквизиты',
            shadow: true,
            margin: '5 10 10 10'
        }
    ]
})