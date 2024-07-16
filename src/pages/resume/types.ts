export type ResumeType = {
  document: Document;
};

export type Document = {
  id: string;
  documentTemplateId: string;
  templateOptions: TemplateOptions;
  title: string;
  generatedTitle: string;
  photo: Photo;
  signature: Signature;
  content: Content;
  documentType: string;
  textOnly: boolean;
  isPubliclyShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  documentConfiguration: DocumentConfiguration;
};

export type Content = {
  locale: string;
  version: string;
  sections: Section[];
};

export type Section = {
  key: string;
  fields: SectionField[];
  movable: boolean;
  records: Record[];
  repeatable: boolean;
  destroyable: boolean;
  additionalFields?: boolean;
  customSectionName?: string;
};

export type SectionField = {
  key: string;
  role: Role;
  format?: string;
  fieldType: FieldType;
  subFields?: PurpleSubField[];
  autocomplete?: string;
  linkedFieldsKey?: string;
  minor?: boolean;
  options?: string[];
};

export type FieldType =
  | 'composite'
  | 'text'
  | 'date'
  | 'richtext'
  | 'month'
  | 'level';

export type Role =
  | 'value'
  | 'richtextValue'
  | 'header'
  | 'subheader'
  | 'period'
  | 'level';

export type PurpleSubField = {
  key: string;
  fieldType: FieldType;
  autocomplete?: string;
  linkedFieldsKey?: string;
  groupedFieldsKey?: string;
  suggestions?: string;
  presentOption?: boolean;
};

export type Record = {
  key: string;
  values: Array<string[] | null | string>;
};

export type DocumentConfiguration = {
  translationLocales: string[];
  defaultSections: DefaultSection[];
  additionalSections: AdditionalSection[];
  customSections: CustomSection[];
};

export type AdditionalSection = {
  key: string;
  fields: AdditionalSectionField[];
  movable: boolean;
  records: unknown[];
  repeatable: boolean;
  destroyable: boolean;
  placeholder?: string;
};

export type AdditionalSectionField = {
  key: string;
  role: Role;
  fieldType: FieldType;
  format?: string;
  subFields?: FluffySubField[];
  presentOption?: boolean;
  suggestions?: string;
  options?: string[];
};

export type FluffySubField = {
  key: string;
  fieldType: FieldType;
  suggestions?: string;
  presentOption?: boolean;
};

export type CustomSection = {
  key: string;
  fields: CustomSectionField[];
  movable: boolean;
  records: unknown[];
  repeatable: boolean;
  destroyable: boolean;
  customSectionName: string;
};

export type CustomSectionField = {
  key: string;
  role: Role;
  fieldType: FieldType;
  format?: string;
  subFields?: FluffySubField[];
  options?: string[];
};

export type DefaultSection = {
  key: string;
  fields: SectionField[];
  movable: boolean;
  records: unknown[];
  repeatable: boolean;
  destroyable: boolean;
  additionalFields: boolean;
};

export type Photo = {
  metadata: Metadata;
  keyCropped: string;
  keyOriginal: string;
  dataCropped: string;
};

export type Metadata = {
  rotation: number;
  croppedAreaPixels: CroppedAreaPixels;
};

export type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Signature = unknown;

export type TemplateOptions = {
  color: string;
};
