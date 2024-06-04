Ext.define('Dashboard.view.users.web.WebUsersFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'webusersfilterpanel',

    requires: [
        'Dashboard.view.users.web.WebUsersController'
    ],
    controller: 'webUsersController',

    title: 'Фильтрация',
    collapsible: ExtUtilConfig.getCollapsible('top'),
    collapsed: false,
    titleCollapse: false,
    shadow: true,
    margin: '10 5 5 10',
    padding: '5 5 5 5',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                defaults: {
                    width: '80%'
                }
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Логин',
                            reference: 'usernameFilterField'
                        },
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Роль',
                            editable: false,
                            store: {
                                type: 'roleStore'
                            },
                            clearable: true,
                            reference: 'roleFilterField',
                            displayField: 'displayName',
                            valueField: 'name'
                        },
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'Chat id',
                            decimals: 0,
                            reference: 'chatIdFilterField'
                        },
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'hbox',
                pack: 'middle'
            },
            items: [
                {
                    xtype: 'button',
                    margin: '20 0 0 0',
                    text: 'Искать',
                    handler: 'search'
                },
                {
                    xtype: 'button',
                    margin: '20 0 0 0',
                    text: 'Очистить форму поиска',
                    handler: 'clearFilterForm'
                }
            ]
        }
    ]
})