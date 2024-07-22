Ext.define('Dashboard.view.users.api.dialog.DealRequestGroupDialog', {
    extend: 'Ext.Dialog',
    reference: 'apiDealRequestGroupDialog',

    title: 'Выбор группы запросов',
    closable: true,
    minWidth: 350,
    height: '50%',

    tools: [
        ExtUtilConfig.getHelpDialogTool('Привязка',
            'Двойным кликом по группе выберите ту, в которую <p>' +
            'по кнопке "Подтвердить с запросом" будут отправляться API сделки.')
    ],

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
                        xtype: 'textfield',
                        filterId: 'userNameFilter',
                        listeners: {
                            change: function (me, newValue) {
                                let store = Ext.getStore('groupChatStore')
                                store.removeFilter(me.filterId)
                                store.addFilter(new Ext.util.Filter({
                                    id: me.filterId,
                                    filterFn: function (item) {
                                        return item.get('title').startsWith(newValue)
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
                    itemTpl: '{title}',
                    emptyText: 'Нет ни одной доступной группы.',
                    store: {
                        storeId: 'groupChatStore',
                        autoLoad: true,
                        fields: [
                            'username'
                        ],
                        proxy: {
                            type: 'ajax',
                            url: '/users/api/getDefaultGroups',
                            reader: {
                                type: 'json',
                                rootProperty: 'body.data'
                            }
                        }
                    },
                    listeners: {
                        childdoubletap: function (me, location) {
                            let rec = me.getStore().getAt(location.recordIndex)
                            let field = ExtUtil.referenceQuery('apiDealRequestGroupField')
                            field.groupPid = rec.get('pid')
                            field.setValue(rec.get('title'))
                            ExtUtil.referenceQuery('apiDealRequestGroupDialog').close()
                        }
                    }
                },
            ]
        },
    ]
})