document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('form').onsubmit=()=>{
    // console.log("Form is submitted")
    r=document.querySelector("#compose-recipients").value;
    s=document.querySelector("#compose-subject").value;
    b=document.querySelector("#compose-body").value;
  
   
    // b=b.replace(/(\n\n\t)/g,'\n');
    // b=b.replace(/(\n\t)/g,'\n');
    // b=b.replace(/(\n\n\n\n|\n\n\n)/g,'\n');
    //or ( /(\n\n\t|\n\t|\n\n\n|\n\n\n\n) )
    b=b.replace(/(\n\n\t|\n\t|\n\n\n|\n\n\n\n)/g,'\n');
    b+='\n';
  
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
        load_mailbox('sent');
    });
    return false;
}
});

function compose_email() {
  // console.log("I am composing an email")
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
        //  console.log(emails);
         emails.forEach(email=>{createEmailDiv(email,mailbox)});
    });

}


  else if(mailbox==="sent"){
    // console.log("Fetching sent mail");
    fetch('/emails/sent')
    .then(response => response.json())
    .then(sent_emails => {
        // console.log(sent_emails);
        sent_emails.forEach(email=>{createEmailDiv(email,mailbox)});
    });
  }

  else if (mailbox==="archive"){
    // console.log("Fetching archive mail");
    fetch('/emails/archive')
    .then(response => response.json())
    .then(archive_emails => {
          // console.log(archive_emails);
          archive_emails.forEach(email=>createEmailDiv(email,mailbox));
    });
  }

}

function createEmailDiv(email,mailbox){
  const wrapper=document.createElement("div");
  wrapper.classList.add('email_wrapper','row','border','border-dark','mb-2','p-1');
  wrapper.addEventListener('click',()=>load_mail(email.id,mailbox));
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



function load_mail(mail_id,mailbox){
  // console.log(`Loading mail ${mail_id}`);
  // console.log(mailbox);
  fetch(`emails/${mail_id}`)
  .then(response=>response.json())
  .then(email=>{
  console.log(email);
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  parent=document.querySelector('#emails-view');
  parent.innerHTML=''

  const mail_header=document.createElement('div');
  mail_header.classList.add('mail_header','row','justify-content-end');
  // const heading=document.createElement('h3');
  // heading.innerHTML='Mail';
  parent.append(mail_header);
  // mail_header.append(heading);
  

  const mail_container=document.createElement('div');
  mail_container.classList.add('mail_container','container');
  const mail_col_wrapper=document.createElement('div');
  mail_col_wrapper.classList.add('mail_col_wrapper','col');


  const subject=document.createElement('div');
  const sender=document.createElement('div');
  const body=document.createElement('div');
  const recipients=document.createElement('div');
  const timestamp=document.createElement('div');


  sender.classList.add('mail_sender');
  subject.classList.add("mail_subject");
  recipients.classList.add('mail_recipients');
  timestamp.classList.add('mail_timestamp');
  body.classList.add('mail_body','mt-3','mb-5','ml-4');
  let text=email.body
  text=text.replaceAll('\n','<br>');
  subject.innerHTML=`<h4>Sub:${email.subject}</h4>`;
  sender.innerHTML=`<b>From:</b> ${email.sender}`;
  recipients.innerHTML=`<b>To:</b> ${email.recipients}`;
  timestamp.innerHTML=`<b>Timestamp:</b> ${email.timestamp}`;
  body.innerHTML=`${text}`
  document.querySelector('#emails-view').append(mail_container);
  mail_container.append(mail_col_wrapper)
  mail_col_wrapper.append(subject);
  mail_col_wrapper.append(sender);
  mail_col_wrapper.append(recipients);
  mail_col_wrapper.append(timestamp);
  mail_col_wrapper.append(body);

  if (mailbox=='inbox' || mailbox=='archive')
  {

    const status=document.createElement('button');
    status.setAttribute('id','mail_status');
    status.addEventListener('click',()=>archive_mail(email));
    mail_header.append(status);
    if (email.archived==false){
      status.classList.add('btn','btn-primary');
      status.innerHTML='Archive';
    }
    else{
      status.classList.add('btn','btn-dark');
      status.innerHTML='UnArchive';
    } 

    if (mailbox=="inbox")
    {
      const reply=document.createElement('button');
      reply.classList.add('btn','btn-primary','rounded-pill');
      reply.innerHTML='Reply';
      reply.setAttribute('id','mail_reply');
      reply.addEventListener('click',()=>reply_mail(email));
      mail_col_wrapper.append(reply);
    }
   
  }

  });

  fetch(`emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  }

  function archive_mail(email){
  // console.log(`Archiving mail ${email.id}`);
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

  function reply_mail(email)
  {
    // console.log(`replying email ${email.id}`);
    compose_email();
    document.querySelector('#compose-recipients').value =email.sender;
    //Apply regEx to extract the needed string after Re
    const re= new RegExp('re.*:(.*)','i');
    console.log('Regex:'+ re.test(email.subject))
    if (re.test(email.subject)){
      document.querySelector('#compose-subject').value = `Re:${email.subject.match(re)[1]}`;
    }
    else{
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    }
    let text=email.body
    text=text.replaceAll('\n','\n\t');
    document.querySelector('#compose-body').value = `\n\n \n\n\tOn ${email.timestamp} ${email.sender} wrote:\n\t${text}`;
  }