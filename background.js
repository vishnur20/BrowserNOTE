// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed');
    chrome.storage.sync.set({browserNOTES: []});
});