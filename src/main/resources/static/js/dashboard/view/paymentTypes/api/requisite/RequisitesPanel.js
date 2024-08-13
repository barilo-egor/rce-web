Ext.define('Dashboard.view.paymentTypes.api.requisite.RequisitesPanel', {
    extend: 'Ext.Panel',
    xtype: 'requisitespanel',
    reference: 'requisitesPanel',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.RequisiteController'
    ],
    controller: 'requisiteController',

    title: 'Реквизиты',
    setDefaultMask: function () {
        Ext.getStore('requisiteStore').removeAll()
        this.setMasked({
            xtype: 'loadmask',
            message: 'Выберите тип оплаты',
            indicator: false,
            style: {
                opacity: 0.5
            }
        })
    },

    listeners: {
        painted: 'setMask'
    },

    tbar: {
        items: [
            {
                iconCls: 'x-fa fa-plus forestgreenColor',
                tooltip: 'Добавить реквизит',
                handler: 'createRequisiteDialog'
            }
        ]
    },

    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            reference: 'apiRequisitesGrid',
            store: 'requisiteStore',

            listeners: {
                childcontextmenu: 'openGridMenu',
            },

            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
                }
                return null
            },
            getRequisiteOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('requisite')
                }
                return null
            },

            columns: [
                {
                    xtype: 'checkcolumn',
                    width: '30',
                    text: '<i class="fas fa-power-off"></i>',
                    dataIndex: 'isOn',
                    menuDisabled: true,
                    listeners: {
                        checkchange: 'turnRequisite'
                    }
                },
                {
                    text: 'Реквизит',
                    dataIndex: 'requisite',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        },
    ]
})