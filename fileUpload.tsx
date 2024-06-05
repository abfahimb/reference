import React, { useMemo, useRef, useState } from 'react'
import formatFileSize from '@/src/helper/fileSize'
import { ScrollArea } from '@/src/components/ui/scroll-area'

import Image, { StaticImageData } from 'next/image'

const CSVImporter = () => {
  const [files, setFiles] = useState<File[]>([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const totalFileSizeInMB = useMemo(() => {
    const totalBytes = files.reduce((total, file) => total + file.size, 0)
    const sizeMB = totalBytes / (1024 * 1024)
    return sizeMB.toFixed(2)
  }, [files])

  const handleClick = React.useCallback(() => fileInputRef.current?.click(), [])
  console.log('totalFileSizeInMB', totalFileSizeInMB)
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files
    if (targetFiles && targetFiles.length > 0) {
      const dropFiles = Array.from(targetFiles)
      const newFiles = dropFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile: File) =>
              existingFile.name === newFile.name && existingFile.size === newFile.size,
          ),
      )
      setFiles([...files, ...newFiles])
    }
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const dropFiles = Array.from(droppedFiles).filter(
        (file) => file.type === 'application/x-zip-compressed',
      )

      const newFiles = dropFiles.filter(
        (newFile) =>
          !files.some(
            (existingFile: File) =>
              existingFile.name === newFile.name && existingFile.size === newFile.size,
          ),
      )
      setFiles([...files, ...(newFiles as File[])])
    }
  }

  const removeFile = (fileName: string) => {
    setFiles((prevState) => prevState.filter((existingFile) => existingFile.name !== fileName))
  }

  return (
    <div className="zip-importer">
      <div
        id="dropzone"
        className="w-full rounded-md border-dashed border-[#FF005A] border-2 p-12 text-center cursor-pointer bg-[#ff005a0d] mt-8"
        onClick={() => handleClick()}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <div id="dropzonePlaceholder">
          <svg
            className="m-auto"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.99994 18.6238C4.07124 17.675 3.37065 16.5272 2.95123 15.2675C2.53181 14.0078 2.40457 12.6691 2.57914 11.353C2.7537 10.0368 3.22551 8.77759 3.9588 7.67075C4.6921 6.56392 5.66767 5.63848 6.8116 4.96453C7.95554 4.29057 9.23784 3.88578 10.5614 3.78081C11.8849 3.67584 13.215 3.87345 14.4509 4.35866C15.6868 4.84388 16.796 5.60397 17.6946 6.58138C18.5932 7.55879 19.2576 8.72788 19.6374 10.0001H21.8749C23.0818 9.99995 24.2568 10.388 25.2262 11.1069C26.1956 11.8258 26.9081 12.8374 27.2584 13.9923C27.6087 15.1473 27.5783 16.3843 27.1716 17.5206C26.7649 18.6569 26.0035 19.6322 24.9999 20.3026"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 15V26.25"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 20L15 15L10 20"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-xl">Drop your zip file here or Browse</span>
            <span className="text-sm pb-8">Maximum upload file size 30 MB</span>
          </div>
        </div>
        <span id="dropzoneLoading" className="hidden">
          Loading...
        </span>
        <span id="dropzoneContent" className="hidden"></span>
        <input
          id="file"
          type="file"
          accept=".zip"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e)}
          multiple
          className="hidden"
        />
      </div>
      <p className="font-bold pb-2">Files</p>
      <div className="file-viewer h-64">
        {!files.length && (
          <p className="font-semibold text-center pt-24">You didn&apos;t upload any product yet</p>
        )}
        {files.map((file) => (
          <div key={file.name} className="flex justify-between pb-4">
            <div className="w-full flex items-center">

              <div className="flex flex-col pl-2">
                {file.name.replace('.zip', '')}
                <span className="text-zinc-400 text-xs font-bold">{formatFileSize(file.size)}</span>
              </div>
            </div>
            <span className="hover:cursor-pointer" onClick={() => removeFile(file.name)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CSVImporter
