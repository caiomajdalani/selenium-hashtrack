'use strict'

const path = require('path');
const index = require(path.join(__dirname, 'index.js'));
const driver = require(path.join(__dirname, 'webdriver.js')).driver;
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

const apontamentoManualDuracao = async() => {
    try {
        await index.openPage();
        await index.userLogin('suporte@hashtrack.io', '123');
        driver.sleep(2000);
        //check and select the option "duration" on account informations
        const account = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.dropdown > a > span'));
        account.click();
        const accountConfig = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.dropdown.open > ul > li:nth-child(2) > a'));
        accountConfig.click();
        const timesheetControl = await driver.findElement(By.css('body > div.uiview.ng-scope > div > div:nth-child(2) > div > div.row > div > div > div > form > div:nth-child(9) > div.col-md-12 > div > div > div > input'));
        timesheetControl.click();
        const timesheetControlSaveButton = await driver.findElement(By.css('body > div.uiview.ng-scope > div > div:nth-child(2) > div > div.row > div > div > div > form > div:nth-child(9) > div.row.text-center > button.btn.btn-success.btn-sm'));
        timesheetControlSaveButton.click();
        driver.sleep(3000);
        //check and delete appoitments
        await index.clearAppointments();
        //click on new appointment
        const buttonNovoApontamento = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.ng-scope > button'));
        buttonNovoApontamento.click();
        driver.sleep(2000);
        //click to open client dropdown
        const clientDropdown = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(1) > div > div > div > a > span.select2-chosen.ng-binding'));
        clientDropdown.click();
        driver.sleep(2000);
        //select the option Cliente 1
        const comboboxClient = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(1) > div > div > div > div > div > input'));
        comboboxClient.sendKeys('Cliente 1');
        comboboxClient.sendKeys(Key.ENTER);
        driver.sleep(2000);
        //click to open project dropdown
        const projectDropdown = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(2) > div > div > div > a > span.select2-chosen.ng-binding'));
        projectDropdown.click();
        driver.sleep(2000);
        //select the option Projeto 1
        const comboboxProject = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(2) > div > div > div > div > div > input'));
        comboboxProject.sendKeys('Projeto 1');
        comboboxProject.sendKeys(Key.ENTER);
        driver.sleep(2000);
        //click to open task dropdown
        const taskDropdown = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(3) > div > a > span.select2-chosen.ng-binding'));
        taskDropdown.click();
        driver.sleep(2000);
        //select the option Tarefa 1
        const comboboxTask = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(3) > div > div > div > input'));
        comboboxTask.sendKeys('Tarefa 1');
        comboboxTask.sendKeys(Key.ENTER);
        driver.sleep(2000);
        //enter the duration (hours and minutes)
        const hoursDuration = await driver.findElement(By.xpath('//*[@id="tabNormal"]/form/div/div[2]/div[7]/div/div/input[1]'));
        hoursDuration.sendKeys('12');
        const minutesDuration = await driver.findElement(By.xpath('//*[@id="tabNormal"]/form/div/div[2]/div[7]/div/div/input[2]'));
        minutesDuration.sendKeys('33');
        driver.sleep(2000);
        //click on "salvar" button
        const saveButton = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(8) > button'));
        saveButton.click();
        driver.sleep(5000);
        //check the appointment fields
        const hourAppointment = await driver.findElement(By.name('hour'));
        const minuteAppointment = await driver.findElement(By.name('minute'));
        const valueHour = await hourAppointment.getAttribute('value');
        const valueMinute = await minuteAppointment.getAttribute('value');
        if (valueHour == 12) {
            if (valueMinute == 33) {
                console.log('Test Passed, driver will close.');
                driver.sleep(5000);
                driver.quit();
            } else {
                console.log('Test Failed! The minute value is different from ' + valueMinute + '. Check screenshot error.');
                index.takeScreenshotError('apontamentoManualDuracao', '.jpg');
                driver.sleep(5000);
                driver.quit();
            }
        } else {
            console.log('Test Failed! The hour value is different from ' + valueHour + '. Check screenshot error.');
            index.takeScreenshotError('apontamentoManualDuracao', '.jpg');
            driver.sleep(5000);
            driver.quit();
        }
    } catch (error) {
        console.error(error);
        index.takeScreenshotError('apontamentoManualDuracao', '.jpg');
        console.log('Something happens. Check the console error.');
        driver.sleep(5000);
        driver.quit();
    }

}

apontamentoManualDuracao();