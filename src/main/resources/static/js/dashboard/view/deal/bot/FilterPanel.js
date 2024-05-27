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
                            margin: '0 20 15 20'
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
                            label: 'Фиатная валюта',
                            displayField: 'code',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'fiatCurrenciesStore'
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'Криптовалюта',
                            displayField: 'shortName',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'cryptoCurrenciesStore'
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'Тип сделки',
                            displayField: 'nominative',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'dealTypesStore'
                            }
                        },
                    ]
                },
                {
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Статус',
                            displayField: 'displayName',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'dealStatusesStore'
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'Доставка',
                            displayField: 'displayName',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'deliveryTypesStore'
                            }
                        },
                        {
                            xtype: 'combobox',
                            label: 'Тип оплаты',
                            displayField: 'name',
                            editable: false,
                            clearable: true,
                            valueField: 'pid',
                            store: {
                                type: 'paymentTypesComboStore'
                            }
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