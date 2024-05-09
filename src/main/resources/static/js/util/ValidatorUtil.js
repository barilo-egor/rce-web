let ValidatorUtil = {
    validatePositiveInt: function (val) {
        if (!val) return 'Введите значение.'
        if (val === '0' || val === 0 || val < 0) return 'Введите значение больше 0.'
        else return true
    },

    validateNotEmpty: function (val) {
        if (!val) return 'Требуется значение'
        return true
    },

    boolValidateNotEmpty: function (val) {
        return val;
    },

    validateNotEmptyAndLettersAndNumber: function (val) {
        if (!val) return 'Введите значение'
        if (RegexUtil.onlyLettersAndNumbers(val)) return true;
        else return 'Только латинские буквы и цифры.'
    },

    validateDiscount: function (val) {
        if (!val) return 'Введите значение.'
        if (val < -99 || val > 99) {
            return 'Значение должно быть от -99 до 99.'
        } else return true
    },

    validateId: function (val) {
        if (!val || val === '') return  'Введите значение'
        if (!RegexUtil.onlyLettersAndNumbers(val)) return 'Только латинские буквы и символы'
        return true
    },

    validateIdWithExists: function (val) {
        if (!val || val === '') return  'Введите значение'
        if (!RegexUtil.onlyLettersAndNumbers(val)) return 'Только латинские буквы и символы'
        return true
    },

    validateChangeLogin: function (val) {
        if (this.defaultValue === val) return true
        return ValidatorUtil.validateLogin(val)
    },

    validateLogin: function (val) {
        if (!val) return 'Введите значение'
        if (!RegexUtil.onlyLettersAndNumbers(val)) return 'Только латинские буквы и цифры.'
        let result = true
        Ext.Ajax.request({
            url: '/web/registration/isUsernameFree',
            method: 'GET',
            params: {
                username: val
            },
            async: false,
            success: function(rs) {
                let response = Ext.JSON.decode(rs.responseText)
                if (!response.result) result = 'Данный логин уже занят'
            },
            failure: function () {
                Ext.Msg.alert('Ошибка', 'Ошибка при попытке проверки логина.')
            }
        })
        return result
    },

    validatePasswordConfirm: function (val) {
        let passwordInput = ExtUtil.idQuery('passwordInput')
        if (!val) return 'Введите значение'
        if (passwordInput.value !== val) return 'Пароли не совпадают'
        return true
    },

    validatePaymentTypeName: function (val) {
        if (!val) return 'Введите значение'
        let result = true
        if (this.up('window').getViewModel().getData().isCreate || this.defaultValue !== val) {
            Ext.Ajax.request({
                url: '/web/paymentTypes/isNameFree',
                method: 'GET',
                params: {
                    name: val
                },
                async: false,
                success: function(rs) {
                    let response = Ext.JSON.decode(rs.responseText)
                    if (!response.body.data.result) result = 'Данное название уже занято'
                },
                failure: function () {
                    Ext.Msg.alert('Ошибка', 'Ошибка при попытке проверки названия.')
                }
            })
        }
        return result
    }
}