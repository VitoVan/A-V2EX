document.body.style.color="rgb(238, 0, 0)";
document.body.style.width="50%";
document.body.style.height="5em";
document.body.style.border="0.5em solid rgb(238, 0, 0)";
document.body.style.padding="2em";
document.body.style.textAlign="center";
document.body.style.borderRadius="1em";
if(document.body.innerText.indexOf('Go Back to Work!') === -1){
    var msg = document.createElement('h1');
    msg.innerHTML='Go Back to Work!';
    msg.style.color='blue';
    var h1 = document.body.getElementsByTagName('h1')[0];
    document.body.insertBefore(msg,h1);
    var p = true;
    while(p){
        p = document.getElementsByTagName('p')[0];
        if(p){p.remove();}
    }
}else if(document.body.innerText.indexOf('V2EX') !== -1){
    document.write('reloading...');
    location.reload();
}
