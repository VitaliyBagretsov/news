import { Alert, Button, Card, Form, Space, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useMediaStore } from '@/entities/media';
import type { UpdateParserConfig } from '@/entities/parser-config';
import {
  ParserConfigForm,
  useParserConfigMutations,
  useParserConfigQuery,
} from '@/entities/parser-config';

import style from './style.module.scss';

const normalize = (values: UpdateParserConfig): UpdateParserConfig => ({
  ...values,
  summarySelector: values.summarySelector?.trim() || null,
  linkSelector: values.linkSelector?.trim() || null,
  imageSelector: values.imageSelector?.trim() || null,
  excludedUrlPatterns: values.excludedUrlPatterns ?? [],
});

const emptyConfig: UpdateParserConfig = {
  articleLinkSelector: '',
  headerSelector: '',
  dateSelector: '',
  summarySelector: null,
  textSelector: '',
  linkSelector: null,
  imageSelector: null,
  externalCodeStrategy: 'last-path-segment',
  externalIdStrategy: 'code',
  publicationDateStrategy: 'datetime-attribute',
  sameHostOnly: true,
  excludedUrlPatterns: [],
};

const ParserConfigPage = () => {
  const mediaId = Number(useParams().mediaId);
  const media = useMediaStore((state) => state.media.find((item) => item.id === mediaId));
  const [form] = Form.useForm<UpdateParserConfig>();
  const configQuery = useParserConfigQuery(mediaId);
  const { preview, update } = useParserConfigMutations(mediaId);

  useEffect(() => {
    if (configQuery.data) {
      form.setFieldsValue({
        articleLinkSelector: configQuery.data.articleLinkSelector,
        headerSelector: configQuery.data.headerSelector,
        dateSelector: configQuery.data.dateSelector,
        summarySelector: configQuery.data.summarySelector,
        textSelector: configQuery.data.textSelector,
        linkSelector: configQuery.data.linkSelector,
        imageSelector: configQuery.data.imageSelector,
        externalCodeStrategy: configQuery.data.externalCodeStrategy,
        externalIdStrategy: configQuery.data.externalIdStrategy,
        publicationDateStrategy: configQuery.data.publicationDateStrategy,
        sameHostOnly: configQuery.data.sameHostOnly,
        excludedUrlPatterns: configQuery.data.excludedUrlPatterns,
      });
    } else if (configQuery.isSuccess) {
      form.setFieldsValue(emptyConfig);
    }
  }, [configQuery.data, configQuery.isSuccess, form]);

  if (configQuery.isPending) return <Spin fullscreen size="large" />;
  if (configQuery.isError) {
    return <Alert message="Настройка парсера не найдена или недоступна" type="error" />;
  }

  const handlePreview = async () => {
    const values = normalize(await form.validateFields());
    preview.mutate(values);
  };

  return (
    <section className={style.page}>
      <Typography.Title level={1}>Парсер: {media?.title ?? `медиа #${mediaId}`}</Typography.Title>
      <Alert
        className={style.notice}
        message="В БД сохраняются только CSS-селекторы и безопасные стратегии. Произвольный JavaScript не выполняется."
        showIcon
        type="info"
      />
      <Card>
        <ParserConfigForm
          form={form}
          initialValues={emptyConfig}
          onFinish={(values) => update.mutate(normalize(values))}
        />
        {(update.isError || preview.isError) && (
          <Alert message="Не удалось сохранить или проверить настройку" type="error" />
        )}
        {update.isSuccess && <Alert message="Настройка сохранена" type="success" />}
        <Space className={style.actions}>
          <Button loading={preview.isPending} onClick={handlePreview}>
            Проверить
          </Button>
          <Button loading={update.isPending} onClick={() => form.submit()} type="primary">
            Сохранить
          </Button>
        </Space>
      </Card>
      {preview.data && (
        <Card className={style.preview} title="Результат проверки">
          <p>Найдено ссылок: {preview.data.articleUrlsFound}</p>
          {preview.data.sample ? (
            <dl>
              <dt>Заголовок</dt>
              <dd>{preview.data.sample.news.header}</dd>
              <dt>Дата</dt>
              <dd>{new Date(preview.data.sample.news.date).toLocaleString('ru-RU')}</dd>
              <dt>URL</dt>
              <dd>{preview.data.sample.news.url}</dd>
              <dt>Длина текста</dt>
              <dd>{preview.data.sample.news.text.length}</dd>
            </dl>
          ) : (
            <p>Статьи по указанному селектору не найдены.</p>
          )}
        </Card>
      )}
    </section>
  );
};

export default ParserConfigPage;
