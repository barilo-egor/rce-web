Ext.define('ApiDashboard.view.grid.DealFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'dealfilterpanel',
    reference: 'dealFilterPanel',

    shadow: true,
    header: false,
    collapsible: {
        direction: 'top',
        tool: null
    },

    padding: '0 20 30 20',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'container',
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },
    items: [
        {
            items: [
                {
                    xtype: 'textfield',
                    label: 'Номер заявки',
                    reference: 'pidFilterField',
                    margin: '0 20 0 20'
                },
                {
                    xtype: 'daterange',
                    reference: 'dateFilterField',
                    margin: '0 20 0 20'
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Фиатная валюта',
                    displayField: 'code',
                    // store: {
                    //     type: 'fiatCurrenciesStore'
                    // },
                    reference: 'fiatCurrencyFilterField',
                    margin: '0 20 0 20'
                },
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Криптовалюта',
                    displayField: 'shortName',
                    // store: {
                    //     type: 'cryptoCurrenciesStore'
                    // },
                    reference: 'cryptoCurrencyFilterField',
                    margin: '0 20 0 20'
                },
            ]
        },
        {
            items: [
                {
                    xtype: 'combobox',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    label: 'Тип сделки',
                    displayField: 'nominative',
                    // store: {
                    //     type: 'dealTypesStore'
                    // },
                    reference: 'dealTypeFilterField',
                    margin: '0 20 0 20'
                },
                {
                    xtype: 'combobox',
                    label: 'Статус',
                    displayField: 'description',
                    editable: false,
                    clearable: true,
                    valueField: 'name',
                    // store: {
                    //     type: 'apiDealStatusesStore'
                    // },
                    reference: 'dealStatusFilterField',
                    margin: '0 20 0 20'
                }
            ]
        }
    ]
})