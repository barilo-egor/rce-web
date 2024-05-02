let GamesUtil = {

    getProperties: function (panel) {
        ExtUtil.request({
            async: false,
            method: 'GET',
            url: '/web/properties/getPropertiesValues',
            params: {
                propertiesPath: panel.gameProperties.configPropertiesPath,
                keys: panel.gameProperties.configKeys
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
                propertiesPath: panel.gameProperties.messagePropertiesPath,
                keys: panel.gameProperties.messageKeys
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

    updateProperties: function (panel) {
        ExtUtil.loadingByComponent(panel)
        let configPropertiesValues = []
        let references = []
        panel.gameProperties.configKeys.forEach(key => {
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
            loadingComponent: panel,
            params: {
                propertiesPath: panel.gameProperties.configPropertiesPath
            },
            success: function (response) {
                references.forEach(reference => GamesUtil.updateDefaultValue(reference))
                references = []
            }
        })

        let messagePropertiesValues = []
        panel.gameProperties.messageKeys.forEach(key => {
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
            loadingComponent: panel,
            params: {
                propertiesPath: panel.gameProperties.messagePropertiesPath
            },
            async: false,
            success: function (response) {
                references.forEach(reference => GamesUtil.updateDefaultValue(reference))
                references = []
                Ext.Msg.alert('Внимание', 'Настройки обновлены.')
                ExtUtil.turnOffLoadingByComponent(panel)
            }
        })
    },

    updateDefaultValue(reference) {
        let field = ExtUtil.referenceQuery(reference)
        field.setFieldStyle('color: #404040;\n' +
            'padding: 5px 10px 4px;\n' +
            'background-color: #fff;\n' +
            'font: 300 13px/21px \'Open Sans\', \'Helvetica Neue\', helvetica, arial, verdana, sans-serif;\n' +
            (field.xtype === 'textarea' ? 'min-height: 80px;' : 'min-height: 30px;'))
        field.defaultValue = field.getValue()
    }
}