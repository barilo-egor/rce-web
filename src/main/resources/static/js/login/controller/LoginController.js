Ext.define('Login.controller.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loginController',

    enterKeyUp: function (me, e) {
        if (e.event.keyCode !== 13) return;
        this.login()
    },

    login: function () {
        let login = ExtUtil.referenceQuery('loginLoginField').getValue()
        if (login === null
            || !ExtUtil.referenceQuery('loginLoginField').isValid()) {
            Ext.toast({
                message: 'Введите логин.',
                docked: 'top',
                alignment: 't-t'
            })
            return
        }
        let password = ExtUtil.referenceQuery('passwordLoginField').getValue()
        if (password === null
            || !ExtUtil.referenceQuery('passwordLoginField').isValid()) {
            Ext.toast({
                message: 'Введите пароль.',
                docked: 'top',
                alignment: 't-t'
            })
            return
        }
        ExtUtil.request({
            url: '/login',
            params: {
                username: login,
                password: password
            },
            success: function (response) {
                if (response.loginSuccess) {
                    location.reload()
                } else {
                    Ext.toast('Неправильный логин или пароль.')
                }
            }
        })
    },

    specialKeyPress: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.login()
        }
    }
})