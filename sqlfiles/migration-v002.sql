-- Migration v002 : création de la table utilisateurs
USE ynov_ci;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES
('Dupont', 'Jean', 'jean.dupont@ynov.com', 'password123'),
('Martin', 'Alice', 'alice.martin@ynov.com', 'password456');
