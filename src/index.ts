"use strict";

// Fetch events data from the server
const fetchEvents = async (): Promise<any[]> => {
  try {
    const response = await fetch("http://localhost:3000/events");
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Render event card for each event
const renderEventCard = (event: any): HTMLElement => {
  const card = document.createElement("div");
  card.classList.add("card", "mt-3", "mb-3");
  card.id = `event-${event.id}`;
  card.innerHTML = `
    <div class="row g-0">
      <div class="col-md-8">
        <div class="card-body">
          <h2 class="card-title">${event.name}</h2>
          <p class="card-text"><strong>Invited by:</strong> ${event.invitedBy}</p>
          <p class="card-text"><strong>Location:</strong> ${event.location}</p>
          <p class="card-text"><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
          <p class="card-text"><strong>Time:</strong> ${event.time}</p>
          <p class="card-text"><strong>People Invited:</strong> ${event.peopleInvited}</p>
          <div class="d-grid gap-2 d-md-block" id="action-buttons-${event.id}">
            <button class="btn btn-secondary buy-ticket" id="buy-ticket-${event.id}" type="button">RSVP</button>
            <button class="btn btn-secondary decline-ticket" id="decline-ticket-${event.id}" type="button">Decline</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <img src="/src/images/${event.image}" class="img-fluid rounded-start" alt="${event.name}">
      </div>
    </div>
  `;
  return card;
};

// Display events on the page
const displayEvents = async (): Promise<void> => {
  const eventsContainer = document.getElementById("events-container");
  if (!eventsContainer) {
    console.error('Error: "events-container" element not found.');
    return;
  }
  const events = await fetchEvents();
  eventsContainer.innerHTML = "";
  events.forEach((event) => {
    const eventCard = renderEventCard(event);
    eventsContainer.appendChild(eventCard);
    addRSVPEventListener(event.id, event.name);
    addDeclineEventListener(event.id);
  });
  console.log("Rendered events:", eventsContainer.innerHTML);
};

// RSVP click handler
const onRSVPClick = async (eventId: number, eventName: string): Promise<void> => {
  const rsvpButton = document.getElementById(`buy-ticket-${eventId}`);
  const declineButton = document.getElementById(`decline-ticket-${eventId}`);
  if (rsvpButton) {
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "ticket";
    ticketDiv.innerHTML = `
      <div style="display: flex; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; width:70%;">
        <div style="background-color: #333; color: white; padding: 10px; flex: 1;">${eventName}</div>
        <div style="background-color: #4a4a4a; color: white; padding: 10px; flex: 2; border: 15px solid white; font-size:15px;">
          <p>Your Party Ticket</p>
        </div>
      </div>
    `;
    rsvpButton?.parentNode?.replaceChild(ticketDiv, rsvpButton);

    // Decrease the number of tickets in the database
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}/decrease-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to decrease tickets: ${response.statusText}`);
      }
      console.log(`Tickets for event ${eventId} decreased by one.`);
    } catch (error) {
      console.error("Error decreasing tickets:", error);
    }
  }
  if (declineButton) {
    declineButton.style.display = "none";
  }
};

// Add RSVP click listener to the button
const addRSVPEventListener = (eventId: number, eventName: string): void => {
  const rsvpButton = document.getElementById(`buy-ticket-${eventId}`);
  if (rsvpButton) {
    rsvpButton.addEventListener("click", () => onRSVPClick(eventId, eventName));
  }
};

// Decline click handler
const onDeclineClick = (eventId: number): void => {
  const rsvpButton = document.getElementById(`buy-ticket-${eventId}`);
  const declineButton = document.getElementById(`decline-ticket-${eventId}`);
  if (declineButton) {
    const declineDiv = document.createElement("div");
    declineDiv.className = "decline";
    declineDiv.innerHTML = `
      <div style="display: flex; border: 1px solid #ccc; border-radius: 5px; overflow: hidden; width:70%;">
        <div style="background-color: #f44336; color: white; padding: 10px; flex: 1;">Declined</div>
        <div style="background-color: #c62828; color: white; padding: 10px; flex: 2; border: 15px solid white; font-size:15px;">
          <p>You have declined this event</p>
        </div>
      </div>
    `;
    declineButton?.parentNode?.replaceChild(declineDiv, declineButton);
  }
  if (rsvpButton) {
    rsvpButton.style.display = "none";
  }
};

// Add Decline click listener to the button
const addDeclineEventListener = (eventId: number): void => {
  const declineButton = document.getElementById(`decline-ticket-${eventId}`);
  if (declineButton) {
    declineButton.addEventListener("click", () => onDeclineClick(eventId));
  }
};

// Function to handle login
const handleLogin = async (event: Event): Promise<void> => {
  event.preventDefault();
  const emailInput = document.getElementById("inputEmail4") as HTMLInputElement;
  const passwordInput = document.getElementById("inputPassword4") as HTMLInputElement;
  if (!emailInput || !passwordInput) {
    console.error("Email or password input fields are missing.");
    return;
  }
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.message}`);
      return;
    }
    alert("Login successful! Redirecting to the home page...");
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Error logging in:", error);
    alert("An error occurred during login. Please try again later.");
  }
};

// Function to handle logout
const logout = (): void => {
  window.location.href = "login.html";
};

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form?.addEventListener("submit", handleLogin);
  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.addEventListener("click", logout);
  displayEvents();
});
