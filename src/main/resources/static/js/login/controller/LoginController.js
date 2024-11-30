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
                alignment: 't-t'
            })
            return
        }
        if (IS_DEV && (loginField === 'admin' || loginField === 'operator')) {
            ExtUtil.mRequest({
                url: '/loginInstant',
                params: {
                    login: loginField
                },
                success: function (response) {
                    location.reload()
                }
            })
            return
        }
        ExtUtil.mRequest({
            url: '/users/web/exist',
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
                        html: 'Наш бот отправил вам сообщение для подтверждения авторизации. Нажмите "Подтвердить вход" в чате с ботом для входа.'
                    }).show()
                } else {
                    Ext.toast({
                        message: 'Пользователь не найден. Пройдите регистрацию.',
                        alignment: 't-t'
                    })
                }
            }
        })

    },

    register: function (me) {
        let registerLoginComponent = ExtUtil.referenceQuery('registerLoginField')
        let login = registerLoginComponent.getValue()
        if (login === null) {
            Ext.toast({
                message: 'Введите логин.',
                alignment: 't-t'
            })
            return
        }
        if (!registerLoginComponent.isValid()) {
            return
        }
        let registerChatIdComponent = ExtUtil.referenceQuery('registerChatIdField')
        let chatId = registerChatIdComponent.getValue()
        if (chatId === null) {
            Ext.toast({
                message: 'Введите chat id.',
                alignment: 't-t'
            })
            return
        }
        if (!registerChatIdComponent.isValid()) {
            return
        }
        let registerTokenComponent = ExtUtil.referenceQuery('registerTokenField')
        ExtUtil.mask('loginPanel', 'Выполняется регистрация.')
        let token = registerTokenComponent.getValue()
        const eventSource = new EventSource("/registration/register?login=" + login + "&chatId=" + chatId + (token ? "&token=" + token : ""));
        eventSource.onmessage = e => {
            let response = Ext.JSON.decode(e.data);
            if (response.success) {
                location.reload()
            } else {
                Ext.Msg.alert('Внимание', 'Регистрация не удалась. Попробуйте ещё раз, либо обратитесь к оператору.');
            }
        }
        eventSource.onerror = () => console.log('Произошла ошибка.');
        Ext.create('Ext.Dialog', {
            title: 'Подтверждение',
            closable: false,
            html: 'Наш бот отправил вам сообщение для подтверждения регистрации. Нажмите "Подтвердить регистрацию" в чате с ботом для входа.'
        }).show()
    },

    specialKeyPress: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.login()
        }
    }
})