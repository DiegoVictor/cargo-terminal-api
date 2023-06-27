import { faker } from '@faker-js/faker';

import paginationLinks from '../../src/utils/paginationLinks';

describe('paginationLinks', () => {
  it('should be able to return all links', async () => {
    const page = 3;
    const pagesTotal = faker.number.int({ min: 5 });
    const resourceUrl = faker.internet.url();

    const links = paginationLinks(page, pagesTotal, resourceUrl);

    expect(links).toStrictEqual({
      last: `${resourceUrl}?page=${pagesTotal}`,
      next: `${resourceUrl}?page=${page + 1}`,
      first: `${resourceUrl}?page=1`,
      prev: `${resourceUrl}?page=${page - 1}`,
    });
  });

  it('should not able to return previous and first page links', async () => {
    const page = 1;
    const pagesTotal = faker.number.int({ min: 5 });
    const resourceUrl = faker.internet.url();

    const links = paginationLinks(page, pagesTotal, resourceUrl);

    expect(links).toStrictEqual({
      last: `${resourceUrl}?page=${pagesTotal}`,
      next: `${resourceUrl}?page=${page + 1}`,
    });
  });

  it('should not be able to return next and last page links', async () => {
    const pagesTotal = faker.number.int({ min: 5 });
    const page = pagesTotal;
    const resourceUrl = faker.internet.url();

    const links = paginationLinks(page, pagesTotal, resourceUrl);

    expect(links).toStrictEqual({
      first: `${resourceUrl}?page=1`,
      prev: `${resourceUrl}?page=${page - 1}`,
    });
  });

  it('should not be able to return any link', async () => {
    const page = 1;
    const pagesTotal = 1;
    const resourceUrl = faker.internet.url();

    const links = paginationLinks(page, pagesTotal, resourceUrl);

    expect(links).toStrictEqual({});
  });
});
