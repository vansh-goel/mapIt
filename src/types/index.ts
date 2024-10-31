export interface Node {
  id: string;
  label: string;
  color?: string;
  val?: number;
}

export interface Link {
  source: string;
  target: string;
  value?: number;
}

export interface MindMap {
  nodes: Node[];
  links: Link[];
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
}