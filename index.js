'use strict';

const fs = require('fs');
const path = require('path');
const driver = require(path.join(__dirname, 'webdriver.js')).driver;

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const checkResultsForHour = async() => {
    //check the appointment fields
    let initialHourAppointment = await driver.executeScript(() => {
        return document.querySelectorAll('.hour')[0].value;
    });
    let finalHourAppointment = await driver.executeScript(() => {
        return document.querySelectorAll('.hour')[1].value;
    });
    let initialMinuteAppointment = await driver.executeScript(() => {
        return document.querySelectorAll('.minute')[0].value;
    });
    let finalMinuteAppointment = await driver.executeScript(() => {
        return document.querySelectorAll('.minute')[1].value;
    });
    let totalAppointment = await driver.executeScript(() => {
        return document.querySelector('.box-total-time.ng-binding.ng-scope').innerText;
    })
    await driver.sleep(3000);
    if (initialHourAppointment == 10) {
        if (initialMinuteAppointment == 33) {
            if (finalHourAppointment == 20) {
                if (finalMinuteAppointment == 35) {
                    if (totalAppointment.trim() == '10:02') {
                        console.log('Appointment with correct values for this day.');
                        driver.sleep(5000);
                        return true;
                    } else {
                        console.log('Test Failed! The total time if different from ' + totalAppointment + '. Check screenshot error.');
                        index.takeScreenshotError('apontamentoManual', '.jpg');
                        driver.sleep(5000);
                        return false;
                    }

                } else {
                    console.log('Test Failed! The final minute value is different from ' + finalMinuteAppointment + '. Check screenshot error.');
                    index.takeScreenshotError('apontamentoManual', '.jpg');
                    driver.sleep(5000);
                    return false;
                }
            } else {
                console.log('Test Failed! The final hour value is different from ' + finalHourAppointment + '. Check screenshot error.');
                index.takeScreenshotError('apontamentoManual', '.jpg');
                driver.sleep(5000);
                return false;
            }
        } else {
            console.log('Test Failed! The initial minute value is different from ' + initialMinuteAppointment + '. Check screenshot error.');
            index.takeScreenshotError('apontamentoManual', '.jpg');
            driver.sleep(5000);
            return false;
        }
    } else {
        console.log('Test Failed! The initial hour value is different from ' + initialHourAppointment + '. Check screenshot error.');
        index.takeScreenshotError('apontamentoManual', '.jpg');
        driver.sleep(5000);
        return false;
    }
}

const clearAppointments = async(type) => {

    if (type == 'replicado') {
        let calendar = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[2]/div/div[1]/div/div/button[1]'));
        await calendar.click();
        let datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
        await datePicker.click();
        datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
        await datePicker.click();
        let datePickerYear = await driver.findElement(By.css("*[id^='datepicker-'][id$='-17']"));
        await datePickerYear.click();
        let datePickerMonth = await driver.findElement(By.css("*[id^='datepicker-'][id$='-0']"));
        await datePickerMonth.click();
        let datePickerDay = await driver.findElement(By.css("*[id^='datepicker-'][id$='-1']"));
        await datePickerDay.click();
        driver.sleep(2000);
    }

    let deleteAppointments = await driver.findElements(By.className('fa-trash-o'));
    while (deleteAppointments.length != 0) {
        let okButton;
        let appointment = deleteAppointments[0];
        await appointment.click();
        await driver.sleep(2000);
        let confirmDelete = await driver.findElement(By.css('body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button'));
        await confirmDelete.click();
        await driver.sleep(2000);
        //try to find success (if not, it is a replicated appointment)
        let result = await driver.findElements(By.css('body > div.sweet-alert.showSweetAlert.visible > div.sa-icon.sa-success.animate'));
        if (result.length != 0) {
            //its a normal appointment
            okButton = await driver.findElement(By.css('body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button'));
            await okButton.click();
            driver.sleep(2000);
        } else {
            //its a replicated appointment
            let clearAllReplicated = await driver.findElement(By.css('body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button'));
            await clearAllReplicated.click();
            driver.sleep(1000);
            okButton = await driver.findElement(By.css('body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button'));
            await okButton.click();
            driver.sleep(2000);
        }

        deleteAppointments = await driver.findElements(By.className('fa-trash-o'));
    }
}

const takeScreenshotError = async(fileName, ext) => {

    try {
        let count = 0;
        // C:\Users\caio.melo\Documents\Fcamara\Workspaces\Selenium - Hashtrack\screenshotErrors
        const screenshotPath = 'C:\\Users\\caio.melo\\Documents\\Fcamara\\Workspaces\\Selenium - Hashtrack\\screenshotErrors\\';
        while (fs.existsSync(path.join(screenshotPath, fileName + (count ? count : '').toString() + ext))) {
            count++;
        }

        const screenShot = await driver.takeScreenshot();
        const filename = path.join(screenshotPath, `${fileName}${(count ? count : '').toString()}${ext}`);

        fs.writeFileSync(filename, screenShot, 'base64');

    } catch (error) {
        console.error(error);
    }

}

const waitForAjax = async() => {
    while (true) {
        const ajaxIsComplete = await driver.executeScript('return $.active;');
        if (!ajaxIsComplete) break;
        await driver.sleep(3000);
    }
}

const openPage = async() => {
    await driver.get('https://app.hashtrack.io/');
}

const userLogin = async(username, password) => {

    const user = await driver.findElement(By.id('username'));
    user.sendKeys(username);
    const pass = await driver.findElement(By.id('password'));
    pass.sendKeys(password);
    driver.sleep(3000);
    // const loginButton = await driver.wait(until.elementIsEnabled(By.css('#loginForm > fieldset > button')));
    const loginButton = await driver.findElement(By.css('#loginForm > fieldset > button'));
    loginButton.click();
    waitForAjax();
    await driver.sleep(3000);
}



module.exports = {
    openPage,
    takeScreenshotError,
    waitForAjax,
    userLogin,
    clearAppointments,
    checkResultsForHour
};