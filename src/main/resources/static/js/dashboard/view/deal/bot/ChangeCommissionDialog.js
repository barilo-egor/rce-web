Ext.define('Dashboard.view.deal.bot.ChangeCommissionDialog', {
    extend: 'Ext.Dialog',
    reference: 'changeWalletDialog',

    title: 'Обновление комиссии',
    closable: true,

    items: [
        {
            xtype: 'numberfield',
            label: 'Новое значение',
            reference: 'newCommissionValue',
            margin: '0 20 5 20',
            bind: {
                value: '{value}'
            }
        },
        {
            xtype: 'button',
            text: 'Обновить',
            handler: function (me) {
                ExtUtil.mask('changeWalletDialog', 'Обновление комиссии')
                let newValue = ExtUtil.referenceQuery('newCommissionValue').getValue()
                let currency = me.up('dialog').getViewModel().getData().cryptoCurrency
                ExtUtil.mRequest({
                    url: '/deal/bot/updateFeeRate/' + currency,
                    method: 'POST',
                    params: {
                        newValue: newValue
                    },
                    loadingComponentRef: 'changeWalletDialog',
                    success: function (response) {
                        ExtUtil.referenceQuery('bitcoinCommissionField').reload()
                        ExtMessages.topToast('Комиисия ' + currency + ' обновлена.')
                        me.up('dialog').close()
                    }
                })
            }
        }
    ]
});