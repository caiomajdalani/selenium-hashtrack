'use strict'

const path = require('path');
const index = require(path.join(__dirname, 'index.js'));
const driver = require(path.join(__dirname, 'webdriver.js')).driver;
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

const apontamentoTimer = async() => {
    try {
        await index.openPage();
        await index.userLogin('suporte@hashtrack.io', '123');
        driver.sleep(2000);
        //check and delete all appointments
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
        //click on Iniciar Timer button
        const timerButton = await driver.findElement(By.css('#tabNormal > form > div > div.form > div:nth-child(5) > button'));
        timerButton.click();
        driver.sleep(5000);
        var stopButton = await driver.findElements(By.className('btn btn-sm btn-danger btn-tracking'));
        if (stopButton.length != 0) {
            console.log('Test Passed, driver will close.');
            stopButton = await driver.findElement(By.className('btn btn-sm btn-danger btn-tracking'));
            stopButton.click();
            driver.sleep(5000);
            driver.quit();
        } else {
            console.log('Stop Button was not found. Test Failed. Verify the screenshot attached.');
            index.takeScreenshotError('apontamentoTimer', '.jpg');
            driver.sleep(5000);
            driver.quit();
        }

    } catch (error) {
        console.error(error);
        index.takeScreenshotError('apontamentoTimer', '.jpg');
        console.log('Something happens. Check the console error.');
        driver.sleep(5000);
        driver.quit();

    }
};

apontamentoTimer();