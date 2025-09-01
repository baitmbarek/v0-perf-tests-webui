"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Pocket as Bucket, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface BucketSelectorProps {
  selectedBucket: string
  onBucketSelect: (bucket: string) => void
}

// Predefined buckets for demo purposes
const PREDEFINED_BUCKETS = ["my-static-website", "company-assets", "public-files", "demo-content"]

export function BucketSelector({ selectedBucket, onBucketSelect }: BucketSelectorProps) {
  const [customBucket, setCustomBucket] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleBucketClick = async (bucket: string) => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    onBucketSelect(bucket)
    setIsLoading(false)
  }

  const handleCustomBucketAdd = async () => {
    if (customBucket.trim()) {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      onBucketSelect(customBucket.trim())
      setCustomBucket("")
      setShowCustomInput(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Predefined Buckets */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Available Buckets</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading bucket...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {PREDEFINED_BUCKETS.map((bucket) => (
              <Card
                key={bucket}
                className={cn(
                  "p-3 cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground",
                  selectedBucket === bucket && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => handleBucketClick(bucket)}
              >
                <div className="flex items-center gap-3">
                  <Bucket className="h-4 w-4" />
                  <span className="text-sm font-medium">{bucket}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Custom Bucket Input */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Custom Bucket</h3>
        {!showCustomInput ? (
          <Button variant="outline" onClick={() => setShowCustomInput(true)} className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Bucket
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter bucket name"
              value={customBucket}
              onChange={(e) => setCustomBucket(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomBucketAdd()}
            />
            <Button onClick={handleCustomBucketAdd} disabled={!customBucket.trim()}>
              Add
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomInput(false)
                setCustomBucket("")
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Selected Bucket Display */}
      {selectedBucket && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Selected Bucket:</p>
          <p className="font-medium text-foreground">{selectedBucket}</p>
        </div>
      )}
    </div>
  )
}
