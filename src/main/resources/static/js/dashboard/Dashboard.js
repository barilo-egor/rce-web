Ext.application({
    extend: 'Ext.app.Application',
    name: 'Dashboard',
    requires: [
        'Dashboard.view.main.DashboardContainer'
    ],

    appFolder: '/js/dashboard',

    viewport: {
        layout: 'fit',
        items: [
            {
                xtype: 'dashboardcontainer'
            }
        ]
    },
    stores: [
        'Dashboard.store.enum.FiatCurrenciesStore',
        'Dashboard.store.enum.CryptoCurrenciesStore',
        'Dashboard.store.enum.DealTypesStore',
        'Dashboard.store.enum.DealStatusesStore',
        'Dashboard.store.enum.DeliveryTypesStore',
        'Dashboard.store.deal.bot.PaymentTypesComboStore',
        'Dashboard.store.enum.ApiDealStatusesStore',
        'Dashboard.store.enum.RoleStore',
        'Dashboard.store.deal.api.CalculationsStore',
        'Dashboard.store.paymentTypes.api.ApiPaymentTypeStore',
        'Dashboard.store.paymentTypes.api.ApiClientStore',
        'Dashboard.store.paymentTypes.api.RequisiteStore',
        'Dashboard.store.deal.review.ReviewStore'
    ]
})