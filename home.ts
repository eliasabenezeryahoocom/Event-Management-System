// Dummy database of signed-in users
const dummyDatabase = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Diana' },
];

// Global variable to store event data
let currentEvent = {};

// Open the Add Event Popup
function openPopup() {
    document.getElementById('popup')!.style.display = 'block';
    document.getElementById('overlay')!.style.display = 'block';
}

// Close the Add Event Popup
function closePopup() {
    document.getElementById('popup')!.style.display = 'none';
    document.getElementById('overlay')!.style.display = 'none';
}

// Open the Recipient Selection Popup
function openRecipientPopup() {
    const recipientList = document.getElementById('recipientList') as HTMLUListElement;
    recipientList.innerHTML = '';  // Clear the list

    // Fetch signed-in users and display them
    fetchSignedInUsers()
        .then(users => {
            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `<input type="checkbox" value="${user.name}" class="recipient"> ${user.name}`;
                recipientList.appendChild(li);
            });
            document.getElementById('recipientPopup')!.style.display = 'block';
            document.getElementById('popup')!.style.display = 'none';
        })
        .catch(error => console.error(error));
}

// Fetch signed-in users from the dummy database
function fetchSignedInUsers(): Promise<any[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dummyDatabase);  // Simulating a delay
        }, 500);
    });
}

// Send the event to selected recipients
function sendEvent() {
    const recipients = Array.from(document.querySelectorAll('.recipient:checked'))
        .map((checkbox: any) => checkbox.value);

    if (recipients.length === 0) {
        alert('Please select at least one recipient.');
        return;
    }

    const eventName = (document.getElementById('eventName') as HTMLInputElement).value;
    const eventDetails = (document.getElementById('eventDetails') as HTMLTextAreaElement).value;
    const eventDate = (document.getElementById('eventDate') as HTMLInputElement).value;
    const eventLocation = (document.getElementById('eventLocation') as HTMLInputElement).value;
    const eventTime = (document.getElementById('eventTime') as HTMLInputElement).value;
    const eventPeople = (document.getElementById('eventPeople') as HTMLInputElement).value;

    // Store the event info
    currentEvent = {
        name: eventName,
        details: eventDetails,
        date: eventDate,
        location: eventLocation,
        time: eventTime,
        people: eventPeople,
        recipients
    };

    // Display the event on the homepage
    displayEvent(currentEvent);

    closeRecipientPopup();
}

// Display the event on the homepage
function displayEvent(event: any) {
    const eventsList = document.getElementById('eventsList') as HTMLDivElement;
    const eventItem = document.createElement('div');
    eventItem.classList.add('event-item');
    eventItem.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.details}</p>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
        <p>Time: ${event.time}</p>
        <p>People: ${event.people}</p>
        <p>Sent To: ${event.recipients.join(', ')}</p>
    `;
    eventsList.appendChild(eventItem);
}

// Close the Recipient Selection Popup
function closeRecipientPopup() {
    document.getElementById('recipientPopup')!.style.display = 'none';
    document.getElementById('overlay')!.style.display = 'none';
}

// Event listener for the overlay to close popups
document.getElementById('overlay')!.addEventListener('click', () => {
    closePopup();
    closeRecipientPopup();
});
