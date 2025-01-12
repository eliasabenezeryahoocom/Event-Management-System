// Base URL for your back-end API
const BASE_URL = 'http://localhost:3000';

// Open the Add Event Popup
function openPopup() {
  document.getElementById('popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

// Close the Add Event Popup
function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

// Open the Recipient Selection Popup
function openRecipientPopup() {
  const recipientList = document.getElementById('recipientList');
  recipientList.innerHTML = ''; // Clear the list

  // Fetch signed-in users and display them
  fetchSignedInUsers()
    .then(function (users) {
      users.forEach(function (user) {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" value="${user.name}" class="recipient"> ${user.name}`;
        recipientList.appendChild(li);
      });
      document.getElementById('recipientPopup').style.display = 'block';
      document.getElementById('popup').style.display = 'none';
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Fetch signed-in users from the back-end
function fetchSignedInUsers() {
  return fetch(`${BASE_URL}/auth/signup`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch signed-in users.');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      return [];
    });
}

// Send the event to selected recipients
function sendEvent() {
  const recipients = Array.from(
    document.querySelectorAll('.recipient:checked'),
  ).map(function (checkbox) {
    return checkbox.value;
  });

  if (recipients.length === 0) {
    alert('Please select at least one recipient.');
    return;
  }

  const eventName = document.getElementById('eventName').value;
  const eventDetails = document.getElementById('eventDetails').value;
  const eventDate = document.getElementById('eventDate').value;
  const eventLocation = document.getElementById('eventLocation').value;
  const eventTime = document.getElementById('eventTime').value;
  const eventPeople = document.getElementById('eventPeople').value;

  const eventData = {
    name: eventName,
    details: eventDetails,
    date: eventDate,
    location: eventLocation,
    time: eventTime,
    people: eventPeople,
    recipients: recipients,
  };

  // POST request to create a new event
  fetch(`${BASE_URL}/events/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create event.');
      }
      return response.json();
    })
    .then((createdEvent) => {
      displayEvent(createdEvent);
      closeRecipientPopup();
    })
    .catch((error) => {
      console.error('Error creating event:', error);
      alert('Failed to create the event. Please try again.');
    });
}

// Display the event on the homepage
function displayEvent(event) {
  const eventsList = document.getElementById('eventsList');
  const eventItem = document.createElement('div');
  eventItem.classList.add('event-item');
  eventItem.setAttribute('data-id', event.id); // Add unique identifier to each event
  eventItem.innerHTML = `
        <h3>${event.name}</h3>
        <p>${event.details}</p>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
        <p>Time: ${event.time}</p>
        <p>People: ${event.people}</p>
        <p>Sent To: ${event.recipients.join(', ')}</p>
    `;

  addEditDeleteButtons(eventItem, event.id); // Add Edit and Delete buttons
  eventsList.appendChild(eventItem);
}

// Add Edit and Delete buttons to events
function addEditDeleteButtons(eventElement, eventId) {
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('mt-2', 'd-flex', 'justify-content-between');

  // Edit button
  const editButton = document.createElement('a');
  editButton.href = `/html/edit.html?id=${eventId}`; // Redirect to edit.html with the event ID
  editButton.textContent = 'Edit';
  editButton.classList.add('btn', 'btn-warning');
  editButton.onclick = () => {
    fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((eventToEdit) => {
        localStorage.setItem('editingEvent', JSON.stringify(eventToEdit)); // Store event for editing
      })
      .catch((error) =>
        console.error('Error fetching event for editing:', error),
      );
  };

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.onclick = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      fetch(`${BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete event.');
          }
          alert('Event deleted successfully!');
          eventElement.remove();
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event. Please try again.');
        });
    }
  };

  // Append buttons to the container
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  // Append the container to the event element
  eventElement.appendChild(buttonContainer);
}

// Close the Recipient Selection Popup
function closeRecipientPopup() {
  document.getElementById('recipientPopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

// Load events from the back-end on page load
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${BASE_URL}/events`, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch events.');
      }
      return response.json();
    })
    .then((events) => {
      events.forEach((event) => displayEvent(event));
    })
    .catch((error) => {
      console.error('Error loading events:', error);
    });
});

// Event listener for the overlay to close popups
document.getElementById('overlay').addEventListener('click', function () {
  closePopup();
  closeRecipientPopup();
});
