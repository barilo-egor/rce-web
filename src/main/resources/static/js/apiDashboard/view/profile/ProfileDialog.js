Ext.define('ApiDashboard.view.profile.ProfileDialog', {
    extend: 'Ext.Dialog',
    reference: 'profileDialog',

    title: 'Профиль',
    closable: 'true',
    height: 300,
    width: 430,

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
                        painted: function (me) {
                            ExtUtil.mRequest({
                                url: '/dashboard/api/util/getUsername',
                                method: 'GET',
                                async: false,
                                success: function (response) {
                                    let username = response.body.data.username
                                    me.setValue(username)
                                    me.defaultValue = username
                                }
                            })
                        },
                        change: function (me, newValue) {
                            if (me.defaultValue && (newValue !== me.defaultValue && me.validate())) {
                                ExtUtil.referenceQuery('updateLoginButton').setHidden(false)
                            } else {
                                ExtUtil.referenceQuery('updateLoginButton').setHidden(true)
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'updateLoginButton',
                    iconCls: 'x-fa fa-check',
                    hidden: true,
                    width: 50,
                    handler: function (me) {
                        let handler = function () {
                            ExtUtil.mask('profileDialog', 'Обновление логина.')
                            ExtUtil.mRequest({
                                url: '/dashboard/api/util/updateLogin',
                                loadingComponentRef: 'profileDialog',
                                params: {
                                    login: ExtUtil.referenceQuery('usernameProfileField').getValue()
                                },
                                success: function (response) {
                                    location.reload()
                                }
                            })
                        }
                        ExtMessages.confirm('Внимание', 'После изменения логина будет необходимо выполнить повторный вход. Продолжить?', handler)
                    }
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
                        painted: function (me) {
                            ExtUtil.mRequest({
                                url: '/dashboard/api/util/getToken',
                                method: 'GET',
                                async: false,
                                success: function (response) {
                                    me.setValue(response.body.data.token)
                                }
                            })
                        }
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-sync-alt',
                    tooltip: 'Сгенерировать новый',
                    width: 50,
                    handler: function (me) {
                        ExtUtil.mask('profileDialog', 'Обновление токена.')
                        let handler = function () {
                            ExtUtil.mRequest({
                                url: '/dashboard/api/util/tokenGenerate',
                                loadingComponentRef: 'profileDialog',
                                success: function (response) {
                                    ExtUtil.referenceQuery('tokenProfileField').setValue(response.body.data.token)
                                    ExtUtil.maskOff('profileDialog')
                                    ExtMessages.topToast('Токен обновлен.')
                                }
                            })
                        }
                        ExtMessages.confirm('Внимание', 'Если вы сгенерируете новый токен, то старый станет неактивен. Продолжить?', handler)
                    }
                }
            ]
        },
        {
            xtype: 'togglefield',
            label: 'Звуковые оповещения',
            listeners: {
                change: function (me, newValue) {
                    ExtUtil.mask('profileDialog', 'Обновление.')
                    ExtUtil.mRequest({
                        url: '/dashboard/api/util/updateSoundEnabled',
                        params: {
                            soundEnabled: newValue
                        },
                        success: function (response) {
                            NOTIFICATION_SOUND_ON = newValue
                            ExtUtil.maskOff('profileDialog')
                        }
                    })
                },
                painted: function (me) {
                    ExtUtil.mRequest({
                        url: '/dashboard/api/util/getSoundEnabled',
                        method: 'GET',
                        async: false,
                        success: function (response) {
                            me.setValue(response.body.data.soundEnabled)
                        }
                    })
                }
            }
        }
    ]
})