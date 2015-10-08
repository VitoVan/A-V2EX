var DEFAULT_QUOTA = 2;
function addPageEvent(){
    document.getElementById('okButton').addEventListener('click', function(){
        var quota = document.getElementById('quotaInput').value;
        chrome.storage.local.set({'quota' : quota},function(){
            window.close();
        });
    });
    document.getElementById('quotaInput').addEventListener('keydown', function(){
        if(event.keyCode == 13){
            document.getElementById('okButton').click();
        }
    });
}
function onInit() {
    chrome.storage.local.get('quota',function(quotaItem){
        var quota = DEFAULT_QUOTA;
        if(quotaItem && quotaItem.quota){
            quota = quotaItem.quota;
        }else{
            chrome.storage.local.set({'quota' : 2});
        }
        document.getElementById('quotaInput').value = quota;
        document.getElementById('quotaInput').select();
        document.getElementById('quotaInput').focus();
        addPageEvent();
    });
}
document.addEventListener('DOMContentLoaded', function() {
    onInit();
});

