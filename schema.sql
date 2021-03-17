DROP TABLE IF EXISTS Countries;
CREATE TABLE IF NOT EXISTS Countries(
    id SERIAL PRIMARY KEY;
    Country VARCHAR(255),
    TotalConfirmed VARCHAR(255),
    TotalRecovered VARCHAR(255),
    TotalDeaths VARCHAR(255),
    Date VARCHAR(255)

);
