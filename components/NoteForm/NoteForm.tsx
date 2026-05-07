'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { CreateNotePayload } from '../../types/note';
import css from './NoteForm.module.css';

const MyCustomError = ({ children }: { children?: React.ReactNode }) => (
  <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
    {children}
  </span>
);

interface NoteFormProps {
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  content: Yup.string()
    .max(500, 'Maximum 500 characters')
    .optional(),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
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
      initialValues={{ 
        title: '', 
        content: '', 
        tag: 'Todo' as const
      }}
      validationSchema={NoteSchema}
      onSubmit={(values: CreateNotePayload) => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.fieldWrapper}>
            <Field name="title" placeholder="Title" />
            <ErrorMessage name="title" component={MyCustomError} />
          </div>

          <div className={css.fieldWrapper}>
            <Field name="content" as="textarea" placeholder="Content (optional)" />
            <ErrorMessage name="content" component={MyCustomError} />
          </div>

          <div className={css.fieldWrapper}>
            <Field name="tag" as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component={MyCustomError} />
          </div>

          <div className={css.actions}>
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}