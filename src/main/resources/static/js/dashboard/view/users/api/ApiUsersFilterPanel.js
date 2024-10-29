Ext.define('Dashboard.view.users.api.ApiUsersFilterPanel', {
    extend: 'Ext.Panel',
    xtype: 'apiusersfilterpanel',
    requires: [
        'Dashboard.view.users.api.ApiUsersController'
    ],
    controller: 'apiUsersController',

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
                            label: 'ID',
                            reference: 'idFilterField',
                        }
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'combobox',
                            label: 'Фиат',
                            editable: false,
                            store: {
                                type: 'fiatCurrenciesStore'
                            },
                            clearable: true,
                            reference: 'fiatCurrencyFilterField',
                            displayField: 'code',
                            valueField: 'name'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Токен',
                            reference: 'tokenFilterField'
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
            defaults: {
                xtype: 'button',
                margin: '20 0 0 0',
            },
            items: [
                {
                    text: 'Искать',
                    handler: 'search'
                },
                {
                    text: 'Очистить форму поиска',
                    handler: 'clearFilterForm'
                }
            ]
        }
    ]
})