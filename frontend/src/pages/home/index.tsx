import { Card, List, Typography } from 'antd';

import style from './style.module.scss';

const features = [
  'Сбор новостей из настроенных медиаисточников',
  'Просмотр публикаций отдельно для каждого источника',
  'Безопасная авторизация через backend и HttpOnly cookie',
];

const HomePage = () => (
  <section className={style.page}>
    <Typography.Title>News</Typography.Title>
    <Typography.Paragraph className={style.description}>
      Учебное приложение для автоматического сбора и просмотра новостей. Backend по расписанию
      обращается к настроенным сайтам, обрабатывает публикации и сохраняет результаты в базе данных.
    </Typography.Paragraph>
    <Card title="Возможности проекта">
      <List dataSource={features} renderItem={(feature) => <List.Item>{feature}</List.Item>} />
    </Card>
  </section>
);

export default HomePage;
