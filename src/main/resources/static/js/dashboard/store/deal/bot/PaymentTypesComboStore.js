Ext.define('Dashboard.store.deal.bot.PaymentTypesComboStore', {
    extend: 'Ext.data.Store',
    alias: 'store.paymentTypesComboStore',
    storeId: 'paymentTypesComboStore',
    fields: ['name', 'pid', 'dealType'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/deal/bot/paymentTypes/combo',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});