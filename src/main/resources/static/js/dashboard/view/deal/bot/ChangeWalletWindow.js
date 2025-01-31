Ext.define('Dashboard.view.deal.bot.ChangeWalletWindow', {
    extend: 'Ext.Dialog',
    reference: 'changeWalletWindow',

    bind: {
        title: '{title}'
    },

    minWidth: 600,
    closable: true,

    buttons: [
        {
            text: 'Заменить',
            handler: function (me) {
                let window = me.up('window')
                ExtUtil.mask('changeWalletWindow', 'Замена кошелька')
                let seedPhrase = ExtUtil.referenceQuery('seedPhraseField').getValue()
                if (!seedPhrase || seedPhrase.length === 0) {
                    ExtMessages.topToast('Введите сид фразу.')
                    return
                }
                ExtUtil.mRequest({
                    url: '/deal/bot/changeWallet',
                    params: {
                        cryptoCurrency: window.getViewModel().getData().cryptoCurrency,
                        seedPhrase: seedPhrase
                    },
                    loadingComponentRef: 'changeWalletWindow',
                    success: function (response) {
                        if (response.data === true) {
                            window.close()
                            ExtMessages.topToast('Кошелек успешно заменен.')
                            ExtUtil.referenceQuery('litecoinBalanceField').reload()
                            ExtUtil.referenceQuery('bitcoinBalanceField').reload()
                        }
                    }
                })
            }
        }
    ],

    layout: 'fit',
    items: [
        {
            xtype: 'container',

            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                {
                    xtype: 'textfield',
                    reference: 'seedPhraseField',
                    label: 'Сид фраза',
                    inputType: 'password',
                    width: '90%'
                }
            ]
        }
    ]
})