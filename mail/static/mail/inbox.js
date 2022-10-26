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
  console.log("I am composing an email")
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  document.querySelector('#emails-view').innerHTML="";
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view ').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  if (mailbox === "inbox")
  {
    console.log("Fetching inbox mail");
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails=>{
         console.log(emails);
         emails.forEach(email=>{createEmailDiv(email)});
    });

}


  else if(mailbox==="sent"){
    console.log("Fetching sent mail");
    fetch('/emails/sent')
    .then(response => response.json())
    .then(sent_emails => {
        console.log(sent_emails);
        sent_emails.forEach(email=>{createEmailDiv(email)});
    });
  }

  else if (mailbox==="archive"){
    console.log("Fetching archive mail");
    fetch('/emails/archive')
    .then(response => response.json())
    .then(archive_emails => {
          console.log(archive_emails);
          archive_emails.forEach(email=>createEmailDiv(email));
    });
  }

}

function createEmailDiv(email){
  const wrapper=document.createElement("div");
  wrapper.classList.add('email_wrapper','row','border','border-dark','mb-2','p-1');
  wrapper.addEventListener('click',()=>load_mail(email.id));
  if (email.read===true){
    wrapper.style.backgroundColor='grey';
  }
  const left_wrapper=document.createElement('div');
  left_wrapper.classList.add('left_wrapper','col');
  const text_wrapper=document.createElement('div');
  text_wrapper.classList.add('text_wrapper','row');
  const sender=document.createElement('div');
  sender.classList.add('sender','col');
  const subject=document.createElement('div');
  subject.classList.add('subject','col')


  const time=document.createElement('div','col');
  time.classList.add('time');

  sender.innerHTML=`<b>${email.sender} <b>`;
  subject.innerHTML=email.subject;
  time.innerHTML=email.timestamp;

  document.querySelector('#emails-view').append(wrapper);
  left_wrapper.append(text_wrapper);
  text_wrapper.append(sender);
  text_wrapper.append(subject);
  wrapper.append(left_wrapper);
  wrapper.append(time);
}



function load_mail(mail_id){
  console.log(`Loading mail ${mail_id}`);
  fetch(`emails/${mail_id}`)
  .then(response=>response.json())
  .then(email=>{
  console.log(email)
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  parent=document.querySelector('#emails-view');
  parent.innerHTML=''

  const mail_header=document.createElement('div');
  mail_header.classList.add('mail_header','row','justify-content-end');
  // const heading=document.createElement('h3');
  // heading.innerHTML='Mail';
  const status=document.createElement('button');
  status.setAttribute('id','email_status');
  status.addEventListener('click',()=>archive_mail(email));

  if (email.archived==false){
    status.classList.add('btn','btn-primary');
    status.innerHTML='Archive';
  }
  else{
    status.classList.add('btn','btn-dark');
    status.innerHTML='UnArchive';
  }
  parent.append(mail_header);
  // mail_header.append(heading);
  mail_header.append(status)

  const mail_container=document.createElement('div');
  mail_container.classList.add('mail_container','container');
  const mail_col_wrapper=document.createElement('div');
  mail_col_wrapper.classList.add('mail_col_wrapper','col');


  const subject=document.createElement('div');
  const sender=document.createElement('div');
  const body=document.createElement('div');
  const recipients=document.createElement('div');
  sender.classList.add('mail_sender');
  subject.classList.add("mail_subject");
  recipients.classList.add('mail_recipients');
  body.classList.add('mail_body','mt-3');


  subject.innerHTML=`<h4>Sub:${email.subject}</h4>`;
  sender.innerHTML=`<b>From:</b> ${email.sender}`;
  recipients.innerHTML=`<b>To:</b> ${email.recipients}`;
  body.innerHTML=`${email.body}`
  document.querySelector('#emails-view').append(mail_container);
  mail_container.append(mail_col_wrapper)
  mail_col_wrapper.append(subject);
  mail_col_wrapper.append(sender);
  mail_col_wrapper.append(recipients)
  mail_col_wrapper.append(body);

  });

  fetch(`emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  }

  function archive_mail(email){
  console.log(email.id)
  console.log(`Archiving mail ${email.id}`);
  archive(email);
  load_mailbox('inbox')
  window.location.reload();

  }




  function archive(email)
  {
    if (email.archived===false){
      fetch(`/emails/${email.id}`,{
            method:'PUT',
            body:JSON.stringify({
            archived:true
            })
      });
  }
    else if (email.archived==true){
      fetch(`/emails/${email.id}`,{
        method:'PUT',
        body:JSON.stringify({
          archived:false
        })
      });
      
    }
  }