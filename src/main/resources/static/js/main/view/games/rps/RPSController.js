Ext.define('Main.view.games.rps.RPSController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rpsController',

    change: function (me) {
        if (me.value !== me.defaultValue) {
            me.setFieldStyle('color:#157fcc; font-weight: bold;')
        } else {
            me.setFieldStyle('color: #404040;\n' +
                'padding: 5px 10px 4px;\n' +
                'background-color: #fff;\n' +
                'font: 300 13px/21px \'Open Sans\', \'Helvetica Neue\', helvetica, arial, verdana, sans-serif;\n' +
                (me.xtype === 'textarea' ? 'min-height: 80px;' : 'min-height: 30px;'))
        }
    },

    beforerender: function (me) {
        ExtUtil.request({
            async: false,
            method: 'GET',
            url: '/web/properties/getPropertiesValues',
            params: {
                propertiesPath: 'RPS_PROPERTIES',
                keys: [
                    'button.text', 'sums'
                ]
            },
            success: function (response) {
                let data = response.body.data
                for (let entry of data) {
                    let field = ExtUtil.referenceQuery(entry.key + '-field')
                    field.setValue(entry.value)
                    field.defaultValue = field.getValue()
                    field.fireEvent('change', field)
                }
            }
        })
        ExtUtil.request({
            async: false,
            method: 'GET',
            url: '/web/properties/getPropertiesValues',
            params: {
                propertiesPath: 'RPS_MESSAGE',
                keys: [
                    'start', 'referral.balance', 'select.rate', 'win.sum', 'rock', 'paper', 'scissors',
                    'ask', 'win', 'lose', 'draw'
                ]
            },
            success: function (response) {
                let data = response.body.data
                for (let entry of data) {
                    let field = ExtUtil.referenceQuery(entry.key + '-field')
                    field.setValue(entry.value)
                    field.defaultValue = field.getValue()
                    field.fireEvent('change', field)
                }
            }
        })
    },

    saveButtonClick: function (me) {
        ExtUtil.loadingByReference('rpsPanel')
        let configKeys = ['button.text', 'sums']
        let configPropertiesValues = []
        let references = []
        configKeys.forEach(key => {
            let reference = key + '-field'
            references.push(reference)
            configPropertiesValues.push({
                key: key,
                value: ExtUtil.referenceQuery(reference).getValue()
            })
        })
        ExtUtil.request({
            url: '/web/properties/updateProperties',
            jsonData: configPropertiesValues,
            async: false,
            loadingComponentRef: 'rpsPanel',
            params: {
                propertiesPath: 'RPS_PROPERTIES'
            },
            success: function (response) {
                references.forEach(reference => {
                    let field = ExtUtil.referenceQuery(reference)
                    field.setFieldStyle('color: #404040;\n' +
                        'padding: 5px 10px 4px;\n' +
                        'background-color: #fff;\n' +
                        'font: 300 13px/21px \'Open Sans\', \'Helvetica Neue\', helvetica, arial, verdana, sans-serif;\n' +
                        (me.xtype === 'textarea' ? 'min-height: 80px;' : 'min-height: 30px;'))
                    field.defaultValue = field.getValue()
                })
                references = []
            }
        })

        let messageKeys = [                    'start', 'referral.balance', 'select.rate', 'win.sum', 'rock', 'paper', 'scissors',
            'ask', 'win', 'lose', 'draw']
        let messagePropertiesValues = []
        messageKeys.forEach(key => {
            let reference = key + '-field'
            references.push(reference)
            messagePropertiesValues.push({
                key: key,
                value: ExtUtil.referenceQuery(reference).getValue()
            })
        })
        ExtUtil.request({
            url: '/web/properties/updateProperties',
            jsonData: messagePropertiesValues,
            loadingComponentRef: 'rpsPanel',
            params: {
                propertiesPath: 'RPS_MESSAGE'
            },
            async: false,
            success: function (response) {
                references.forEach(reference => {
                    let field = ExtUtil.referenceQuery(reference)
                    field.setFieldStyle('color: #404040;\n' +
                        'padding: 5px 10px 4px;\n' +
                        'background-color: #fff;\n' +
                        'font: 300 13px/21px \'Open Sans\', \'Helvetica Neue\', helvetica, arial, verdana, sans-serif;\n' +
                        (me.xtype === 'textarea' ? 'min-height: 80px;' : 'min-height: 30px;'))
                    field.defaultValue = field.getValue()
                })
                references = []
                Ext.Msg.alert('Внимание', 'Настройки обновлены.')
                ExtUtil.turnOffLoadingByReference('rpsPanel')
            }
        })
    }
})