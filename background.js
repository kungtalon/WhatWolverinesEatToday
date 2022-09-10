function readMenu(doc, mealTime) {
    if (mealTime === "lunch") {
        courseId = 1
    }
    else if (mealTime === "dinner") {
        courseId = 2
    } else {
        console.error("Wrong Meal Time!")
    }
    meals = doc.getElementsByClassName("courses")
    meals = meals[courseId].querySelectorAll(".courses_wrapper > li")

    signatures = Array.from(meals).filter(items => {
        collection = items.getElementsByTagName("h4")[0].textContent.toLowerCase()
        return collection.startsWith("signature") || collection.startsWith("world")
    }
    ).map(items =>
        Array.from(items.getElementsByClassName("item-name"))
    ).flat().map(item => item.textContent.trim())

    return signatures
}

function makeHtml(hallName, signatures) {
    hallNameCap = hallName[0].toUpperCase() + hallName.substring(1)
    html = "<div class=\"signatures\"><h3>" + hallNameCap + "</h3><ul>"
    for (dish of signatures) {
        html += "<li>" + dish + "</li>"
    }
    html += "</ul></div>"
    return html
}

async function requestDiningHallMenus(hallName, mealTime) {
    url = "https://dining.umich.edu/menus-locations/dining-halls/" + hallName
    return fetch(url, {
        credentials: 'include',
        method: 'get'
    }).then(r => r.text()).then(resString => {
        return new DOMParser().parseFromString(resString, "text/html")
    }).then(
        r => readMenu(r, mealTime)
    ).then(
        result => makeHtml(hallName, result)
    ).then(r => {
        chrome.storage.local.set({ [hallName]: r }, function () {
            // console.warn("set storage of " + hallName + " : " + r)
        })
        return true
    })
}

chrome.browserAction.onClicked.addListener((tab) => {
    const d = new Date()
    let hour = d.getHours()
    let minute = d.getMinutes()
    mealTime = ""
    if (hour < 14 || hour > 22) {
        mealTime = "lunch"
    } else {
        mealTime = "dinner"
    }
    currentTime = ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2)
    chrome.storage.local.set({ ["queryTime"]: currentTime })
    hallNames = ["bursley", "east-quad", "mosher-jordan", "south-quad"]
    Promise.all(hallNames.map(r => requestDiningHallMenus(r, mealTime))).then(res => {
        chrome.tabs.create({ url: "/newtab.html" });
    })
})