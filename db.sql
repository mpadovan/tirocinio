CREATE TABLE IF NOT EXISTS Users (
    uuid VARCHAR(50),
    age INTEGER,
    sex VARCHAR(50),
    music_experience INTEGER,
    videogames_experience INTEGER,
    PRIMARY KEY (uuid)
);
CREATE TABLE IF NOT EXISTS Tests (
    filename VARCHAR(50),
    uuid VARCHAR(50),
    weight INTEGER,
    masculinity INTEGER,
    time REAL,
    PRIMARY KEY (filename, uuid),
    FOREIGN KEY (uuid) REFERENCES Users(uuid)
);