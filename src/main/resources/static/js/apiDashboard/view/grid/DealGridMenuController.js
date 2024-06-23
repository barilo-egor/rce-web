Ext.define('ApiDashboard.view.grid.DealGridMenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dealGridMenuController',

    updateDisabled: function (me) {
        let deal = me.getViewModel().getData().deal.getData()
        let status = deal.apiDealStatus.name
        ExtUtil.referenceQuery('cancelMenuButton').setDisabled(status !== 'PAID')
        ExtUtil.referenceQuery('deleteMenuButton').setDisabled(status !== 'CREATED')
    },

    cancelHandler: function (me) {
        let dealPid = me.up('menu').getViewModel().getData().deal.getData().pid
        ExtMessages.confirm('Отмена сделки №' + dealPid, 'Вы действительно хотите отменить сделку?',
            function () {
                ExtUtil.mask('dealGrid', 'Отмена сделки')
                ExtUtil.mRequest({
                    url: '/dashboard/api/deal/cancel',
                    params: {
                        dealPid: dealPid
                    },
                    success: function (response) {
                        Ext.getStore('dealStore').reload()
                        ExtUtil.maskOff('dealGrid')
                    }
                })
            })
    },

    deleteHandler: function (me) {
        ExtMessages.confirm('Удаление сделки №' + dealPid, 'Вы действительно хотите удалить сделку?',
            function () {
                ExtUtil.mask('dealGrid', 'Удаление сделки')
                ExtUtil.mRequest({
                    url: '/dashboard/api/deal/delete',
                    params: {
                        dealPid: me.up('menu').getViewModel().getData().deal.getData().pid
                    },
                    success: function (response) {
                        Ext.getStore('dealStore').reload()
                        ExtUtil.maskOff('dealGrid')
                    }
                })
            })
    }
})