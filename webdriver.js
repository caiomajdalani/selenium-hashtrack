'use strict';

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let _driver = null;

const getInstanceDriver = () => {
    return new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chrome')
        .build();
};



module.exports = {
    get driver() {
        if (!_driver)
            _driver = getInstanceDriver();

        return _driver;
    }
}