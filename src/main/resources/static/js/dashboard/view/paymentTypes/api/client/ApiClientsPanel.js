Ext.define('Dashboard.view.paymentTypes.api.client.ApiClientsPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiclientspanel',

    title: 'API клиенты',
    masked: {
        xtype: 'loadmask',
        message: 'Выберите тип оплаты',
        indicator: false
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
            columns: [
                {
                    xtype: 'checkcolumn',
                    text: 'Включение'
                },
                {
                    text: 'ID',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        }
    ]
})