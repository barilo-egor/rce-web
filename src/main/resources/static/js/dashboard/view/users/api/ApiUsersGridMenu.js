Ext.define('Dashboard.view.users.api.ApiUsersGridMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'apiusersgridmenu',

    items: [
        {
            text: 'Скопировать токен',
            iconCls: 'x-fa fa-copy',
            handler: function (me) {
                navigator.clipboard.writeText(ExtUtil.referenceQuery('apiUsersGrid').getSelection().get('token'))
                ExtMessages.topToast('Токен скопирован в буфер обмена')
            }
        }
    ]
})