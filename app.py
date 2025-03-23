from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = 'thansoho.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with app.open_resource('schema.sql', mode='r') as f:
        conn.cursor().executescript(f.read())
    conn.commit()
    conn.close()

@app.cli.command('initdb')
def initdb_command():
    """Initialize the database."""
    init_db()
    print('Initialized the database.')

def reduce_to_single_digit_notin(total):
    if total in [11, 22, 33]:
        return total
    while total > 9:
        total = sum(int(digit) for digit in str(total))
    return total

def reduce_to_single_digit(total):
    while total > 9:
        total = sum(int(digit) for digit in str(total))
    return total

def life_path_number(birth):
    day, month, year = map(int, birth.split('/'))
    return reduce_to_single_digit_notin(reduce_to_single_digit(day) + reduce_to_single_digit(month) + reduce_to_single_digit(year))

def destiny_number(name):
    mapping = {chr(ord('A') + i): (i % 9) + 1 for i in range(26)}
    words = name.upper().split()
    total = sum(reduce_to_single_digit_notin(sum(mapping.get(char, 0) for char in word.replace(' ', '') if 'A' <= char <= 'Z')) for word in words)
    return reduce_to_single_digit_notin(total)

def destiny_challenge_number(name):
    return reduce_to_single_digit_notin(abs(soul_challenge_number(name) - personality_challenge_number(name)))

def soul_number(name):
    vowels = {'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3}
    words = name.upper().split()
    total = sum(reduce_to_single_digit_notin(sum(vowels.get(char, 0) for char in word if char in vowels)) for word in words)
    return reduce_to_single_digit_notin(total)

def soul_challenge_number(name):
    vowels = {'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3}
    chars = list(name.upper())
    first_vowel = next((char for char in chars if char in vowels), None)
    last_vowel = next((char for char in reversed(chars) if char in vowels), None)
    return reduce_to_single_digit_notin(abs((vowels.get(first_vowel, 0)) - (vowels.get(last_vowel, 0))))

def personality_number(name):
    consonant_mapping = {
        'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
        'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    words = name.upper().split()
    total = sum(reduce_to_single_digit(sum(consonant_mapping.get(char, 0) for char in word if char in consonant_mapping)) for word in words)
    return reduce_to_single_digit_notin(total)

def personality_challenge_number(name):
    consonant_mapping = {
        'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
        'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    words = name.upper().split()
    if not words:
        return 0
    first_consonant = next((char for char in words[0] if char in consonant_mapping), None)
    last_consonant = next((char for char in reversed(words[-1]) if char in consonant_mapping), None)
    total = abs((consonant_mapping.get(first_consonant, 0)) - (consonant_mapping.get(last_consonant, 0)))
    return reduce_to_single_digit_notin(total)

def attitude_number(birth):
    parts = birth.split('/')
    day = int(parts[0])
    month = int(parts[1])
    return reduce_to_single_digit_notin(day + month)

def talent_number(birth):
    day = int(birth.split('/')[0])
    return reduce_to_single_digit_notin(day)

def maturity_number(birth, name):
    return reduce_to_single_digit_notin(life_path_number(birth) + destiny_number(name))

def rational_thought_number(name, birth):
    last_name_value = destiny_number(' '.join(name.split(' ')[-1:]))
    day = int(birth.split('/')[0])
    return reduce_to_single_digit_notin(last_name_value + day)

def resilience_number(name):
    return reduce_to_single_digit_notin(destiny_number(''.join(word[0] for word in name.split())))

@app.route('/', methods=['GET']) # Chỉ chấp nhận GET method
def index():
    """Hiển thị trang chủ."""
    return render_template('index.html') # Chỉ trả về template index.html

@app.route('/api/calculate', methods=['POST'])
def calculate_api():
    """API endpoint to calculate numerology results."""
    data = request.get_json() # Nhận dữ liệu JSON từ request

    if not data or 'fullName' not in data or 'birthday' not in data:
        return jsonify({'error': 'Vui lòng cung cấp đầy đủ fullName và birthday'}), 400 # Báo lỗi nếu thiếu dữ liệu

    full_name = data['fullName']
    birthday = data['birthday']

    try:
        life_path = life_path_number(birthday)
        destiny = destiny_number(full_name)
        destiny_challenge = destiny_challenge_number(full_name)
        soul = soul_number(full_name)
        soul_challenge = soul_challenge_number(full_name)
        personality = personality_number(full_name)
        personality_challenge = personality_challenge_number(full_name)
        attitude = attitude_number(birthday)
        talent = talent_number(birthday)
        maturity = maturity_number(birthday, full_name)
        rational = rational_thought_number(full_name, birthday)
        overcome = resilience_number(full_name)

        results = {
            'lifePath': life_path,
            'destiny': destiny,
            'destinyChallenge': destiny_challenge,
            'soul': soul,
            'soulChallenge': soul_challenge,
            'personality': personality,
            'personalityChallenge': personality_challenge,
            'attitude': attitude,
            'talent': talent,
            'maturity': maturity,
            'rational': rational,
            'overcome': overcome
        }

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO results (full_name, birthday, life_path, destiny, destiny_challenge, soul, soul_challenge, personality, personality_challenge, attitude, talent, maturity, rational, overcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                      (full_name, birthday, life_path, destiny, destiny_challenge, soul, soul_challenge, personality, personality_challenge, attitude, talent, maturity, rational, overcome))
        conn.commit()
        conn.close()

        return jsonify(results), 200 # Trả về kết quả dạng JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500 # Xử lý lỗi và trả về JSON


if __name__ == '__main__':
    app.run(debug=True)