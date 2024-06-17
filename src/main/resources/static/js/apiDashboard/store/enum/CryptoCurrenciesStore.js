Ext.define('ApiDashboard.store.enum.CryptoCurrenciesStore', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptoCurrenciesStore',
    storeId: 'cryptoCurrenciesStore',
    fields: ['name', 'shortName'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/enum/cryptoCurrencies',
        reader: {
            type: 'json',
            rootProperty: 'body.data'
        }
    }
});