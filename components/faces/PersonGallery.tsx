'use client'

import { useState } from 'react'
import { Users, ChevronRight, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { namePerson } from '@/lib/actions/faces'
import type { PersonCluster } from '@/lib/ai/types'

interface PersonGalleryProps {
  persons: PersonCluster[]
  onSelectPerson?: (personId: string) => void
  isOwner?: boolean // Can the user edit names?
}

export function PersonGallery({ persons, onSelectPerson, isOwner = false }: PersonGalleryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  const startEditing = (person: PersonCluster) => {
    setEditingId(person.id)
    setEditName(person.name || '')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
  }

  const saveName = async (personId: string) => {
    if (!editName.trim()) {
      cancelEditing()
      return
    }

    setSaving(true)
    const { success, error } = await namePerson(personId, editName.trim())
    setSaving(false)

    if (success) {
      cancelEditing()
      // Optimistically update the UI
      // In production, this would revalidate the data
    } else {
      console.error('Failed to save name:', error)
    }
  }

  if (persons.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No People Detected Yet</h3>
        <p className="text-gray-500 text-sm">
          As photos are uploaded, we'll automatically detect and group people.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">People in Photos</h3>
        <span className="text-sm text-gray-500">{persons.length} people</span>
      </div>

      <div className="grid gap-2">
        {persons.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 transition"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {person.representativeFaceUrl ? (
                  <img
                    src={person.representativeFaceUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6 text-purple-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {editingId === person.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter name..."
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName(person.id)
                        if (e.key === 'Escape') cancelEditing()
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveName(person.id)}
                      disabled={saving}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditing}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {person.name || `Person ${persons.indexOf(person) + 1}`}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => startEditing(person)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {person.photoCount} photo{person.photoCount !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Action */}
              {onSelectPerson && (
                <button
                  onClick={() => onSelectPerson(person.id)}
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <span className="text-sm font-medium mr-1">View</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Compact version for sidebar/filter panel
 */
export function PersonFilter({
  persons,
  selectedPersonId,
  onSelectPerson,
}: {
  persons: PersonCluster[]
  selectedPersonId: string | null
  onSelectPerson: (personId: string | null) => void
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Person</h4>
      
      <button
        onClick={() => onSelectPerson(null)}
        className={`w-full flex items-center space-x-3 p-2 rounded-lg transition ${
          selectedPersonId === null
            ? 'bg-purple-100 text-purple-700'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <Users className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">All People</span>
      </button>

      {persons.map((person, index) => (
        <button
          key={person.id}
          onClick={() => onSelectPerson(person.id)}
          className={`w-full flex items-center space-x-3 p-2 rounded-lg transition ${
            selectedPersonId === person.id
              ? 'bg-purple-100 text-purple-700'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-amber-100 flex items-center justify-center overflow-hidden">
            {person.representativeFaceUrl ? (
              <img
                src={person.representativeFaceUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-purple-600">
                {(person.name || `P${index + 1}`).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium block truncate">
              {person.name || `Person ${index + 1}`}
            </span>
            <span className="text-xs text-gray-500">
              {person.photoCount} photos
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
