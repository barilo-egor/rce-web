Ext.define('Dashboard.view.paymentTypes.api.client.AddClientDialog', {
    extend: 'Ext.Dialog',
    reference: 'addClientDialog',

    width: 400,
    height: 500,
    title: 'Добавление клиенту типа оплаты',
    closable: true,

    layout: 'fit',
    items: [
        {
            xtype: 'panel',
            shadow: true,
            margin: '0 0 30 0',

            layout: 'fit',
            tbar: {
                layout: 'fit',
                items: [
                    {
                        xtype: 'searchfield',
                        placeholder: 'Поиск по id',
                        filterId: 'idFilter',
                        listeners: {
                            change: function (me, newValue) {
                                let store = Ext.getStore('notAddedApiClientsStore')
                                store.removeFilter(me.filterId)
                                store.addFilter(new Ext.util.Filter({
                                    id: me.filterId,
                                    filterFn: function (item) {
                                        return item.get('id').startsWith(newValue)
                                    }
                                }))
                            }
                        }
                    }
                ]
            },
            items: [
                {
                    xtype: 'list',
                    itemTpl: '{id}',
                    shadow: true,
                    emptyText: 'Нет ни одного доступного клиента.',
                    store: {
                        storeId: 'notAddedApiClientsStore',
                        autoLoad: false,
                        fields: ['id'],
                        proxy: {
                            type: 'ajax',
                            url: '/paymentTypes/api/client',
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        }
                    },
                    listeners: {
                        childdoubletap: function (me, location) {
                            ExtUtil.mask('addClientDialog', 'Добавление клиента')
                            let rec = me.getStore().getAt(location.recordIndex)
                            let url = '/paymentTypes/api/' + ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                            + '/client/' + rec.get('id')
                            RequestUtil.request({
                                url: url,
                                method: 'PUT',
                                masked: 'addClientDialog',
                                success: function () {
                                    Ext.getStore('apiPaymentTypeStore').reload()
                                    ExtMessages.topToast('Клиент успешно связан с типом оплаты')
                                    ExtUtil.maskOff('addClientDialog')
                                    ExtUtil.referenceQuery('addClientDialog').close()
                                }
                            })
                        },
                        painted: function (me) {
                            me.getStore().load({
                                params: {
                                    isAdding: true,
                                    paymentTypePid: ExtUtil.referenceQuery('paymentTypesGrid').getPidOfSelected()
                                }
                            })
                        }
                    }
                },
            ]
        }
    ]
})