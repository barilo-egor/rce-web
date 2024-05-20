let ExtMessages = {
    incorrectlyForm: function () {
        Ext.Msg.alert('Внимание', 'Неверно заполнена форма.')
    },

    topToast: function (message) {
        Ext.toast({
            message: message,
            alignment: 't-t'
        })
    }
}