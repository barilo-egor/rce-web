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
            ExtUtil.referenceQuery('enterInFiatCheckbox').setChecked(false)
        } else {
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
        let params = {
            dealType: ExtUtil.referenceQuery('dealTypeAddField').getValue(),
            cryptoCurrency: ExtUtil.referenceQuery('cryptoCurrencyAddField').getValue(),
            cryptoAmount: ExtUtil.referenceQuery('cryptoAmountField').getValue(),
            fiatCurrency: ExtUtil.referenceQuery('fiatCurrencyAddField').getValue(),
            amount: ExtUtil.referenceQuery('fiatAmountField').getValue(),
        }

    }
})