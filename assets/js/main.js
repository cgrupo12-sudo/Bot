/**
 * Wester Juniors Bank - Main JavaScript
 * Handles all interactive elements of the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scrolling for anchor links
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
            }
        });
    });
    
    // Loan Calculator Functionality
    const loanCalculator = {
        amount: document.getElementById('amount'),
        amountRange: document.getElementById('amount-range'),
        term: document.getElementById('term'),
        termRange: document.getElementById('term-range'),
        rate: document.getElementById('rate'),
        loanType: document.getElementById('loan-type'),
        monthlyPayment: document.getElementById('monthly-payment'),
        loanAmount: document.getElementById('loan-amount'),
        totalInterest: document.getElementById('total-interest'),
        totalPayment: document.getElementById('total-payment'),
        
        init() {
            // Set initial values
            this.syncAmounts();
            this.syncTerms();
            this.calculate();
            
            // Event listeners
            this.amount.addEventListener('input', () => this.onAmountChange());
            this.amountRange.addEventListener('input', () => this.onAmountRangeChange());
            this.term.addEventListener('input', () => this.onTermChange());
            this.termRange.addEventListener('input', () => this.onTermRangeChange());
            this.rate.addEventListener('input', () => this.calculate());
            this.loanType.addEventListener('change', () => this.updateRateByLoanType());
        },
        
        onAmountChange() {
            this.amountRange.value = this.amount.value;
            this.calculate();
        },
        
        onAmountRangeChange() {
            this.amount.value = this.amountRange.value;
            this.calculate();
        },
        
        onTermChange() {
            this.termRange.value = this.term.value;
            this.calculate();
        },
        
        onTermRangeChange() {
            this.term.value = this.termRange.value;
            this.calculate();
        },
        
        syncAmounts() {
            const value = this.amount.value;
            this.amountRange.value = value;
            this.loanAmount.textContent = this.formatCurrency(value);
        },
        
        syncTerms() {
            const value = this.term.value;
            this.termRange.value = value;
        },
        
        updateRateByLoanType() {
            const rates = {
                'hipotecario': 7.9,
                'personal': 12.9,
                'empresarial': 9.9
            };
            
            const selectedType = this.loanType.value;
            this.rate.value = rates[selectedType] || 9.9;
            this.calculate();
        },
        
        calculate() {
            const principal = parseFloat(this.amount.value);
            const years = parseFloat(this.term.value);
            const rate = parseFloat(this.rate.value) / 100 / 12; // Monthly interest rate
            const payments = years * 12; // Total number of payments
            
            // Calculate monthly payment
            let monthlyPayment = 0;
            if (rate === 0) {
                monthlyPayment = principal / payments;
            } else {
                monthlyPayment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
            }
            
            // Calculate total payment and total interest
            const totalPayment = monthlyPayment * payments;
            const totalInterest = totalPayment - principal;
            
            // Update the UI
            this.monthlyPayment.textContent = this.formatCurrency(monthlyPayment);
            this.loanAmount.textContent = this.formatCurrency(principal);
            this.totalInterest.textContent = this.formatCurrency(totalInterest);
            this.totalPayment.textContent = this.formatCurrency(totalPayment);
            
            // Update the loan amount in the contact form if it exists
            const contactLoanType = document.getElementById('loan-type-contact');
            if (contactLoanType) {
                contactLoanType.value = this.loanType.value;
            }
        },
        
        formatCurrency(amount) {
            return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }
    };
    
    // Initialize calculator if elements exist
    if (document.getElementById('loan-calculator')) {
        loanCalculator.init();
    }
    
    // Form validation for contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Validación previa manual
            // Si falla, no se envía a Formsubmit
            let isValid = true;
            const name = this.querySelector('input[type="text"]');
            const email = this.querySelector('input[type="email"]');
            const message = this.querySelector('textarea');
            [name, email, message].forEach(field => {
                field.classList.remove('border-red-500');
                const errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains('text-red-500')) {
                    errorElement.remove();
                }
            });
            if (!name.value.trim()) {
                showError(name, 'Por favor ingresa tu nombre');
                isValid = false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError(email, 'Por favor ingresa un correo electrónico válido');
                isValid = false;
            }
            if (!message.value.trim()) {
                showError(message, 'Por favor ingresa tu mensaje');
                isValid = false;
            }
            if (!isValid) {
                e.preventDefault();
                return false;
            }
            // Mostrar mensaje de éxito tras envío (solo si Formsubmit no redirige)
            // Si quieres evitar redirección, elimina el campo _next en el HTML
            setTimeout(function() {
                const success = document.getElementById('contact-success');
                if(success) success.classList.remove('hidden');
                contactForm.reset();
            }, 800);
        });
        
        function showError(field, message) {
            field.classList.add('border-red-500');
            const errorElement = document.createElement('p');
            errorElement.className = 'text-red-500 text-sm mt-1';
            errorElement.textContent = message;
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }
    
    // Scroll reveal animation
    function revealOnScroll() {
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('opacity-100', 'translate-y-0');
                
                if (element.classList.contains('reveal-left')) {
                    element.classList.add('translate-x-0');
                } else if (element.classList.contains('reveal-right')) {
                    element.classList.add('translate-x-0');
                }
            }
        });
    }
    
    // Initialize scroll reveal
    window.addEventListener('scroll', revealOnScroll);
    
    // Initial check in case elements are already in view
    revealOnScroll();
    
    // Add animation classes to elements
    document.addEventListener('DOMContentLoaded', () => {
        // Add animation classes to hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) heroTitle.classList.add('animate-fadeIn');
        if (heroSubtitle) heroSubtitle.classList.add('animate-fadeIn', 'delay-100');
        if (heroButtons) heroButtons.classList.add('animate-fadeIn', 'delay-200');
    });
    
    // Add animation to loan cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe loan cards
    document.querySelectorAll('.loan-card').forEach(card => {
        observer.observe(card);
    });
});

// Add a simple loading animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('opacity-0');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }
});
