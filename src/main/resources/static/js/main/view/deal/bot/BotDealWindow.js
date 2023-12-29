Ext.define('Main.view.deal.bot.BotDealWindow', {
    extend: 'Ext.window.Window',
    id: 'botDealWindow',
    requires: ['Main.view.deal.bot.BotDealsController'],
    controller: 'botDealsController',
    width: '95%',
    height: '95%',
    bind: {
        title: 'Сделка №{deal.pid} на {deal.dealType.genitive}'
    },
    autoShow: true,
    modal: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 0.9,
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '20 20 20 20',
            defaults: {
                xtype: 'displayfield',
                labelStyle: 'font-weight:bold',
                labelWidth: 180
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
                    fieldLabel: 'Способ доставки',
                    bind: {
                        value: '{deal.deliveryType.displayName}'
                    }
                },
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.9,
                            xtype: 'displayfield',
                            fieldLabel: 'Реквизиты пользователя',
                            id: 'userRequisitesField',
                            labelStyle: 'font-weight:bold',
                            labelWidth: 180,
                            bind: {
                                value: '{deal.requisite}'
                            }
                        },
                        {
                            flex: 0.1,
                            xtype: 'container',
                            margin: '5 0 0 5',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'fas fa-copy noColorBtn',
                                    cls: 'noColorBtn',
                                    handler: 'copyRequisites'
                                }
                            ]
                        }
                    ]
                },
                {
                    fieldLabel: 'Контакт',
                    listeners: {
                        afterrender: 'buildContact'
                    },
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
                        value: '{deal.dealStatus.displayName}'
                    }
                },
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 0.8,
                            xtype: 'displayfield',
                            id: 'chatIdField',
                            labelStyle: 'font-weight:bold',
                            labelWidth: 180,
                            fieldLabel: 'ID',
                            bind: {
                                value: '{deal.chatId}'
                            }
                        },
                        {
                            flex: 0.2,
                            xtype: 'container',
                            margin: '5 0 0 5',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'fas fa-copy noColorBtn',
                                    margin: '0 5 0 0',
                                    cls: 'noColorBtn',
                                    handler: 'copyChatId'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'fas fa-paper-plane noColorBtn',
                                    cls: 'noColorBtn',
                                    handler: 'sendMessageWindow'
                                }
                            ]
                        },
                    ]
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
                },
                {
                    xtype: 'panel',
                    margin: '0 20 0 20',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        xtype: 'button',
                        margin: '10 0 0 0'
                    },
                    hidden: true,
                    bind: {
                        hidden: '{deal.dealStatus.name === "CONFIRMED"}'
                    },
                    items: [
                        {
                            text: 'Показать чек',
                            cls: 'blueButton',
                            handler: 'showCheck'
                        },
                        {
                            text: 'Подтвердить',
                            handler: 'confirmDeal',
                            cls: 'greenBtn'
                        },
                        {
                            text: 'Запросить верификацию',
                            cls: 'blueButton',
                            bind: {
                                hidden: '{deal.dealStatus.name !== "PAID"}'
                            },
                            handler: 'askVerification'
                        },
                        {
                            xtype: 'button',
                            text: 'Показать верификацию',
                            handler: 'showVerification',
                            bind: {
                                hidden: '{deal.dealStatus.name !== "VERIFICATION_RECEIVED"}'
                            },
                            cls: 'blueButton'
                        },
                        {
                            text: 'Удалить',
                            cls: 'redButton',
                            handler: 'deleteDealWindow'
                        }
                    ]
                }
            ]
        }
    ]
})