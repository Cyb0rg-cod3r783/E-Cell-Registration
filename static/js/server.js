// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
});

// Initialize Registration Form
function initializeRegistrationForm() {
    setupFormAnimations();
    setupInputValidation();
    setupRippleEffect();
}

// Setup Form Animations
function setupFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 800 + (index * 150));
    });
    
    // Animate button
    const button = document.querySelector('.register-btn');
    if (button) {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 800 + (formGroups.length * 150));
    }
}

// Setup Input Validation
function setupInputValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
}

// Validate Individual Input
function validateInput(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const value = input.value.trim();
    
    // Remove previous validation classes
    formGroup.classList.remove('error', 'success');
    
    // Validate based on input type
    let isValid = false;
    
    switch(input.type) {
        case 'text':
            isValid = value.length >= 2;
            break;
        case 'email':
            isValid = isValidEmail(value);
            break;
        case 'tel':
            isValid = isValidPhone(value);
            break;
        default:
            isValid = value.length > 0;
    }
    
    // Apply validation classes
    if (value.length > 0) {
        formGroup.classList.add(isValid ? 'success' : 'error');
    }
}

// Clear Validation on Input
function clearValidation(event) {
    const formGroup = event.target.closest('.form-group');
    formGroup.classList.remove('error', 'success');
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Setup Ripple Effect for Button
function setupRippleEffect() {
    const button = document.querySelector('.register-btn');
    
    if (button) {
        button.addEventListener('click', function(e) {
            const ripple = button.querySelector('.btn-ripple');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('animate');
            
            setTimeout(() => ripple.classList.remove('animate'), 600);
        });
    }
}

// Form Submission Handler
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Show loading state
    const button = document.querySelector('.register-btn');
    const originalText = button.innerHTML;
    
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    
    // Validate all inputs before submission
    if (!validateAllInputs()) {
        button.classList.remove('loading');
        button.innerHTML = originalText;
        showResponseMessage('Please fill all fields correctly', 'error');
        return;
    }
    
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('Sending registration data:', data);
        
        const response = await fetch("/registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response data:', result);
        
        if (result.success) {
            showResponseMessage(result.message || 'Registration successful!', 'success');
            
            // Reset form after successful submission
            setTimeout(() => {
                e.target.reset();
                clearAllValidations();
                
                // Redirect to success page with email parameter
                const email = data.email;
                window.location.href = `/success?email=${encodeURIComponent(email)}`;
            }, 1500);
        } else {
            showResponseMessage(result.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showResponseMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        button.classList.remove('loading');
        button.innerHTML = originalText;
    }
});

// Validate All Inputs
function validateAllInputs() {
    const inputs = document.querySelectorAll('input[required]');
    let allValid = true;
    
    inputs.forEach(input => {
        const event = { target: input };
        validateInput(event);
        
        const formGroup = input.closest('.form-group');
        if (formGroup.classList.contains('error') || !input.value.trim()) {
            allValid = false;
        }
    });
    
    return allValid;
}

// Clear All Validations
function clearAllValidations() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
    });
}

// Show Response Message
function showResponseMessage(message, type) {
    const responseDiv = document.getElementById('responseMessage');
    
    if (responseDiv) {
        responseDiv.textContent = message;
        responseDiv.className = `response-message ${type} show`;
        
        // Auto-hide after 5 seconds for non-success messages
        if (type !== 'success') {
            setTimeout(() => {
                responseDiv.classList.remove('show');
            }, 5000);
        }
    }
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        const firstInput = document.querySelector('input');
        if (firstInput) firstInput.focus();
    }
});

// Auto-focus first input after page load animation
setTimeout(() => {
    const firstInput = document.querySelector('input');
    if (firstInput) firstInput.focus();
}, 1500);

// Input formatting helpers
document.addEventListener('input', function(e) {
    const input = e.target;
    
    // Phone number formatting
    if (input.type === 'tel') {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 10) {
            value = value.slice(0, 10);
        }
        input.value = value;
    }
    
    // Name formatting (capitalize first letters)
    if (input.name === 'username') {
        input.value = input.value.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    // Email formatting (lowercase)
    if (input.type === 'email') {
        input.value = input.value.toLowerCase();
    }
});

// Add visual feedback for form completion
function checkFormCompletion() {
    const inputs = document.querySelectorAll('input[required]');
    const allFilled = Array.from(inputs).every(input => input.value.trim());
    
    const button = document.querySelector('.register-btn');
    if (button && allFilled) {
        button.style.background = '#4caf50';
        button.innerHTML = '<i class="fas fa-check"></i> Ready to Register <div class="btn-ripple"></div>';
    } else if (button) {
        button.style.background = '#4285f4';
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Register Now <div class="btn-ripple"></div>';
    }
}

// Monitor form completion
document.addEventListener('input', checkFormCompletion);
document.addEventListener('blur', checkFormCompletion, true);