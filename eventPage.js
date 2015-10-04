var ACCESS_DENIED = false;
var DEFAULT_QUOTA = 2;
function getLink(url) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}
function requestV2EX(protocol,host, next) {
    var x = new XMLHttpRequest();
    var requestUrl = protocol + '//' + host + '/?timestamp=' + Date.now();
    console.log('Requesting...', requestUrl);
    x.open('GET', requestUrl);
    x.onload = function() {
        var response = x.response;
        if(response && response.indexOf('Access Denied') !== -1){
            ACCESS_DENIED = true;
        }else{
            ACCESS_DENIED = false;
        }
        next(ACCESS_DENIED);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}
function ddosV2EX(protocol, host, count){
    requestV2EX(protocol, host, function(denied_flag){
        if(denied_flag === false){
            for(var i=0;i<count;i++){
                if(ACCESS_DENIED === false){
                    console.log('DDOS: ', i);
                    requestV2EX(protocol, host);
                }
            }
        }
    });
}
function blockV2EX(protocol, host){
    ddosV2EX(protocol, host, 100);
}
function checkIn(protocol, host){
    chrome.storage.local.get('checkInTime', function(item){
        if(item.checkInTime !== 0){
            console.log('already checked in.');
        }else{
            chrome.storage.local.set({'checkInTime': Date.now()});
            console.log('checkIng in.... ');
        }
    });
    //check if we should block v2ex
    var today = new Date().toJSON().slice(0,10);
    chrome.storage.local.get('timeSpended', function(timeItem){
        if(timeItem && timeItem.timeSpended && timeItem.timeSpended.date === today){
            lastTotalSeconds = timeItem.timeSpended.spendedSeconds;
            chrome.storage.local.get('quota',function(quotaItem){
                var quota = DEFAULT_QUOTA;
                if(quotaItem && quotaItem.quota){
                    quota = quotaItem.quota;
                }else{
                    chrome.storage.local.set({'quota' : 2});                    
                }
                if(quota * 60 * 60 > lastTotalSeconds){
                    console.log('Everything is fine, no need to block', 'quota:' , quota , 'spended hour:' , lastTotalSeconds / 60 /60);
                }else{
                    console.log('No....young man...');
                    blockV2EX(protocol, host);
                }
            });
        }
    });
}
function checkOut(){
    chrome.storage.local.get('checkInTime', function(item){
        if(item.checkInTime !== 0){
            //caculate seconds spended on V2EX this time.
            var spendedSeconds = (Date.now() - item.checkInTime)/1000;
            console.log('checkIng OUT.... ', ' Seconds: ', spendedSeconds);
            chrome.storage.local.set({'checkInTime': 0});
            //caculate todays total seconds on V2EX
            var today = new Date().toJSON().slice(0,10);
            chrome.storage.local.get('timeSpended', function(timeItem){
                var lastTotalSeconds = 0;
                if(timeItem && timeItem.timeSpended && timeItem.timeSpended.date === today){
                    lastTotalSeconds = timeItem.timeSpended.spendedSeconds;
                }
                var totalSeconds = spendedSeconds + lastTotalSeconds;
                chrome.storage.local.set({'timeSpended': {'spendedSeconds' : totalSeconds, 'date' : today}});
                console.log('Today, spended: ', totalSeconds);
            });
        }else{
            console.log('not checked in.');
        }
    });
}
function checkTab(tabId){
    if(tabId){
        chrome.tabs.get(tabId,function(tab){
            var link = getLink(tab.url);
            var host = link.host;
            var protocol = link.protocol;
            console.log(host);
            if(host.indexOf('v2ex.com') !== -1){
                //ddosV2EX(protocol, host, 100);
                checkIn(protocol, host);
            }else{
                checkOut();
            }
        });
    }
}

function onInit(){
    chrome.tabs.onActivated.addListener(function(acInfo){
        checkTab(acInfo.tabId);
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        checkTab(tabId);
    });
}
//add another event listener, incase the background is killed.
chrome.runtime.onInstalled.addListener(onInit);
