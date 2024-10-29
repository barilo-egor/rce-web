Ext.define('Dashboard.store.deal.bot.BitcoinPoolStore', {
    extend: 'Ext.data.Store',
    storeId: 'bitcoinPoolStore',
    autoLoad: true,
    pageSize: 0,
    listeners: {
        load: function (me, records) {
            ExtUtil.referenceQuery('bitcoinPoolButton').setBadgeText(records.length)
        }
    },
    proxy: {
        type: 'ajax',
        url: '/deal/bot/poolDeals?cryptoCurrency=BITCOIN',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});