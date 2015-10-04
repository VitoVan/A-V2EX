var DEFAULT_QUOTA = 2;
function addPageEvent(){
    document.getElementById('okButton').addEventListener('click', function(){
        var quota = document.getElementById('quotaInput').value;
        chrome.storage.local.set({'quota' : quota},function(){
            window.close();
        });
    });;
}
function onInit() {
    chrome.storage.local.get('quota',function(quotaItem){
        var quota = DEFAULT_QUOTA;
        if(quotaItem && quotaItem.quota){
            quota = quotaItem.quota;
            document.getElementsByTagName('input')[0].value = quota;
        }else{
            chrome.storage.local.set({'quota' : 2});
        }
        addPageEvent();
    });
}
document.addEventListener('DOMContentLoaded', function() {
    onInit();
});

