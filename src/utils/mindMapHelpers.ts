import { Node, Link, Note } from '../types';

// Simplified but effective keyword extraction
const extractKeywords = (text: string): Set<string> => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  
  // Domain-specific terms
  const domainTerms = new Set([
    'cell', 'structure', 'function', 'membrane', 'nucleus', 'organelle',
    'cytoplasm', 'mitochondria', 'protein', 'dna', 'rna', 'biology',
    'unit', 'body', 'powerhouse', 'energy', 'organism'
  ]);

  const keywords = new Set<string>();
  
  // Add single words
  words.forEach(word => {
    if (domainTerms.has(word) || word.length > 3) {
      keywords.add(word);
    }
  });

  // Add phrases (2-3 word combinations)
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = words[i] + ' ' + words[i + 1];
    if (phrase.includes('cell') || 
        phrase.includes('structure') || 
        phrase.includes('function')) {
      keywords.add(phrase);
    }
    
    if (i < words.length - 2) {
      const triPhrase = phrase + ' ' + words[i + 2];
      if (triPhrase.includes('cell') || 
          triPhrase.includes('structure') || 
          triPhrase.includes('function')) {
        keywords.add(triPhrase);
      }
    }
  }

  return keywords;
};

const calculateSimilarity = (keywords1: Set<string>, keywords2: Set<string>): number => {
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  let score = 0;
  intersection.forEach(term => {
    // Higher weights for specific patterns
    if (term.includes('cell')) score += 3;
    else if (term.includes('structure') || term.includes('function')) score += 2.5;
    else if (term.includes(' ')) score += 2;
    else score += 1;

    // Additional weight for parent-child relationship indicators
    if (
      (keywords1.has('cell') && term.includes('structure')) ||
      (keywords1.has('cell') && term.includes('function')) ||
      (keywords2.has('cell') && term.includes('structure')) ||
      (keywords2.has('cell') && term.includes('function'))
    ) {
      score += 2;
    }
  });
  
  return score / Math.max(5, union.size); // Normalize but maintain meaningful scores
};

const generateNodeColor = (index: number, parentId: string | null): string => {
  if (parentId === null) {
    // Parent nodes get a distinct color
    return '#1e40af'; // Darker blue
  } else {
    // Child nodes get different colors based on their index
    const colors = [
      '#2563eb', // Blue
      '#7c3aed', // Purple
      '#db2777', // Pink
      '#059669', // Emerald
      '#d97706', // Amber
    ];
    return colors[index % colors.length];
  }
};

const findParentNote = (
  note: Note,
  notes: Note[],
  noteKeywords: Map<string, Set<string>>
): string | null => {
  const currentKeywords = noteKeywords.get(note.id)!;
  let bestParentId: string | null = null;
  let highestSimilarity = 0.1; // Lower threshold for better catching relationships

  notes.forEach(potentialParent => {
    if (potentialParent.id === note.id || 
        potentialParent.timestamp >= note.timestamp) return;

    const parentKeywords = noteKeywords.get(potentialParent.id)!;
    const similarity = calculateSimilarity(currentKeywords, parentKeywords);

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestParentId = potentialParent.id;
    }
  });

  return bestParentId;
};

export const generateMindMap = (notes: Note[]) => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const noteKeywords = new Map<string, Set<string>>();
  const parentChildMap = new Map<string, string[]>();

  // First pass: Extract keywords
  notes.forEach(note => {
    noteKeywords.set(note.id, extractKeywords(note.content));
  });

  // Second pass: Create hierarchical structure
  notes.forEach(note => {
    const parentId = findParentNote(note, notes, noteKeywords);
    
    if (parentId) {
      const children = parentChildMap.get(parentId) || [];
      children.push(note.id);
      parentChildMap.set(parentId, children);
    }

    nodes.push({
      id: note.id,
      label: note.content.slice(0, 40) + (note.content.length > 40 ? '...' : ''),
      val: parentId ? 1 : 2, // Make parent nodes larger
      color: generateNodeColor(nodes.length, parentId)
    });

    // Create hierarchical links
    if (parentId) {
      links.push({
        source: parentId,
        target: note.id,
        value: 2 // Stronger connection for hierarchical relationships
      });
    }
  });

  // Third pass: Add similarity-based connections
  notes.forEach((note1, i) => {
    const keywords1 = noteKeywords.get(note1.id)!;
    
    notes.slice(i + 1).forEach(note2 => {
      const keywords2 = noteKeywords.get(note2.id)!;
      const similarity = calculateSimilarity(keywords1, keywords2);
      
      // Create links for related concepts
      if (similarity >= 0.1) { // Lower threshold for more connections
        const existingLink = links.some(
          link => 
            (link.source === note1.id && link.target === note2.id) ||
            (link.source === note2.id && link.target === note1.id)
        );

        if (!existingLink) {
          links.push({
            source: note1.id,
            target: note2.id,
            value: similarity
          });
        }
      }
    });
  });

  return { nodes, links };
};

// Common English words to filter out
const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'that', 'have', 'with',
  'this', 'from', 'they', 'would', 'there', 'their', 'what',
  'about', 'which', 'when', 'make', 'like', 'time', 'just',
  'know', 'take', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'than', 'then', 'look', 'only', 'come',
  'over', 'think', 'also', 'back', 'after', 'work', 'first',
  'well', 'even', 'want', 'because', 'these', 'give', 'most'
];