Ext.define('Main.view.deal.bot.BotDealWindow', {
    extend: 'Ext.window.Window',
    width: '95%',
    height: '95%',
    bind: {
        title: 'Сделка №{deal.pid} на {deal.dealType.genitive}'
    },
    autoShow: true,
    modal: true,
    layout: 'fit',
    items: [
        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '20 20 20 20',
            defaults: {
                xtype: 'displayfield',
                labelStyle: 'font-weight:bold',
                labelWidth: 200,
            },
            items: [
                {
                    fieldLabel: 'Дата, время',
                    bind: {
                        value: '{deal.dateTime}'
                    }
                },
                {
                    fieldLabel: 'Тип оплаты',
                    bind: {
                        value: '{deal.paymentType}'
                    }
                },
                {
                    fieldLabel: 'Реквизиты пользователя',
                    id: 'userRequisitesField',
                    bind: {
                        value: '{deal.requisite}'
                    }
                },
                {
                    xtype: 'container',
                    margin: '0 0 10 0',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Скопировать реквизиты',
                            cls: 'blueButton',
                            handler: function (btn) {
                                navigator.clipboard.writeText(ExtUtil.idQuery('userRequisitesField').getValue())
                                Ext.toast('Реквизиты скопированы в буфер обмена.')
                            }
                        },
                    ]
                },
                {
                    fieldLabel: 'Контакт',
                    bind: {
                        value: '{deal.username}'
                    }
                },
                {
                    fieldLabel: 'Количество сделок',
                    bind: {
                        value: '{deal.dealsCount}'
                    }
                },
                {
                    fieldLabel: 'Статус',
                    bind: {
                        value: '{deal.dealStatus}'
                    }
                },
                {
                    fieldLabel: 'ID',
                    bind: {
                        value: '{deal.chatId}'
                    }
                },
                {
                    bind: {
                        fieldLabel: 'Сумма крипто',
                        value: '{deal.amountCrypto} {deal.cryptoCurrency}'
                    }
                },
                {
                    bind: {
                        fieldLabel: 'Сумма фиат',
                        value: '{deal.amountFiat} {deal.fiatCurrency}'
                    }
                }
            ]
        }
    ]
})