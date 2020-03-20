let request = require('request');
let axios = require('axios');
let express = require('express');
let app = express(); 
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
function todayReport() {
    request('https://coronaapiwom.herokuapp.com/apidata', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let today = new Date();
            let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let json = JSON.parse(body)
            let messenger = '';
            let content = 'THỐNG KÊ TÌNH HÌNH DỊCH BỆNH nCoV-19. CẬP NHẬT NGÀY ' + date + ' LÚC ' + time;
            sendMessageTelegram(content.bold())
            for (let index = 0; index < json.length; index++) {
                let countryName = json[index].Country_Name;
                let totalCases = json[index].Total_Cases;
                let totalDeaths = json[index].Total_Deaths;
                let totalRecovered = json[index].Total_Recovered;
                let seriousCases = json[index].Serious_Cases;
                let arrayCountry = ['China', 'Vietnam', 'Italy', 'USA', 'UK', 'Malaysia', 'S. Korea', 'Singapore', 'Indonesia', 'Thailand', 'Philippines', 'India', 'Japan', 'Iran'];
                arrayCountry.forEach(function(valueCountry){
                    if(countryName == valueCountry) {
                        messenger = countryName +' hiên tại đã có '+ totalCases +' ca nhiễm, '+ seriousCases +' ca nghiêm trọng, '+ totalDeaths +' ca tử vong và '+ totalRecovered +' đã phục hồi';
                        sendMessageTelegram(messenger.italics())
                    }
                }) 
            }
        }else {
            sendMessageTelegram('API NO CONNECT: ' + error)
        }
    });
}


function sendMessageTelegram(textMessage) {
    let payload = {
        "method": "sendMessage",
        "chat_id": -331121088,
        "text": textMessage,
        "parse_mode": "HTML"
    }
    let API_TOKEN = '956543622:AAFb2t68PyWUYdyGqsMSTkPXyV6ehLLTvzA';
    axios({
        method: 'POST',
        url: 'https://api.telegram.org/bot' + API_TOKEN + '/',
        data: payload,
    }).then(response => {
        console.log(response + "Message posted");
        
    }).catch(error =>{
        console.log(error);
    });
}

const cron = require('cron');
const job = new cron.CronJob({
  cronTime: '00 00 13 * * 0-6', // Chạy Jobs vào 23h30 hằng đêm
  onTick: function() {
    todayReport();
    console.log('Cron jub runing...');
  },
  start: true, 
  timeZone: 'Asia/Ho_Chi_Minh' // Lưu ý set lại time zone cho đúng 
});

job.start();

