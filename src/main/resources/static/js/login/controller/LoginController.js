Ext.define('Login.controller.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loginController',

    enterKeyUp: function (me, e) {
        if (e.event.keyCode !== 13) return;
        this.login()
    },

    login: function () {
        let loginFieldComponent = ExtUtil.referenceQuery('loginField')
        let loginField = loginFieldComponent.getValue()
        if (loginField === null || !loginFieldComponent.isValid()) {
            Ext.toast({
                message: 'Введите chat id либо логин.',
                docked: 'top',
                alignment: 't-t'
            })
            return
        }
        ExtUtil.mRequest({
            url: '/web/user/isExist',
            params: {
                loginField: loginField
            },
            method: 'GET',
            success: function (response) {
                if (response.body.data.isExist === true) {
                    const eventSource = new EventSource("/registerLogin?loginField=" + loginField);
                    eventSource.onmessage = e => {
                        let response = Ext.JSON.decode(e.data);
                        if (response.success) {
                            location.reload()
                        } else {
                            Ext.Msg.alert('Внимание', 'Авторизация не удалась. Попробуйте ещё раз, либо обратитесь к оператору.');
                        }
                    }
                    eventSource.onerror = () => console.log('Произошла ошибка.');
                    Ext.create('Ext.Dialog', {
                        title: 'Подтверждение',
                        closable: false,
                        html: 'Наш бот отправил вам сообщение для подтверждения авторизации. Нажмите "Подтвердить" в чате с ботом для входа.'
                    }).show()
                } else {
                    Ext.toast('Пользователь не найден. Пройдите регистрацию.')
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