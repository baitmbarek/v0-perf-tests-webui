"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2, ExternalLink, Download } from "lucide-react"

interface ContentDisplayProps {
  bucket: string
  object: string
  onBack: () => void
}

export function ContentDisplay({ bucket, object, onBack }: ContentDisplayProps) {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [contentType, setContentType] = useState<string>("")

  useEffect(() => {
    loadContent()
  }, [bucket, object])

  const loadContent = async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock content based on file type
    const fileExtension = object.split(".").pop()?.toLowerCase()

    let mockContent = ""
    let type = "text/plain"

    switch (fileExtension) {
      case "html":
        type = "text/html"
        mockContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #059669; font-size: 2em; margin-bottom: 20px; }
        .content { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">Welcome to ${object}</div>
    <div class="content">
        <p>This is a sample HTML file from the GCS bucket "${bucket}".</p>
        <p>The content is being displayed through the reverse proxy system.</p>
        <p>This demonstrates how static files can be served from Google Cloud Storage.</p>
    </div>
</body>
</html>`
        break
      case "css":
        type = "text/css"
        mockContent = `/* Styles for ${object} */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f8fafc;
    color: #475569;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
    color: #059669;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.button {
    background-color: #10b981;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}

.button:hover {
    background-color: #059669;
}`
        break
      case "js":
        type = "application/javascript"
        mockContent = `// JavaScript file: ${object}
// From bucket: ${bucket}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading content from GCS bucket: ${bucket}');
    
    // Initialize the application
    const app = {
        init: function() {
            this.setupEventListeners();
            this.loadContent();
        },
        
        setupEventListeners: function() {
            const buttons = document.querySelectorAll('.interactive-button');
            buttons.forEach(button => {
                button.addEventListener('click', this.handleButtonClick);
            });
        },
        
        handleButtonClick: function(event) {
            event.preventDefault();
            console.log('Button clicked:', event.target.textContent);
            
            // Simulate some interaction
            event.target.style.backgroundColor = '#059669';
            setTimeout(() => {
                event.target.style.backgroundColor = '#10b981';
            }, 200);
        },
        
        loadContent: function() {
            // Simulate loading content from GCS
            const contentArea = document.getElementById('dynamic-content');
            if (contentArea) {
                contentArea.innerHTML = '<p>Content loaded from ${bucket}/${object}</p>';
            }
        }
    };
    
    // Start the application
    app.init();
});`
        break
      default:
        mockContent = `Content of ${object} from bucket ${bucket}

This is a demonstration of how static files from Google Cloud Storage 
can be displayed through a reverse proxy system.

File: ${object}
Bucket: ${bucket}
Content-Type: ${type}

The actual implementation would fetch the real content from GCS
and display it appropriately based on the file type.`
    }

    setContent(mockContent)
    setContentType(type)
    setIsLoading(false)
  }

  const renderContent = () => {
    if (contentType === "text/html") {
      return (
        <iframe
          srcDoc={content}
          className="w-full h-96 border border-border rounded-md"
          title={`Preview of ${object}`}
        />
      )
    }

    return (
      <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono max-h-96">
        <code>{content}</code>
      </pre>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Explorer
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{object}</h1>
                <p className="text-sm text-muted-foreground">from {bucket}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-6">
        <Card className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Loading content from {bucket}/{object}...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Content Preview</h2>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{contentType}</span>
              </div>
              {renderContent()}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
