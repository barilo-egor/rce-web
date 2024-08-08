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
    }
}