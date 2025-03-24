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


        document.addEventListener('DOMContentLoaded', function() {
            const calculateBtn = document.getElementById('calculateBtn');
            const refreshBtn = document.getElementById('refreshBtn'); // Dòng này vẫn tồn tại, nhưng không gây lỗi vì không dùng nữa
            const resultsContainer = document.querySelector('.results-container');
            const formElement = document.querySelector('form'); // Lấy thẻ form

            if (calculateBtn) {
                calculateBtn.style.display = 'block';
            }
            if (refreshBtn) {
                refreshBtn.style.display = 'none'; // Dòng này vẫn tồn tại, không ảnh hưởng vì refreshBtn có thể là null
            }
            if (resultsContainer) {
                resultsContainer.classList.add('hidden');
                resultsContainer.style.display = 'none';
            }

            // Thêm event listener cho form submit
            if (formElement) {
                formElement.addEventListener('submit', function(event) {
                    event.preventDefault(); // Chặn hành vi submit form mặc định

                    const fullName = document.getElementById('fullName').value.trim(); // Thêm .trim() để loại bỏ khoảng trắng đầu cuối
                    const birthday = document.getElementById('birthday').value;

                    // Frontend Validation (Bước 3 - Thêm validation ở đây)
                    if (!fullName) {
                        alert('Vui lòng nhập đầy đủ Họ và tên.');
                        return; // Dừng lại nếu validation thất bại
                    }

                    if (!birthday) {
                        alert('Vui lòng nhập Ngày sinh.');
                        return; // Dừng lại nếu validation thất bại
                    }

                    // Validate birthday format DD/MM/YYYY (chấp nhận cả YYYY-MM-DD từ datepicker)
                    const birthdayRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
                    const birthdayRegexDatePicker = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; // Định dạng YYYY-MM-DD từ datepicker

                    if (!birthdayRegex.test(birthday) && !birthdayRegexDatePicker.test(birthday)) {
                        alert('Ngày sinh không đúng định dạng. Vui lòng nhập theo định dạng DD/MM/YYYY.');
                        return; // Dừng lại nếu validation thất bại
                    }

                    // Convert date format from YYYY-MM-DD to DD/MM/YYYY for API
                    const birthdayValue = new Date(birthday); // Tạo đối tượng Date từ giá trị input datepicker (YYYY-MM-DD)
                    const day = String(birthdayValue.getDate()).padStart(2, '0'); // Lấy ngày, thêm padding 0 nếu cần
                    const month = String(birthdayValue.getMonth() + 1).padStart(2, '0'); // Lấy tháng (getMonth() trả về tháng 0-11), +1 và thêm padding 0
                    const year = birthdayValue.getFullYear(); // Lấy năm

                    const formattedBirthday = `${day}/${month}/${year}`; // Tạo chuỗi định dạng DD/MM/YYYY

                    // Gọi API /api/calculate bằng fetch
                    fetch('/api/calculate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Báo cho server biết dữ liệu là JSON
                        },
                        body: JSON.stringify({ fullName: fullName, birthday: formattedBirthday }) // Gửi dữ liệu JSON với formattedBirthday
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
                        if (refreshBtn) { // Dòng này và dòng dưới vẫn tồn tại, nhưng không gây lỗi dù refreshBtn có thể null
                            refreshBtn.style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi gọi API:', error);
                        alert('Có lỗi xảy ra khi tính toán. Vui lòng thử lại sau.'); // Hiển thị thông báo lỗi cho người dùng
                    });
                });
            }
        });
