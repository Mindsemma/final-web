// Mobile Menu and Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');
    
    // Get elements
    const menuCheckbox = document.getElementById('menu-toggle');
    const dropdownTriggers = document.querySelectorAll('.drop-trigger');
    
    // Debug info
    console.log('Found dropdown triggers:', dropdownTriggers.length);
    
    // Handle dropdown clicks on mobile
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Only run on mobile
            if (window.innerWidth <= 768) {
                console.log('Dropdown trigger clicked');
                e.preventDefault();
                e.stopPropagation();
                
                const parentDropdown = this.closest('.dropdown');
                
                if (parentDropdown) {
                    // Toggle active class
                    parentDropdown.classList.toggle('active');
                    console.log('Toggled dropdown active state:', parentDropdown.classList.contains('active'));
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach(dropdown => {
                        if (dropdown !== parentDropdown) {
                            dropdown.classList.remove('active');
                        }
                    });
                }
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            // If clicked outside dropdown and not on hamburger
            if (!e.target.closest('.dropdown') && !e.target.closest('.hamburger')) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
    
    // Close entire menu when clicking regular nav links
    document.querySelectorAll('.nav-links a:not(.drop-trigger)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Close menu
                if (menuCheckbox) {
                    menuCheckbox.checked = false;
                }
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                
                console.log('Menu closed after link click');
            }
        });
    });
    
    // Reset on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Close all mobile dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Uncheck menu checkbox
            if (menuCheckbox) {
                menuCheckbox.checked = false;
            }
        }
    });
});



// Hero Slideshow Functionality - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.querySelector('.slideshow-container');
    if (!slideshow) return;
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Debug: Check if slides are found
    console.log('Slides found:', slides.length);
    console.log('Dots found:', dots.length);
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    let isUserInteracting = false;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Validate index
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to current slide and dot
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        
        if (dots.length > currentSlide) {
            dots[currentSlide].classList.add('active');
        }
        
        console.log('Showing slide:', currentSlide);
    }
    
    // Function to show next slide
    function nextSlide() {
        if (isUserInteracting) return; // Don't auto-advance if user is interacting
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Function to show previous slide
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Function to start slideshow
    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
        console.log('Slideshow started');
    }
    
    // Function to stop slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
        console.log('Slideshow stopped');
    }
    
    // Initialize slideshow
    function initSlideshow() {
        // Ensure first slide is active
        showSlide(0);
        
        // Start automatic slideshow
        startSlideshow();
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                isUserInteracting = true;
                stopSlideshow();
                showSlide(index);
                
                // Reset interaction flag after 3 seconds
                setTimeout(() => {
                    isUserInteracting = false;
                    startSlideshow();
                }, 3000);
            });
        });
        
        // Pause slideshow on hover/touch
        slideshow.addEventListener('mouseenter', stopSlideshow);
        slideshow.addEventListener('mouseleave', function() {
            if (!isUserInteracting) startSlideshow();
        });
        
        // Touch events for mobile
        slideshow.addEventListener('touchstart', function() {
            isUserInteracting = true;
            stopSlideshow();
        });
        
        slideshow.addEventListener('touchend', function() {
            setTimeout(() => {
                isUserInteracting = false;
                startSlideshow();
            }, 3000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                isUserInteracting = true;
                stopSlideshow();
                prevSlide();
                setTimeout(() => { isUserInteracting = false; startSlideshow(); }, 3000);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                isUserInteracting = true;
                stopSlideshow();
                nextSlide();
                setTimeout(() => { isUserInteracting = false; startSlideshow(); }, 3000);
            }
        });
    }
    
    // Wait for images to load before starting slideshow
    let imagesLoaded = 0;
    const totalImages = slides.length;
    
    slides.forEach(slide => {
        const img = new Image();
        img.src = slide.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        
        img.onload = function() {
            imagesLoaded++;
            console.log('Image loaded:', imagesLoaded, 'of', totalImages);
            
            if (imagesLoaded === totalImages) {
                console.log('All images loaded, starting slideshow');
                initSlideshow();
            }
        };
        
        img.onerror = function() {
            imagesLoaded++;
            console.warn('Failed to load image:', img.src);
            
            if (imagesLoaded === totalImages) {
                console.log('All images processed, starting slideshow');
                initSlideshow();
            }
        };
    });
    
    // If no images to load, start immediately
    if (totalImages === 0) {
        initSlideshow();
    }
});