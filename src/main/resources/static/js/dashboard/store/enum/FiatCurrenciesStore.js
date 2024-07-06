Ext.define('Dashboard.store.enum.FiatCurrenciesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.fiatCurrenciesStore',
    storeId: 'fiatCurrenciesStore',
    model: 'Dashboard.model.enum.FiatCurrency',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/fiatCurrencies',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});