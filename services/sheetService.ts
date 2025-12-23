import { YogaStyle } from '../types.ts';
import { yogaStyles as fallbackYogaStyles } from './dataService.ts';

// The ID of your Google Sheet
const SPREADSHEET_ID: string = '1lHu6AKuDVgkY3idyu2fZeuHnW_hrkUhnfdFHhSF8y-8';

// Robust CSV Parser that handles newlines inside quotes
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuote && nextChar === '"') {
        // Escaped quote: "" becomes " inside a quoted string
        currentVal += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      // Value separator
      currentRow.push(currentVal);
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuote) {
      // Row separator
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = '';
      
      // Handle CRLF (Windows line endings)
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      // Regular character
      currentVal += char;
    }
  }

  // Handle the last row if the file doesn't end with a newline
  if (currentRow.length > 0 || currentVal !== '') {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  // Clean up values: trim whitespace and remove surrounding quotes
  return rows.map(row => 
    row.map(val => {
      const trimmed = val.trim();
      // If it looks like a quoted string, strip quotes
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1).replace(/""/g, '"');
      }
      return trimmed;
    })
  );
};

// Helper to resolve image URLs (supports Google Drive, External URLs, and Local 'img' folder)
const resolveImageUrl = (url: string): string => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  
  // 1. Handle Google Drive Links
  if (trimmedUrl.includes('drive.google.com')) {
    const idRegex = /\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/;
    const match = trimmedUrl.match(idRegex);
    if (match) {
      const id = match[1] || match[2];
      if (id) {
        return `https://drive.google.com/uc?export=view&id=${id}`;
      }
    }
    // If it's a drive link but we couldn't parse ID, return as is just in case
    return trimmedUrl;
  }

  // 2. Handle External URLs (http/https)
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }

  // 3. Handle Local Files
  // Normalize path to ensure it points to the public/img directory properly
  
  // Remove leading slashes/backslashes if present
  let cleanPath = trimmedUrl.replace(/^[/\\]+/, '');
  
  // Auto-append .jpeg if no extension is provided
  const hasExtension = /\.(jpeg|jpg|png|webp|gif|svg)$/i.test(cleanPath);
  if (!hasExtension) {
    cleanPath += '.jpeg';
  }
  
  // If the user already included "img/", use as is. Otherwise, prepend "img/"
  if (!cleanPath.startsWith('img/')) {
    cleanPath = `img/${cleanPath}`;
  }
  
  // Return absolute path to ensure correct resolution from any route
  return `/${cleanPath}`;
};

const transformCSVRowToYogaStyle = (row: string[]): YogaStyle => {
  // Check if row is valid (needs at least Slug and Name)
  if (row.length < 2) return {} as YogaStyle;

  return {
    slug: row[0] || '', 
    name: row[1] || 'Unnamed Style',
    description: row[2] || '',
    benefits: row[3] ? row[3].split(',').map(b => b.trim()).filter(b => b.length > 0) : [],
    difficulty: (row[4] as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
    duration: row[5] || '',
    // Use Column G (index 6) for image.
    image: resolveImageUrl(row[6] || ''),
  };
};

export const fetchYogaStyles = async (): Promise<YogaStyle[]> => {
  if (!SPREADSHEET_ID) {
    return fallbackYogaStyles;
  }

  try {
    // We use the Google Visualization API endpoint with an explicit query to SELECT columns A through G.
    // This ensures that even if Column G (Image) is empty in some rows, the structure is preserved.
    const query = encodeURIComponent("SELECT A,B,C,D,E,F,G");
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1&tq=${query}`;

    console.log(`Fetching from: ${url}`); 

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data (${response.status}). Ensure the Google Sheet is shared with "Anyone with the link" as Viewer.`);
    }

    const text = await response.text();
    
    // Parse the full CSV text
    const rows = parseCSV(text);
    
    console.log("Parsed Rows (Debug):", rows);

    if (rows.length <= 1) {
      return [];
    }

    // Remove the header row (index 0) and parse the rest
    const dataRows = rows.slice(1);
    
    const validStyles = dataRows
      .filter(row => row.length > 1 && row[1] && row[1].trim() !== '') // Ensure 'Name' exists
      .map(transformCSVRowToYogaStyle);

    return validStyles;

  } catch (error) {
    console.error("Failed to fetch yoga styles:", error);
    throw error;
  }
};