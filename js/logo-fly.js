// Logo drops like a real ping-pong ball with exactly 23 bounces
(function() {
    function initLogoDrop() {
        var logo = document.getElementById('logo');
        if (!logo) return;

        // Set initial state
        logo.style.opacity = '0';
        logo.style.transition = 'none';

        // Force reflow
        void logo.offsetWidth;

        // Real ping-pong ball physics
        var bounceCount = 23;
        var initialHeight = 300;
        var bounceRatio = 0.78; // Height retained per bounce (slightly higher to sustain 23 bounces)

        var keyframes = [];
        var currentHeight = initialHeight;
        var time = 0;
        var fallDuration = 150;

        // Start high
        keyframes.push({ opacity: '0', transform: `translateY(-${currentHeight}px)` });

        // First fall to ground
        time += fallDuration;
        keyframes.push({ opacity: '0.5', transform: 'translateY(0px)', offset: time / 4000 });

        // Exactly 23 bounces
        for (var i = 0; i < bounceCount; i++) {
            currentHeight *= bounceRatio;

            var riseDuration = fallDuration * Math.sqrt(bounceRatio) * (1 + i * 0.02);
            fallDuration *= Math.sqrt(bounceRatio);

            // Rise up
            time += riseDuration;
            keyframes.push({
                transform: `translateY(-${currentHeight}px)`,
                offset: time / 4000
            });

            // Fall down
            time += fallDuration;
            keyframes.push({
                transform: 'translateY(0px)',
                offset: time / 4000
            });
        }

        // Final settle
        keyframes.push({ opacity: '1', transform: 'translateY(0px)' });

        // Perform animation
        logo.animate(keyframes, {
            duration: time + 200,
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
