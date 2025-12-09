CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buildings (
    buildingId INT AUTO_INCREMENT PRIMARY KEY,
    picturesPath varchar(50),
    name VARCHAR(50),
    address VARCHAR(50),
    year INT,
    summary VARCHAR(200),
    rating INT,
    category VARCHAR(50)
);

CREATE TABLE options (
    optionId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    name varchar(50),
    description varchar(200),
    ranking int,
    CONSTRAINT fk_users_options FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE
);


CREATE TABLE itineraries (
    itineraryId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    numberOfBuildings INT,
    distance FLOAT,
    ranking INT,
    optionBased VARCHAR(20),
    CONSTRAINT fk_users_itineraries FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE
);

CREATE TABLE itineraryBuilding (
    itineraryBuildingId INT AUTO_INCREMENT PRIMARY KEY,
    itineraryId INT,
    buildingId INT,
    CONSTRAINT fk_itineraries_itineraryBuildings FOREIGN KEY (itineraryId)
        REFERENCES itineraries(itineraryId)
        ON DELETE CASCADE,
    CONSTRAINT fk_buildings_itineraryBuildings FOREIGN KEY (buildingId)
        REFERENCES buildings(buildingId)
        ON DELETE CASCADE
);

CREATE TABLE reviews (
    reviewId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    buildingId INT,
    title VARCHAR(50),
    description VARCHAR(200),
    rating INT,
    CONSTRAINT fk_users_reviews FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON DELETE CASCADE,
    CONSTRAINT fk_buildings_reviews FOREIGN KEY (buildingId)
        REFERENCES buildings(buildingId)
        ON DELETE CASCADE
);
