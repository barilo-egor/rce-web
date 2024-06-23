Ext.define('ApiDashboard.view.profile.ProfileDialog', {
    extend: 'Ext.Dialog',
    reference: 'profileDialog',
    requires: [
        'ApiDashboard.view.profile.ProfileController'
    ],
    controller: 'profileController',

    title: 'Профиль',
    closable: 'true',
    height: 300,
    width: 430,

    tools: [
        ExtUtilConfig.getHelpDialogTool('Редактирование профиля',
            'Для редактирования логина введите новое<br>' +
            'значение в поле и нажмите кнопку подтверждения.<br>' +
            'Для генерации нового токена нажмите<br>' +
            'кнопку "Сгенерировать новый"<br>')
    ],

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'middle'
    },

    items: [
        {
            xtype: 'container',
            margin: '0 0 15 0',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 1,
                    xtype: 'textfield',
                    reference: 'usernameProfileField',
                    label: 'Логин',
                    clearable: false,
                    validators: function (val) {
                        if (!this.defaultValue || val === this.defaultValue) return true
                        else return ValidatorUtil.validateLogin(val)
                    },
                    listeners: {
                        painted: 'setUsername',
                        change: 'usernameChange'
                    }
                },
                {
                    xtype: 'button',
                    reference: 'updateLoginButton',
                    iconCls: 'x-fa fa-check',
                    hidden: true,
                    width: 50,
                    handler: 'updateLoginHandler'
                }
            ]

        },
        {
            xtype: 'container',
            margin: '0 0 15 0',

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    flex: 1,
                    xtype: 'textfield',
                    reference: 'tokenProfileField',
                    label: 'Токен',
                    editable: false,
                    clearable: false,
                    listeners: {
                        painted: 'setToken'
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-sync-alt',
                    tooltip: 'Сгенерировать новый',
                    width: 50,
                    handler: 'generateTokenHandler'
                }
            ]
        },
        {
            xtype: 'togglefield',
            label: 'Звуковые оповещения',
            listeners: {
                change: 'soundEnabledChange',
                painted: 'setSoundEnabled'
            }
        }
    ]
})