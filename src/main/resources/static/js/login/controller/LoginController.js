Ext.define('Login.controller.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loginController',

    enterKeyUp: function (me, e) {
        if (e.event.keyCode !== 13) return;
        this.login()
    },

    login: function () {
        let chatIdComponent = ExtUtil.referenceQuery('chatIdLoginField')
        let chatId = chatIdComponent.getValue()
        if (chatId === null || !chatIdComponent.isValid()) {
            Ext.toast({
                message: 'Введите chat id.',
                docked: 'top',
                alignment: 't-t'
            })
            return
        }
        const eventSource = new EventSource("/registerLogin?chatId=" + chatId);
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
    },

    specialKeyPress: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.login()
        }
    }
})