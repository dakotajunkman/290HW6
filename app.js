const url = 'http://flip1.engr.oregonstate.edu:20003/';
const table = document.querySelector('#workout');
const tableHead = ['id', 'Name', 'Reps', 'Weight', 'Units', 'Date'];

function deleteTable() {
    table.innerHTML = '';
}

function makeTable(rows) {
    // iterate over all rows from DB
    // add table cells with data
    // add buttons
    makeHeaderRow();
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
}

function makeRow(row) {
    // use data to make a table data cells
    // make form that wraps data cells
    // append cells
}

function makeCell(data) {
    // make a cell from the data
}

function makeInput(data) {
    // creates form input
}

async function getData() {
    try {
        let data = await fetch(url);
        return data;
    } catch(e) {
        console.log(e);
    }
}

table.addEventListener('click', (evt) => {
    let target = evt.target;
    // if update button, send put request
    // if delete button, send delete request
});


(async () => {
    let data = await getData();
    makeTable(data);
})();