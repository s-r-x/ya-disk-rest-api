import { createReadStream } from 'fs';
import {
  YA_DISK_BASE_URL,
  YA_DISK_RESOURCES_URL,
  YA_DISK_TRASH_URL,
} from './config';
import { HttpClient } from './http-client';
import { Maybe } from './typings/utils';
import type {
  IResource,
  IGetDiskMetadataRes,
  IRemoveParams,
  ILink,
  ICopyParams,
  IGetItemMetadataParams,
  IGetItemsListRes,
  IGetItemsListParams,
  IGetPublicItemsListRes,
  IGetPublicItemsListParams,
  IGetLastUploadedItemsListParams,
  IGetLastUploadedItemsListRes,
  IMoveParams,
  IPublishParams,
  IUnpublishParams,
  IGetUploadUrlParams,
  IGetUploadUrlRes,
  IUploadParams,
  TUploadFile,
  IUploadByUploadUrlParams,
  IUploadByExternalUrlParams,
  IGetDownloadUrlParams,
  IGetTrashParams,
  TGetTrashRes,
  IClearTrashParams,
  IRestoreTrashParams,
  IUpdateItemMetadataParams,
  IIsItemExistParams,
} from './typings/yandex';
import type { IHttpClient } from './typings/http';
import type { HttpError } from './errors/http';

export class YaDisk {
  private _http: IHttpClient;
  private _token: string;

  /**
   * @param token - Yandex oauth token
   * {@link https://oauth.yandex.ru/}
   */
  constructor(token: string) {
    this._token = token;
    this._http = new HttpClient(token, YA_DISK_BASE_URL);
  }

