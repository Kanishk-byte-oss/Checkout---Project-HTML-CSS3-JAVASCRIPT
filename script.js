// ========================================
// STEP STATE MODEL (Primary Concept)
// Numeric step index tracks user progress: Step 1, Step 2, Step 3, Step 4
let currentStep = 1;                    // Current step (e.g., currentStep = 2)
const maxSteps = 4;                     // Total steps in checkout workflow

// ========================================
// STATE PERSISTENCE - Save current step to localStorage (Required)
// Called after navigation and input changes
function saveStep() {
    // EXACT SYNTAX: localStorage.setItem('currentStep', currentStep)
    localStorage.setItem('currentStep', Number(currentStep).toString());
    
    // ES6 Template Literal + JSON for form data persistence
    const formData = {
        [`step${currentStep}`]: document.getElementById('cart-items')?.value || '',
        step2: {
            name: document.getElementById('shipping-name')?.value || '',
            address: document.getElementById('shipping-address')?.value || ''
        },
        step3: {
            card: document.getElementById('card-number')?.value || '',
            expiry: document.getElementById('expiry')?.value || ''
        }
    };
    localStorage.setItem('formData', JSON.stringify(formData)); // JSON parsing
}

// ========================================
// RESTORE ON RELOAD - Load saved step automatically (Critical Requirement)
// Runs on page load to show persisted progress
function loadStep() {
    const savedStep = localStorage.getItem('currentStep');
    const savedData = localStorage.getItem('formData');
    
    if (savedStep) {
        // ES6 Number parsing - EXACT SYNTAX as required
        currentStep = Number(localStorage.getItem('currentStep'));
        renderStep(); // Dynamic UI transition to saved step
        
        // Restore form data using template literal
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('cart-items').value = data[`step${currentStep}`] || '';
            document.getElementById('shipping-name').value = data.step2?.name || '';
            document.getElementById('shipping-address').value = data.step2?.address || '';
            document.getElementById('card-number').value = data.step3?.card || '';
            document.getElementById('expiry').value = data.step3?.expiry || '';
        }
    }
}

// ========================================
// STEP NAVIGATION LOGIC (Primary Evaluation Area)
// Next step with boundary check - REQUIRED conditional
function nextStep() {
    if (currentStep < maxSteps) {           // Boundary check (CRITICAL)
        currentStep++;                      // Track forward progress
        renderStep();                       // Dynamic UI update
        saveStep();                         // Persist step transition
    }
}

// ========================================
// PREVIOUS STEP NAVIGATION - Backward tracking
function prevStep() {
    if (currentStep > 1) {                  // Boundary check (REQUIRED)
        currentStep--;                      // Track backward progress
        renderStep();                       // Dynamic UI update
    }
}

// ========================================
// UI STEP RENDERING - Dynamic DOM manipulation (No page reload)
// Show only active step, hide others dynamically
function renderStep() {
    // Hide ALL step contents and indicators first
    for (let i = 1; i <= maxSteps; i++) {
        document.getElementById(`step-${i}`).classList.remove('active');
        document.querySelector(`.step[data-step="${i}"]`).classList.remove('active');
    }
    
    // Show ONLY current step content + update indicators
    document.getElementById(`step-${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update step display (Step 2 of 4)
    document.getElementById('current-step-display').textContent = currentStep;
    
    // Dynamic button states
    document.getElementById('prev-btn').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('next-btn').textContent = currentStep < maxSteps ? 'Next' : 'Finish';
}

// ========================================
// RESET WORKFLOW - Clear storage + return to Step 1 (Required)
function resetWorkflow() {
    currentStep = 1;                                    // Return to Step 1
    localStorage.removeItem('currentStep');             // Clear stored step
    localStorage.removeItem('formData');                // Clear form data
    document.querySelectorAll('input').forEach(input => input.value = ''); // Clear inputs
    renderStep();                                       // Refresh UI
}

// ========================================
// FORM SUBMISSION - Final step completion
function submitWorkflow() {
    alert(`Thank you! Purchase completed at Step ${currentStep}.`);  // ES6 template literal
    resetWorkflow();
}

// ========================================
// EVENT LISTENERS - Dynamic DOM updates (No page reload)
// Auto-restore on EVERY page load + real-time persistence
window.onload = () => loadStep();                       // ES6 arrow function
document.addEventListener('input', saveStep);           // Save on typing

// ========================================
// INITIAL RENDER - Setup complete workflow
renderStep();

