Ext.define('Dashboard.view.paymentTypes.api.client.ApiClientsPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiclientspanel',
    reference: 'apiClientsPanel',
    requires: [
        'Dashboard.view.paymentTypes.api.client.ApiClientsController',
        'Dashboard.view.paymentTypes.api.client.ApiClientsGridMenu'
    ],
    controller: 'apiClientsController',

    title: 'API клиенты',
    setDefaultMask: function () {
        this.setMasked({
            xtype: 'loadmask',
            message: 'Выберите тип оплаты',
            indicator: false,
            style: {
                opacity: 0.5
            }
        })
    },

    listeners: {
        painted: 'setMask'
    },

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавить клиента',
                handler: 'addClientDialog'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            reference: 'apiClientsGrid',
            store: 'apiClientStore',

            getIdOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('id')
                }
                return null
            },

            listeners: {
                childcontextmenu: 'openGridMenu',
            },

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