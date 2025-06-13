import { useEffect, useRef } from 'react'
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd'
import { toast } from 'sonner'
import {
    AlertDescription,
    AlertTitle,
    Alert,
} from '@nuvix/sui/components/alert';
import * as y from 'yup';

import { useEnumeratedTypeCreateMutation } from '@/data/enumerated-types/enumerated-type-create-mutation'
import EnumeratedTypeValueRow from './_row';
import { NATIVE_POSTGRES_TYPES } from './_constants'
import { AlertCircle, ExternalLink, Plus } from 'lucide-react'
import { SidePanel } from '@/ui/SidePanel'
import { Form, InputField, SubmitButton } from '@/components/others/forms'
import { FieldArray, useFormik, Field } from 'formik'
import { useProjectStore } from '@/lib/store';
import { Button } from '@nuvix/ui/components';
import { Label } from '@nuvix/sui/components';

interface CreateEnumeratedTypeSidePanelProps {
    visible: boolean
    onClose: () => void
    schema: string
}

const FormSchema = y.object({
    name: y
        .string()
        .required('Please provide a name for your enumerated type')
        .test('not-native-type', 'Name cannot be a native Postgres data type', (value) =>
            !NATIVE_POSTGRES_TYPES.includes(value)
        ),
    description: y.string().optional(),
    values: y
        .array()
        .of(
            y.object({
                value: y.string().required('Please provide a value')
            })
        )
        .default([]),
})

type FormSchemaType = y.InferType<typeof FormSchema>;

const CreateEnumeratedTypeSidePanel = ({
    visible,
    onClose,
    schema,
}: CreateEnumeratedTypeSidePanelProps) => {
    const initialValues = { name: '', description: '', values: [{ value: '' }] }
    const submitRef = useRef<HTMLButtonElement>(null)
    const { project, sdk } = useProjectStore((s) => s);
    const { mutate: createEnumeratedType, isPending: isCreating } = useEnumeratedTypeCreateMutation({
        onSuccess: (res, vars) => {
            toast.success(`Successfully created type "${vars.name}"`)
            closePanel()
        },
    })

    const onSubmit = (data: y.InferType<typeof FormSchema>) => {
        if (project.$id === undefined) return console.error('Project ref required')

        createEnumeratedType({
            projectRef: project.$id,
            sdk,
            schema,
            name: data.name,
            description: data.description?.replaceAll("'", "''"),
            values: data.values.filter((x) => x.value.length > 0).map((x) => x.value.trim()),
        })
    }

    const { ...form } = useFormik<FormSchemaType>({ initialValues, onSubmit, validationSchema: FormSchema, });

    useEffect(() => {
        form.resetForm(initialValues as any)
    }, [visible])

    const closePanel = () => {
        form.resetForm(initialValues as any)
        onClose()
    }

    return (
        <SidePanel
            loading={isCreating}
            visible={visible}
            onCancel={closePanel}
            header="Create a new enumerated type"
            confirmText="Create type"
            onConfirm={() => {
                if (submitRef.current) submitRef.current.click()
            }}
        >
            <SidePanel.Content className="py-4">
                <Form {...form} className="space-y-4">
                    <InputField name='name' label='Name' required />
                    <InputField name='description' label='Description' labelOptional='Optional' />
                    <FieldArray
                        name="values"
                        render={({ move, push, remove, form }) => {
                            const fields = (form.values.values || []) as { value: string }[];

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
                                            After creation, values cannot be deleted or sorted
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
                                                                field={`values.${index}.value`}
                                                                isDisabled={fields.length < 2}
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
                                            onClick={() => push({ value: '' })}
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
        </SidePanel >
    )
}

export default CreateEnumeratedTypeSidePanel