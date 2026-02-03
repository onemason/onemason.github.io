// Logo drops like a ping-pong ball
(function() {
    function initLogoDrop() {
        var logo = document.getElementById('logo');
        if (!logo) return;

        // Set initial state
        logo.style.opacity = '0';
        logo.style.transition = 'none';

        // Force reflow
        void logo.offsetWidth;

        // Ping-pong bounce keyframes
        var keyframes = [];
        var bounceCount = 23;
        var bounceHeight = 80;

        // Initial position - in air
        keyframes.push({ opacity: '0', transform: 'translateY(-300px)' });

        // First hit on ground
        keyframes.push({ opacity: '0.5', transform: 'translateY(0px)' });

        // 23 bounces
        for (var i = 0; i < bounceCount; i++) {
            var height = bounceHeight * Math.pow(0.82, i);
            keyframes.push({ transform: `translateY(-${height}px)` });
            keyframes.push({ transform: 'translateY(0px)' });
        }

        // Final settle
        keyframes.push({ opacity: '1', transform: 'translateY(0px)' });

        // Perform animation
        logo.animate(keyframes, {
            duration: 4000,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLogoDrop);
    } else {
        initLogoDrop();
    }
})();
