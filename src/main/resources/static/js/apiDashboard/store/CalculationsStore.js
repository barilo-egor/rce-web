Ext.define('ApiDashboard.store.CalculationsStore', {
    extend: 'Ext.data.TreeStore',
    storeId: 'calculationsStore',

    autoLoad: false,
    pageSize: 4,
    proxy: {
        type: 'ajax',
        url: '/dashboard/api/calculation/getCalculations',
        reader: {
            type: 'json',
            rootProperty: 'children'
        }
    },
    root: {
        text: 'root',
        rootVisible: false,
        iconCls: 'none'
    }
});