import { BASE_URL, HALL_NAMES } from "./consts.js"

async function requestDiningHallMenus(hallName) {
    let url = `${BASE_URL}${hallName}`
    return fetch(url, {
        credentials: 'include',
        method: 'get'
    }).then(r => r.text()).then(r => {
        if (r) {
            chrome.storage.local.set({ [hallName]: r }, function () {
                console.warn("set storage of " + hallName + " : " + r.length)
            })
            return true
        } else {
            console.warn("no value found for " + hallName)
        }
    })
}

chrome.action.onClicked.addListener(_ => {
    Promise.all(HALL_NAMES.map(r => requestDiningHallMenus(r))).then(_ => {
        chrome.tabs.create({ url: "/menu.html" });
    })
})