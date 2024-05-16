function createBodyDiv(emailBody) {
    // Create a new div element
    const innerDiv = document.createElement('div');
  
    // Set the innerHTML of the innerDiv to the email body
    innerDiv.innerHTML = emailBody;
  
    // Get the existing div with id "body"
    const bodyDiv = document.getElementById('body');
  
    // Append the innerDiv to the bodyDiv
    bodyDiv.appendChild(innerDiv);
  }
  createBodyDiv(email.body);
