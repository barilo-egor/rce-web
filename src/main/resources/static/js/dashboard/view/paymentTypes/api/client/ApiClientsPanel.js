Ext.define('Dashboard.view.paymentTypes.api.client.ApiClientsPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiclientspanel',
    reference: 'apiClientsPanel',

    title: 'API клиенты',
    masked: {
        xtype: 'loadmask',
        message: 'Выберите тип оплаты',
        indicator: false,
        style: {
            opacity: 0.5
        }
    },

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавить клиента'
            },
            '->',
            {
                iconCls: 'x-fa fa-question',
                tooltip: 'Помощь'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            store: 'apiClientStore',
            columns: [
                {
                    text: 'ID',
                    dataIndex: 'id',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        }
    ]
})