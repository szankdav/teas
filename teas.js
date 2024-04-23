"use strict"

const baseUrl = "http://172.19.0.12:8761/api"
const myModal = new bootstrap.Modal('#modifyTea')
console.log(myModal)

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
    const deleteButton = document.createElement('button')
    deleteButton.classList.add("btn", "btn-danger", "delete", "w-100")
    deleteButton.innerHTML = "Törlés"
    deleteButton.addEventListener("click", (e) => {
        const id = e.target.dataset.id
        const teaSor = document.querySelector(`[data-id="${id}"]`).parentElement.parentElement
        teaSor.classList.add("toBeDeleted")
        if(confirm("Biztos törölni szeretnéd a teát a táblázatból?")){
            deleteTea(id)
        }
    })

    const modifyButton = document.createElement('button')
    modifyButton.classList.add("btn", "btn-warning", "delete", "mt-2", "w-100")
    modifyButton.innerHTML = "Módosítás"

    modifyButton.addEventListener("click", (e) => {
        const id = e.target.dataset.id
        const teaSor = document.querySelector(`[data-id="${id}"]`).parentElement.parentElement
        teaSor.classList.add("toBeModified")
        myModal.show()
        fetch(`${baseUrl}/teas/${id}`, {
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
            .then(tea => {
                console.log(tea)
                // const modifyTeaForm = document.querySelector("#modifyTea form")
                // modifyTeaForm.name.value = tea.name
            })
            .catch(error => {
                console.error(error)
                alert("A tea betöltése sikertelen")
            });
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
        deleteButton.dataset.id = tea.id
        modifyButton.dataset.id = tea.id
        td.append(deleteButton)
        td.append(modifyButton)
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
            document.getElementById("teas").innerHTML = ""
            form.style.visibility = "hidden"
            displayTable()
        })
        .catch(err => {
            console.error(err)
        })
}

const form = document.querySelector("form")

form.addEventListener("submit", sendNewTea)

document.getElementById("ujTermek").addEventListener("click", (e) => {
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
        const idRow = document.querySelector(`[data-id="${id}"]`).parentElement.parentElement
        idRow.remove()
        return alert("A tea törlésre került a táblából!")
    })
    .catch(err => {
        console.log("Hiba: " + err)
    })
}
  
function modifyTea(tea) {

}