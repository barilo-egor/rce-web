Ext.define('Login.controller.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loginController',

    login: function (me) {
        if (!ExtUtil.referenceQuery('loginLoginField').isValid()) {
            Ext.toast('Введите логин.')
        }
        if (!ExtUtil.referenceQuery('passwordLoginField').isValid()) {
            Ext.toast('Введите пароль.')
        }
    },

    specialKeyPress: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.login()
        }
    }
})