DROP TABLE IF EXISTS results;

CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    birthday TEXT NOT NULL,
    life_path INTEGER,
    destiny INTEGER,
    destiny_challenge INTEGER,
    soul INTEGER,
    soul_challenge INTEGER,
    personality INTEGER,
    personality_challenge INTEGER,
    attitude INTEGER,
    talent INTEGER,
    maturity INTEGER,
    rational INTEGER,
    overcome INTEGER
);