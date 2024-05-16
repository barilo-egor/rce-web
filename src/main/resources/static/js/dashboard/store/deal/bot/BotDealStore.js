Ext.define('Dashboard.store.deal.bot.BotDealStore', {
    extend: 'Ext.data.Store',
    storeId: 'botDealStore',
    autoLoad: true,
    pageSize: 20,
    fields: ['pid', 'dealStatus', 'chatId', 'paymentType'],
    proxy: {
        type: 'ajax',
        url: '/deal/bot/findAll',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
})