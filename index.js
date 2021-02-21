const express = require('express');
const app = express();
const port = 3000;

const cheerio = require("cheerio");
const fs = require("fs");
const rp = require("request-promise");

const URL = `https://giavangonline.com/goldhistory.php`;
 
const options = {
  uri: URL,
  transform: function (body) {
    return cheerio.load(body);
  },
};

app.listen(port, function(error){
    let data = '', tableName='';
    if (error) {
        console.log("Something went wrong");
    }
    console.log("server is running port:  " + port);
    let param = process.argv.slice(2);
    if(param[0] === 'h' || param[0] === 'm' || param[0] === 's'){
      if(!isNaN(param[1]) && !isNaN(param[2])){
        if(parseInt(param[1]) <= parseInt(param[2])){
          crawler((dataCSV, dataName)=>{
            data += dataCSV;
            tableName = dataName;
          });

          let timer = setInterval(()=>{
            crawler((dataCSV, dataName)=>{
              data += dataCSV;
              tableName = dataName;
            });
          }, param [0] === 'h' ? param[1]*60*60*1000 : param [0] === 'm' ? param[1]*60*1000 : param[1]*1000 );

          setTimeout(() => { 
            clearInterval(timer); 
            var objToday = new Date(),
              weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
              dayOfWeek = weekday[objToday.getDay()],
              domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
              dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
              months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
              curMonth = months[objToday.getMonth()],
              curYear = objToday.getFullYear(),
              curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
              curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
              curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
              curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
            var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
            
            var currentDate = "Date " + dayOfWeek + "_" + dayOfMonth + "_" + curMonth + "_" + curYear;
            var currentTime = "Time " + curHour + "_" + curMinute + "_" + curSeconds + "_" + curMeridiem;

            if (!fs.existsSync(`./resultData/${currentDate}`)) {
              fs.mkdirSync(`./resultData/${currentDate}`, { recursive: true });
            }

            fs.writeFileSync(`./resultData/${currentDate}/${tableName+'_'+currentTime}.csv`, data, 'utf8');
            console.log('Complete getting data, press ctrl + C to turn off program'); 
          }, param [0] === 'h' ? param[2]*60*60*1000 + 1000: param [0] === 'm' ? param[2]*60*1000 + 1000: param[2]*1000 + 100);
        }
        else console.log('The first number must be less than or equal the second number \nPress ctrl + C to turn off program');
      } 
      else console.log('Please pass two number \nPress ctrl + C to turn off program');
    }
    else console.log('Please pass type of time \nPress ctrl + C to turn off program');
})
 
async function crawler(returnData) {
  try {
    var $ = await rp(options);
  } catch (error) {
    return error;
  }
 
  const tableContent = $("#sjcexchange table");
  let content_data = '', tableName = '';
  for (let i = 0; i < tableContent.length; i++) {
    const table = $(tableContent[i]);
    
    const tableHead = $(table.find("tbody").find("th")[0]);
    tableName = tableHead.text().replace(' / ',' ');
     
    let locationData = [], proportionData = [], history = '';
    const tableData = table.find("tbody").find("td");
    for (let j = 0; j < tableData.length; j++) {
      const data = $(tableData[j]);
      if(j % 2 === 0 && j != tableData.length -1) locationData.push(data.text());
      else if (j % 2 !== 0) proportionData.push(data.text().split(',').join(''));
      else history = data.text();
    }

    let dataCSV = '\uFEFFDate,Time,Type,Buy,Sell\n';
    let dataDate_Time = history.replace('Đang xem ngày: ','').split(' ');
    let dataDate = dataDate_Time[0], dataTime = dataDate_Time[1]+' '+dataDate_Time[2];
  
    locationData.forEach((location, index) => {
      let buy_sell = proportionData[index].replace(' / ','/').split('/');
      let buy = buy_sell[0], sell = buy_sell[1];
      dataCSV += `${dataDate},${dataTime},${location},${buy},${sell}\n`;
    });

    content_data += dataCSV;
  }
  returnData(content_data, tableName);
};