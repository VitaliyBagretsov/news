import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, List, Spin } from 'antd';

import { useMediaStore } from '@/entities/media';
import type { News as NewsEntity } from '@/entities/news';
import { useNewsQuery } from '@/entities/news';
import NewsItem from '@/features/news-item';
import NewsContent from '@/widgets/news-content';
import PageToolbar from '@/widgets/page-toolbar.tsx';

import style from './style.module.scss';

const News = () => {
  const params = useParams();
  const [selectedNews, setSelectedNews] = useState<NewsEntity | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const media = useMediaStore((state) =>
    state.media.find((item) => item.id.toString() === params.mediaId),
  );

  const { data, isError, isPending } = useNewsQuery({
    filter: {
      mediaId: Number(params.mediaId),
    },
    sort: { date: 'DESC' },
    page,
    limit,
  });

  const onChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  return (
    <div className={style.media}>
      <PageToolbar header={media?.title ?? ''} logo={media?.logo ?? ''} />
      <div className={style.news}>
        {isPending ? (
          <Spin size="large" />
        ) : isError ? (
          <Alert message="Не удалось загрузить новости" type="error" />
        ) : (
          <div>
            <List
              className={style.list}
              pagination={{
                position: 'top',
                current: page,
                pageSize: limit,
                total: data?.count,
                onChange,
                className: style.listPagination,
              }}
              dataSource={data?.data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={<NewsItem props={item} onClick={setSelectedNews} />} />
                </List.Item>
              )}
            />
          </div>
        )}
        {selectedNews ? <NewsContent {...selectedNews} /> : 'Выберите новость'}
      </div>
    </div>
  );
};

export default News;
