Ext.define('Dashboard.view.deal.api.ApiDealsFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'apidealsfilterpanel',
    requires: [
        'Dashboard.view.deal.api.ApiDealsController'
    ],
    controller: 'apiDealsController',

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
                            xtype: 'textfield',
                            label: 'Номер заявки',
                            reference: 'pidFilterField'
                        },
                        {
                            xtype: 'textfield',
                            label: 'ID клиента',
                            reference: 'apiUserIdFilterField'
                        },
                        {
                            xtype: 'daterange',
                            margin: '0 20 15 20',
                            reference: 'dateFilterField'
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
                            xtype: 'textfield',
                            label: 'Реквизит',
                            reference: 'requisiteFilterField'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'button',
            margin: '20 0 0 0',
            text: 'Искать',
            handler: 'search'
        }
    ]
})