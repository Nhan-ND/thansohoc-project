        // Create stars in the background
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const starCount = 100;

            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');

                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;

                // Random size
                const size = Math.random() * 2;

                // Random animation delay
                const delay = Math.random() * 4;

                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.animationDelay = `${delay}s`;

                starsContainer.appendChild(star);
            }
        }

        // Call the function when the page loads
        window.addEventListener('load', createStars);

        function refreshPage() {
            document.querySelector('.results-container').classList.add('hidden');
            document.getElementById('fullName').value = '';
            document.getElementById('birthday').value = '';
            document.querySelector('form').style.display = 'block'; // Show form
            document.querySelector('.results-container').style.display = 'none'; // Hide results
        }

        document.getElementById('refreshBtn').addEventListener('click', refreshPage);

        document.addEventListener('DOMContentLoaded', function() {
            const calculateBtn = document.getElementById('calculateBtn');
            const refreshBtn = document.getElementById('refreshBtn');
            const resultsContainer = document.querySelector('.results-container');
            const formSection = document.querySelector('.input-section');

            if (calculateBtn) {
                calculateBtn.style.display = 'block'; // Show calculate button initially
            }
            if (refreshBtn) {
                refreshBtn.style.display = 'none'; // Hide refresh button initially
            }
            if (resultsContainer) {
                resultsContainer.classList.add('hidden'); // Hide results initially using class
                resultsContainer.style.display = 'none'; // Also hide results container by default
            }
        });