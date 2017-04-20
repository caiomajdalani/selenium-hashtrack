'use strict'

const path = require('path');
const index = require(path.join(__dirname, 'index.js'));
const driver = require(path.join(__dirname, 'webdriver.js')).driver;
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

const apontamentoReplicado = async() => {
    try {
        await index.openPage();
        await index.userLogin('suporte@hashtrack.io', '123');
        driver.sleep(2000);
        //check on account informations
        const account = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.dropdown > a > span'));
        account.click();
        const accountConfig = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.dropdown.open > ul > li:nth-child(2) > a'));
        accountConfig.click();
        await driver.sleep(2000);
        //select duration
        const timesheetControl = await driver.findElement(By.css('body > div.uiview.ng-scope > div > div:nth-child(2) > div > div.row > div > div > div > form > div:nth-child(8) > div > div > div > div > input'));
        timesheetControl.click();
        //check "permitir apontamentos replicados" 
        let saveButton;
        const replicatedAppointment = await driver.findElement(By.id('toggle-allowCharge'));
        let replicatedAppointmentClass = await replicatedAppointment.getAttribute('class');
        if (replicatedAppointmentClass.includes('ng-empty')) {
            let switchRightReplicated = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[2]/div/div/div/form/div[2]/div/div/label'));
            await switchRightReplicated.click();
            driver.sleep(2000);
            saveButton = await driver.findElement(By.css('body > div.uiview.ng-scope > div > div:nth-child(2) > div > div.row > div > div > div > form > div:nth-child(9) > div.row.text-center > button.btn.btn-success.btn-sm'));
            await saveButton.click();
            driver.sleep(3000);
        } else {
            saveButton = await driver.findElement(By.css('body > div.uiview.ng-scope > div > div:nth-child(2) > div > div.row > div > div > div > form > div:nth-child(9) > div.row.text-center > button.btn.btn-success.btn-sm'));
            await saveButton.click();
            driver.sleep(3000);
        }
        //select repeat (week)
        await appointmentBase();
        await replicatedWeek();
        //select repeat (all days)
        await appointmentBase();
        await replicatedAllDays();
        //select repeat (custom)
        await appointmentBase();
        await replicatedCustom();


    } catch (error) {
        console.error(error);
        console.log('Something happens. Check the console error.');
        driver.sleep(5000);
        driver.quit();
    }
}

