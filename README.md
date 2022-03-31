# ya-disk-rest-api

Тщательно типизированная и задокументированная обертка над Yandex Disk REST API.

[Документация](https://s-r-x.github.io/ya-disk-rest-api)

## Использование
```sh
npm i ya-disk-rest-api
```
* * *
```typescript
import { YaDisk } from 'ya-disk-rest-api';

const disk = new YaDisk('oauth token');

await disk.upload({ path: 'file.txt', file: './local-file.txt' });
```