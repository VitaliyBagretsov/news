import { ReadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { createNewsPath } from '@/shared/config';

interface OpenMediaNewsProps {
  mediaId: number;
}

const OpenMediaNews = ({ mediaId }: OpenMediaNewsProps) => {
  const navigate = useNavigate();

  return (
    <Button
      icon={<ReadOutlined />}
      onClick={() => navigate(createNewsPath(mediaId))}
      type="primary"
    >
      Новости
    </Button>
  );
};

export default OpenMediaNews;