  public get token(): string {
    return this._token;
  }
  public set token(token: string) {
    this._token = token;
    this._http.setAuthToken(token);
  }
  /**
   * Получить метаинформацию о диске пользователя
   * {@link https://yandex.ru/dev/disk/api/reference/capacity.html}
   */
  public async getDiskMetadata(): Promise<IGetDiskMetadataRes> {
    const res = await this._http.request<IGetDiskMetadataRes>({
      method: 'GET',
    });
    return res.data;
  }
  /**
   * Получить список файлов упорядоченный по имени
   * {@link https://yandex.ru/dev/disk/api/reference/all-files.html}
   */
  public async getItemsList(
    params: IGetItemsListParams
  ): Promise<IGetItemsListRes> {
    const res = await this._http.request<IGetItemsListRes>({
      method: 'GET',
      url: YA_DISK_RESOURCES_URL + '/files',
      params: {
        limit: params.limit,
        media_type: params.mediaType,
        offset: params.offset,
        preview_crop: params.previewCrop,
        preview_size: params.previewSize,
        sort: params.sort,
        fields: params.fields,
      },
    });
    return res.data;
  }
  /**
   * Получить метаинформацию о файле или каталоге
   * {@link https://yandex.ru/dev/disk/api/reference/meta.html}
   * @returns null - если ресурс не найден, либо ресурс.
   * @example
   * ```ts
   * await disk.getItemMetadata({
   *  path: 'file.txt'
   * });
   * ```
   */
  public async getItemMetadata(
    params: IGetItemMetadataParams
  ): Promise<Maybe<IResource>> {
    try {
      const res = await this._http.request<IResource>({
        method: 'GET',
        url: YA_DISK_RESOURCES_URL,
        params: {
          path: params.path,
          limit: params.limit,
          media_type: params.mediaType,
          offset: params.offset,
          preview_crop: params.previewCrop,
          preview_size: params.previewSize,
          sort: params.sort,
          fields: params.fields,
        },
      });
      return res.data;
    } catch (e) {
      if (this._http.isHttpError(e) && e.code === 404) {
        return null;
      } else throw e;
    }
  }
  /**
   * Получить список опубликованных ресурсов
   * {@link https://yandex.ru/dev/disk/api/reference/recent-public.html}
   */
  public async getPublicItemsList(
    params: IGetPublicItemsListParams
  ): Promise<IGetPublicItemsListRes> {
    const res = await this._http.request<IGetPublicItemsListRes>({
      method: 'GET',
      url: YA_DISK_RESOURCES_URL + '/public',
      params: {
        limit: params.limit,
        media_type: params.mediaType,
        offset: params.offset,
        preview_crop: params.previewCrop,
        preview_size: params.previewSize,
        type: params.type,
        fields: params.fields,
      },
    });
    return res.data;
  }
  /**
   * Получить список файлов упорядоченный по дате загрузки
   * {@link https://yandex.ru/dev/disk/api/reference/recent-upload.html}
   */
  public async getLastUploadedItemsList(
    params: IGetLastUploadedItemsListParams
  ): Promise<IGetLastUploadedItemsListRes> {
    const res = await this._http.request<IGetLastUploadedItemsListRes>({
      method: 'GET',
      url: YA_DISK_RESOURCES_URL + '/last-uploaded',
      params: {
        limit: params.limit,
        media_type: params.mediaType,
        preview_crop: params.previewCrop,
        preview_size: params.previewSize,
        fields: params.fields,
      },
    });
    return res.data;
  }
  /**
   * Проверить существует ли ресурс(файл либо папка) по указанному пути
   * @example
   * ```ts
   * await disk.isItemExist({ path: 'dir-or-file' });
   * // true если файл или папка по указанному пути существует
   * ```
   * @example
   * ```ts
   * await disk.isItemExist({ path: 'myfile.txt', type: 'file' });
   * // true если ресурс существует и является файлом
   * ```
   * @example
   * ```ts
   * await disk.isItemExist({ path: 'mydir', type: 'dir' });
   * // true если ресурс существует и является папкой
   * ```
   */
  public async isItemExist(params: IIsItemExistParams): Promise<boolean> {
    const item: Maybe<Pick<IResource, 'type'>> = await this.getItemMetadata({
      path: params.path,
      fields: 'type',
    });
    if (!item) return false;
    else if (!params.type) return true;
    else return item.type === params.type;
  }
  /**
   * Хелпер вызывающий {@link YaDisk.isItemExist} с аргументом "type" равному "file"
   * @example
   * ```ts
   * await disk.isFileExist('myfile.txt');
   * ```
   */
  public isFileExist(path: string): Promise<boolean> {
    return this.isItemExist({ path, type: 'file' });
  }
  /**
   * Хелпер вызывающий {@link YaDisk.isItemExist} с аргументом "type" равному "dir"
   * @example
   * ```ts
   * await disk.isDirExist('mydir');
   * ```
   */
  public isDirExist(path: string): Promise<boolean> {
    return this.isItemExist({ path, type: 'dir' });
  }
  /**
   * Создать папку
   * {@link https://yandex.ru/dev/disk/api/reference/create-folder.html}
   */
  public async createDir(path: string): Promise<ILink> {
    const res = await this._http.request<ILink>({
      method: 'PUT',
      params: { path },
      url: YA_DISK_RESOURCES_URL,
    });
    return res.data;
  }
  /**
   * Удалить файл или папку
   * {@link https://yandex.ru/dev/disk/api/reference/delete.html}
   * @example
   * ```ts
   * await disk.remove({
   *  path: "file-to-remove.txt",
   *  permanently: true
   * })
   * ```
   */
  public async remove(params: IRemoveParams): Promise<ILink | undefined> {
    const res = await this._http.request<ILink>({
      url: YA_DISK_RESOURCES_URL,
      method: 'DELETE',
      params: {
        path: params.path,
        permanently: params.permanently,
        force_async: params.forceAsync,
      },
    });
    return res.data;
  }
  /**
   * Создать копию файла или папки
   * {@link https://yandex.ru/dev/disk/api/reference/copy.html}
   * @example
   * ```ts
   * await disk.copy({
   *  from: "from.txt",
   *  to: "to.txt",
   *  overwrite: true
   * })
   * ```
   */
  public async copy(params: ICopyParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      url: YA_DISK_RESOURCES_URL + '/copy',
      method: 'POST',
      params: {
        from: params.from,
        path: params.to,
        overwrite: params.overwrite,
        force_async: params.forceAsync,
      },
    });
    return res.data;
  }
  /**
   * Переместить файл или папку
   * {@link https://yandex.ru/dev/disk/api/reference/move.html}
   */
  public async move(params: IMoveParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      url: YA_DISK_RESOURCES_URL + '/move',
      method: 'POST',
      params: {
        from: params.from,
        path: params.to,
        overwrite: params.overwrite,
        force_async: params.forceAsync,
      },
    });
    return res.data;
  }
  /**
   * Опубликовать ресурс
   * {@link https://yandex.ru/dev/disk/api/reference/publish.html#publish-q}
   */
  public async publish(params: IPublishParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      url: YA_DISK_RESOURCES_URL + '/publish',
      method: 'PUT',
      params: { path: params.path },
    });
    return res.data;
  }
  /**
   * Отменить публикацию ресурса
   * {@link https://yandex.ru/dev/disk/api/reference/publish.html#unpublish-q}
   */
  public async unpublish(params: IUnpublishParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      url: YA_DISK_RESOURCES_URL + '/unpublish',
      method: 'PUT',
      params: { path: params.path },
    });
    return res.data;
  }

  /**
   * Получить ссылку для загрузки файла. Ссылка действительна 30 мин
   * Можно использовать только 1 раз, даже если загрузка не была успешной
   * {@link https://yandex.ru/dev/disk/api/reference/upload.html#url-request}
   * @example
   * ```ts
   * await disk.getUploadUrl({
   *  path: "ya-disk-file.txt",
   *  overwrite: true,
   * })
   * ```
   */
  public async getUploadUrl(
    params: IGetUploadUrlParams
  ): Promise<IGetUploadUrlRes> {
    const res = await this._http.request<IGetUploadUrlRes>({
      url: YA_DISK_RESOURCES_URL + '/upload',
      method: 'GET',
      params: { path: params.path, overwrite: params.overwrite },
    });
    return res.data;
  }
  /**
   * загрузить файл по полученной из getUploadUrl ссылке
   * {@link https://yandex.ru/dev/disk/api/reference/upload.html#response-upload}
   * @example
   * ```ts
   * await disk.uploadByUploadUrl({
   *  file: "./file.txt",
   *  url: "url-from-get-upload-url-method"
   * })
   * ```
   * @example
   * ```ts
   * await disk.uploadByUploadUrl({
   *  file: fs.createReadStream("./file.txt"),
   *  url: "url-from-get-upload-url-method"
   * })
   * ```
   * @example
   * ```ts
   * await disk.uploadByUploadUrl({
   *  file: Buffer.from('hello world', 'utf-8'),
   *  url: "url-from-get-upload-url-method"
   * })
   * ```
   */
  public async uploadByUploadUrl(
    params: IUploadByUploadUrlParams
  ): Promise<void> {
    let body: TUploadFile;
    if (typeof params.file === 'string') {
      body = createReadStream(params.file, 'binary');
    } else {
      body = params.file;
    }
    const res = await this._http.request<void>({
      url: params.url,
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
      },
      body,
    });
    return res.data;
  }
  /**
   * хелпер комбинирующий {@link YaDisk.getUploadUrl} и {@link YaDisk.uploadByUploadUrl}.
   * Получает ссылку на загрузку и загружает по ней файл
   * @example
   * ```ts
   * await disk.upload({
   *  path: "ya-disk-file.txt",
   *  file: "./file.txt",
   *  overwrite: true,
   * })
   * ```
   * @example
   * ```ts
   * await disk.upload({
   *  path: "ya-disk-file.txt",
   *  file: fs.createReadStream("./file.txt"),
   * })
   * ```
   * @example
   * ```ts
   * await disk.upload({
   *  path: "ya-disk-file.txt",
   *  file: Buffer.from('hello world', 'utf-8'),
   * })
   * ```
   */
  public async upload(params: IUploadParams): Promise<void> {
    const { href: url } = await this.getUploadUrl({
      path: params.path,
      overwrite: params.overwrite,
    });
    return await this.uploadByUploadUrl({
      url,
      file: params.file,
    });
  }
  /**
   * Загрузить файл в Диск по внешнему URL
   * {@link https://yandex.ru/dev/disk/api/reference/upload-ext.html}
   * @example
   * ```ts
   * await disk.uploadByExternalUrl({
   *  path: "path-to-yandex-disk-file.png",
   *  url: "https://www.example.com/cat.png",
   * })
   * ```
   */
  public async uploadByExternalUrl(
    params: IUploadByExternalUrlParams
  ): Promise<void> {
    const res = await this._http.request<void>({
      method: 'POST',
      url: YA_DISK_RESOURCES_URL + '/upload',
      params: {
        path: params.path,
        url: params.url,
        disable_redirects: params.disableRedirects,
      },
    });
    return res.data;
  }
  /**
   * Получить ссылку на скачивание файла
   * {@link https://yandex.ru/dev/disk/api/reference/content.html}
   */
  public async getDownloadUrl(params: IGetDownloadUrlParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      method: 'GET',
      url: YA_DISK_RESOURCES_URL + '/download',
      params: {
        path: params.path,
      },
    });
    return res.data;
  }
  /**
   * Обновить пользовательские данные ресурса
   * {@link https://yandex.ru/dev/disk/api/reference/meta-add.html}
   * @example
   * ```ts
   * await disk.updateItemMetadata({
   *  path: 'file.txt',
   *  body: {
   *    custom_properties: {foo: "1", bar: "2"}
   *  }
   * });
   * ```
   */
  public async updateItemMetadata(
    params: IUpdateItemMetadataParams
  ): Promise<IResource> {
    const res = await this._http.request<IResource>({
      method: 'PATCH',
      url: YA_DISK_RESOURCES_URL,
      params: {
        path: params.path,
      },
      body: params.body,
    });
    return res.data;
  }
  /**
   * Получить содержимое Корзины
   */
  public async getTrash(params: IGetTrashParams): Promise<TGetTrashRes> {
    const res = await this._http.request<TGetTrashRes>({
      method: 'GET',
      url: YA_DISK_TRASH_URL,
      params: {
        limit: params.limit,
        offset: params.offset,
        preview_crop: params.previewCrop,
        preview_size: params.previewSize,
        sort: params.sort,
      },
    });
    return res.data;
  }
  /**
   * Очистить корзину
   * {@link https://yandex.ru/dev/disk/api/reference/trash-delete.html}
   */
  public async clearTrash(params: IClearTrashParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      method: 'DELETE',
      url: YA_DISK_TRASH_URL,
      params: {
        force_async: params.forceAsync,
        path: params.path,
      },
    });
    return res.data;
  }
  /**
   * Восстановить ресурс из Корзины
   * {@link https://yandex.ru/dev/disk/api/reference/trash-restore.html}
   */
  public async restoreTrash(params: IRestoreTrashParams): Promise<ILink> {
    const res = await this._http.request<ILink>({
      method: 'PUT',
      url: YA_DISK_TRASH_URL,
      params: {
        path: params.path,
        name: params.name,
        overwrite: params.overwrite,
        force_async: params.forceAsync,
      },
    });
    return res.data;
  }
  /**
   * проверить была ли выброшенная ошибка инстансом {@link HttpError}
   * @example
   * ```ts
   * try {
   *  await disk.getMetadata();
   * } catch(e) {
   *  if(disk.isHttpError(e)) {
   *    // тип сужен до HttpError
   *    if(e.code === 404) {
   *      // ...
   *    }
   *  }
   * }
   * ```
   * @param e - ошибка
   */
  public isHttpError(e: any): e is HttpError {
    return this._http.isHttpError(e);
  }
}
