Ext.define('Dashboard.view.paymentTypes.api.client.ApiClientsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apiclientsgridmenu',

    items: [
        {
            text: 'Удалить',
            reference: 'copyRequisiteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                ExtUtil.mask('apiClientsGrid')
                let url = '/paymentTypes/api/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                    + '/client/' + ExtUtil.referenceQuery('apiClientsGrid').getIdOfSelected()
                RequestUtil.request({
                    url: url,
                    method: 'DELETE',
                    masked: 'apiClientsGrid',
                    success: function () {
                        Ext.getStore('paymentTypeStore').reload()
                        ExtMessages.topToast('Клиент отвязан от типа оплаты')
                        ExtUtil.maskOff('apiClientsGrid')
                    }
                })
            }
        }
    ]
})