Ext.define('Dashboard.store.deal.api.CalculationsStore', {
    extend: 'Ext.data.TreeStore',
    storeId: 'calculationsStore',

    autoLoad: false,
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: '/users/api/getCalculations',
        reader: {
            type: 'json',
            rootProperty: 'children'
        }
    },
    listeners: {
        beforeload: function (me, operation) {
            operation.setParams({
                apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
            })
        }
    },
    root: {
        text: 'root',
        rootVisible: false,
        iconCls: 'none'
    }
});