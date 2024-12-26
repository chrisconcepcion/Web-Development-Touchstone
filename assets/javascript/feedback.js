document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                requestType: document.getElementById('requestType').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString(),
                id: Date.now() // Unique ID for each submission
            };

            // Get existing feedback from storage or initialize empty array
            let feedbackList = JSON.parse(localStorage.getItem('feedbackSubmissions')) || [];
            
            // Add new feedback to array
            feedbackList.push(formData);
            
            // Save updated list back to storage
            localStorage.setItem('feedbackSubmissions', JSON.stringify(feedbackList));

            // Show success message
            Swal.fire({
                title: "Thank You!",
                text: "Your feedback has been submitted successfully.",
                icon: "success",
                confirmButtonColor: "#790D1D"
            }).then(() => {
                // Reset form
                feedbackForm.reset();
            });
        });
    }

    // Display stored feedback count (optional)
    displayFeedbackCount();
});

function displayFeedbackCount() {
    const feedbackCount = document.getElementById('feedback-count');
    if (feedbackCount) {
        const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions')) || [];
        feedbackCount.textContent = submissions.length;
    }
}

// Function to clear feedback (for testing purposes)
function clearFeedback() {
    localStorage.removeItem('feedbackSubmissions');
    displayFeedbackCount();
}