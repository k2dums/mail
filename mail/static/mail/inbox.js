document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('form').onsubmit=()=>{
    console.log("Form is submitted")
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients:docuement.querySelector("#compose-id").value.stringify(),
          subject:document.querySelector("#compose-subject").value.stringify(),
          body:document.querySelector("#compose-body").value.stringify()
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
  }

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view ').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  if (mailbox === "inbox")
  {
    fetch('/emails/inbox').then(response=>response.json).then(emails=>{console.log(emails)})
  }
  else if(mailbox==="sent"){
    fetch('/emails/sent').then(response=>response.json).then(emails=>{console.log(emails)})
  }
  else if (mailbox==="archive"){
    fetch('/emails/archive').then(response=>response.json).then(emails=>{console.log(emails)})
  }

}