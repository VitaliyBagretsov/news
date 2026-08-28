import { Col, Form, Input, Row, Switch } from 'antd';
import type { FormInstance } from 'antd';

import type { CreateMedia } from '../model';

interface MediaFormProps {
  form: FormInstance<CreateMedia>;
  initialValues: Partial<CreateMedia>;
  onFinish: (values: CreateMedia) => void;
}

export const MediaForm = ({ form, initialValues, onFinish }: MediaFormProps) => (
  <Form<CreateMedia>
    form={form}
    initialValues={initialValues}
    layout="vertical"
    onFinish={onFinish}
    preserve={false}
  >
    <Row gutter={16}>
      <Col md={12} xs={24}>
        <Form.Item
          label="Название"
          name="title"
          rules={[{ required: true, whitespace: true, message: 'Введите название' }]}
        >
          <Input maxLength={100} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          label="Адрес сайта"
          name="url"
          rules={[
            { required: true, message: 'Введите адрес сайта' },
            { type: 'url', message: 'Введите корректный URL' },
          ]}
        >
          <Input maxLength={500} placeholder="https://example.com" />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item label="Описание" name="description">
      <Input.TextArea maxLength={5000} rows={3} />
    </Form.Item>

    <Row gutter={16}>
      <Col md={12} xs={24}>
        <Form.Item label="Главный редактор" name="chiefEditor">
          <Input maxLength={300} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Контактное лицо" name="contact">
          <Input maxLength={5000} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ type: 'email', message: 'Введите корректный e-mail' }]}
        >
          <Input maxLength={200} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Телефон" name="phone">
          <Input maxLength={50} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Адрес редакции" name="address">
          <Input maxLength={500} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Copyright" name="copyright">
          <Input maxLength={5000} />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item
          label="URL логотипа"
          name="logo"
          rules={[{ type: 'url', message: 'Введите корректный URL' }]}
        >
          <Input placeholder="https://example.com/logo.png" />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item label="Использовать для сбора новостей" name="isActive" valuePropName="checked">
      <Switch />
    </Form.Item>
  </Form>
);
