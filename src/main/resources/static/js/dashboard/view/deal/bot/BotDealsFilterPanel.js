Ext.define('Dashboard.view.deal.bot.BotDealsFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'botdealsfilterpanel',
    requires: [
        'Dashboard.view.deal.bot.BotDealsController'
    ],
    controller: 'botDealsController',

    title: 'Фильтрация',
    collapsible: ExtUtilConfig.getCollapsible('top'),
    collapsed: true,
    titleCollapse: false,
    shadow: true,
    margin: '10 5 5 10',
    padding: '5 5 5 5',

    layout: {
        type: 'vbox',
        align: 'center'
    },
    defaults: {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
    },
    items: [
        {
            width: '100%',
            defaults: {
                flex: 1,
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            },
            items: [
                {
                    defaults: {
                        margin: '0 20 0 20'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Chat id',
                            reference: 'chatIdFilterField',
                            decimals: 0
                        },
                        {
                            xtype: 'textfield',
                            label: 'Username',
                            reference: 'usernameFilterField'
                        },
                        {
                            xtype: 'daterange',
                            margin: '0 20 15 20',
                            reference: 'dateFilterField'
                        },
                        {
                            xtype: 'textfield',
                            label: 'Реквизит',
                            reference: 'requisiteFilterField'
                        }
                    ]
                },
                {
                    defaults: {
                        xtype: 'combobox',
                        margin: '0 20 0 20',
                        editable: false,
                        clearable: true,
                        valueField: 'name'
                    },
                    items: [
                        {
                            label: 'Фиатная валюта',
                            displayField: 'code',
                            store: {
                                type: 'fiatCurrenciesStore'
                            },
                            reference: 'fiatCurrencyFilterField'
                        },
                        {
                            label: 'Криптовалюта',
                            displayField: 'shortName',
                            store: {
                                type: 'cryptoCurrenciesStore'
                            },
                            reference: 'cryptoCurrencyFilterField'
                        },
                        {
                            label: 'Тип сделки',
                            displayField: 'nominative',
                            store: {
                                type: 'dealTypesStore'
                            },
                            reference: 'dealTypeFilterField'
                        },
                    ]
                },
                {
                    defaults: {
                        xtype: 'combobox',
                        margin: '0 20 0 20',
                        editable: false,
                        clearable: true,
                    },
                    items: [
                        {
                            label: 'Статус',
                            displayField: 'displayName',
                            valueField: 'name',
                            store: {
                                type: 'dealStatusesStore'
                            },
                            reference: 'dealStatusFilterField'
                        },
                        {
                            label: 'Доставка',
                            displayField: 'displayName',
                            valueField: 'name',
                            store: {
                                type: 'deliveryTypesStore'
                            },
                            reference: 'deliveryTypeFilterField'
                        },
                        {
                            label: 'Тип оплаты',
                            displayField: 'name',
                            valueField: 'pid',
                            store: {
                                type: 'paymentTypesComboStore'
                            },
                            reference: 'paymentTypeFilterField'
                        },
                    ]
                }
            ]
        },
        {
            defaults: {
                xtype: 'button',
                margin: '20 0 0 0',
            },
            items: [
                {
                    text: 'Искать',
                    handler: 'search'
                },
                {
                    text: 'Очистить форму поиска',
                    handler: 'clearFilterForm'
                }
            ]
        }
    ]
})