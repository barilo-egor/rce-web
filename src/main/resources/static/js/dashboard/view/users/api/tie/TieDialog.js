Ext.define('Dashboard.view.users.api.tie.TieDialog', {
    extend: 'Common.dialog.CommonDialog',
    reference: 'tieDialog',
    requires: [
        'Dashboard.view.users.api.tie.TieController'
    ],
    controller: 'tieController',

    closable: 'true',
    title: 'Привязка WEB пользователя',
    minWidth: 350,
    width: '20%',
    height: '90%',

    tools: [
        ExtUtilConfig.getHelpDialogTool('Привязка',
            'Здесь вы можете привязать API пользователя к WEB пользователю<br>' +
            'для того чтобы клиент мог зайти в кабинет.<br>' +
            'Двойным кликом выберите пользователя из списка "Свободные пользователи"<br>' +
            'для привязки пользователя. Для отвязки, также двойным кликом выберите<br>' +
            'пользователя из списка "Привязанные пользователи".')
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            flex: 0.5,
            xtype: 'panel',
            shadow: true,
            height: 255,
            margin: '0 0 30 0',
            title: 'Привязанные пользователи',

            listeners: {
                painted: function(me) {
                    Ext.getStore('apiWebUsersLoginStore').load({
                        params: {
                            apiUserPid: ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('pid')
                        }
                    })
                }
            },

            layout: 'fit',
            tbar: {
                layout: 'fit',
                items: [
                    {
                        xtype: 'textfield',
                        filterId: 'userNameFilter',
                        listeners: {
                            change: 'changeExistFilterField'
                        }
                    }
                ]
            },
            items: [
                {
                    xtype: 'list',
                    itemTpl: '{username}',
                    store: {
                        storeId: 'apiWebUsersLoginStore',
                        autoLoad: false,
                        fields: [
                            'username'
                        ],
                        proxy: {
                            type: 'ajax',
                            url: '/util/getApiWebUsernames',
                            reader: {
                                type: 'json'
                            }
                        }
                    },
                    listeners: {
                        childdoubletap: 'doubleClickRemove'
                    }
                },
            ]
        },
        {
            flex: 0.5,
            xtype: 'panel',
            shadow: true,
            height: 255,
            margin: '0 0 30 0',
            title: 'Свободные пользователи',

            layout: 'fit',
            tbar: {
                layout: 'fit',
                items: [
                    {
                        xtype: 'textfield',
                        filterId: 'userNameFilter',
                        listeners: {
                            change: 'changeAddFilterField'
                        }
                    }
                ]
            },
            items: [
                {
                    xtype: 'list',
                    itemTpl: '{username}',
                    store: {
                        storeId: 'userLoginStore',
                        autoLoad: true,
                        fields: [
                            'username'
                        ],
                        proxy: {
                            type: 'ajax',
                            url: '/util/getUsernames',
                            reader: {
                                type: 'json'
                            }
                        }
                    },
                    listeners: {
                        childdoubletap: 'doubleClickAdd'
                    }
                },
            ]
        }
    ]
})