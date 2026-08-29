import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal } from 'antd';
import { useState } from 'react';

import { useAuthSessionQuery } from '@/entities/auth';
import type { CreateMedia, Media } from '@/entities/media';
import { MediaForm, normalizeMediaFormValues, useUpdateMediaMutation } from '@/entities/media';

interface UpdateMediaFeatureProps {
  media: Media;
}

const UpdateMediaFeature = ({ media }: UpdateMediaFeatureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<CreateMedia>();
  const { data: session } = useAuthSessionQuery();
  const updateMedia = useUpdateMediaMutation();
  const { id } = media;
  const initialValues: CreateMedia = media;

  if (!session?.user.roles.includes('admin')) return null;

  const openModal = () => {
    form.setFieldsValue(initialValues);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    updateMedia.reset();
    form.resetFields();
  };

  const handleSubmit = (values: CreateMedia) => {
    updateMedia.mutate({ id, media: normalizeMediaFormValues(values) }, { onSuccess: closeModal });
  };

  return (
    <>
      <Button icon={<EditOutlined />} onClick={openModal}>
        Изменить
      </Button>
      <Modal
        cancelText="Отмена"
        okButtonProps={{ loading: updateMedia.isPending }}
        okText="Сохранить"
        onCancel={closeModal}
        onOk={() => form.submit()}
        open={isOpen}
        title={`Редактирование: ${media.title}`}
        width={800}
      >
        {updateMedia.isError && (
          <Alert
            closable
            message="Не удалось обновить медиа. Проверьте данные и права доступа."
            type="error"
          />
        )}
        <MediaForm form={form} initialValues={initialValues} onFinish={handleSubmit} />
      </Modal>
    </>
  );
};

export default UpdateMediaFeature;
