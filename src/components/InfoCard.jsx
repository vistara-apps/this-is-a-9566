import React from 'react'
import { ExternalLink, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const InfoCard = ({ title, content, variant = 'default', className = '' }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const baseClasses = "bg-surface rounded-lg shadow-card p-6 border-l-4"
  const variantClasses = {
    default: "border-l-primary",
    script: "border-l-accent bg-green-50"
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <button
          onClick={() => copyToClipboard(`${title}\n\n${content}`)}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      
      <div className="prose prose-sm max-w-none">
        {content.split('\n').map((paragraph, index) => (
          <p key={index} className="text-text-secondary leading-relaxed mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

export default InfoCard