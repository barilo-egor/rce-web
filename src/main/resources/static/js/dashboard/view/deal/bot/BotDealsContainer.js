Ext.define('Dashboard.view.deal.bot.BotDealsContainer', {
    extend: 'Ext.Container',
    xtype: 'botdealscontainer',
    requires: [
        'Dashboard.view.deal.bot.DealInfoPanel'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    title: 'Фильтрация',
                    collapsed: true,
                    shadow: true,
                    tools: [
                        {
                            type: 'down'
                        }
                    ],
                    margin: '10 10 10 10',
                    padding: '5 5 5 5',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    flex: 1,
                                    xtype: 'container',
                                    layout: {
                                        type: 'vbox',
                                        align: 'center'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            label: 'Chat id'
                                        },
                                        {
                                            xtype: 'datefield',
                                            label: 'Дата сделки'
                                        }
                                    ]
                                },
                                {
                                    flex: 1,
                                    xtype: 'container',
                                    layout: {
                                        type: 'vbox',
                                        align: 'center'
                                    },
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            label: 'Тип сделки'
                                        },
                                        {
                                            xtype: 'combobox',
                                            label: 'Фиат'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Искать'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    shadow: true,
                    margin: '10 10 10 10',
                    layout: 'fit',
                    tbar: {
                        items: [
                            {
                                iconCls: 'x-fa fa-file-excel darkGreen'
                            }
                        ]
                    },
                    items: [
                        {
                            xtype: 'grid',
                            columns: [
                                {
                                    text: 'Статус'
                                },
                                {
                                    text: 'Тип оплаты'
                                },
                                {
                                    text: 'Тип сделки'
                                },
                                {
                                    text: 'Сумма в крипте'
                                },
                                {
                                    text: 'Фиат сумма'
                                },
                                {
                                    text: 'Доставка'
                                },
                                {
                                    text: 'Дата'
                                },
                                {
                                    text: 'Время'
                                },
                                {
                                    text: 'Реквизит'
                                },
                                {
                                    text: 'Chat id'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'dealinfopanel',
            shadow: true,
            margin: '10 10 10 10'
        }
    ]
})