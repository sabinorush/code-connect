-- Separate database for the e2e test suite, so tests never touch
-- development data. Only runs on first init of an empty volume.
CREATE DATABASE code_connect_test;
