Ext.define('Dashboard.view.deal.bot.BotDealsFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'botdealsfilterpanel',
    requires: [
        'Dashboard.view.deal.bot.BotDealsController'
    ],
    controller: 'botDealsController',

    title: 'Фильтрация',
    collapsible: {
        direction: 'top',
        expandToolText: 'Развернуть',
        collapseToolText: 'Свернуть'
    },
    collapsed: true,
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
                            },
                            reference: 'fiatCurrencyFilterField'
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
                            },
                            reference: 'cryptoCurrencyFilterField'
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
                            },
                            reference: 'dealTypeFilterField'
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
                            },
                            reference: 'dealStatusFilterField'
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
                            },
                            reference: 'deliveryTypeFilterField'
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
                            },
                            reference: 'paymentTypeFilterField'
                        },
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'button',
                    margin: '20 0 0 0',
                    text: 'Искать',
                    handler: 'search'
                },
                {
                    xtype: 'button',
                    margin: '20 0 0 0',
                    text: 'Очистить форму поиска',
                    handler: 'clearFilterForm'
                }
            ]
        }
    ]
})