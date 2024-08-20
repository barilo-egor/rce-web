Ext.define('Dashboard.store.paymentTypes.api.ApiPaymentTypeStore', {
    extend: 'Ext.data.Store',
    storeId: 'apiPaymentTypeStore',
    autoLoad: false,
    pageSize: 0,
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
            } else {
                ExtUtil.referenceQuery('apiRequisitesPanel').setDefaultMask()
                ExtUtil.referenceQuery('apiClientsPanel').setDefaultMask()
            }
        }
    }
});