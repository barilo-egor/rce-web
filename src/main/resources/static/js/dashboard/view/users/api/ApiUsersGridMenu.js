Ext.define('Dashboard.view.users.api.ApiUsersGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apiusersgridmenu',

    items: [
        {
            text: 'Скопировать ID',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('id'))
                ExtMessages.topToast('ID скопирован в буфер обмена')
            }
        },
        {
            text: 'Скопировать токен',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('token'))
                ExtMessages.topToast('Токен скопирован в буфер обмена')
            }
        },
        '-',
        {
            text: 'Расчет',
            iconCls: 'x-fa fa-calculator lightBlue',
            reference: 'calculationGridButton',
            handler: function(me) {
                Ext.create('Dashboard.view.users.api.calculate.CalculationDialog').show()
            }
        },
        {
            text: 'Удалить',
            iconCls: 'x-fa fa-trash-alt redColor',
            handler: function (me) {
                Ext.create('Dashboard.view.users.api.dialog.ApiUserDeleteDialog').show()
            }
        }
    ]
})