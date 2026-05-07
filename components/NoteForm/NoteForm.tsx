'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { CreateNotePayload } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  content: Yup.string().required('Required'),
  tag: Yup.string().oneOf(['work', 'personal', 'important']).required('Required'),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'personal' as const }}
      validationSchema={NoteSchema}
      onSubmit={(values: CreateNotePayload) => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <Field name="title" placeholder="Title" />
          <ErrorMessage name="title" component="div" />
          
          <Field name="content" as="textarea" placeholder="Content" />
          <ErrorMessage name="content" component="div" />

          <Field name="tag" as="select">
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="important">Important</option>
          </Field>

          <div className={css.actions}>
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" disabled={isSubmitting}>Create note</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}