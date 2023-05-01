import fetch, {Headers} from "node-fetch";
import cheerio from "cheerio";
import alert from 'alert'

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = dd + '-' + mm + '-' + yyyy;

console.log(`today date: ${today}`);

const bramptonLocation = {
  locationNumber: 4, body: "gofor=show_apt_date&location=4&service_type=Passport", locationName: "Brampton"
};

let testUserDate = {
  name: 'test', mobile: "5000000000", passport: "U00000000", email: 'whatever@live.com', description: "whatever"
}

//*************** USER SHOULD MODIFY ***************************
//*************** USER SHOULD MODIFY ***************************
const user = testUserDate;
const OntarioLocation = bramptonLocation;
// const OntarioLocation = bramptonLocation;
//*************** USER SHOULD MODIFY ***************************
//*************** USER SHOULD MODIFY ***************************
async function getCookie() {
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "PHPSESSID=9bddcaa0382590447dfda99c3fabed2g");
  myHeaders.append("Accept", "application/json");

  const requestOptions = {
    method: 'GET', headers: myHeaders, redirect: 'follow'
  };

  return fetch("https://www.blsindia-canada.com/appointmentbls/ajax.php", requestOptions)
      .then(response => JSON.stringify(response.headers.raw()["set-cookie"][0]));
}

async function getDates(cookie) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Accept-Language", "en-US,en;q=0.9");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  myHeaders.append("Cookie", cookie);
  myHeaders.append("Origin", "https://www.blsindia-canada.com");
  myHeaders.append("Referer", "https://www.blsindia-canada.com/appointmentbls/appointment.php");
  myHeaders.append("Sec-Fetch-Dest", "empty");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Sec-Fetch-Site", "same-origin");
  myHeaders.append("Sec-GPC", "1");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");
  myHeaders.append("X-Requested-With", "XMLHttpRequest");


  var requestOptions = {
    method: 'POST', headers: myHeaders, body: OntarioLocation.body, redirect: 'follow'
  };

  return fetch("https://www.blsindia-canada.com/appointmentbls/ajax.php", requestOptions)
      .then(response => {
        return response.text()
      })
      .then(result => {
        return result.split('~')[4]
      })
}

async function getTimeSlot(cookie, date) {
  date = date.split("-").reverse().join("-");
  console.log("Using Date :", date)
  var myHeaders = new Headers();
  myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8");
  myHeaders.append("Accept-Language", "en-US,en;q=0.9");
  myHeaders.append("Cache-Control", "max-age=0");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Cookie", cookie);
  myHeaders.append("Origin", "https://www.blsindia-canada.com");
  myHeaders.append("Referer", "https://www.blsindia-canada.com/appointmentbls/appointment.php");
  myHeaders.append("Sec-Fetch-Dest", "document");
  myHeaders.append("Sec-Fetch-Mode", "navigate");
  myHeaders.append("Sec-Fetch-Site", "same-origin");
  myHeaders.append("Sec-Fetch-User", "?1");
  myHeaders.append("Sec-GPC", "1");
  myHeaders.append("Upgrade-Insecure-Requests", "1");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

  var urlencoded = new URLSearchParams();
  urlencoded.append("location", OntarioLocation.locationNumber);
  urlencoded.append("service_type", "Passport");
  urlencoded.append("app_date", date);
  urlencoded.append("app_slot", "");
  urlencoded.append("name", user.name);
  urlencoded.append("phone", user.mobile);
  urlencoded.append("passport_no", user.passport);
  urlencoded.append("email", user.email);
  urlencoded.append("service", user.description);
  urlencoded.append("no_of_applications", "1");

  var requestOptions = {
    method: 'POST', headers: myHeaders, body: urlencoded, redirect: 'follow'
  };

  return fetch("https://www.blsindia-canada.com/appointmentbls/appointment.php", requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result)
        const $ = cheerio.load(result);
        $.html();
        return "" + $('#app_slot option:eq(1)').attr('value');
      })
      .catch(error => console.log('error', error));
}

function bookAppointment() {
// todo: implement
}

let loopCount = 0

function runInloop() {
  console.log("*** LOOPCOUNT :" + loopCount++)
  getCookie().then(cookie => {
    getDates(cookie).then(async availableDates => {
      console.log('DATES AVAILABLE= ' + availableDates.split(','))
      if (true) {
        if (availableDates.replaceAll(today, '') !== '') {

          const now = new Date().toString('yyyy-MM-d-h-mm-ss');
          await alert(`BRAMPTON\nBRAMPTON\nBRAMPTON\nBRAMPTON\n\nTIME: ${now}\n\nLOCATION: ${OntarioLocation.locationName}\n\nDATE: ${availableDates.replaceAll(',', '\n')}}`);
          console.log('Confirmed!');
          await getTimeSlot(cookie, availableDates.split(',')[0]).then(timeSlot => {
            console.log("TIME SLOT =", timeSlot)
          })
        }
        runInloop();
      }
    })
  })
}

runInloop();
