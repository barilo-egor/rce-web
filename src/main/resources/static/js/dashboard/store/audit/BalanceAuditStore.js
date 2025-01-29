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
    }
})