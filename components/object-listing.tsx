"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, File, ImageIcon, Code, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ObjectListingProps {
  bucket: string
  selectedObject: string
  onObjectSelect: (object: string) => void
}

interface GCSObject {
  name: string
  type: "html" | "css" | "js" | "image" | "other"
  size: string
  lastModified: string
}

// Mock data for demo purposes
const MOCK_OBJECTS: Record<string, GCSObject[]> = {
  "my-static-website": [
    { name: "index.html", type: "html", size: "12.5 KB", lastModified: "2024-01-15" },
    { name: "styles.css", type: "css", size: "8.2 KB", lastModified: "2024-01-15" },
    { name: "script.js", type: "js", size: "15.7 KB", lastModified: "2024-01-14" },
    { name: "logo.png", type: "image", size: "45.3 KB", lastModified: "2024-01-10" },
    { name: "about.html", type: "html", size: "9.1 KB", lastModified: "2024-01-12" },
  ],
  "company-assets": [
    { name: "main.css", type: "css", size: "25.4 KB", lastModified: "2024-01-20" },
    { name: "app.js", type: "js", size: "89.2 KB", lastModified: "2024-01-19" },
    { name: "banner.jpg", type: "image", size: "156.8 KB", lastModified: "2024-01-18" },
  ],
  "public-files": [
    { name: "home.html", type: "html", size: "18.9 KB", lastModified: "2024-01-22" },
    { name: "common.css", type: "css", size: "12.1 KB", lastModified: "2024-01-21" },
  ],
  "demo-content": [
    { name: "demo.html", type: "html", size: "7.3 KB", lastModified: "2024-01-25" },
    { name: "demo.css", type: "css", size: "4.8 KB", lastModified: "2024-01-25" },
  ],
}

const getFileIcon = (type: GCSObject["type"]) => {
  switch (type) {
    case "html":
      return <FileText className="h-4 w-4 text-orange-500" />
    case "css":
      return <Code className="h-4 w-4 text-blue-500" />
    case "js":
      return <Code className="h-4 w-4 text-yellow-500" />
    case "image":
      return <ImageIcon className="h-4 w-4 text-green-500" />
    default:
      return <File className="h-4 w-4 text-gray-500" />
  }
}

export function ObjectListing({ bucket, selectedObject, onObjectSelect }: ObjectListingProps) {
  const [objects, setObjects] = useState<GCSObject[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (bucket) {
      loadObjects(bucket)
    } else {
      setObjects([])
    }
  }, [bucket])

  const loadObjects = async (bucketName: string) => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Get mock objects or empty array for custom buckets
    const bucketObjects = MOCK_OBJECTS[bucketName] || []
    setObjects(bucketObjects)
    setIsLoading(false)
  }

  if (!bucket) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a bucket to view objects</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading objects from {bucket}...</p>
        </div>
      </div>
    )
  }

  if (objects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No objects found in bucket "{bucket}"</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        {objects.length} object{objects.length !== 1 ? "s" : ""} in {bucket}
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {objects.map((object) => (
          <Card
            key={object.name}
            className={cn(
              "p-3 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground",
              selectedObject === object.name && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => onObjectSelect(object.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(object.type)}
                <div>
                  <p className="text-sm font-medium">{object.name}</p>
                  <p className="text-xs opacity-70">
                    {object.size} • {object.lastModified}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Object Display */}
      {selectedObject && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Selected Object:</p>
          <p className="font-medium text-foreground">{selectedObject}</p>
        </div>
      )}
    </div>
  )
}
