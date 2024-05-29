Ext.define('Dashboard.view.deal.bot.add.AddController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addController',

    comboChange: function (me) {
        if (ExtUtil.referenceQuery('enterInCryptoCheckbox').getChecked()) {
            ExtUtil.referenceQuery('fiatAmountField').setValue(null)
        } else {
            ExtUtil.referenceQuery('cryptoAmountField').setValue(null)
        }
    },

    checkBoxChange: function (me, newValue) {
        if (!newValue) return
        let cryptoEnter = me.getReference() === 'enterInCryptoCheckbox'
        if (cryptoEnter) {
            ExtUtil.referenceQuery('fiatAmountField').setListeners({
                focus: function () {
                    let value = ExtUtil.referenceQuery('fiatAmountField').getValue()
                    if (!value) return
                    navigator.clipboard.writeText(value)
                    ExtMessages.topToast('Фиатная сумма скопирована в буфер обмена')
                }
            })
            ExtUtil.referenceQuery('cryptoAmountField').setListeners({})
            ExtUtil.referenceQuery('enterInFiatCheckbox').setChecked(false)
        } else {
            ExtUtil.referenceQuery('cryptoAmountField').setListeners({
                focus: function () {
                    let value = ExtUtil.referenceQuery('cryptoAmountField').getValue()
                    if (!value) return
                    navigator.clipboard.writeText(value)
                    ExtMessages.topToast('Сумма в крипте скопирована в буфер обмена')
                }
            })
            ExtUtil.referenceQuery('fiatAmountField').setListeners({})
            ExtUtil.referenceQuery('enterInCryptoCheckbox').setChecked(false)
        }
        ExtUtil.referenceQuery('fiatAmountField').setValue(null)
        ExtUtil.referenceQuery('cryptoAmountField').setValue(null)
        ExtUtil.referenceQuery('cryptoAmountField').setEditable(cryptoEnter === true)
        ExtUtil.referenceQuery('fiatAmountField').setEditable(cryptoEnter === false)
        ExtUtil.referenceQuery('cryptoAmountField').getTriggers().calculate.setHidden(cryptoEnter === false)
        ExtUtil.referenceQuery('fiatAmountField').getTriggers().calculate.setHidden(cryptoEnter === true)
    },

    calculateCryptoAmount: function (me) {
        let newValue = ExtUtil.referenceQuery('fiatAmountField').getValue()
        if (!newValue || newValue === 0) return
        ExtUtil.mask('cryptoAmountFieldContainer', 'Расчет')
        setTimeout(function () {
            ExtUtil.mRequest({
                url: '/deal/bot/calculate',
                method: 'GET',
                async: false,
                params: {
                    amount: newValue,
                    fiatCurrency: ExtUtil.referenceQuery('fiatCurrencyAddField').getValue(),
                    cryptoCurrency: ExtUtil.referenceQuery('cryptoCurrencyAddField').getValue(),
                    dealType: ExtUtil.referenceQuery('dealTypeAddField').getValue(),
                    personalDiscount: ExtUtil.referenceQuery('personalDiscountAddField').getValue()
                },
                success: function (response) {
                    ExtUtil.referenceQuery('cryptoAmountField').setValue(Number(response.body.data.amount))
                    ExtUtil.maskOff('cryptoAmountFieldContainer')
                }
            })
        }, 10);
    },

    calculateFiatAmount: function (me) {
        let newValue = ExtUtil.referenceQuery('cryptoAmountField').getValue()
        if (!newValue || newValue === 0) return
        ExtUtil.mask('fiatAmountFieldContainer', 'Расчет')
        setTimeout(function () {
            ExtUtil.mRequest({
                url: '/deal/bot/calculate',
                method: 'GET',
                async: false,
                params: {
                    cryptoAmount: newValue,
                    fiatCurrency: ExtUtil.referenceQuery('fiatCurrencyAddField').getValue(),
                    cryptoCurrency: ExtUtil.referenceQuery('cryptoCurrencyAddField').getValue(),
                    dealType: ExtUtil.referenceQuery('dealTypeAddField').getValue(),
                    personalDiscount: ExtUtil.referenceQuery('personalDiscountAddField').getValue()
                },
                success: function (response) {
                    ExtUtil.referenceQuery('fiatAmountField').setValue(Number(response.body.data.amount))
                    ExtUtil.maskOff('fiatAmountFieldContainer')
                }
            })
        }, 10);
    },

    saveDeal: function (me) {
        let dealTypeAddField = ExtUtil.referenceQuery('dealTypeAddField')
        if (!dealTypeAddField.isValid()) return
        let cryptoCurrencyAddField = ExtUtil.referenceQuery('cryptoCurrencyAddField')
        if (!cryptoCurrencyAddField.isValid()) return
        let cryptoAmountField = ExtUtil.referenceQuery('cryptoAmountField')
        if (!cryptoAmountField.validate()) return
        let fiatCurrencyAddField = ExtUtil.referenceQuery('fiatCurrencyAddField')
        if (!fiatCurrencyAddField.isValid()) return
        let fiatAmountField = ExtUtil.referenceQuery('fiatAmountField')
        if (!fiatAmountField.isValid()) return
        let params = {
            dealType: dealTypeAddField.getValue(),
            cryptoCurrency: cryptoCurrencyAddField.getValue(),
            cryptoAmount: cryptoAmountField.getValue(),
            fiatCurrency: fiatCurrencyAddField.getValue(),
            amount: fiatAmountField.getValue(),
        }

        ExtUtil.mask('addDialog', 'Расчет')
        setTimeout(function () {
            ExtUtil.mRequest({
                url: '/deal/bot/saveDeal',
                async: false,
                params: params,
                success: function (response) {
                    Ext.getStore('botDealStore').reload()
                    ExtUtil.maskOff('addDialog')
                }
            })
        }, 10);
    }
})