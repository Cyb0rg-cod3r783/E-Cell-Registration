// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeSuccessPage();
});

// Initialize Success Page
function initializeSuccessPage() {
    updateRegistrationDetails();
    createConfetti();
    animateElements();
}

// Update Registration Details with Dynamic Data
function updateRegistrationDetails() {
    // Generate random registration ID
    const registrationId = generateRegistrationId();
    const regIdElement = document.getElementById('registration-id');
    if (regIdElement) {
        regIdElement.textContent = registrationId;
    }
    
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const dateElement = document.getElementById('registration-date');
    if (dateElement) {
        dateElement.textContent = currentDate;
    }
    
    // Get email from URL parameters or existing content
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || getExistingEmail();
    const emailElement = document.getElementById('user-email');
    if (emailElement && email && email !== 'your.email@example.com') {
        emailElement.textContent = email;
    }
    
    // Store registration data
    storeRegistrationData(registrationId, email, currentDate);
}

// Generate Random Registration ID
function generateRegistrationId() {
    const prefix = '#REG';
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    return prefix + randomNum;
}

// Get Existing Email from the page
function getExistingEmail() {
    const emailElement = document.getElementById('user-email');
    return emailElement ? emailElement.textContent : 'your.email@example.com';
}

// Store Registration Data (in memory for this session)
function storeRegistrationData(id, email, date) {
    const registrationData = {
        id: id,
        email: email,
        date: date,
        timestamp: Date.now()
    };
    
    // Store in window object for access by other functions
    window.registrationData = registrationData;
}

// Create Confetti Animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(confettiContainer);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000);
}

// Create Individual Confetti Piece
function createConfettiPiece(container) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Random horizontal position
    confetti.style.left = Math.random() * 100 + '%';
    
    // Random animation delay
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    // Random size
    const size = Math.random() * 6 + 4;
    confetti.style.width = size + 'px';
    confetti.style.height = size + 'px';
    
    container.appendChild(confetti);
}

// Animate Elements on Load
function animateElements() {
    // Add entrance animations to details
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 600 + (index * 200));
    });
    
    // Animate buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));
    });
}

// Download Confirmation Function
function downloadConfirmation() {
    // Create confirmation text
    const registrationData = window.registrationData || {
        id: '#REG12345',
        email: getExistingEmail(),
        date: new Date().toLocaleDateString()
    };
    
    const confirmationText = `
E-CELL IIT BOMBAY WORKSHOP REGISTRATION CONFIRMATION
===================================================

Registration ID: ${registrationData.id}
Email: ${registrationData.email}
Registration Date: ${registrationData.date}

Thank you for registering for the Entrepreneurship Workshop!

Workshop Details:
- Duration: 6-hour offline workshop
- Organizer: E-Cell IIT Bombay
- Includes: Expert speakers, startup kit, and certificate

Important Information:
- Please keep this confirmation for your records
- You will receive additional workshop details via email
- Contact E-Cell IIT Bombay if you have any questions

What to expect:
- Networking with like-minded entrepreneurs
- Insights from industry experts
- Hands-on startup activities
- Certificate of participation

We look forward to seeing you at the workshop!

Best regards,
E-Cell IIT Bombay Team

Contact: ecell@iitb.ac.in
Website: www.ecell.in
    `;
    
    // Create and download file
    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `workshop-confirmation-${registrationData.id.replace('#', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show feedback
    showNotification('Confirmation downloaded successfully!', 'success');
}

// Go to Home Function
function goToHome() {
    // You can customize this URL to point to your actual home page
    const homeUrl = '/registration'; // or your actual home page URL
    
    // Add a nice transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = homeUrl;
    }, 300);
}

// Show Notification Function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4caf50' : '#2196f3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Print function (bonus feature)
function printConfirmation() {
    window.print();
}

// Add print styles dynamically
const printStyles = `
    @media print {
        body * {
            visibility: hidden;
        }
        .success-card, .success-card * {
            visibility: visible;
        }
        .success-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border: 2px solid #4285f4;
        }
        .action-buttons, .confetti {
            display: none !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);