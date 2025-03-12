Ext.define('Dashboard.view.deal.review.ReviewContainer', {
    extend: 'Ext.panel.Accordion',
    xtype: 'reviewcontainer',
    reference: 'reviewContainer',
    requires: [
        'Dashboard.view.deal.review.ReviewController'
    ],
    controller: 'reviewController',

    items: [
        {
            flex: 1,
            xtype: 'panel',
            title: 'Новые отзывы',

            layout: 'fit',
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',

                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-sync-alt material-blue-color',
                            tooltip: 'Перезагрузить отзывы',
                            handler: function () {
                                Ext.getStore('reviewStore').reload()
                            }
                        },
                        {
                            xtype: 'button',
                            reference: 'publishSelectedButton',
                            text: 'Одобрить выделенные',
                            iconCls: 'x-fa fa-check-double material-blue-color',
                            hidden: true,
                            handler: function (me) {
                                let records = Ext.getStore(PUBLISHED_REVIEW_STORE_ID).getRange()
                                if (records.length < 1) {
                                    ExtMessages.info('Внимание', 'Не выделена ни одна запись.')
                                    return
                                }
                                ExtMessages.confirm('Внимание', 'Одобрить все выделенные отзывы?', function () {
                                    let pids = records.map(rec => rec.get('pid'))
                                    ExtUtil.mRequest({
                                        url: '/deal/review',
                                        method: 'POST',
                                        jsonData: pids,
                                        success: function (response) {
                                            ExtUtil.referenceQuery('publishSelectedButton').setHidden(true)
                                            ExtUtil.referenceQuery('deleteSelectedButton').setHidden(true)
                                            Ext.getStore(PUBLISHED_REVIEW_STORE_ID).removeAll()
                                            ExtMessages.info('Информация', 'Все выделенные отзывы одобрены и буду опубликованы согласно очереди.')
                                        }
                                    })
                                })
                            }
                        },
                        {
                            xtype: 'button',
                            reference: 'deleteSelectedButton',
                            text: 'Удалить выделенные',
                            iconCls: 'x-fa fa-trash-alt redColor',
                            hidden: true,
                            handler: function (me) {
                                let records = Ext.getStore(PUBLISHED_REVIEW_STORE_ID).getRange()
                                if (records.length < 1) {
                                    ExtMessages.info('Внимание', 'Не выделена ни одна запись.')
                                    return
                                }
                                ExtMessages.confirm('Внимание', 'Удалить все выделенные отзывы?', function () {
                                    let pids = records.map(rec => rec.get('pid'))
                                    ExtUtil.mRequest({
                                        url: '/deal/review',
                                        method: 'DELETE',
                                        jsonData: pids,
                                        success: function (response) {
                                            ExtUtil.referenceQuery('publishSelectedButton').setHidden(true)
                                            ExtUtil.referenceQuery('deleteSelectedButton').setHidden(true)
                                            Ext.getStore(PUBLISHED_REVIEW_STORE_ID).removeAll()
                                        }
                                    })
                                })
                            }
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    reference: 'reviewGrid',
                    store: 'reviewStore',

                    getPidOfSelected: function() {
                        let selection = this.getSelection()
                        if (selection) {
                            return selection.get('pid')
                        }
                        return null
                    },

                    plugins: {
                        pagingtoolbar: true
                    },
                    listeners: {
                        painted: function (me) {
                            me.getStore().load()
                            Ext.getStore(PUBLISHED_REVIEW_STORE_ID).removeAll()
                        },
                        childcontextmenu: 'openGridMenu',
                    },


                    columns: [
                        {
                            xtype: 'checkcolumn',
                            dataIndex: 'selected',
                            width: 40,
                            listeners: {
                                checkchange: function (me, rowIndex, checked, record) {
                                    let store = Ext.getStore(PUBLISHED_REVIEW_STORE_ID)
                                    if (checked) {
                                        store.add({pid: record.get('pid')})
                                    } else {
                                        let storeRec = store.find('pid', record.get('pid'))
                                        store.removeAt(storeRec)
                                    }
                                    let totalCount = store.getRange().length
                                    let publishSelectedButton = ExtUtil.referenceQuery('publishSelectedButton')
                                    let deleteSelectedButton = ExtUtil.referenceQuery('deleteSelectedButton')
                                    if (totalCount === 1) {
                                        publishSelectedButton.setHidden(false)
                                        deleteSelectedButton.setHidden(false)
                                    } else if (totalCount === 0) {
                                        publishSelectedButton.setHidden(true)
                                        deleteSelectedButton.setHidden(true)
                                    }
                                    if (totalCount > 0) {
                                        publishSelectedButton.setText('Одобрить выделенные (' + totalCount + ')')
                                        deleteSelectedButton.setText('Удалить выделенные (' + totalCount + ')')
                                    }
                                }
                            }
                        },
                        {
                            text: '№',
                            dataIndex: 'pid',
                            menuDisabled: true
                        },
                        {
                            text: 'Chat id',
                            width: 150,
                            dataIndex: 'chatId',
                            menuDisabled: true
                        },
                        {
                            text: 'Username',
                            width: 200,
                            dataIndex: 'username',
                            menuDisabled: true
                        },
                        {
                            text: 'Текст',
                            flex: 1,
                            dataIndex: 'text',
                            menuDisabled: true
                        }
                    ]
                }
            ]
        },
        {
            flex: 1,
            xtype: 'panel',
            title: 'В очереди на публикацию',

            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    reference: 'reviewGrid',
                    store: 'reviewQueueStore',

                    getPidOfSelected: function() {
                        let selection = this.getSelection()
                        if (selection) {
                            return selection.get('pid')
                        }
                        return null
                    },

                    plugins: {
                        pagingtoolbar: true
                    },
                    listeners: {
                        painted: function (me) {
                            me.getStore().load()
                        },
                    },


                    columns: [
                        {
                            text: '№',
                            dataIndex: 'pid',
                            menuDisabled: true
                        },
                        {
                            text: 'Chat id',
                            width: 150,
                            dataIndex: 'chatId',
                            menuDisabled: true
                        },
                        {
                            text: 'Username',
                            width: 200,
                            dataIndex: 'username',
                            menuDisabled: true
                        },
                        {
                            text: 'Текст',
                            flex: 1,
                            dataIndex: 'text',
                            menuDisabled: true
                        }
                    ]
                }
            ]
        }
    ]
})