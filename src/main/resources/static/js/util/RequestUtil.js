let RequestUtil = {
    FORM: {
        processFormFailure: function (response, title, handler) {
            let decodedResponse = Ext.decode(response.responseText)
            let message = 'Статус: ' + response.status + ' ' + response.statusText
                + (response.data && response.data.message
                    ? '<br>Сообщение: ' + decodedResponse.data.message
                    : '')
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
                if (response.status === 500) {
                    ExtMessages.error('Ошибка', Ext.decode(response.responseText).data.message)
                } else {
                    ExtMessages.error('Ошибка запроса', 'Статус: ' + response.status + ' ' + response.statusText)
                }
            }
        }
        let requestObject = Ext.apply({}, config)
        requestObject.success = function (rawResponse) {
            let response
            try {
                if (rawResponse.responseText && rawResponse.responseText.length > 0) {
                    response = Ext.JSON.decode(rawResponse.responseText)
                }
            } catch (e) {
                console.error('Ошибка при парсинге ответа.')
            }
            config.success(response, rawResponse)
        }
        Ext.Ajax.request(requestObject)
    }
}