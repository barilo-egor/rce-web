Ext.define('Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsPanel', {
    extend: 'Ext.Panel',
    xtype: 'securepaymentdetailspanel',
    requires: [
        'Dashboard.view.paymentTypes.bot.details.SecurePaymentDetailsController',
        'Dashboard.view.paymentTypes.bot.details.CreateSecurePaymentDetailsDialog'
    ],
    controller: 'securePaymentDetailsController',

    title: 'Защитные реквизиты',
    shadow: true,

    layout: 'fit',
    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    iconCls: 'x-fa fa-plus forestgreenColor',
                    tooltip: 'Добавить реквизит',
                    handler: 'createDialog'
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'securePaymentDetailsGrid',
            store: 'securePaymentDetailsStore',

            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
                }
                return null
            },
            getSelectedRec: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection
                }
                return null
            },

            listeners: {
                painted: function (me) {
                    me.getStore().load()
                },
                childcontextmenu: 'openGridMenu',
            },

            columns: [
                {
                    text: 'Кол-во сделок',
                    dataIndex: 'minDealCount',
                    width: 120
                },
                {
                    text: 'Фиат',
                    dataIndex: 'fiatCurrency',
                    width: 120,
                    renderer: function (val) {
                        return val.displayName
                    }
                },
                {
                    flex: 1,
                    text: 'Реквизит',
                    dataIndex: 'details'
                }
            ]
        }
    ]
})