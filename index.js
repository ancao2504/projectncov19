let request = require('request');
let axios = require('axios');
let express = require('express');
let app = express(); 
let URL = 'https://viruscoronaapi.herokuapp.com/worldometers';
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('THỐNG KÊ TÌNH HÌNH DICH BỆNH ĐƯỢC VIẾT BẰNG NODEJS'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

extractDataNcov19(URL)
function extractDataNcov19(url) {
	request(url, function (error, response, body) {
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
	            let newCases = json[index].New_Cases;
	            let totalDeaths = json[index].Total_Deaths;
	            let newDeaths = json[index].New_Deaths;
	            let totalRecovered = json[index].Total_Recovered;
	            let seriousCases = json[index].Serious_Cases;
	            let arrayCountry = ['China', 'Vietnam', 'Italy', 'USA', 'UK', 'Malaysia', 'S. Korea', 'Singapore', 'Indonesia', 'Thailand', 'Philippines', 'India', 'Japan', 'Iran'];
	            arrayCountry.forEach(function(valueCountry){
	                if(countryName == valueCountry) {
	                    messenger = countryName +' hiên tại đã có '+ totalCases +' ca nhiễm, trong đó: '+ newCases +' ca mới, '+ seriousCases +' ca nghiêm trọng, '+ totalDeaths +' ca tử vong, '+ newDeaths + ' ca tử vong mới ' + 'và '+ totalRecovered +' đã phục hồi';
	                    sendMessageTelegram(messenger.italics())
	                }
	            }) 
	        }
	    }else {
	        sendMessageTelegram('API NO CONNECT: ' + url)
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


