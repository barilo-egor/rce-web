Ext.define('Dashboard.store.paymentTypes.api.PaymentTypeStore', {
    extend: 'Ext.data.Store',
    storeId: 'paymentTypeStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/paymentTypes/api',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    listeners: {
        load: function (store) {
            let paymentTypePid = ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
            if (paymentTypePid) {
                Ext.getStore('apiClientStore').load({
                    params: {
                        paymentTypePid: paymentTypePid
                    }
                })
                Ext.getStore('requisiteStore').load({
                    params: {
                        paymentTypePid: paymentTypePid
                    }
                })
            }
        }
    }
});