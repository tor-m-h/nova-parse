import { useState, useRef } from 'react'
import { X, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, tittel: string) => Promise<void>
  isUploading: boolean
}

export function UploadModal({ isOpen, onClose, onUpload, isUploading }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [tittel, setTittel] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFile(droppedFile)) {
        setFile(droppedFile)
        if (!tittel) {
          setTittel(droppedFile.name.replace(/\.[^/.]+$/, ''))
        }
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (isValidFile(selectedFile)) {
        setFile(selectedFile)
        if (!tittel) {
          setTittel(selectedFile.name.replace(/\.[^/.]+$/, ''))
        }
      }
    }
  }

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const validExtensions = ['.pdf', '.docx', '.txt']
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    return validTypes.includes(file.type) || validExtensions.includes(extension)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !tittel) return

    await onUpload(file, tittel)
    setFile(null)
    setTittel('')
    onClose()
  }

  const handleClose = () => {
    setFile(null)
    setTittel('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-cyan-500/20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Last opp manual
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Drop zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
              dragActive
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10'
                : 'border-gray-300 dark:border-cyan-500/30 hover:border-sky-500 dark:hover:border-cyan-500',
              file && 'border-green-500 bg-green-50 dark:bg-green-500/10'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-green-500 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Klikk eller dra fil hit
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PDF, DOCX eller TXT (maks 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Title input */}
          <Input
            label="Tittel"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            placeholder="Gi manualen en beskrivende tittel"
            required
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={!file || !tittel || isUploading}
              isLoading={isUploading}
              className="flex-1"
            >
              Last opp
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
