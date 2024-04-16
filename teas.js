"use strict"

const baseUrl = "http://172.19.0.12:8761/api"

function generateTable(teas) {
    const table = document.createElement('table')
    table.classList.add("table", "table-striped")
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')
    const tbody = document.createElement('tbody')
    const titles = ["Megnevezés", "Gyártó", "Fajta", "Kiszerelés", "Mennyiség", "Ár", "Admin"]

    for (const title of titles) {
        const th = document.createElement('th')
        th.append(document.createTextNode(title))
        tr.append(th)
    }

    for (const tea of teas) {
        tbody.append(generateRow(tea))
    }

    thead.append(tr)
    table.append(thead)
    table.append(tbody)

    return table
}

function displayTable() {
    fetch(baseUrl + "/teas", {
        headers: {
            "Accept": "application/json",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Hálózati hiba")
            }
            return res.json()
        })
        .then(teas => {
            document.getElementById("teas").append(generateTable(teas))
        })
        .catch(error => {
            console.error(error)
            alert("A teák betöltése sikertelen")
        });

    // const teas = [
    //     {
    //         "name": "English Breakfast",
    //         "brand": {
    //             "id": 3,
    //             "name": "Twinings",
    //             "country": "Egyesült királyság"
    //         },
    //         "range": "black",
    //         "format": "tea bag",
    //         "qty": 25,
    //         "unit": "db",
    //         "price": 1469
    //     },
    //     {
    //         "name": "Earl Grey",
    //         "brand": {
    //             "id": 3,
    //             "name": "Twinings",
    //             "country": "Egyesült Királyság"
    //         },
    //         "range": "black",
    //         "format": "tea bag",
    //         "qty": 25,
    //         "unit": "db",
    //         "price": 1469
    //     }
    // ]
}

displayTable()

function generateRow(tea) {
    const tr = document.createElement('tr')
    const button = document.createElement('button')
    button.classList.add("btn", "btn-danger", "delete")
    button.innerHTML = "Törlés"
    button.addEventListener("click", (e) => {
        const id = e.target.dataset.id
        const teaSor = document.querySelector(`[data-id="${id}"]`).parentElement.parentElement
        teaSor.classList.add("toBeDeleted")
        if(confirm("Biztos törölni szeretnéd a teát a táblázatból?")){
            deleteTea(id)
        }
    })
    const contents = [
        tea.name,
        tea.brand.name,
        tea.range,
        tea.format,
        `${tea.qty} ${tea.unit}`,
        `${tea.price} Ft`,
        ""
    ]

    for (const content of contents) {
        const td = document.createElement('td')
        td.append(document.createTextNode(content))
        button.dataset.id = tea.id
        td.appendChild(button)
        tr.append(td)
    }

    return tr
}

function sendNewTea(evt) {
    evt.preventDefault()
    const megnevezesInput = document.getElementById("name")
    const gyartoInput = document.getElementById("brand_id")
    const tipusInput = document.getElementById("range")
    const kiszerelesInput = document.getElementById("format")
    const mennyisegInput = document.getElementById("qty")
    const egysegInput = document.getElementById("unit")
    const arInput = document.getElementById("price")

    const newTea = {
        name: megnevezesInput.value,
        brand_id: gyartoInput.value,
        range: tipusInput.value,
        format: kiszerelesInput.value,
        qty: mennyisegInput.value,
        unit: egysegInput.value,
        price: arInput.value
    }

    fetch(baseUrl + "/teas",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTea)
        })
        .then(res => {
            if (!res.ok) {
                alert("Az elküldött adatok helytelenek")
                throw Error("Az elküldött adatok helytelenek")
            }
            return res.json()
        })
        .then(tea => {
            generateRow(tea)
        })
        .catch(err => {
            console.error(err)
        })
}

const form = document.querySelector("form")

form.addEventListener("submit", sendNewTea)

document.getElementById("ujTermek").addEventListener("click", () => {
    form.style.visibility = "unset"
})

function deleteTea(id){
    fetch(baseUrl + "/teas/" + id, {
        method: "DELETE"
    })
    .then(res => {
        if(!res.ok){
            throw Error("Hiba a törlés közben!")
        }
        return alert("A tea törlésre került a táblából!")
    })
    .catch(err => {
        console.log("Hiba: " + err)
    })
}