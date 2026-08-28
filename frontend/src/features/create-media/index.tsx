import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Modal } from 'antd';
import { useState } from 'react';

import { useAuthSessionQuery } from '@/entities/auth';
import type { CreateMedia } from '@/entities/media';
import { MediaForm, normalizeMediaFormValues, useCreateMediaMutation } from '@/entities/media';

const CreateMediaFeature = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm<CreateMedia>();
  const { data: session } = useAuthSessionQuery();
  const createMedia = useCreateMediaMutation();

  if (!session?.user.roles.includes('admin')) return null;

  const closeModal = () => {
    setIsOpen(false);
    createMedia.reset();
    form.resetFields();
  };

  const handleSubmit = (values: CreateMedia) => {
    createMedia.mutate(normalizeMediaFormValues(values), { onSuccess: closeModal });
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={() => setIsOpen(true)} type="primary">
        Добавить медиа
      </Button>
      <Modal
        cancelText="Отмена"
        okButtonProps={{ loading: createMedia.isPending }}
        okText="Создать"
        onCancel={closeModal}
        onOk={() => form.submit()}
        open={isOpen}
        title="Новое медиа"
        width={800}
      >
        {createMedia.isError && (
          <Alert
            closable
            message="Не удалось создать медиа. Проверьте данные и права доступа."
            type="error"
          />
        )}
        <MediaForm form={form} initialValues={{ isActive: true }} onFinish={handleSubmit} />
      </Modal>
    </>
  );
};

export default CreateMediaFeature;
