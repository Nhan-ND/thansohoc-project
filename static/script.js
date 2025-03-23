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
            const formElement = document.querySelector('form'); // Lấy thẻ form

            if (calculateBtn) {
                calculateBtn.style.display = 'block';
            }
            if (refreshBtn) {
                refreshBtn.style.display = 'none';
            }
            if (resultsContainer) {
                resultsContainer.classList.add('hidden');
                resultsContainer.style.display = 'none';
            }

            // Thêm event listener cho form submit
            if (formElement) {
                formElement.addEventListener('submit', function(event) {
                    event.preventDefault(); // Chặn hành vi submit form mặc định

                    const fullName = document.getElementById('fullName').value;
                    const birthday = document.getElementById('birthday').value;

                    if (!fullName || !birthday) {
                        alert('Vui lòng nhập đầy đủ Họ và tên và Ngày sinh.');
                        return;
                    }

                    // Gọi API /api/calculate bằng fetch
                    fetch('/api/calculate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Báo cho server biết dữ liệu là JSON
                        },
                        body: JSON.stringify({ fullName: fullName, birthday: birthday }) // Gửi dữ liệu JSON
                    })
                    .then(response => {
                        if (!response.ok) {
                            // Xử lý lỗi HTTP (ví dụ: 400, 500)
                            return response.json().then(err => {
                                throw new Error(`Lỗi từ server: ${response.status} - ${err.error || 'Unknown error'}`);
                            });
                        }
                        return response.json(); // Parse JSON response nếu thành công
                    })
                    .then(data => {
                        // Hiển thị kết quả lên trang
                        document.getElementById('lifePath').textContent = data.lifePath;
                        document.getElementById('destiny').textContent = data.destiny;
                        document.getElementById('destinyChallenge').textContent = data.destinyChallenge;
                        document.getElementById('soul').textContent = data.soul;
                        document.getElementById('soulChallenge').textContent = data.soulChallenge;
                        document.getElementById('personality').textContent = data.personality;
                        document.getElementById('personalityChallenge').textContent = data.personalityChallenge;
                        document.getElementById('attitude').textContent = data.attitude;
                        document.getElementById('talent').textContent = data.talent;
                        document.getElementById('maturity').textContent = data.maturity;
                        document.getElementById('rational').textContent = data.rational;
                        document.getElementById('overcome').textContent = data.overcome;

                        resultsContainer.classList.remove('hidden'); // Hiển thị container kết quả
                        resultsContainer.style.display = 'flex'; // Đảm bảo hiển thị flex (nếu cần)
                        formElement.style.display = 'none'; // Ẩn form
                        if (refreshBtn) {
                            refreshBtn.style.display = 'block'; // Hiển thị nút Nhập Mới
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi gọi API:', error);
                        alert('Có lỗi xảy ra khi tính toán. Vui lòng thử lại sau.'); // Hiển thị thông báo lỗi cho người dùng
                    });
                });
            }
        });