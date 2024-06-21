Ext.application({
    extend: 'Ext.app.Application',
    name: 'ApiDashboard',
    requires: [
        'ApiDashboard.view.MainContainer'
    ],

    appFolder: '/js/apiDashboard',

    viewport: {
        layout: 'fit',
        items: [
            {
                xtype: 'maincontainer'
            }
        ]
    },
    stores: [
        'ApiDashboard.store.enum.FiatCurrenciesStore',
        'ApiDashboard.store.enum.CryptoCurrenciesStore',
        'ApiDashboard.store.enum.DealTypesStore',
        'ApiDashboard.store.enum.ApiDealStatusesStore',
        'ApiDashboard.store.CalculationsStore'
    ]
})