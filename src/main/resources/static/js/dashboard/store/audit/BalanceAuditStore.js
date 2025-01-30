Ext.define('Dashboard.store.audit.BalanceAuditStore', {
    extend: 'Ext.data.Store',
    storeId: VARS.STORE_IDS.BALANCE_AUDIT_STORE,
    autoLoad: false,
    remoteSort: true,
    pageSize: 50,
    proxy: {
        type: 'ajax',
        url: '/audit/balance',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    listeners: {
        beforeload: function (me, operation) {
            let form = ExtUtil.referenceQuery('balanceAuditSearchForm')
            let params = {}
            params.targetChatId = form.items.items[0].getValue()
            params.initiatorChatId = form.items.items[1].getValue()

            operation.setParams(params)
        }
    }
})