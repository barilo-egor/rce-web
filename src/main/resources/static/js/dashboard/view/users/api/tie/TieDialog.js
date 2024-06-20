Ext.define('Dashboard.view.users.api.tie.TieDialog', {
    extend: 'Ext.Dialog',
    reference: 'tieDialog',
    requires: [
        'Dashboard.view.users.api.tie.TieController'
    ],
    controller: 'tieController',

    closable: 'true',
    title: 'Привязка WEB пользователя',
    minWidth: 350,
    width: '20%',

    tools: [
        {
            type: 'help',
            tooltip: {
                align: 'tr-bl',
                anchorToTarget: true,
                anchor: true,
                autoHide: false,
                closable: true,
                showOnTap: true,
                scrollable: 'y',
                title: 'Привязка',
                html: 'Здесь вы можете привязать API пользователя к WEB пользователю<br>' +
                    'для того чтобы клиент мог зайти в кабинет.<br>' +
                    'Для привязки двойным кликом в списке выберите<br>' +
                    'нужного пользователя и нажмите "Привязать"<br>' +
                    'Чтобы полностью отвязать пользователя, очистите поле<br>' +
                    'текущего пользователя и нажмите "Привязать".'
            }
        }
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'textfield',
            reference: 'currentUserField',
            label: 'Текущий WEB пользователь',
            editable: false,
            margin: '0 0 20 0',
            listeners: {
                change: 'changeCurrentUser',
                painted: 'setValues'
            }
        },
        {
            xtype: 'panel',
            shadow: true,
            height: 255,
            margin: '0 0 30 0',

            layout: 'fit',
            tbar: {
                layout: 'fit',
                items: [
                    {
                        xtype: 'textfield',
                        filterId: 'userNameFilter',
                        listeners: {
                            change: 'changeFilterField'
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
                        childdoubletap: 'doubleClick'
                    }
                },
            ]
        },
        {
            xtype: 'button',
            reference: 'tieButton',
            text: 'Привязать',
            disabled: true,
            handler: 'tie'
        }
    ]
})