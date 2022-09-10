body = document.getElementById("content")
menu = document.getElementById("menu")

queryTime = ""
html = "<div>"
hallNameSet = new Set(["bursley", "east-quad", "mosher-jordan", "south-quad"])

chrome.storage.local.get(null, function (items) {
    for (key in items) {
        if (key === "queryTime") {
            queryTime = items[key]
        }
        if (hallNameSet.has(key)) {
            html += items[key]
            // console.warn("get key: " + key + " value: " + items[key])
        }
    }
    menu.innerHTML = html + "</div>";
    body.innerHTML += "<div id=\"footer\">Last Query " + queryTime + "</div>"
});

