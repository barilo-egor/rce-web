Ext.define('Dashboard.view.main.DashboardWorkspace', {
    extend: 'Ext.Panel',
    xtype: 'dashboardworkspace',
    reference: 'dashboardworkspace',

    shadow: true,
    margin: '10 10 10 10',
    padding: '20 20 20 20',

    items: [
        {
            xtype: 'textfield',
            label: 'Label'
        }
    ]
})