const appointmentBase = async() => {
    //check and delete appoitments (for replicated, select 01-01-2018 on calendar)
    await index.clearAppointments('replicado');
    //click on new appointment
    const buttonNovoApontamento = await driver.findElement(By.css('#header > nav > div.navbar-right > ul > li.ng-scope > button'));
    await buttonNovoApontamento.click();
    driver.sleep(5000);
    //click on "replicado" option
    const replicatedOption = await driver.findElement(By.xpath('/html/body/div[1]/div/div/ul/li[2]'));
    await replicatedOption.click();
    await driver.sleep(2000);
    //find dates dates
    let initialDate = await driver.findElement(By.css('#dpicker > div > div:nth-child(1) > div > input'));
    let finalDate = await driver.findElement(By.css('#dpicker > div > div:nth-child(2) > div > input'));
    //select initial date (12-31-2017)
    await initialDate.click();
    let datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
    await datePicker.click();
    datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
    await datePicker.click();
    let datePickerYear = await driver.findElement(By.css("*[id^='datepicker-'][id$='-17']"));
    await datePickerYear.click();
    let datePickerMonth = await driver.findElement(By.css("*[id^='datepicker-'][id$='-0']"));
    await datePickerMonth.click();
    let datePickerDay = await driver.findElement(By.css("*[id^='datepicker-'][id$='-0']"));
    await datePickerDay.click();
    //select final date (01-06-2018)
    await finalDate.click();
    datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
    await datePicker.click();
    datePicker = await driver.findElement(By.css("*[id^='datepicker-'][id$='-title']"));
    await datePicker.click();
    datePickerYear = await driver.findElement(By.css("*[id^='datepicker-'][id$='-17']"));
    await datePickerYear.click();
    datePickerMonth = await driver.findElement(By.css("*[id^='datepicker-'][id$='-0']"));
    await datePickerMonth.click();
    datePickerDay = await driver.findElement(By.css("*[id^='datepicker-'][id$='-6']"));
    await datePickerDay.click();
    //select client
    const clientCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(1) > div > div > div'));
    await clientCombobox.click();
    driver.sleep(1000);
    let clientField = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(1) > div > div > div > div > div > input'));
    await clientField.sendKeys('Cliente 1');
    clientField.sendKeys(Key.ENTER);
    driver.sleep(2000);
    //select project
    const projectCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(2) > div > div > div'));
    await projectCombobox.click();
    driver.sleep(1000);
    let projectField = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(2) > div > div > div > div > div > input'));
    projectField.sendKeys('Projeto 1');
    projectField.sendKeys(Key.ENTER);
    driver.sleep(2000);
    //select task
    const taskCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(3) > div'));
    await taskCombobox.click();
    driver.sleep(1000);
    let taskField = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div:nth-child(3) > div > div > div > input'));
    taskField.sendKeys('Tarefa 1');
    taskField.sendKeys(Key.ENTER);
    driver.sleep(2000);
    //select and insert "inicio / fim" fields
    const initHour = await driver.findElement(By.xpath('//*[@id="tabCharge"]/form/div[2]/div[2]/div[6]/div[2]/div/input[1]'));
    initHour.sendKeys('1033');
    const finalHour = await driver.findElement(By.xpath('//*[@id="tabCharge"]/form/div[2]/div[2]/div[6]/div[2]/div/input[2]'));
    finalHour.sendKeys('2035');
}

const replicatedWeek = async() => {
    //select repeat (week)
    let repeatCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select'));
    await repeatCombobox.click();
    driver.sleep(1000);
    let selectRepeat = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select > option:nth-child(3)'));
    selectRepeat.click();
    //click on "salvar" button
    let saveButton = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div.form-group.btns-modal-appointment > button'));
    await saveButton.click();
    await driver.sleep(3000);
    //select day 01
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
    //check week results for all days 
    //day 01
    let finalResult = await index.checkResultsForHour();
    if (finalResult) {
        //day 02
        let selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[3]/button'));
        await selectDay.click();
        driver.sleep(3000);
        finalResult = await index.checkResultsForHour();
        if (finalResult) {
            //day 03
            selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[4]/button'));
            await selectDay.click();
            driver.sleep(3000);
            finalResult = await index.checkResultsForHour();
            if (finalResult) {
                //day 04
                selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[5]/button'));
                await selectDay.click();
                driver.sleep(3000);
                finalResult = await index.checkResultsForHour();
                if (finalResult) {
                    //day 05
                    selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[6]/button'));
                    await selectDay.click();
                    driver.sleep(3000);
                    finalResult = await index.checkResultsForHour();
                    if (finalResult) {
                        console.log('Results for all days are correct for weekly replicated appointment. Test Passed.');
                        driver.sleep(5000);
                    } else {
                        console.log('Something is wrong with 5th day of weekly apointment results.');
                    }
                } else {
                    console.log('Something is wrong with fourth day of weekly apointment results.');
                }

            } else {
                console.log('Something is wrong with third day of weekly apointment results.');
            }

        } else {
            console.log('Something is wrong with second day of weekly apointment results.');
        }

    } else {
        console.log('Something is wrong with first day of weekly apointment results.');
    }

}

