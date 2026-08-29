import { DeleteOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Tooltip, Upload } from 'antd';
import type { UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { useState } from 'react';

import { useAuthSessionQuery } from '@/entities/auth';
import type { Media } from '@/entities/media';
import { useUpdateMediaLogoMutation } from '@/entities/media';

interface UpdateMediaLogoProps {
  media: Media;
}

const UpdateMediaLogo = ({ media }: UpdateMediaLogoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<RcFile>();
  const { data: session } = useAuthSessionQuery();
  const { removeLogo, updateLogo } = useUpdateMediaLogoMutation();

  if (!session?.user.roles.includes('admin')) return null;

  const closeModal = () => {
    setIsOpen(false);
    setFile(undefined);
    removeLogo.reset();
    updateLogo.reset();
  };

  const handleUpload = () => {
    if (!file) return;
    updateLogo.mutate({ file, id: media.id }, { onSuccess: closeModal });
  };

  const handleRemove = () => removeLogo.mutate(media.id, { onSuccess: closeModal });
  const hasError = removeLogo.isError || updateLogo.isError;
  const fileList: UploadFile[] = file
    ? [{ name: file.name, originFileObj: file, status: 'done', uid: file.uid }]
    : [];

  return (
    <>
      <Tooltip title="Изменить логотип">
        <Button
          aria-label="Изменить логотип"
          icon={<PictureOutlined />}
          onClick={() => setIsOpen(true)}
          shape="circle"
        />
      </Tooltip>
      <Modal
        cancelText="Закрыть"
        footer={(_, { CancelBtn }) => (
          <>
            {media.logo && (
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={removeLogo.isPending}
                onClick={handleRemove}
              >
                Удалить
              </Button>
            )}
            <CancelBtn />
            <Button
              disabled={!file}
              icon={<UploadOutlined />}
              loading={updateLogo.isPending}
              onClick={handleUpload}
              type="primary"
            >
              Загрузить
            </Button>
          </>
        )}
        onCancel={closeModal}
        open={isOpen}
        title={`Логотип: ${media.title}`}
      >
        {hasError && <Alert message="Не удалось изменить логотип" type="error" />}
        <Upload
          accept="image/png,image/jpeg,image/webp"
          beforeUpload={(selectedFile) => {
            setFile(selectedFile);
            return false;
          }}
          fileList={fileList}
          maxCount={1}
          onRemove={() => setFile(undefined)}
        >
          <Button icon={<UploadOutlined />}>Выбрать PNG, JPEG или WebP до 2 МБ</Button>
        </Upload>
      </Modal>
    </>
  );
};

export default UpdateMediaLogo;
