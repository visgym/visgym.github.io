window.HELP_IMPROVE_VIDEOJS = false;

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// Function to calculate and set iframe height to fully contain all content
function setIframeHeight(iframe) {
    try {
        const iframeDoc = iframe.contentWindow.document;
        const iframeBody = iframeDoc.body;
        const iframeHtml = iframeDoc.documentElement;
        
        // Wait for content to be ready
        if (iframeDoc.readyState === 'loading') {
            iframeDoc.addEventListener('DOMContentLoaded', function() {
                setIframeHeight(iframe);
            });
            return;
        }
        
        // Get the maximum height from body and html to ensure all content is included
        const bodyScrollHeight = iframeBody.scrollHeight;
        const bodyOffsetHeight = iframeBody.offsetHeight;
        const htmlScrollHeight = iframeHtml.scrollHeight;
        const htmlOffsetHeight = iframeHtml.offsetHeight;
        
        // Get computed styles to account for margins and padding
        const bodyStyle = iframe.contentWindow.getComputedStyle(iframeBody);
        const htmlStyle = iframe.contentWindow.getComputedStyle(iframeHtml);
        
        const bodyMarginTop = Math.abs(parseInt(bodyStyle.marginTop) || 0);
        const bodyMarginBottom = Math.abs(parseInt(bodyStyle.marginBottom) || 0);
        const bodyPaddingTop = Math.abs(parseInt(bodyStyle.paddingTop) || 0);
        const bodyPaddingBottom = Math.abs(parseInt(bodyStyle.paddingBottom) || 0);
        
        const htmlMarginTop = Math.abs(parseInt(htmlStyle.marginTop) || 0);
        const htmlMarginBottom = Math.abs(parseInt(htmlStyle.marginBottom) || 0);
        const htmlPaddingTop = Math.abs(parseInt(htmlStyle.paddingTop) || 0);
        const htmlPaddingBottom = Math.abs(parseInt(htmlStyle.paddingBottom) || 0);
        
        // Calculate total height including all margins and padding
        const totalHeight = Math.max(
            bodyScrollHeight + bodyMarginTop + bodyMarginBottom + bodyPaddingTop + bodyPaddingBottom,
            htmlScrollHeight + htmlMarginTop + htmlMarginBottom + htmlPaddingTop + htmlPaddingBottom,
            bodyOffsetHeight + bodyMarginTop + bodyMarginBottom + bodyPaddingTop + bodyPaddingBottom,
            htmlOffsetHeight + htmlMarginTop + htmlMarginBottom + htmlPaddingTop + htmlPaddingBottom
        );
        
        // Disable scrolling in iframe
        iframe.style.overflow = 'hidden';
        iframe.style.overflowX = 'hidden';
        iframe.style.overflowY = 'hidden';
        iframe.setAttribute('scrolling', 'no');
        
        // Disable scrolling in iframe document
        iframeBody.style.overflow = 'hidden';
        iframeBody.style.overflowX = 'hidden';
        iframeBody.style.overflowY = 'hidden';
        iframeHtml.style.overflow = 'hidden';
        iframeHtml.style.overflowX = 'hidden';
        iframeHtml.style.overflowY = 'hidden';
        
        // Set iframe height to fully contain all content (add small buffer to ensure everything is visible)
        iframe.style.height = (totalHeight + 10) + 'px';
        
        // Multiple recalculations to handle dynamic content loading
        const recalculateHeight = function(attempt) {
            attempt = attempt || 0;
            if (attempt > 5) return; // Limit to 5 attempts
            
            setTimeout(function() {
                const newBodyHeight = iframeBody.scrollHeight;
                const newHtmlHeight = iframeHtml.scrollHeight;
                
                const newTotalHeight = Math.max(
                    newBodyHeight + bodyMarginTop + bodyMarginBottom + bodyPaddingTop + bodyPaddingBottom,
                    newHtmlHeight + htmlMarginTop + htmlMarginBottom + htmlPaddingTop + htmlPaddingBottom
                );
                
                const currentHeight = parseInt(iframe.style.height) || 0;
                
                if (newTotalHeight > currentHeight - 10) {
                    iframe.style.height = (newTotalHeight + 10) + 'px';
                    // Continue recalculating if height changed
                    recalculateHeight(attempt + 1);
                }
                
                // Ensure scrolling remains disabled
                iframe.style.overflow = 'hidden';
                iframeBody.style.overflow = 'hidden';
                iframeHtml.style.overflow = 'hidden';
            }, attempt === 0 ? 200 : 300); // First delay 200ms, subsequent 300ms
        };
        
        // Start recalculation process
        recalculateHeight(0);
        
    } catch (e) {
        // Fallback to simple scrollHeight if cross-origin or other error
        console.log('Iframe height calculation error:', e);
        try {
            const fallbackHeight = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = (fallbackHeight + 20) + 'px';
        } catch (e2) {
            console.log('Fallback iframe height calculation error:', e2);
        }
    }
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    
    // Setup iframe height auto-adjustment
    const iframes = document.querySelectorAll('iframe.embed-frame, iframe.dashboard-iframe');
    iframes.forEach(function(iframe) {
        // Set height on load
        iframe.addEventListener('load', function() {
            setIframeHeight(this);
        });
        
        // Also set height immediately if already loaded
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            setIframeHeight(iframe);
        }
    });

})
