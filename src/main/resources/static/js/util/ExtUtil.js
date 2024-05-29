let ExtUtil = {

    COMPONENTS: {
        disable: function (components) {
            for (let component of components) {
                component.disable()
            }
        },
        enable: function (components) {
            for (let component of components) {
                component.enable()
            }
        },
        allowBlank: function (value, components) {
            for (let component of components) {
                component.allowBlank = value
            }
        },
        hide: function (components) {
            for (let component of components) {
                component.hide()
            }
        },
        show: function (components) {
            for (let component of components) {
                component.show()
            }
        }
    },

    Msg: {
        error: function (config) {
            Ext.create('Ext.window.Window', {
                autoShow: true,
                modal: true,
                width: 350,
                title: 'Ошибка',
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'OK',
                        handler: ExtUtil.closeWindow
                    }
                ],
                items: [
                    {
                        xtype: 'container',
                        margin: '10 10 10 10',
                        html: config.text
                    }
                ]
            })
        },
        message: function (config) {
            Ext.create('Ext.window.Window', {
                autoShow: true,
                modal: true,
                width: 350,
                title: config.title ? config.title : 'Справка',
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'OK',
                        handler: ExtUtil.closeWindow
                    }
                ],
                items: [
                    {
                        xtype: 'container',
                        margin: '10 10 10 10',
                        html: '<div style="text-align: center;">' + config.text + '</div>'
                    }
                ]
            })
        }
    },

    changeDefaultValue: function (me) {
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

    forceComboFirstValue: function (me) {
        me.setValue(me.getStore().getAt(0))
    },

    idQuery: function (id) {
        return Ext.ComponentQuery.query('[id=' + id + ']')[0]
    },

    referenceQuery: function (reference) {
        return Ext.ComponentQuery.query('[reference=' + reference + ']')[0]
    },

    request: function (config) {
        let requestObj = {}
        requestObj.url = config.url
        requestObj.method = config.method ? config.method : 'POST'
        if (config.params) requestObj.params = config.params
        if (config.jsonData) requestObj.jsonData = config.jsonData
        let failure = this.failure
        requestObj.failure = function(response) {
            if (config.loadingComponent) {
                config.loadingComponent.setLoading(false)
            } else if (config.loadingComponentRef) {
                ExtUtil.turnOffLoadingByReference(config.loadingComponentRef)
            }
            failure(response)
        }
        requestObj.async = config.async !== false
        requestObj.success = function (rawResponse) {
            let response = Ext.JSON.decode(rawResponse.responseText)
            if (!response.success) {
                let addingText = response.description
                    ? ': ' + response.description
                    : '. Информация отсутствует.'
                ExtUtil.Msg.error({
                    text: 'Ошибка сервера<p>' + addingText
                })
                if (config.loadingComponent) config.loadingComponent.setLoading(false)
            } else if (response.body && response.body.warningString){
                Ext.Msg.alert('Внимание', response.body.warningString)
                if (config.loadingComponent) config.loadingComponent.setLoading(false)
            } else {
                if (response.body && response.body.message) {
                    Ext.Msg.alert('Информация', response.body.message)
                }
                if (response.body && response.body.toast) {
                    Ext.toast(response.body.toast)
                }
                config.success(response, rawResponse)
            }
        }
        Ext.Ajax.request(requestObj)
    },

    mRequest: function (config) {
        let requestObj = {}
        requestObj.url = config.url
        requestObj.method = config.method ? config.method : 'POST'
        if (config.params) requestObj.params = config.params
        if (config.jsonData) requestObj.jsonData = config.jsonData
        let failure = this.failure
        requestObj.failure = function(response) {
            if (config.loadingComponent) {
                config.loadingComponent.setMasked(false)
            } else if (config.loadingComponentRef) {
                ExtUtil.turnOffLoadingByReference(config.loadingComponentRef)
            }
            failure(response)
        }
        requestObj.async = config.async !== false
        requestObj.success = function (rawResponse) {
            let response = Ext.JSON.decode(rawResponse.responseText)
            if (!response.success) {
                let addingText = response.description
                    ? ': ' + response.description
                    : '. Информация отсутствует.'
                ExtUtil.Msg.error({
                    text: 'Ошибка сервера<p>' + addingText
                })
                if (config.loadingComponent) config.loadingComponent.setMasked(false)
            } else if (response.body && response.body.warningString){
                Ext.Msg.alert('Внимание', response.body.warningString)
                if (config.loadingComponent) config.loadingComponent.setMasked(false)
            } else {
                if (response.body && response.body.message) {
                    Ext.Msg.alert('Информация', response.body.message)
                }
                if (response.body && response.body.toast) {
                    Ext.toast({
                        message: response.body.toast,
                        alignment: 't-t'
                    })
                }
                config.success(response, rawResponse)
            }
        }
        Ext.Ajax.request(requestObj)
    },

    failure: function (response) {
        Ext.create('Ext.Dialog', {
            title: 'Ошибка',
            html: 'Ошибка при выполнении запроса. Статус: ' + response.status + '.Описание: ' + response.statusText,
            closable: true
        }).show()
    },

    closeWindow: function (btn) {
        btn.up('window').close()
    },

    askBefore(config) {
        Ext.Msg.show({
            title: config.title,
            message: config.message,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    config.callback()
                }
            }
        });
    },

    toClipboard(value) {
        navigator.clipboard.writeText(value)
    },

    loadingByReference: function (reference) {
        ExtUtil.referenceQuery(reference).setLoading('Пожалуйста, ждите...')
    },

    mask: function (reference, text) {
        ExtUtil.referenceQuery(reference).setMasked(text ? text : 'Пожалуйста, ждите...')
    },

    maskOff: function (reference) {
        ExtUtil.referenceQuery(reference).setMasked(false)
    },

    loadingByComponent: function (component) {
        component.setLoading('Пожалуйста, ждите...')
    },

    turnOffLoadingByReference: function (reference) {
        ExtUtil.referenceQuery(reference).setLoading(false)
    },

    turnOffLoadingByComponent: function (component) {
        component.setLoading(false)
    },

    getJsonData: function (fieldsReferences) {
        let jsonData = {}
        for (let fieldReference of fieldsReferences) {
            let field = ExtUtil.referenceQuery(fieldReference)
            if (!field) {
                throw new Error('Не найден компонент по reference=' + fieldReference)
            }
            let value = field.getValue()
            if (value) {
                jsonData[fieldReference.substring(0, fieldReference.indexOf('Field'))] = value
            }
        }
        return jsonData
    }
}