document.body.style.color="rgb(238, 0, 0)";
document.body.style.width="50%";
document.body.style.height="10em";
document.body.style.border="0.5em solid rgb(238, 0, 0)";
document.body.style.padding="2em";
document.body.style.textAlign="center";
document.body.style.borderRadius="1em";
if(document.body.innerText.indexOf('Go Back to Work!') === -1){
    var msg = document.createElement('h4');
    msg.innerHTML='Go Back to Work!';
    msg.style.color='blue';
    var p = document.body.getElementsByTagName('p')[0];
    document.body.insertBefore(msg,p);
}else if(document.body.innerText.indexOf('V2EX') !== -1){
    location.reload();
}
