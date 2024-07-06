Ext.define('ApiDashboard.store.enum.FiatCurrenciesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.fiatCurrenciesStore',
    storeId: 'fiatCurrenciesStore',
    fields: [
        'name', 'code', 'displayName', 'genitive', 'flag'
    ],
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