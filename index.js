let request = require('request');
let axios = require('axios');

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

let CronJob = require('cron').CronJob;
let job = new CronJob('00 00 6 * * 1-7', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);
job.start();