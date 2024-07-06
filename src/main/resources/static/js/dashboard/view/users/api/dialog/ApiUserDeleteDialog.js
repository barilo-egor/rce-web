Ext.define('Dashboard.view.users.api.dialog.ApiUserDeleteDialog', {
    extend: 'Common.dialog.CommonDialog',
    reference: 'deleteDialog',

    title: 'Удаление пользователя',

    buttons: [
        {
            text: 'Удалить',
            handler: function (me) {
                let value = ExtUtil.referenceQuery('deleteUserRadio').getValue()
                let idDeleteField = ExtUtil.referenceQuery('idDeleteField')
                let params = {}
                if (value === 1) {
                    if (!idDeleteField.validate) return
                    params.newUserId = idDeleteField.getValue()
                }
                params.deleteUserId = ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('id')
                ExtUtil.mask('deleteDialog', 'Удаление клиента')
                ExtUtil.mRequest({
                    url: '/users/api/delete',
                    loadingComponentRef: 'deleteDialog',
                    params: params,
                    success: function (response) {
                        Ext.getStore('apiUserStore').reload()
                        ExtUtil.maskOff('deleteDialog')
                        ExtUtil.referenceQuery('deleteDialog').close()
                    }
                })
            }
        }
    ],
    buttonAlign: 'center',
    closable: true,

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            width: '100%',
            xtype: 'radiogroup',
            reference: 'deleteUserRadio',
            listeners: {
                change: function (me, newValue) {
                    if (newValue === 2) {
                        ExtUtil.referenceQuery('idDeleteField').hide()
                        me.getItems().items[0].setChecked(false)
                    } else {
                        ExtUtil.referenceQuery('idDeleteField').show()
                        me.getItems().items[1].setChecked(false)
                    }
                }
            },
            items: [
                {
                    label: 'Перенести сделки на другого пользователя',
                    width: 300,
                    value: 1,
                    checked: true
                },
                {
                    label: 'Удалить все сделки пользователя',
                    width: 230,
                    value: 2
                }
            ]
        },
        {
            xtype: 'textfield',
            reference: 'idDeleteField',
            label: 'ID пользователя',
            required: true,
            requiredMessage: 'Введите ID для переноса сделок',
            validators: function (val) {
                let result = false
                ExtUtil.mRequest({
                    url: '/users/api/isExistById',
                    method: 'GET',
                    params: {
                        id: val
                    },
                    async: false,
                    success: function (response) {
                        result = response.body.data.exist === true
                    }
                })
                if (result === true) {
                    return true
                } else {
                    return 'Клиента с таким ID не найдено.'
                }
            }
        }
    ]
})