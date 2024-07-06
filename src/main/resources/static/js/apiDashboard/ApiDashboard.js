Ext.Ajax.on('requestexception', function(conn, response, options) {
    if (response.status === 401) {
        ExtMessages.error('Сессия завершена', 'Ваша сессия истекла. Пожалуйста, войдите снова.',
            function () {
                window.location.href = '/';
            })
    }
});
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