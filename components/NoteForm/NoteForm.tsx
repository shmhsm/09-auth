'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { CreateNotePayload } from '../../types/note';
import css from './NoteForm.module.css';

const MyCustomError = ({ children }: { children?: React.ReactNode }) => (
  <div className={css.errorText}>{children}</div>
);

interface NoteFormProps {
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be less than 500 characters')
    .optional(),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']) 
    .required('Tag is required'),
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
            <label htmlFor="title">Title</label>
            <Field name="title" id="title" placeholder="Enter title" />
            <ErrorMessage name="title" component={MyCustomError} />
          </div>

          <div className={css.fieldWrapper}>
            <label htmlFor="content">Content</label>
            <Field 
              name="content" 
              id="content" 
              as="textarea" 
              placeholder="Enter content (optional)" 
            />
            <ErrorMessage name="content" component={MyCustomError} />
          </div>

          <div className={css.fieldWrapper}>
            <label htmlFor="tag">Category</label>
            <Field name="tag" id="tag" as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component={MyCustomError} />
          </div>

          <div className={css.actions}>
            <button 
                type="button" 
                className={css.cancelBtn} 
                onClick={onCancel}
            >
              Cancel
            </button>
            <button 
                type="submit" 
                className={css.submitBtn} 
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}