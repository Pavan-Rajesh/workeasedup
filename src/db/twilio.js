twilioClient.messages
  .create({
    from: "+12518424997",
    body: "Ahoy! This message was sent from my Twilio form me hello phone number!",
    to: "+919398856866",
  })
  .then((message) => console.log(message.body))
  .catch((err) => {
    console.log(err);
  });
