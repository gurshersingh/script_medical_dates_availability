const webdriver = require('selenium-webdriver');
By=webdriver.By
until=webdriver.until
//const chrome = require('selenium-webdriver/chrome');

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'boyd.brekke63@ethereal.email',
        pass: 'BnAa95Z7TYc6KhDust'
    }
});

const sendEmail = () =>{
    return new Promise (async (resolve,reject)=>{
        //console.log(email,pin)
        try {
            let info = await transporter.sendMail({
                from: '"Gursher" <boyd.brekke63@ethereal.email>', // sender address
                to: 'gursher.patti@gmail.com', // list of receivers
                subject: "SinghSoftware: Medical date available", // Subject line
                text: "Medical date available", // plain text body
                html: `<b>Medical date available</b>`, // html body
              })
              console.log("Message sent: %s", info.messageId);
              resolve(info)
            }
         catch (error) {
            console.log(error)
        }
    })
}


const locations=['rbLocation135','rbLocation84','rbLocation138','rbLocation129','rbLocation162','rbLocation161']
const start = async(location,i)=>{
   
        
       
let driver =  new webdriver.Builder()
    .forBrowser('firefox')
    //.setChromeOptions(/* ... */)
    .build();
    try{
     await driver.get("https://bmvs.onlineappointmentscheduling.net.au/oasis/")
     await driver.wait(until.titleIs('Bupa medical visa services'), 5000)
     
     await driver.findElement(By.id('ContentPlaceHolder1_btnInd')).click()
     await driver.findElement(By.id('ContentPlaceHolder1_SelectLocation1_txtSuburb')).sendKeys('3000');
     //await driver.findElement(By.xpath('//*[@id="ContentPlaceHolder1_SelectLocation1_ddlState"]')).click()
     await driver.findElement(By.xpath('//*[@id="ContentPlaceHolder1_SelectLocation1_ddlState"]/option[8]')).click()
     await driver.wait(until.titleIs('Select location'), 5000)
     await driver.findElement(By.className('postcode-search')).click()
     //const rows = await driver.findElements(By.css("tr")); 
    await driver.manage().setTimeouts( { implicit: 3000 } );
    await driver.wait(until.titleIs('Select location'), 5000)
    console.log(i+1)
    await driver.findElement(By.id(location)).click()
    if(i<2){
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        await alert.accept();
    }
    await driver.findElement(By.id('ContentPlaceHolder1_btnCont')).click()
    await driver.findElement(By.id('chkClass1_489')).click()
    await driver.findElement(By.id('chkClass1_492')).click()
    await driver.findElement(By.id('ContentPlaceHolder1_btnCont')).click()
    const availDate = await driver.findElement(By.id('ContentPlaceHolder1_SelectTime1_txtAppDate')).getAttribute("value")
    const myDate=new Date('2022-01-24');
    var parts =availDate.split('/');
    var freedates = new Date(parts[2], parts[1] - 1, parts[0]); 
    //console.log(myDate.toDateString())
    await driver.manage().setTimeouts( { implicit: 3000 } );

    console.log(freedates.toDateString() +" " +location)
    if(freedates<myDate){
        console.log("-----------------------------------")
        console.log("-----------------------------------")
        console.log("-----------------------------------")
        console.log("go ahead-----date available--------"+location)
        console.log("-----------------------------------")
        console.log("-----------------------------------")
        console.log("-----------------------------------")
        sendEmail()
    }
     
    }
     finally {
         await driver.quit();
      }
    }
    async function getStart (){ for (let i = 0; i < locations.length; i++) {
       
       //await start(locations[i],i)
        start(locations[i],i)
    }}

    const cron = require('node-cron');
    
    cron.schedule('10 * * * * *', function(){
        console.log("started")
        getStart()} , {
        scheduled: true,
        timezone: "Australia/Sydney"
      }); 
      //135 - melbourne
      //84 - greenborough
      //138 -preston
      //129 - forest
      //162 -ringwood
      //161 ballarat