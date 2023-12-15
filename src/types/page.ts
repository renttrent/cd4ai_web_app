export interface PageProps<
  Params extends { [K in keyof Params]?: string } = {},
  SearchParams extends { [K in keyof SearchParams]?: string } = {}
> {
  params: Params;
  searchParams: SearchParams;
}
