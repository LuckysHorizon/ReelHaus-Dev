'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, onError, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      onError?.('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      onError?.('File too large. Maximum size is 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        onError?.(errorData.error || 'Upload failed')
        return
      }

      const data = await response.json()

      if (data.success) {
        onChange(data.imageUrl)
        setPreview(null) // Clear preview since we have the URL
      } else {
        onError?.(data.error || 'Upload failed')
      }
    } catch (error) {
      onError?.('Network error during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange('')
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-red-400">Cover Image</Label>
      
      {/* Image Preview */}
      {(value || preview) && (
        <div className="relative">
          <img
            src={preview || value}
            alt="Cover preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-700"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Controls */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            <Upload className={`h-4 w-4 mr-2 ${uploading ? 'animate-spin' : ''}`} />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* URL Input */}
        <div>
          <Label htmlFor="cover_image_url" className="text-gray-400 text-sm">
            Or enter image URL:
          </Label>
          <Input
            id="cover_image_url"
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-gray-900/50 border-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  )
}
