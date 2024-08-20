Ext.define('Dashboard.view.paymentTypes.api.ApiPaymentTypesContainer', {
    extend: 'Ext.Container',
    xtype: 'apipaymenttypescontainer',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.ApiRequisitesPanel',
        'Dashboard.view.paymentTypes.api.client.ApiClientsPanel',
        'Dashboard.view.paymentTypes.api.type.ApiPaymentTypesPanel'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 0.7,
            xtype: 'apipaymenttypespanel',
            margin: '10 5 10 10',
        },
        {
            flex: 0.3,
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
                    xtype: 'apirequisitespanel',
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