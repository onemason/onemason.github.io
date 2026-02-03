// Snow text falling animation for blog posts
(function() {
    function initSnowText() {
        // Only run on blog post pages
        if (!document.querySelector('.post')) return;

        var content = document.querySelector('.content');
        if (!content) return;

        // Get all text nodes in order, excluding code blocks
        var textNodes = [];
        var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);

        var node;
        while (node = walker.nextNode()) {
            // Skip text inside pre/code blocks
            var parent = node.parentNode;
            if (parent && (parent.tagName === 'PRE' || parent.tagName === 'CODE')) {
                continue;
            }
            if (node.textContent.trim().length > 0) {
                textNodes.push(node);
            }
        }

        // Replace each text node with a span
        textNodes.forEach(function(textNode) {
            var span = document.createElement('span');
            span.className = 'snow-char';
            span.textContent = textNode.textContent;
            span.style.color = '';
            textNode.parentNode.replaceChild(span, textNode);
        });

        // Start snow falling animation
        var chars = content.querySelectorAll('.snow-char');
        chars.forEach(function(char, index) {
            var delay = index * 0.01;
            char.style.opacity = '0';
            char.style.animationDelay = delay + 's';
            char.style.animationDuration = '1.2s';
            char.style.animationFillMode = 'forwards';
            char.style.animationTimingFunction = 'ease-out';
            char.style.animationName = 'snowFall';
        });

        // Restore text after animation
        setTimeout(function() {
            chars.forEach(function(span) {
                var text = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(text, span);
            });
        }, 3500);
    }

    // Image fade-in animation
    function initImageFadeIn() {
        var images = document.querySelectorAll('.content img');
        images.forEach(function(img) {
            // If image already loaded, show immediately
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
                img.addEventListener('load', function() {
                    img.style.opacity = '1';
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initSnowText();
            initImageFadeIn();
        });
    } else {
        initSnowText();
        initImageFadeIn();
    }
})();
