let currentStep = 1;
const totalSteps = 4;
let isYearly = false;
let selectedPlan = null;
let selectedAddons = [];

const planPrices = {
    arcade: { monthly: 9, yearly: 90 },
    advanced: { monthly: 12, yearly: 120 },
    pro: { monthly: 15, yearly: 150 }
};

const addonPrices = {
    online: { monthly: 1, yearly: 10 },
    storage: { monthly: 2, yearly: 20 },
    profile: { monthly: 2, yearly: 20 }
};

function showStep(stepNumber) {
    // Hide all step contents
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => content.classList.remove('active'));
    
    // Show current step content
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update sidebar active state
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update summary when showing step 4
    if (stepNumber === 4) {
        updateSummary();
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function goToStep(stepNumber) {
    currentStep = stepNumber;
    showStep(stepNumber);
}

function toggleBilling() {
    isYearly = !isYearly;
    const toggle = document.getElementById('billingToggle');
    toggle.classList.toggle('yearly', isYearly);
    
    // Update plan prices
    updatePlanPrices();
    updateAddonPrices();
}

function updatePlanPrices() {
    Object.keys(planPrices).forEach(plan => {
        const price = isYearly ? planPrices[plan].yearly : planPrices[plan].monthly;
        const suffix = isYearly ? '/yr' : '/mo';
        document.getElementById(`${plan}-price`).textContent = `$${price}${suffix}`;
    });
}

function updateAddonPrices() {
    Object.keys(addonPrices).forEach(addon => {
        const price = isYearly ? addonPrices[addon].yearly : addonPrices[addon].monthly;
        const suffix = isYearly ? '/yr' : '/mo';
        document.getElementById(`${addon}-price`).textContent = `+$${price}${suffix}`;
    });
}

function selectPlan(plan) {
    // Remove selected class from all plans
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to chosen plan
    document.querySelector(`[data-plan="${plan}"]`).classList.add('selected');
    selectedPlan = plan;
}

function toggleAddon(addon) {
    const addonElement = document.querySelector(`[data-addon="${addon}"]`);
    const index = selectedAddons.indexOf(addon);
    
    if (index > -1) {
        selectedAddons.splice(index, 1);
        addonElement.classList.remove('selected');
    } else {
        selectedAddons.push(addon);
        addonElement.classList.add('selected');
    }
}

function updateSummary() {
    if (!selectedPlan) return;

    const planName = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
    const billingType = isYearly ? 'Yearly' : 'Monthly';
    const planPrice = isYearly ? planPrices[selectedPlan].yearly : planPrices[selectedPlan].monthly;
    const suffix = isYearly ? '/yr' : '/mo';

    document.getElementById('selected-plan').textContent = `${planName} (${billingType})`;
    document.getElementById('plan-total').textContent = `$${planPrice}${suffix}`;

    // Update add-ons summary
    const addonSummary = document.getElementById('addon-summary');
    addonSummary.innerHTML = '';
    
    let totalPrice = planPrice;
    
    selectedAddons.forEach(addon => {
        const addonPrice = isYearly ? addonPrices[addon].yearly : addonPrices[addon].monthly;
        const addonName = getAddonName(addon);
        
        const addonItem = document.createElement('div');
        addonItem.className = 'summary-item';
        addonItem.innerHTML = `
            <div class="summary-label">${addonName}</div>
            <div class="summary-price">+$${addonPrice}${suffix}</div>
        `;
        addonSummary.appendChild(addonItem);
        
        totalPrice += addonPrice;
    });

    document.getElementById('total-price').textContent = `$${totalPrice}${suffix}`;
    document.getElementById('total-label').textContent = `Total (per ${isYearly ? 'year' : 'month'})`;
}

function getAddonName(addon) {
    const names = {
        online: 'Online Service',
        storage: 'Larger Storage',
        profile: 'Customizable Profile'
    };
    return names[addon];
}

function submitForm() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        plan: selectedPlan,
        billing: isYearly ? 'yearly' : 'monthly',
        addons: selectedAddons
    };
    
    alert('Form submitted successfully!\n\nForm Data:\n' + JSON.stringify(formData, null, 2));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to step items
    document.querySelectorAll('.step-item').forEach(item => {
        item.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            currentStep = stepNumber;
            showStep(stepNumber);
        });
    });

    // Add form validation
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            nextStep();
        });
    }

    // Add input focus animations
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});