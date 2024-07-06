Ext.define('Dashboard.view.deal.api.ApiDealsFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'apidealsfilterpanel',
    requires: [
        'Dashboard.view.deal.api.ApiDealsController'
    ],
    controller: 'apiDealsController',

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
                            reference: 'pidFilterField',
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
                    defaults: {
                        xtype: 'combobox',
                        editable: false,
                        clearable: true,
                        valueField: 'name',
                    },
                    items: [
                        {
                            label: 'Фиатная валюта',
                            displayField: 'code',
                            store: {
                                type: 'fiatCurrenciesStore'
                            },
                            reference: 'fiatCurrencyFilterField',
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
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Статус',
                            displayField: 'description',
                            editable: false,
                            clearable: true,
                            valueField: 'name',
                            store: {
                                type: 'apiDealStatusesStore'
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