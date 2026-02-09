// EmailJS initialization (moved to each HTML head for local testing)
// (function(){
//    emailjs.init({
//      publicKey: "6ErlI6x4H-VISVp0O",
//    });
// })();

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

document.getElementById('logo').addEventListener('click', function(){
    window.location.href='index.html'; // Navigate to home page
});
document.getElementById('logo').style.cursor= 'pointer';

// Smooth scroll for internal links (primarily for current page, but not used for navigation between pages)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });


            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
});


// Contact Form Submission Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Send email
        sendEmail(formData);
    });
}

// Newsletter Form Submission Handler
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value; // Corrected ID

        // Placeholder for actual Google Apps Script Web App URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbzCIBZFxavKczktY881LigpVgR-9289qz7n2HrGIh5053psMFTt2ursirG76wsMy1c/exec';

        fetch(webAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Newsletter subscription successful:', data);
            // In a real application, you'd show a success message to the user here
            document.getElementById('newsletter-email').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            // In a real application, you'd show an error message to the user here
        });
    });
}


function validateForm(formData) {
    // Simple validation
    if (!formData.name || formData.name.trim() === '') {
        console.log('Please enter your name');
        return false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        console.log('Please enter a valid email address');
        return false;
    }

    if (!formData.subject || formData.subject.trim() === '') {
        console.log('Please enter a subject');
        return false;
    }

    if (!formData.message || formData.message.trim() === '') {
        console.log('Please enter your message');
        return false;
    }

    return true;
}

function sendEmail(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Using EmailJS (you'll need to set this up)
    if (typeof emailjs !== 'undefined') {
        emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_EMAILJS_TEMPLATE_ID', { // REMINDER: Replace with your actual EmailJS credentials
            to_email: 'sunfoyac.network@gmail.com',
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message
        })
        .then(function(response) {
            console.log('Message sent successfully:', response);
            // In a real application, you'd show a success message to the user here
            contactForm.reset();
        }, function(error) {
            console.error('Failed to send message. EmailJS Error:', error);
            // In a real application, you'd show an error message to the user here
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    } else {
        // Fallback method using mailto (less reliable for form submission)
        const mailtoLink = `mailto:sunfoyac.network@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;

        // Reset button state after a delay
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            console.log('Your email client should open. If not, please email us directly at sunfoyac.network@gmail.com');
        }, 1000);
    }
}
