import type { Dict } from './utils';
import type { Stream } from 'stream';

export type TResourceType = 'file' | 'dir';
export type TUploadFile = Stream | Buffer | string;
export type TPreviewSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | string;
export type TSort =
  | 'name'
  | '-name'
  | 'path'
  | '-path'
  | 'created'
  | '-created'
  | 'modified'
  | '-modified'
  | 'size'
  | '-size';
export interface IResource {
  antivirus_status: Dict<any>;
  resource_id: string;
  share: {
    is_root: boolean;
    is_owned: boolean;
    rights: string;
  };
  file: string;
  /**
   * Размер файла
   */
  size: number;
  photoslice_time: string;
  _embedded: {
    sort: string;
    items: Dict<any>[];
    limit: number;
    offset: number;
    path: string;
    total: number;
  };
  exif: {
    date_time: string;
    gps_longitude: Dict<any>;
    gps_latitude: Dict<any>;
  };
  /**
   * Объект со всеми атрибутами, заданными с помощью запроса Добавление метаинформации для ресурса. Содержит только ключи вида имя:значение (объекты или массивы содержать не может).
   * {@link https://yandex.ru/dev/disk/api/reference/meta-add.html}
   */
  custom_properties: Dict<any>;
  media_type: string;
  /**
   * Ссылка на уменьшенное изображение из файла (превью). Включается в ответ только для файлов поддерживаемых графических форматов.
   * Запросить превью можно только с OAuth-токеном пользователя, имеющего доступ к самому файлу.
   */
  preview: string;
  /**
   * Тип ресурса
   */
  type: TResourceType;
  /**
   * MIME-тип файла
   */
  mime_type: string;
  revision: number;
  /**
   * Ссылка на опубликованный ресурс.
   * Включается в ответ только если указанный файл или папка опубликован.
   */
  public_url: string;
  /**
   * Полный путь к ресурсу на Диске.
   * В метаинформации опубликованной папки пути указываются относительно самой папки. Для опубликованных файлов значение ключа всегда «/».
   * Для ресурса, находящегося в Корзине, к атрибуту может быть добавлен уникальный идентификатор (например, trash:/foo_1408546879). С помощью этого идентификатора ресурс можно отличить от других удаленных ресурсов с тем же именем.
   */
  path: string;
  /**
   * MD5-хэш файла
   */
  md5: string;
  /**
   * Ключ опубликованного ресурса.
   * Включается в ответ только если указанный файл или папка опубликован.
   */
  public_key: string;
  sha256: string;
  /**
   * Имя ресурса
   */
  name: string;
  /**
   * Дата и время создания ресурса, в формате ISO 8601
   */
  created: string;
  /**
   * Дата и время изменения ресурса, в формате ISO 8601
   */
  modified: string;
  comment_ids: {
    private_resource: string;
    public_resource: string;
  };
}
export interface ILink {
  href: string;
  method: string;
  templated: boolean;
}

export interface IRemoveParams {
  path: string;
  permanently?: boolean;
  forceAsync?: boolean;
}
export interface ICopyParams {
  from: string;
  to: string;
  forceAsync?: boolean;
  overwrite?: boolean;
}
export interface IMoveParams extends ICopyParams {}
export interface IPublishParams {
  path: string;
}
export interface IUnpublishParams extends IPublishParams {}
export interface IGetItemsListParams {
  /**
   * Количество выводимых вложенных ресурсов
   */
  limit?: number;
  /**
   * Фильтр по медиа типу
   */
  mediaType?: string;
  /**
   * Смещение от начала списка вложенных ресурсов
   */
  offset?: number;
  /**
   * Разрешить обрезку превью
   */
  previewCrop?: boolean;
  /**
   * Размер превью
   */
  previewSize?: TPreviewSize;
  /**
   * Поле для сортировки ресурсов
   */
  sort?: TSort;
  /**
   * Список возвращаемых атрибутов
   */
  fields?: string;
}
export interface IGetItemMetadataParams extends IGetItemsListParams {
  path: string;
}
export interface IGetLastUploadedItemsListParams
  extends Omit<IGetItemsListParams, 'sort' | 'offset'> {}
export interface IGetPublicItemsListParams
  extends Omit<IGetItemsListParams, 'sort'> {
  type?: TResourceType;
}
export interface IGetUploadUrlParams {
  // путь, по которому следует загрузить файл
  path: string;
  // признак перезаписи
  overwrite?: boolean;
}
export interface IUploadByUploadUrlParams {
  // ссылка для загрузки файла
  url: string;
  // загружаемый файл. может быть путем до файла, Stream либо Buffer
  file: TUploadFile;
}
export interface IUploadParams
  extends IGetUploadUrlParams,
    Omit<IUploadByUploadUrlParams, 'url'> {}
export interface IUploadByExternalUrlParams {
  // Путь, куда будет помещён ресурс
  path: string;
  // URL внешнего ресурса, который следует загрузить
  url: string;
  // Запретить делать редиректы
  disableRedirects?: boolean;
}
export interface IGetDownloadUrlParams {
  // Путь к ресурсу
  path: string;
}
export interface IGetTrashParams extends IGetItemsListParams {}
export interface IClearTrashParams {
  /**
   * Путь к удаляемому ресурсу относительно корневого каталога Корзины. Например, %2Fbar%2Fphoto.png. Если параметр не задан, Корзина очищается полностью.
   */
  path?: string;
  /**
   * Выполнить асинхронно.
   */
  forceAsync?: boolean;
}
export interface IRestoreTrashParams {
  // Путь к ресурсу в Корзине
  path: string;
  // Имя, под которым будет восстановлен ресурс
  name?: string;
  // Выполнить асинхронно.
  // Перезаписать существующий ресурс восстанавливаемым
  overwrite?: boolean;
  forceAsync?: boolean;
}
export interface IUpdateItemMetadataParams {
  path: string;
  body: Dict<any>;
}
export interface IIsItemExistParams {
  path: string;
  type?: TResourceType;
}

export interface IGetDiskMetadataRes {
  total_space: number;
  trash_size: number;
  used_space: number;
  max_file_size: number;
  system_folders: Dict<string>;
  is_paid: boolean;
  unlimited_autoupload_enabled: boolean;
  user: {
    country: string;
    login: string;
    display_name: string;
    uid: string;
  };
  revision: number;
}
export interface IGetItemsListRes {
  items: IResource[];
  limit: number;
  offset: number;
}
export interface IGetPublicItemsListRes extends IGetItemsListRes {
  type: TResourceType;
}
export interface IGetLastUploadedItemsListRes
  extends Omit<IGetItemsListRes, 'offset'> {}
export interface IGetUploadUrlRes extends ILink {
  operation_id: string;
}
export type TGetTrashRes = IResource[];
