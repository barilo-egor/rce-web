Ext.define('Dashboard.view.paymentTypes.api.ApiPaymentTypesContainer', {
    extend: 'Ext.Container',
    xtype: 'apipaymenttypescontainer',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.RequisitesPanel',
        'Dashboard.view.paymentTypes.api.client.ApiClientsPanel',
        'Dashboard.view.paymentTypes.api.type.PaymentTypesPanel'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 0.6,
            xtype: 'paymenttypespanel',
            margin: '10 5 10 10',
        },
        {
            flex: 0.4,
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                flex: 0.5,
                shadow: true
            },
            items: [
                {
                    xtype: 'requisitespanel',
                    margin: '10 10 5 5'
                },
                {
                    xtype: 'apiclientspanel',
                    margin: '5 10 10 5',
                }
            ]
        }
    ]
})