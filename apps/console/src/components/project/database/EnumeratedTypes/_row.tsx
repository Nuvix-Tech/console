import { InputField } from '@/components/others/forms'
import { IconButton } from '@nuvix/ui/components'
import { GripVertical, Trash } from 'lucide-react'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'

interface EnumeratedTypeValueRowProps {
    index: number
    id: string
    field: any
    isDisabled?: boolean
    onRemoveValue: () => void
}

const EnumeratedTypeValueRow = ({
    index,
    id,
    field,
    isDisabled = false,
    onRemoveValue,
}: EnumeratedTypeValueRowProps) => {
    return (
        <Draggable draggableId={id} index={index} isDragDisabled={isDisabled}>
            {(draggableProvided: DraggableProvided) => (
                <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    className="flex items-center space-x-2 space-y-2"
                >
                    <div
                        {...draggableProvided.dragHandleProps}
                        className={`opacity-50 hover:opacity-100 transition ${isDisabled ? 'text-foreground-lighter !cursor-default' : 'text-foreground'
                            }`}
                    >
                        <GripVertical size={16} strokeWidth={1.5} />
                    </div>
                    <InputField name={field} className="w-full" />
                    <IconButton
                        type="button"
                        size="s"
                        disabled={isDisabled}
                        icon={<Trash strokeWidth={1.5} size={16} />}
                        onClick={() => onRemoveValue()}
                    />
                </div>
            )}
        </Draggable>
    )
}

export default EnumeratedTypeValueRow