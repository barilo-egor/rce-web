Ext.define('Main.view.webUser.control.EditUserWindow', {
    extend: 'Ext.window.Window',
    width: '40%',
    height: '95%',
    draggable: false,
    autoShow: true,
    title: 'Редактирование пользователя',

    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Login',
            bind: {
                value: '{user.login}'
            },
            validator: ValidatorUtil.validateLogin
        },
        {
            xtype: 'combobox',
            fieldLabel: 'Роль',
            displayField: 'displayName',
            emptyText: 'Роль',
            valueField: 'name',
            store: 'roleStore',
            validator: ValidatorUtil.validateNotEmpty
        },
    ]
})