const replicatedAllDays = async() => {
    //select repeat (all days)
    let repeatCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select'));
    await repeatCombobox.click();
    driver.sleep(1000);
    let selectRepeat = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select > option:nth-child(2)'));
    selectRepeat.click();
    //click on "salvar" button
    let saveButton = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div.form-group.btns-modal-appointment > button'));
    await saveButton.click();
    await driver.sleep(3000);
    //select day 01
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
    let datePickerDay = await driver.findElement(By.css("*[id^='datepicker-'][id$='-0']"));
    await datePickerDay.click();
    driver.sleep(2000);
    //check week results for all days 
    //day 01
    let finalResult = await index.checkResultsForHour();
    if (finalResult) {
        //day 02
        let selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[2]/button'));
        await selectDay.click();
        driver.sleep(3000);
        finalResult = await index.checkResultsForHour();
        if (finalResult) {
            //day 03
            selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[3]/button'));
            await selectDay.click();
            driver.sleep(3000);
            finalResult = await index.checkResultsForHour();
            if (finalResult) {
                //day 04
                selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[4]/button'));
                await selectDay.click();
                driver.sleep(3000);
                finalResult = await index.checkResultsForHour();
                if (finalResult) {
                    //day 05
                    selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[5]/button'));
                    await selectDay.click();
                    driver.sleep(3000);
                    finalResult = await index.checkResultsForHour();
                    if (finalResult) {
                        //day 06
                        selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[6]/button'));
                        await selectDay.click();
                        driver.sleep(3000);
                        finalResult = await index.checkResultsForHour();
                        if (finalResult) {
                            //day 07
                            selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[7]/button'));
                            await selectDay.click();
                            driver.sleep(3000);
                            finalResult = await index.checkResultsForHour();
                            if (finalResult) {
                                console.log('Results for all days are correct for daily replicated appointment. Test Passed.');
                                driver.sleep(5000);
                            } else {
                                console.log('Something is wrong with 7th day of daily apointment results.');
                            }

                        } else {
                            console.log('Something is wrong with 6th day of daily apointment results.');
                        }

                    } else {
                        console.log('Something is wrong with 5th day of daily apointment results.');
                    }
                } else {
                    console.log('Something is wrong with fourth day of daily apointment results.');
                }

            } else {
                console.log('Something is wrong with third day of daily apointment results.');
            }

        } else {
            console.log('Something is wrong with second day of daily apointment results.');
        }

    } else {
        console.log('Something is wrong with first day of daily apointment results.');
    }
}

const replicatedCustom = async() => {
    //select repeat (custom)
    let repeatCombobox = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select'));
    await repeatCombobox.click();
    driver.sleep(1000);
    let selectRepeat = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > select > option:nth-child(4)'));
    selectRepeat.click();
    //select custom days
    let firstDay = await driver.findElement(By.id('1')); //monday
    await firstDay.click();
    let secondDay = await driver.findElement(By.id('3')); //wednesday
    await secondDay.click();
    let thirdDay = await driver.findElement(By.id('5')); //friday
    await thirdDay.click();
    //click on "salvar" button
    let saveButton = await driver.findElement(By.css('#tabCharge > form > div.container-fluid.modal-novo-apontamento > div.form > div.form-group.btns-modal-appointment > button'));
    await saveButton.click();
    await driver.sleep(3000);
    //select day 01
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
    //check week results for all days 
    //day 01
    let finalResult = await index.checkResultsForHour();
    if (finalResult) {
        //day 02
        let selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[4]/button'));
        await selectDay.click();
        driver.sleep(3000);
        finalResult = await index.checkResultsForHour();
        if (finalResult) {
            //day 03
            selectDay = await driver.findElement(By.xpath('/html/body/div[2]/div/div[2]/div/div[3]/div/div/div/div[1]/div/ul/li[6]/button'));
            await selectDay.click();
            driver.sleep(3000);
            finalResult = await index.checkResultsForHour();
            if (finalResult) {
                console.log('Results for all days are correct for custom replicated appointment. Test Passed.');
                driver.sleep(5000);
                driver.quit();
            } else {
                console.log('Something is wrong with third day of custom apointment results.');
            }
        } else {
            console.log('Something is wrong with second day of custom apointment results.');
        }
    } else {
        console.log('Something is wrong with first day of custom apointment results.');
    }
}

apontamentoReplicado();