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
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
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
                                Ext.getStore('apiPaymentTypeStore').load({
                                    params: {
                                        dealType: rec.get('name'),
                                        apiUserId: ExtUtil.referenceQuery('apiUserIdCombo').getValue()
                                    }
                                })
                            }
                        }
                    },
                    listeners: {
                        change: 'dealTypeChange'
                    }
                },
                {
                    xtype: 'combobox',
                    reference: 'apiUserIdCombo',
                    margin: '0 0 0 30',
                    label: 'Поиск по id клиента',
                    queryMode: 'remote',
                    displayField: 'value',
                    valueField: 'value',
                    triggerAction: 'query',
                    forceSelection: true,
                    minChars: 1,
                    store: {
                        fields: ['value'],
                        proxy: {
                            type: 'ajax',
                            url: '/autocomplete/client/id',
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        }
                    },
                    listeners: {
                        select: 'selectApiUserId'
                    }
                },
                {
                    xtype: 'container',

                    layout: {
                        type: 'vbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            reference: 'dropClientFilterButton',
                            iconCls: 'x-fa fa-times-circle',
                            hidden: true,
                            tooltip: 'Очистка фильтра клиента',
                            handler: 'dropClientFilter'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'paymentTypesGrid',
            store: 'apiPaymentTypeStore',

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
                    width: 120,
                    menuDisabled: true
                },
                {
                    text: 'Мин.сумма',
                    dataIndex: 'minSum',
                    width: 120,
                    menuDisabled: true
                },
                {
                    text: 'Валюта',
                    reference: 'fiatCurrencyColumn',
                    dataIndex: 'fiatCurrency',
                    width: 120,
                    menuDisabled: true
                },
                {
                    text: 'Валюта',
                    reference: 'cryptoCurrencyColumn',
                    dataIndex: 'cryptoCurrency',
                    hidden: true,
                    width: 120,
                    menuDisabled: true
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