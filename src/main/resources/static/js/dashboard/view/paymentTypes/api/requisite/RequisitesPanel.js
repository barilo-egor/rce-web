Ext.define('Dashboard.view.paymentTypes.api.requisite.RequisitesPanel', {
    extend: 'Ext.Panel',
    xtype: 'requisitespanel',
    reference: 'requisitesPanel',

    title: 'Реквизиты',
    masked: {
        xtype: 'loadmask',
        message: 'Выберите тип оплаты',
        indicator: false,
        style: {
            opacity: 0.5
        }
    },

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавить реквизит'
            },
            '->',
            {
                iconCls: 'x-fa fa-question',
                tooltip: 'Помощь',
                handler: function (me) {

                }
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            columns: [
                {
                    text: 'Реквизит',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        },
    ]
})