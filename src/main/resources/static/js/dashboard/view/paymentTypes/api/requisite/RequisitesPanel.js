Ext.define('Dashboard.view.paymentTypes.api.requisite.RequisitesPanel', {
    extend: 'Ext.Panel',
    xtype: 'requisitespanel',
    reference: 'requisitesPanel',
    requires: [
        'Dashboard.view.paymentTypes.api.requisite.RequisiteController'
    ],
    controller: 'requisiteController',

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
                tooltip: 'Добавить реквизит',
                handler: 'createRequisiteDialog'
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
            reference: 'apiRequisitesGrid',
            store: 'requisiteStore',

            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
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
                        checkchange: function (me, rowIndex, checked) {
                            ExtUtil.mask('apiRequisitesGrid', 'Обновление реквизита')
                            let url = '/paymentTypes/api/requisite/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                            RequestUtil.request({
                                url: url,
                                method: 'PATCH',
                                params: {
                                    isOn: checked === true
                                },
                                masked: 'apiRequisitesGrid',
                                success: function (response) {
                                    ExtUtil.maskOff('apiRequisitesGrid')
                                    ExtMessages.topToast('Реквизит ' + (checked === true ? 'включен' : 'выключен'))
                                }
                            })
                        }
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