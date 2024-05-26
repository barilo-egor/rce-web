Ext.define('Dashboard.view.deal.bot.FilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'filterpanel',
    title: 'Фильтрация',
    collapsible: {
        direction: 'top',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    collapsed: false,
    titleCollapse: false,
    shadow: true,
    margin: '10 5 5 10',
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
            defaults: {
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 20 0 20'
                }
            },
            items: [
                {
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Chat id',
                            reference: 'chatIdFilterField'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Username',
                            reference: 'usernameFilterField'
                        },
                        {
                            xtype: 'daterange',
                            margin: '0 20 15 20',
                            viewModel: {
                                data: {
                                    label: 'Дата сделки'
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: 'Время сделки'
                        }
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Фиат'
                        },
                        {
                            xtype: 'numberfield',
                            label: 'Фиат сумма'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Криптовалюта'
                        },
                        {
                            xtype: 'numberfield',
                            label: 'Сумма в крипте'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Реквизит'
                        }
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Тип сделки'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Статус'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Тип оплаты'
                        },
                        {
                            xtype: 'combobox',
                            label: 'Доставка'
                        },
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Искать'
        }
    ]
})