import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAuthSessionQuery } from '@/entities/auth';
import { createParserConfigPath } from '@/shared/config';

interface OpenParserConfigProps {
  mediaId: number;
}

const OpenParserConfig = ({ mediaId }: OpenParserConfigProps) => {
  const navigate = useNavigate();
  const { data: session } = useAuthSessionQuery();

  if (!session?.user.roles.includes('admin')) return null;

  return (
    <Button icon={<SettingOutlined />} onClick={() => navigate(createParserConfigPath(mediaId))}>
      Парсер
    </Button>
  );
};

export default OpenParserConfig;
