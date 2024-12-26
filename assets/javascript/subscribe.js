document.addEventListener('DOMContentLoaded', function() {
    const footerSubscribeForm = document.getElementById('footer-subscribe-form');
    console.log(footerSubscribeForm)
    
    if (footerSubscribeForm) {
        footerSubscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value from footer form
            const email = document.getElementById('footer-email').value;
            
            // Validate email format
            if (!isValidEmail(email)) {
                Swal.fire({
                    title: "Invalid Email",
                    text: "Please enter a valid email address.",
                    icon: "error",
                    confirmButtonColor: "#790D1D"
                });
                return;
            }

            // Get existing subscriptions or initialize empty array
            let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            
            // Check if email already exists
            if (subscribers.includes(email)) {
                Swal.fire({
                    title: "Already Subscribed",
                    text: "This email is already subscribed to our newsletter.",
                    icon: "info",
                    confirmButtonColor: "#790D1D"
                });
                return;
            }
            
            // Add new subscriber
            subscribers.push(email);
            
            // Save updated list
            localStorage.setItem('subscribers', JSON.stringify(subscribers));

            // Show success message
            Swal.fire({
                title: "Thank You!",
                text: "You've successfully subscribed to our newsletter.",
                icon: "success",
                confirmButtonColor: "#790D1D"
            }).then(() => {
                // Reset form
                footerSubscribeForm.reset();
            });
        });
    }
});

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}