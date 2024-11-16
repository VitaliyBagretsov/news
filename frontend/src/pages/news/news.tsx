import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List } from 'antd';

import { INews } from '../../entities/types.ts';
import { useGetNewsQuery } from '../../entities/api.ts';
import NewsItem from '../../features/news-item/index.tsx';
import PageToolbar from '../../widgets/page-toolbar.tsx/index.tsx';
import NewsContent from '../../widgets/news-content/index.tsx';

import style from './style.module.scss';
import { useSelector } from '../../shared/utils/store.util.ts';

const News = () => {
  const params = useParams();
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const media = useSelector((store) =>
    store.newsSlice.data.find((item) => item.id.toString() === params.id)
  );

  const { data, isLoading, isFetching } = useGetNewsQuery({
    filter: {
      id: parseInt(params.id ?? ''),
    },
    sort: { date: 'DESC' },
    page,
    limit,
  });

  useEffect(() => {
    // console.log(data);
  }, [data, isLoading, isFetching]);

  const onChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  return (
    <div className={style.media}>
      <PageToolbar header={media?.title ?? ''} logo={media?.logo ?? ''} />
      <div className={style.news}>
        {isLoading || isFetching ? null : (
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
                  <List.Item.Meta
                    title={<NewsItem props={item} onClick={setSelectedNews} />}
                  />
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
