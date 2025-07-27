function SendMail() {
  event.preventDefault(); // Prevent form submission
  
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value, // Fixed: was getAnimations
  };

  emailjs
    .send("service_c22g8et", "template_2taod0g", parms)
    .then(function(response) {
      alert("Email Sent Successfully!");
      console.log('SUCCESS!', response.status, response.text);
    })
    .catch(function(error) {
      alert("Email Failed to Send: " + error.text);
      console.log('FAILED...', error);
    });
}
