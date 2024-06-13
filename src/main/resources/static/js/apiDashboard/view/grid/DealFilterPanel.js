Ext.define('ApiDashboard.view.grid.DealFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'dealfilterpanel',

    shadow: true,
    padding: '20 20 20 20',

    items: [
        {
            xtype: 'textfield',
            label: 'Номер заявки',
            reference: 'pidFilterField',
        },
        {
            xtype: 'daterange',
            reference: 'dateFilterField'
        },
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
            reference: 'cryptoCurrencyFilterField'
        },
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
            reference: 'dealTypeFilterField'
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
            reference: 'dealStatusFilterField'
        }
    ]
})