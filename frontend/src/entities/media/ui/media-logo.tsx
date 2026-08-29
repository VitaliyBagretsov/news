import { FileImageOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import style from './media-logo.module.scss';

interface MediaLogoProps {
  className?: string;
  fileName?: string | null;
  title: string;
}

const getImageUrl = (fileName: string): string => {
  if (/^https?:\/\//.test(fileName)) return fileName;
  const apiUrl = import.meta.env.VITE_API_URL ?? '/api';
  return `${apiUrl}/media/images/${encodeURIComponent(fileName)}`;
};

export const MediaLogo = ({ className = '', fileName, title }: MediaLogoProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => setHasError(false), [fileName]);

  if (!fileName || hasError) {
    return (
      <span
        aria-label={`${title}: логотип отсутствует`}
        className={`${className} ${style.placeholder}`}
      >
        <FileImageOutlined />
      </span>
    );
  }

  return (
    <img
      alt={`${title} logo`}
      className={className}
      onError={() => setHasError(true)}
      src={getImageUrl(fileName)}
    />
  );
};
