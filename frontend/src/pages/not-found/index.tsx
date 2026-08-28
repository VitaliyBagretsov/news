import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/shared/config';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      extra={
        <Button onClick={() => navigate(routePaths.home)} type="primary">
          На главную
        </Button>
      }
      status="404"
      subTitle="Запрошенная страница не существует"
      title="Страница не найдена"
    />
  );
};

export default NotFoundPage;
