import { HALL_NAMES } from "./consts.js"

function readMenu(doc, mealTime) {
    let courseId = 0
    if (mealTime === "lunch") {
        courseId = 1
    }
    else if (mealTime === "dinner") {
        courseId = 2
    } else {
        console.error("Wrong Meal Time!")
    }
    let meals =
        doc.getElementsByClassName("courses")[courseId].querySelectorAll(".courses_wrapper > li")

    let signatures = Array.from(meals).filter(items => {
        let collection = items.getElementsByTagName("h4")[0].textContent.toLowerCase()
        return collection.startsWith("signature") || collection.startsWith("world")
    }).map(items =>
        Array.from(items.getElementsByClassName("item-name"))
    ).flat().map(item => item.textContent.trim())

    return [...new Set(signatures)]   // deduplicate
}

function makeHtml(hallName, signatures) {
    const hallNameCap = hallName[0].toUpperCase() + hallName.substring(1)
    let html = "<div class=\"signatures\"><h3>" + hallNameCap + "</h3><ul>"
    if (signatures === null || signatures.length === 0) {
        html += "<li>No Service at this Time</li>"
    } else {
        for (const dish of signatures) {
            html += "<li>" + dish + "</li>"
        }
    }
    html += "</ul></div>"
    return html
}

function getQueryTime() {
    const d = new Date()
    let hour = d.getHours()
    let minute = d.getMinutes()
    let mealTime = ""
    if (hour < 14 || hour > 22) {
        mealTime = "lunch"
    } else {
        mealTime = "dinner"
    }
    let currentTime = ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2)

    return { "queryTime": currentTime, mealTime }
}

function index() {
    let body = document.getElementById("content")
    let menu = document.getElementById("menu")
    let { queryTime, mealTime } = getQueryTime()
    let html = "<div>"
    let keys = [...HALL_NAMES]
    chrome.storage.local.get(keys, function (items) {
        for (const key in items) {
            // console.warn("get key: " + key + " value: " + items[key].length)

            let parseDOM = new DOMParser().parseFromString(items[key], "text/html")
            let signatures = readMenu(parseDOM, mealTime)

            html += makeHtml(key, signatures)
        }
        menu.innerHTML = html + "</div>";
        body.innerHTML += "<div id=\"footer\">Last Query " + queryTime + "</div>"
    });
}

index()

