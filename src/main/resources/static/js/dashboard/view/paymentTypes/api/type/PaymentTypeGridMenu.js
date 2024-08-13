Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypeGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'requisitesgridmenu',
    requires: [
        'Dashboard.view.paymentTypes.api.type.EditPaymentTypeDialog'
    ],

    items: [
        {
            text: 'Редактировать',
            iconCls: 'x-fa fa-pen',
            handler: function (me) {
                let selected = ExtUtil.referenceQuery('paymentTypesGrid').getSelectedRec()
                Ext.create('Dashboard.view.paymentTypes.api.type.EditPaymentTypeDialog', {
                    viewModel: {
                        data: {
                            pid: selected.get('pid'),
                            id: selected.get('id'),
                            name: selected.get('name'),
                            comment: selected.get('comment')
                        }
                    }
                }).show()
            }
        },
        {
            text: 'Удалить',
            reference: 'copyRequisiteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                ExtMessages.confirm('Внимание', 'Вместе с типом будут удалены всего его реквизиты, а также связи с АПИ клиентами. Продолжить?',
                    function () {
                        ExtUtil.mask('paymentTypesGrid')
                        let url = '/paymentTypes/api/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                        RequestUtil.request({
                            url: url,
                            method: 'DELETE',
                            masked: 'paymentTypesGrid',
                            success: function () {
                                Ext.getStore('paymentTypeStore').reload()
                                ExtMessages.topToast('Тип оплаты удален')
                                ExtUtil.referenceQuery('requisitesPanel').setDefaultMask()
                                ExtUtil.referenceQuery('apiClientsPanel').setDefaultMask()
                                ExtUtil.maskOff('paymentTypesGrid')
                            }
                        })
                    })
            }
        }
    ]
})