let RequestUtil = {
    FORM: {
        processFormFailure: function (response, title, handler) {
            let decodedResponse = Ext.decode(response.responseText)
            let message = 'Статус: ' + response.status + ' ' + response.statusText + '<br>Сообщение: '
                + decodedResponse.data.message
            ExtMessages.error(title ? title : 'Ошибка', message, handler)
        },
        formFailure: function (form, response) {
            RequestUtil.FORM.processFormFailure(response)
        }
    },

    request(config) {
        if (!config.failure) {
            config.failure = function (response) {
                if (config.masked) {
                    if (typeof config.masked === 'string') {
                        ExtUtil.referenceQuery(config.masked).setMasked(false)
                    } else if (typeof config.masked === 'object') {
                        config.masked.setMasked(false)
                    }
                }
                ExtMessages.error('Ошибка', Ext.decode(response.responseText).data.message)
            }
        }
        Ext.Ajax.request(config)
    }
}