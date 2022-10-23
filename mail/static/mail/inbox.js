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
    r=document.querySelector("#compose-recipients").value
    s=document.querySelector("#compose-subject").value
    b=document.querySelector("#compose-body").value

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: r,
          subject:s,
          body:b
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
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails=>{
         console.log(emails);
         emails.forEach(email=>{createEmailDiv(email)});
    });

}


  else if(mailbox==="sent"){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(sent_emails => {
        console.log(sent_emails);
        sent_emails.forEach(email=>{createEmailDiv(email)});
    });
  }

  else if (mailbox==="archive"){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(archive_emails => {
          console.log(archive_emails);
          archive_emails.forEach(email=>createEmailDiv(email));
    });
  }

}


function loadmail(){
console.log("An email was clicked");
}

function createEmailDiv(email){
  const wrapper=document.createElement("div");
  wrapper.classList.add('email_wrapper','row','border','border-dark','mb-2','p-1');

  const left_wrapper=document.createElement('div');
  left_wrapper.classList.add('left_wrapper','col');
  const text_wrapper=document.createElement('div')
  text_wrapper.classList.add('text_wrapper','row')
  const sender=document.createElement('div');
  sender.classList.add('sender','col');
  const subject=document.createElement('div');
  subject.classList.add('subject','col')


  const time=document.createElement('div','col');
  time.classList.add('time');

  sender.innerHTML=`<b>${email.sender} <b>`
  subject.innerHTML=email.subject
  time.innerHTML=email.timestamp

  document.querySelector('#emails-view').append(wrapper);
  left_wrapper.append(text_wrapper)
  text_wrapper.append(sender)
  text_wrapper.append(subject)
  wrapper.append(left_wrapper);
  wrapper.append(time);
}