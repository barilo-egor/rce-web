Ext.define('Dashboard.view.paymentTypes.api.type.ApiPaymentTypeGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apirequisitesgridmenu',
    requires: [
        'Dashboard.view.paymentTypes.api.type.EditApiPaymentTypeDialog'
    ],

    items: [
        {
            text: 'Редактировать',
            iconCls: 'x-fa fa-pen',
            handler: function (me) {
                let selected = ExtUtil.referenceQuery('paymentTypesGrid').getSelectedRec()
                Ext.create('Dashboard.view.paymentTypes.api.type.EditApiPaymentTypeDialog', {
                    viewModel: {
                        data: {
                            pid: selected.get('pid'),
                            id: selected.get('id'),
                            name: selected.get('name'),
                            comment: selected.get('comment'),
                            minSum: Number(selected.get('minSum'))
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
                                Ext.getStore('apiPaymentTypeStore').reload()
                                ExtMessages.topToast('Тип оплаты удален')
                                ExtUtil.referenceQuery('apiRequisitesPanel').setDefaultMask()
                                ExtUtil.referenceQuery('apiClientsPanel').setDefaultMask()
                                ExtUtil.maskOff('paymentTypesGrid')
                            }
                        })
                    })
            }
        }
    ]
})