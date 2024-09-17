Ext.define('Dashboard.view.paymentTypes.api.requisite.ApiRequisitesPanel', {
    extend: 'Ext.Panel',
    xtype: 'apirequisitespanel',
    reference: 'apiRequisitesPanel',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.ApiRequisiteController'
    ],
    controller: 'apiRequisiteController',

    title: 'Реквизиты',
    setDefaultMask: function () {
        Ext.getStore('apiRequisiteStore').removeAll()
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
            store: 'apiRequisiteStore',

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
            getCommentOfSelected: function () {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('comment')
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
                    flex: 0.6,
                    menuDisabled: true
                },
                {
                    text: 'Примечание',
                    dataIndex: 'comment',
                    flex: 0.4
                }
            ]
        },
    ]
})