const form = document.querySelector('form');
const table = document.querySelector('table');
const inviteInput = document.querySelector('#invite-input');
const dropdown = document.querySelector('#invite-input-dropdown');
const invitedUsers = document.querySelector('#invited-users');

// Submit the form
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.querySelector('#name-input').value;
    const users = [...invitedUsers.children].map(elm => elm.textContent);
    const tableString = table.outerHTML;

    const response = await fetch(form.action, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            users: users,
            tableString: tableString
        })
    })

    console.log(response.status);
    window.location.href = '/scoreboards';
})

table.addEventListener('contextmenu', event => {
    event.preventDefault();
    console.log(event.target);
})

// Make all table cells editable
document.querySelectorAll('th, td').forEach(cell => {
    cell.setAttribute('contenteditable', 'true');
})
// Remove dropdown on click
document.addEventListener('click', event => {
    if (event.target.id !== 'invite-input') {
        dropdown.innerHTML = '';
    }
})
// Show dropdown on input
inviteInput.addEventListener('input', async (event) => {
    dropdown.innerHTML = '';
    const value = inviteInput.value;

    if (!value) return;

    const response = await fetch(`/api/users?q=${value}`);
    const data = await response.json();
    const requestingUser = data.requestingUser;
    const usernames = data.users.filter(u => u !== requestingUser);
    const invitedUsernames = [...invitedUsers.children].map(elm => elm.textContent);

    for (const username of usernames.filter(u => !invitedUsernames.includes(u))) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = username;
        button.onclick = () => inviteUser(username);
        dropdown.append(button);
    }
})
// Add username to invited users
function inviteUser(username) {
    const span = document.createElement('span');
    span.textContent = username;
    span.classList.add('invited-user');
    span.onclick = () => span.remove();
    
    invitedUsers.appendChild(span);

    inviteInput.value = '';
    inviteInput.focus();
}
// Add row in table
function addRow() {
    const row = document.createElement('tr');

    for (const cell of table.rows[0].cells) {
        const cell = document.createElement('td');
        cell.setAttribute('contenteditable', 'true');
        row.append(cell);
    }

    table.tBodies[0].append(row);
}
// Add column in table
function addCol() {
    const th = document.createElement('th');
    th.setAttribute('contenteditable', 'true');
    table.tHead.rows[0].append(th);

    for (const row of table.tBodies[0].rows) {
        const td = document.createElement('td');
        td.setAttribute('contenteditable', 'true');
        row.append(td);
    }
}

