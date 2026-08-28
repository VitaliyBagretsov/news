INSERT INTO news.media (title, url, "isActive")
VALUES
  ('RT на русском', 'https://russian.rt.com', true),
  ('РИА Новости', 'https://ria.ru', true),
  ('CNews', 'https://www.cnews.ru', true)
ON CONFLICT (url) DO NOTHING;
