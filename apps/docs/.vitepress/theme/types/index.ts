export type Meta = {
  name: string;
  _split_id: number;
};

export type Offset = {
  start: number;
  end: number;
};

export type Answer = {
  answer: string;
  context: string;
  meta: Meta;
  offsets_in_context: [Offset];
  offsets_in_document: [Offset];
  score: number;
  type: string;
  document_id: string;
};
export type Document = {
  content: string;
  content_type: string;
  id: string;
  score: number;
};

export type QueryResponse = {
  answers: [Answer];
  documents: [];
  query: string;
};
