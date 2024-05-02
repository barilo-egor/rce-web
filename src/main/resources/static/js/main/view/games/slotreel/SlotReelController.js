Ext.define('Main.view.games.slotreel.SlotReelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.slotReelController',

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
                propertiesPath: 'SLOT_REEL_PROPERTIES',
                keys: [
                    'SLOT_REEL', 'try',
                    'seven.triple', 'seven.double',
                    'lemon.triple', 'lemon.double',
                    'cherry.triple', 'cherry.double',
                    'bar.triple', 'bar.double',
                    'button.try.text', 'button.close.text'
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
                propertiesPath: 'SLOT_REEL_MESSAGE',
                keys: [
                    'scroll', 'win', 'lose', 'start', 'balance.empty', 'try.cost'
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
        ExtUtil.loadingByReference('slotReelPanel')
        let configKeys = ['SLOT_REEL', 'try',
            'seven.triple', 'seven.double',
            'lemon.triple', 'lemon.double',
            'cherry.triple', 'cherry.double',
            'bar.triple', 'bar.double',
            'button.try.text', 'button.close.text']
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
            loadingComponentRef: 'slotReelPanel',
            params: {
                propertiesPath: 'SLOT_REEL_PROPERTIES'
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

        let messageKeys = ['scroll', 'win', 'lose', 'start', 'balance.empty', 'try.cost']
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
            loadingComponentRef: 'slotReelPanel',
            params: {
                propertiesPath: 'SLOT_REEL_MESSAGE'
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
                ExtUtil.turnOffLoadingByReference('slotReelPanel')
            }
        })
    }
})