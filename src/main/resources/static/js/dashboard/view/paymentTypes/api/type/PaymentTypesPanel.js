Ext.define('Dashboard.view.paymentTypes.api.type.PaymentTypesPanel', {
    extend: 'Ext.Panel',
    xtype: 'paymenttypespanel',
    requires: [
        'Dashboard.view.paymentTypes.api.type.PaymentTypesController',
        'Dashboard.view.paymentTypes.api.requisite.RequisitesGridMenu'
    ],
    controller: 'paymentTypesController',

    shadow: true,
    title: 'Типы оплат',

    layout: 'fit',
    items: [
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    iconCls: 'x-fa fa-plus forestgreenColor',
                    tooltip: 'Добавить тип оплаты',
                    handler: 'createDialog'
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'top',
            items: [
                {
                    xtype: 'combobox',
                    reference: 'dealTypeField',
                    label: 'Тип сделки',
                    displayField: 'nominative',
                    editable: false,
                    queryMode: 'local',
                    valueField: 'name',
                    store: {
                        type: 'dealTypesStore',
                        listeners: {
                            load: function (me, records) {
                                let rec = me.getAt(0)
                                ExtUtil.referenceQuery('dealTypeField').setValue(rec)
                                Ext.getStore('paymentTypeStore').load({
                                    params: {
                                        dealType: rec.get('name')
                                    }
                                })
                            }
                        }
                    },
                    listeners: {
                        change: 'dealTypeChange'
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'paymentTypesGrid',
            store: 'paymentTypeStore',

            listeners: {
                select: 'selectPaymentType',
                childcontextmenu: 'openGridMenu',
            },
            getPidOfSelected: function() {
                let selection = this.getSelection()
                if (selection) {
                    return selection.get('pid')
                }
                return null
            },
            getSelectedRec: function () {
                return this.getSelection()
            },

            columns: [
                {
                    text: 'Название',
                    dataIndex: 'name',
                    width: 250,
                    menuDisabled: true
                },
                {
                    text: 'ID',
                    dataIndex: 'id',
                    width: 150,
                    menuDisabled: true
                },
                {
                    text: 'Тип',
                    dataIndex: 'dealType',
                    width: 120
                },
                {
                    text: 'Валюта',
                    reference: 'fiatCurrencyColumn',
                    dataIndex: 'fiatCurrency',
                    width: 120
                },
                {
                    text: 'Валюта',
                    reference: 'cryptoCurrencyColumn',
                    dataIndex: 'cryptoCurrency',
                    hidden: true,
                    width: 120
                },
                {
                    text: 'Примечание',
                    dataIndex: 'comment',
                    flex: 1,
                    menuDisabled: true
                }
            ]
        },
    ]
})