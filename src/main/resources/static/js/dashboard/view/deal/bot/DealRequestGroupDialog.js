Ext.define('Dashboard.view.deal.bot.DealRequestGroupDialog', {
    extend: 'Ext.Dialog',
    reference: 'dealRequestGroupDialog',

    title: 'Выбор группы запросов',
    closable: true,
    minWidth: 350,
    height: '50%',

    tools: [
        ExtUtilConfig.getHelpDialogTool('Привязка',
            'Двойным кликом по группе выберите ту, в которую <p>' +
            'по кнопке "Подтвердить с запросом" будут отправляться сделки.')
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
                            url: '/deal/bot/getDefaultGroups',
                            reader: {
                                type: 'json',
                                rootProperty: 'body.data'
                            }
                        }
                    },
                    listeners: {
                        childdoubletap: function (me, location) {
                            ExtUtil.mask('dealRequestGroupDialog', 'Обновление группы')
                            let rec = me.getStore().getAt(location.recordIndex)
                            ExtUtil.mRequest({
                                url: '/deal/bot/updateDealRequestGroup',
                                params: {
                                    pid: rec.get('pid')
                                },
                                loadingComponentRef: 'dealRequestGroupDialog',
                                success: function (response) {
                                    let field = ExtUtil.referenceQuery('dealRequestGroupField')
                                    field.setValue(rec.get('title'))
                                    field.groupPid = rec.get('pid')
                                    ExtUtil.maskOff('dealRequestGroupDialog')
                                    ExtUtil.referenceQuery('dealRequestGroupDialog').close()
                                }
                            })
                        }
                    }
                },
            ]
        },
    ]
})