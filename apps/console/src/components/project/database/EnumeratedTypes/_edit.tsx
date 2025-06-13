import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
    AlertDescription,
    AlertTitle,
    Alert,
} from '@nuvix/sui/components/alert';
import * as y from 'yup';


import { useEnumeratedTypeUpdateMutation } from '@/data/enumerated-types/enumerated-type-update-mutation'
import type { EnumeratedType } from '@/data/enumerated-types/enumerated-types-query'
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd'
import EnumeratedTypeValueRow from './_row'
import { AlertCircle, ExternalLink, Plus } from 'lucide-react'
import { useProjectStore } from '@/lib/store';
import { FieldArray, useFormik } from 'formik';
import { SidePanel } from '@/ui/SidePanel';
import { Form, InputField, SubmitButton } from '@/components/others/forms';
import { Button } from '@nuvix/ui/components';
import { Label } from '@nuvix/sui/components';

interface EditEnumeratedTypeSidePanelProps {
    visible: boolean
    selectedEnumeratedType?: EnumeratedType
    onClose: () => void
}

const FormSchema = y.object({
    name: y
        .string()
        .required('Please provide a name for your enumerated type')
        .default(''),
    description: y.string().optional(),
    values: y
        .array()
        .of(
            y.object({
                isNew: y.boolean().required(),
                originalValue: y.string().required(),
                updatedValue: y.string().required('Please provide a value')
            })
        )
        .default([]),
})

type FormSchemaType = y.InferType<typeof FormSchema>;

const EditEnumeratedTypeSidePanel = ({
    visible,
    selectedEnumeratedType,
    onClose,
}: EditEnumeratedTypeSidePanelProps) => {
    const submitRef = useRef<HTMLButtonElement>(null)
    const { project, sdk } = useProjectStore((s) => s);
    const { mutate: updateEnumeratedType, isPending: isCreating } = useEnumeratedTypeUpdateMutation({
        onSuccess: (_, vars) => {
            toast.success(`Successfully updated type "${vars.name.updated}"`)
            onClose()
        },
    })

    const onSubmit = (data: FormSchemaType) => {
        if (project?.$id === undefined) return console.error('Project ref required')
        if (selectedEnumeratedType === undefined)
            return console.error('selectedEnumeratedType required')

        const payload: {
            schema: string
            name: { original: string; updated: string }
            values: { original: string; updated: string; isNew: boolean }[]
            description?: string
        } = {
            schema: selectedEnumeratedType.schema,
            name: { original: selectedEnumeratedType.name, updated: data.name },
            values: data.values
                .filter((x) => x.updatedValue.length !== 0)
                .map((x) => ({
                    original: x.originalValue,
                    updated: x.updatedValue.trim(),
                    isNew: x.isNew,
                })),
            ...(data.description !== selectedEnumeratedType.comment
                ? { description: data.description?.replaceAll("'", "''") }
                : {}),
        }

        updateEnumeratedType({
            projectRef: project.$id,
            sdk,
            ...payload,
        })
    }

    const form = useFormik<FormSchemaType>({ onSubmit, validationSchema: FormSchema, initialValues: { name: '', description: '', values: [] } })

    const originalEnumeratedTypes = (selectedEnumeratedType?.enums ?? []).map((x: any) => ({
        isNew: false,
        originalValue: x,
        updatedValue: x,
    }))

    useEffect(() => {
        if (selectedEnumeratedType !== undefined) {
            form.resetForm({
                name: selectedEnumeratedType.name,
                description: selectedEnumeratedType.comment ?? '',
                values: originalEnumeratedTypes,
            } as any)
        }

        if (selectedEnumeratedType == undefined) {
            form.resetForm({
                values: originalEnumeratedTypes,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEnumeratedType])

    return (
        <SidePanel
            loading={isCreating}
            visible={visible}
            onCancel={onClose}
            header={`Update type "${selectedEnumeratedType?.name}"`}
            confirmText="Update type"
            onConfirm={() => {
                if (submitRef.current) submitRef.current.click()
            }}
        >
            <SidePanel.Content className="py-4">
                <Form {...form} className="space-y-4" >
                    <InputField name='name' label='Name' required />
                    <InputField name='description' label='Description' labelOptional='Optional' />

                    <FieldArray
                        name="values"
                        render={({ move, push, remove, form }) => {
                            const fields = (form.values.values || []) as FormSchemaType['values'];

                            const updateOrder = (result: any) => {
                                // Dropped outside of the list
                                if (!result.destination) return
                                if (result.source.index === result.destination.index) return;
                                move(result.source.index, result.destination.index);
                            }

                            return (
                                <>
                                    <Label>
                                        Values
                                    </Label>
                                    <Alert>
                                        <AlertCircle strokeWidth={1.5} />
                                        <AlertTitle>
                                            Existing values cannot be deleted or sorted
                                        </AlertTitle>
                                        <AlertDescription>
                                            <p className="!leading-normal track">
                                                You will need to delete and recreate the enumerated type with
                                                the updated values instead.
                                            </p>
                                            <Button
                                                asChild
                                                type="button"
                                                size='s'
                                                prefixIcon={<ExternalLink strokeWidth={1.5} />}
                                                className="mt-2"
                                                href="https://www.postgresql.org/message-id/21012.1459434338%40sss.pgh.pa.us"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Learn more
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                    <Form {...form}>
                                        <DragDropContext onDragEnd={(result: any) => updateOrder(result)}>
                                            <Droppable droppableId="enum_type_values_droppable">
                                                {(droppableProvided: DroppableProvided) => (
                                                    <div ref={droppableProvided.innerRef}>
                                                        {fields.map((field, index) => (
                                                            <EnumeratedTypeValueRow
                                                                index={index}
                                                                id={index.toString()}
                                                                field={`values.${index}.updatedValue`}
                                                                isDisabled={!field.isNew}
                                                                onRemoveValue={() => remove(index)}
                                                            />
                                                        ))}
                                                        {droppableProvided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>

                                        <Button
                                            type="button"
                                            size='s'
                                            variant="secondary"
                                            prefixIcon={<Plus strokeWidth={1.5} />}
                                            onClick={() => push({ isNew: true, originalValue: '', updatedValue: '' })}
                                        >
                                            Add value
                                        </Button>

                                    </Form>
                                </>
                            )
                        }}
                    />
                    <SubmitButton ref={submitRef} size={'s'} className="!hidden">
                        Update
                    </SubmitButton>
                </Form>
            </SidePanel.Content>
        </SidePanel>
    )
}

export default EditEnumeratedTypeSidePanel