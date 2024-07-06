Ext.define('ApiDashboard.view.profile.ProfileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.profileController',

    setUsername: function (me) {
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

    setToken: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/util/getToken',
            method: 'GET',
            async: false,
            success: function (response) {
                me.setValue(response.body.data.token)
            }
        })
    },

    setSoundEnabled: function (me) {
        ExtUtil.mRequest({
            url: '/dashboard/api/util/getSoundEnabled',
            method: 'GET',
            async: false,
            success: function (response) {
                me.suspendEvent('change')
                me.setValue(response.body.data.soundEnabled)
                me.resumeEvent('change')
            }
        })
    },

    usernameChange: function (me, newValue) {
        if (me.defaultValue && (newValue !== me.defaultValue && me.validate())) {
            ExtUtil.referenceQuery('updateLoginButton').setHidden(false)
        } else {
            ExtUtil.referenceQuery('updateLoginButton').setHidden(true)
        }
    },

    soundEnabledChange: function (me, newValue) {
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

    updateLoginHandler: function (me) {
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
    },

    generateTokenHandler: function (me) {
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
})