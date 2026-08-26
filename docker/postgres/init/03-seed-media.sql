INSERT INTO news.media (title, url, "isActive")
VALUES ('RT на русском', 'https://russian.rt.com', true)
ON CONFLICT (url) DO NOTHING;
