Ext.define('Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'securepaymentdetailsgridmenu',

    items: [
        {
            text: 'Редактировать',
            iconCls: 'x-fa fa-pen',
            handler: function (me) {
                let selected = ExtUtil.referenceQuery('securePaymentDetailsGrid').getSelectedRec()
                Ext.create('Dashboard.view.paymentTypes.bot.details.CreateSecurePaymentDetailsDialog', {
                    viewModel: {
                        data: {
                            title: 'Редактирование защитного реквизита',
                            pid: selected.get('pid'),
                            minDealCount: selected.get('minDealCount'),
                            details: selected.get('details')
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
                let selectedRec = ExtUtil.referenceQuery('securePaymentDetailsGrid').getSelectedRec()
                let minDealCount = selectedRec.get('minDealCount')
                let recs = Ext.getStore('securePaymentDetailsStore').getRange().filter(rec => rec.get('minDealCount') > minDealCount)
                if (recs.length > 0) {
                    ExtMessages.info('Внимание', 'Для удаления этого реквизита первоначально удалите реквизиты, у которых количество сделок больше.')
                    return
                }
                ExtUtil.mask('securePaymentDetailsGrid')
                let url = '/paymentTypes/bot/securePaymentDetails/' + selectedRec.get('pid')
                RequestUtil.request({
                    url: url,
                    method: 'DELETE',
                    masked: 'securePaymentDetailsGrid',
                    success: function () {
                        Ext.getStore('securePaymentDetailsStore').reload()
                        ExtMessages.topToast('Защитный реквизит удален')
                        ExtUtil.maskOff('securePaymentDetailsGrid')
                    }
                })
            }
        }
    ]
})