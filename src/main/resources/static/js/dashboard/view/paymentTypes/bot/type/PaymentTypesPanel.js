Ext.define('Dashboard.view.paymentTypes.bot.type.PaymentTypesPanel', {
    extend: 'Ext.Panel',
    xtype: 'paymenttypespanel',

    title: 'Типы оплат',
    shadow: true,

    layout: 'fit',
    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    iconCls: 'x-fa fa-plus forestgreenColor',
                    tooltip: 'Добавить тип оплаты'
                }
            ]
        },
        {
            xtype: 'grid',
            store: 'paymentTypeStore',

            listeners: {
                painted: function (me) {
                    me.getStore().load()
                }
            },

            columns: [
                {
                    xtype: 'checkcolumn',
                    text: '<i class="fas fa-power-off"></i>',
                    width: '30',
                    dataIndex: 'on',
                    menuDisabled: true
                },
                {
                    flex: 1,
                    text: 'Наименование',
                    dataIndex: 'name',
                    menuDisabled: true
                },
                {
                    width: 180,
                    text: 'Минимальная сумма',
                    dataIndex: 'minSum',
                    menuDisabled: true
                },
                {
                    width: 180,
                    text: 'Фиатная валюта',
                    dataIndex: 'fiatCurrency',
                    menuDisabled: true,
                    renderer: function (data) {
                        return data.name
                    }
                },
            ]
        }
    ]
})