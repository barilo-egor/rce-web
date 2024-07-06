let RegexUtil = {
    onlyLettersAndNumbers: function (str) {
        return /^[A-Za-z0-9]{4,20}$/.test(str);
    },

    onlyNumbers: function (str) {
        return /^[0-9]*$/.test(str);
    }
}