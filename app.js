const url = 'http://localhost:3000';
const table = document.querySelector('#workout');
const tableHead = ['Name', 'Reps', 'Weight', 'Units', 'Date'];
const addForm = document.querySelector('#addForm');

function deleteTable() {
    table.innerHTML = '';
}

function makeTable(rows) {
    deleteTable();
    makeHeaderRow();
    const body = document.createElement('tbody');
    for (let i = 0; i < rows.rows.length; i++) {
        let row = makeRow(rows.rows[i]);
        body.append(row);
    }
    table.append(body);
}

function makeHeaderRow() {
    const head = document.createElement('thead');
    const row = document.createElement('tr');
    
    for (let i = 0; i < tableHead.length; i++) {
        const cell = document.createElement('th');
        const text = document.createTextNode(tableHead[i]);
        cell.append(text)
        row.append(cell)
    }
    head.append(row);
    table.append(head);
}

function makeRow(row) {
    let newRow = document.createElement('tr');
    for (let prop in row) {
        let cell = makeCell(prop, row[prop]);
        newRow.append(cell)
    }
    let update = makeButton('update', 'Update');
    let del = makeButton('delete', 'Delete');
    newRow.append(update);
    newRow.append(del);
    return newRow;
}

function makeCell(key, value) {
    let cell = document.createElement('td');
    if (key === 'id') {
        cell.style.display = 'none';
    }
    let input = makeInput(key, value);
    cell.append(input);
    return cell
}

function makeInput(name, value) {
    let input = document.createElement('input');
    if (name === 'id') {
        input.type = 'hidden';
        input.name = 'id';
    } else if (name === 'name' || name === 'units') {
        input.type = 'text';
        if (name === 'name') {
            input.name = 'name';
        } else {
            input.name = 'units';
        }
    } else if (name === 'weight' || name === 'reps') {
        input.type = 'number';
        if (name === 'weight') {
            input.name = 'weight';
        } else {
            input.name = 'reps';
        }
    } else {
        input.type = 'date';
        input.name = 'date';
        value = value.slice(0, 10);
    }
    input.value = value;
    input.disabled = true;
    return input;
}

function makeButton(name, text) {
    let btn = document.createElement('button');
    btn.name = name;
    btn.innerText = text;
    return btn;
}

// gets current state of database
async function getData() {
    try {
        let data = await fetch(url);
        let rows = await data.json();
        return rows;
    } catch(e) {
        console.log(e);
    }
}

// sends UPDATE, POST, and DELETE requests to server
async function sendRequest(data) {
    try {
        const response = await fetch(url, data);
        const rows = await response.json()
        makeTable(rows);
    } catch(err) {
        console.log(err);
    }
}

// gets data from workout table to send to server
function gatherData(node) {
    let obj = {};
    while (node) {
        let child = node.firstChild;
        if (child.tagName === 'INPUT') {
            obj[child.name] = child.value;
        }
        node = node.previousElementSibling;
    }
    return obj;
}

// enables input in the table to update data
function enableInput(node) {
    while (node) {
        let child = node.firstChild;
        if (child.tagName === 'INPUT') {
            child.disabled = false;
        }
        node = node.previousElementSibling;
    }
}

// listener for adding new workout data
addForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = {};
    const formData = new FormData(addForm);
    formData.forEach((val, key) => {data[key] = val});
    const postData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    sendRequest(postData);
    const arr = Array.from(addForm.elements);
    arr.forEach(x => x.value = '');
});

// listener for update and delete requests
table.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (evt.target.name === 'delete') {
        let node = evt.target.previousElementSibling;
        let data = gatherData(node);
        let delData = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        sendRequest(delData);
    } else if (evt.target.name === 'update') {
        evt.target.name = 'send';
        evt.target.innerText = 'Send Update';
        let node = evt.target.previousElementSibling;
        enableInput(node);
    } else if (evt.target.name === 'send') {
        let node = evt.target.previousElementSibling;
        let data = gatherData(node);
        let updateData = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        sendRequest(updateData);
    }
});

// runs on page load to get current state of database
(async () => {
    let data = await getData();
    makeTable(data);
})();