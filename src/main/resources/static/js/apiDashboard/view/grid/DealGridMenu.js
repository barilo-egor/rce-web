Ext.define('ApiDashboard.view.grid.DealGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'dealgridmenu',

    listeners: {
        beforeshow: function (me) {
            let deal = me.getViewModel().getData().deal.getData()
            let status = deal.apiDealStatus.name
            ExtUtil.referenceQuery('cancelMenuButton').setDisabled(status !== 'PAID')
            ExtUtil.referenceQuery('deleteMenuButton').setDisabled(status !== 'CREATED')
        }
    },

    items: [
        {
            text: 'Отменить',
            reference: 'cancelMenuButton',
            iconCls: 'x-fa fa-ban orangeColor',
            handler: function (me) {
                let dealPid = me.up('menu').getViewModel().getData().deal.getData().pid
                ExtMessages.confirm('Отмена сделки №', 'Вы действительно хотите отменить сделку?',
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
            }
        },
        {
            text: 'Удалить',
            reference: 'deleteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                ExtMessages.confirm('Удаление сделки №', 'Вы действительно хотите удалить сделку?',
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
        }
    ]
})