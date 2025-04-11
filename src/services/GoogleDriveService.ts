import { ReflectionEntry } from '../types';

const REFLECTION_FILE_NAME = 'daily_reflections.json';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

class GoogleDriveService {
  private accessToken: string;
  private isPreviewMode: boolean;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    // Check if we're in preview mode (using a mock token)
    this.isPreviewMode = accessToken.includes('preview') || !accessToken.includes('.');
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    // In preview mode, simulate API responses instead of making real requests
    if (this.isPreviewMode) {
      return this.mockFetch(url, options);
    }

    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`);
    }

    return response;
  }

  // Mock implementation for preview mode
  private async mockFetch(url: string, options: RequestInit = {}): Promise<Response> {
    console.log('Mock Google Drive API call:', url, options);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock different API responses based on the URL and method
    if (url.includes('/files?q=')) {
      // Finding reflection file
      return new Response(JSON.stringify({
        files: localStorage.getItem('mock_drive_file_exists') === 'true' 
          ? [{ id: 'mock-file-id', name: REFLECTION_FILE_NAME }] 
          : []
      }));
    } else if (url.includes('/files?uploadType=multipart')) {
      // Creating new file
      localStorage.setItem('mock_drive_file_exists', 'true');
      return new Response(JSON.stringify({ id: 'mock-file-id', name: REFLECTION_FILE_NAME }));
    } else if (url.includes('/files/') && url.includes('?alt=media')) {
      // Getting file content
      const savedEntries = localStorage.getItem('reflectionEntries') || '[]';
      return new Response(savedEntries);
    } else if (options.method === 'PATCH') {
      // Updating file
      return new Response(JSON.stringify({ id: 'mock-file-id', name: REFLECTION_FILE_NAME }));
    }
    
    // Default response
    return new Response(JSON.stringify({ success: true }));
  }

  async findReflectionFile() {
    const query = `name='${REFLECTION_FILE_NAME}' and trashed=false`;
    const url = `${DRIVE_API_URL}/files?q=${encodeURIComponent(query)}`;
    
    const response = await this.fetchWithAuth(url);
    const data = await response.json();
    
    return data.files && data.files.length > 0 ? data.files[0] : null;
  }

  async createReflectionFile(entries: ReflectionEntry[]) {
    const metadata = {
      name: REFLECTION_FILE_NAME,
      mimeType: 'application/json'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(entries)], { type: 'application/json' }));

    const response = await this.fetchWithAuth(
      `${DRIVE_UPLOAD_URL}/files?uploadType=multipart`,
      {
        method: 'POST',
        body: form
      }
    );

    return response.json();
  }

  async updateReflectionFile(fileId: string, entries: ReflectionEntry[]) {
    const response = await this.fetchWithAuth(
      `${DRIVE_UPLOAD_URL}/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entries)
      }
    );

    return response.json();
  }

  async loadReflections(): Promise<ReflectionEntry[]> {
    const file = await this.findReflectionFile();
    
    if (!file) {
      return [];
    }

    const response = await this.fetchWithAuth(
      `${DRIVE_API_URL}/files/${file.id}?alt=media`
    );

    return await response.json();
  }

  async saveReflections(entries: ReflectionEntry[]): Promise<void> {
    const file = await this.findReflectionFile();
    
    if (file) {
      await this.updateReflectionFile(file.id, entries);
    } else {
      await this.createReflectionFile(entries);
    }
  }
}

export default GoogleDriveService;
