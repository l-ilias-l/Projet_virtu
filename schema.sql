CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME                  -- Nouvelle colonne pour la date et l'heure limite
);

INSERT INTO tasks (title, description, status, deadline) 
VALUES 
    ('Acheter du pain', 'Aller à la boulangerie avant 18h', 'pending', '2024-12-10 18:00:00'),
    ('Finir le projet', 'Finaliser la partie Docker', 'in_progress', '2024-12-20 23:59:59');
