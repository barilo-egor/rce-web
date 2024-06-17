Ext.define('ApiDashboard.view.grid.DealController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dealController',

    exportDeals: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/deal/beforeExport',
            jsonData: Ext.getStore('dealStore').getFiltersFromPanel(),
            success: function (response) {
                if (response.body.data.success) {
                    window.open('/dashboard/api/deal/export')
                } else {
                    ExtMessages.topToast('Ошибка при экспорте сделок.')
                }
            }
        })
    }
})