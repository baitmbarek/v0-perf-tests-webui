"use client"

import { useState } from "react"
import { BucketSelector } from "@/components/bucket-selector"
import { ObjectListing } from "@/components/object-listing"
import { ContentDisplay } from "@/components/content-display"
import { Button } from "@/components/ui/button"
import { FolderOpen } from "lucide-react"

export default function GCSExplorer() {
  const [currentView, setCurrentView] = useState<"explorer" | "content">("explorer")
  const [selectedBucket, setSelectedBucket] = useState<string>("")
  const [selectedObject, setSelectedObject] = useState<string>("")

  const handleDisplayContent = () => {
    if (selectedBucket && selectedObject) {
      setCurrentView("content")
    }
  }

  const handleBackToExplorer = () => {
    setCurrentView("explorer")
  }

  if (currentView === "content") {
    return <ContentDisplay bucket={selectedBucket} object={selectedObject} onBack={handleBackToExplorer} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">GCS File Explorer</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and display static files from Google Cloud Storage buckets
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Bucket Selection */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Select Bucket</h2>
            <BucketSelector selectedBucket={selectedBucket} onBucketSelect={setSelectedBucket} />
          </div>

          {/* Right Panel - Object Listing */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Select Object</h2>
            <ObjectListing bucket={selectedBucket} selectedObject={selectedObject} onObjectSelect={setSelectedObject} />
          </div>
        </div>

        {/* Display Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleDisplayContent}
            disabled={!selectedBucket || !selectedObject}
            size="lg"
            className="px-8"
          >
            Display Content
          </Button>
        </div>
      </main>
    </div>
  )
}
