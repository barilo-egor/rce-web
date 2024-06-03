const ExtUtilConfig = {
    SUPPORT: {
        COLLAPSIBLE_OBJECTS: {
            TOP: {
                direction: 'top',
                expandToolText: 'Развернуть',
                collapseToolText: 'Свернуть'
            },
            RIGHT: {
                direction: 'right',
                expandToolText: 'Развернуть',
                collapseToolText: 'Свернуть'
            },
            LEFT: {
                direction: 'left',
                expandToolText: 'Развернуть',
                collapseToolText: 'Свернуть'
            },
            BOTTOM: {
                direction: 'bottom',
                expandToolText: 'Развернуть',
                collapseToolText: 'Свернуть'
            }
        }
    },
    getCollapsible(direction) {
        debugger
        switch (direction) {
            case 'top': return this.SUPPORT.COLLAPSIBLE_OBJECTS.TOP
            case 'right': return this.SUPPORT.COLLAPSIBLE_OBJECTS.RIGHT
            case 'left': return this.SUPPORT.COLLAPSIBLE_OBJECTS.LEFT
            case 'bottom': return this.SUPPORT.COLLAPSIBLE_OBJECTS.BOTTOM
        }
    }
}