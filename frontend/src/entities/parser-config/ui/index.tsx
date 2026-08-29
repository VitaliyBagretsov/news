import { Col, Form, Input, Row, Select, Switch } from 'antd';
import type { FormInstance } from 'antd';

import type { UpdateParserConfig } from '../model';

interface ParserConfigFormProps {
  form: FormInstance<UpdateParserConfig>;
  initialValues?: UpdateParserConfig;
  onFinish: (values: UpdateParserConfig) => void;
}

const selectorRule = { required: true, whitespace: true, message: 'Укажите CSS-селектор' };

export const ParserConfigForm = ({ form, initialValues, onFinish }: ParserConfigFormProps) => (
  <Form form={form} initialValues={initialValues} layout="vertical" onFinish={onFinish}>
    <Row gutter={16}>
      <Col md={12} xs={24}>
        <Form.Item label="Ссылки на статьи" name="articleLinkSelector" rules={[selectorRule]}>
          <Input />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Заголовок" name="headerSelector" rules={[selectorRule]}>
          <Input />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Дата публикации" name="dateSelector" rules={[selectorRule]}>
          <Input />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Краткое описание" name="summarySelector">
          <Input allowClear />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Текст статьи" name="textSelector" rules={[selectorRule]}>
          <Input />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Ссылки внутри статьи" name="linkSelector">
          <Input allowClear />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Изображения" name="imageSelector">
          <Input allowClear />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item label="Исключения URL" name="excludedUrlPatterns">
          <Select mode="tags" open={false} placeholder="Введите фрагмент и нажмите Enter" />
        </Form.Item>
      </Col>
      <Col md={8} xs={24}>
        <Form.Item label="Внешний код" name="externalCodeStrategy" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Последний сегмент URL', value: 'last-path-segment' },
              { label: 'Предпоследний сегмент URL', value: 'penultimate-path-segment' },
              { label: 'Статья РИА', value: 'ria-article' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col md={8} xs={24}>
        <Form.Item label="Внешний ID" name="externalIdStrategy" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Совпадает с кодом', value: 'code' },
              { label: 'Префикс кода', value: 'code-prefix' },
              { label: 'ID статьи РИА', value: 'ria-article' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col md={8} xs={24}>
        <Form.Item label="Формат даты" name="publicationDateStrategy" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Атрибут datetime', value: 'datetime-attribute' },
              { label: 'Текст РИА', value: 'ria-text' },
              { label: 'Русское название месяца', value: 'russian-month-text' },
            ]}
          />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item
      label="Разрешать ссылки только с того же хоста"
      name="sameHostOnly"
      valuePropName="checked"
    >
      <Switch />
    </Form.Item>
  </Form>
);
