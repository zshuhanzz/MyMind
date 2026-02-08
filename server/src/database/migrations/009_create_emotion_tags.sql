CREATE TABLE emotion_tags (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) UNIQUE NOT NULL,
    category    VARCHAR(30) NOT NULL,
    emoji       VARCHAR(10),
    sort_order  SMALLINT DEFAULT 0
);

INSERT INTO emotion_tags (name, category, emoji, sort_order) VALUES
('happy',       'positive', '😊', 1),
('grateful',    'positive', '🙏', 2),
('calm',        'positive', '😌', 3),
('hopeful',     'positive', '🌱', 4),
('energetic',   'positive', '⚡', 5),
('loved',       'positive', '💜', 6),
('anxious',     'negative', '😰', 7),
('sad',         'negative', '😢', 8),
('angry',       'negative', '😤', 9),
('overwhelmed', 'negative', '🌊', 10),
('lonely',      'negative', '🫂', 11),
('exhausted',   'negative', '😮‍💨', 12),
('numb',        'neutral',  '😶', 13),
('confused',    'neutral',  '🤔', 14),
('restless',    'neutral',  '🔄', 15),
('bored',       'neutral',  '😐', 16);
