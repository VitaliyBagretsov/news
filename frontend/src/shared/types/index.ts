type ObjectKey<Obj> = keyof Obj;

type ISort<Entity> = {
  [key in ObjectKey<Entity>]: 'ASC' | 'DESC';
};

export interface Query<Entity> {
  filter?: Partial<Entity>;
  search?: Partial<Entity>;
  searchBy?: string;
  sort?: Partial<ISort<Entity>>;
  page?: number;
  limit?: number;
}

export interface QueryResult<Entity> {
  count: number;
  data: Entity[];
}
