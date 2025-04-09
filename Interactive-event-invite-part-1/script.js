// Get the form element and confirmation message element
const rsvpForm = document.getElementById('rsvp-form');
const confirmationMessage = document.getElementById('confirmation-message');

// Add event listener to the form submission
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the selected attendance value
  const attendance = document.getElementById('attendance').value;

  // Display confirmation message based on attendance selection
  if (attendance === 'yes') {
    confirmationMessage.innerHTML = '🎉 Party on! We look forward to seeing you at the GIF Gala!';
  }
  
  // Show the confirmation message
  confirmationMessage.style.display = 'block';
  
  // Reset the form
  rsvpForm.reset();
});