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

            }
        },
        {
            text: 'Удалить',
            reference: 'deleteMenuButton',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {

            }
        }
    ]
})