Ext.define('ApiDashboard.view.grid.DealController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dealController',

    loadFirstPage: function() {
        Ext.getStore('dealStore').loadPage(1)
    },

    checkTie: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/deal/checkTie',
            method: 'GET',
            success: function (response) {
                me.getStore().load()
            }
        })
    },

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
    },

    openGridMenu: function (me, eObj) {
        me.deselectAll();
        me.setSelection(eObj.record);
        if (!me.menu) {
            me.menu = Ext.create('ApiDashboard.view.grid.DealGridMenu')
        }
        me.menu.setViewModel({
            data: {
                deal: eObj.record
            }
        })
        me.menu.showAt(eObj.event.getX(), eObj.event.getY());
        eObj.event.stopEvent()
    },

    reloadDeals: function (me) {
        Ext.getStore('dealStore').reload()
    }
})