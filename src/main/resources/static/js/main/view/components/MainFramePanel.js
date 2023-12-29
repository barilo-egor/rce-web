let STORE_UPDATE_RUNNER = new Ext.util.TaskRunner()
let STORE_UPDATE_FUNCTION = function () {
    Ext.getStore('botDealStore').reload()
}
STORE_UPDATE_RUNNER.start({
    run: STORE_UPDATE_FUNCTION,
    interval: 5000
})

Ext.define('Main.view.components.MainFramePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainframepanel',
    padding: '0 0 0 1',
    id: 'mainFramePanel',
    requires: [
        'Main.view.usdCourse.UsdCoursePanel',
        'Main.view.usdCourse.UsdCourseController',
        'Main.view.components.MainFrameTitle',
        'Main.view.components.MainFrameHeader',
        'Main.view.registration.RegistrationPanel',
        'Main.view.registration.RegistrationController',
        'Main.view.api.registration.ApiRegistrationPanel',
        'Main.view.api.registration.ApiRegistrationController',
        'Main.view.api.control.ApiUsersControlPanel',
        'Main.view.api.control.ApiUsersControlController',
        'Main.view.changePassword.ChangePasswordPanel',
        'Main.view.bulkDiscount.BulkDiscountPanel',
        'Main.view.bulkDiscount.BulkDiscountGridPanel',
        'Main.view.bulkDiscount.BulkDiscountController',
        'Main.view.bulkDiscount.BulkDiscountAddForm',
        'Main.view.paymentTypes.PaymentTypesPanel',
        'Main.view.deal.bot.BotDealsPanel',
        'Main.view.webUser.control.WebUserControlPanel'
    ],
    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'botdealspanel',
            scrollable: true
        }
    ]
})