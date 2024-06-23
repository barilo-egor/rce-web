Ext.define('ApiDashboard.view.statistic.DealStatisticController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dealStatisticController',

    load: function (me) {
        Ext.getStore('statisticStore').load({
            params: ExtUtil.referenceQuery('statisticDateRange').getValue()
        })
    }
})