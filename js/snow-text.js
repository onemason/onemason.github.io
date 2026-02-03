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
            textNode.parentNode.replaceChild(span, textNode);
        });

        // Set animation delay only - opacity and animation are in CSS
        var chars = content.querySelectorAll('.snow-char');
        chars.forEach(function(char, index) {
            var delay = index * 0.02;
            char.style.animationDelay = delay + 's';
        });

        // Restore text after all animations complete
        setTimeout(function() {
            chars.forEach(function(span) {
                var text = document.createTextNode(span.textContent);
                if (span.parentNode) {
                    span.parentNode.replaceChild(text, span);
                }
            });
        }, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initSnowText();
        });
    } else {
        initSnowText();
    }
})();
