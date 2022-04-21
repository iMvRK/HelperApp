
// function to send a notification to specific user
const sendSingleDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAdqArrA8:APA91bGyQtkOS9TQWYK3yj4L7FJknEh5MOfi14lIJQXRsdv-TWIuxw4_A-TpNH1R-F9dVmerHeWCFo1dlVXaHbh90Yj5-UuZA6AByw8VKw3zMTM1IdDOte5aJsmexXtvH6T8swZKhZfV',
  );

  var raw = JSON.stringify({
    data: {},
    notification: {
      body: data.body,
      title: data.title,
    },
    to: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

// function to send a notification to multiple users
const sendMultiDeviceNotification = (data) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAdqArrA8:APA91bGyQtkOS9TQWYK3yj4L7FJknEh5MOfi14lIJQXRsdv-TWIuxw4_A-TpNH1R-F9dVmerHeWCFo1dlVXaHbh90Yj5-UuZA6AByw8VKw3zMTM1IdDOte5aJsmexXtvH6T8swZKhZfV',
  );

  var raw = JSON.stringify({
    data: {},
    notification: {
      body: data.body,
      title: data.title,
    },
    registration_ids: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
};

export default {
  sendSingleDeviceNotification,
  sendMultiDeviceNotification,
};  