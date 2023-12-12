'use client'

import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiAlertTriangle } from "react-icons/fi";
import { zodResolver } from '@hookform/resolvers/zod';
import { creatIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod'

type IssueForm = z.infer<typeof creatIssueSchema>

const NewIssuePage = () => {

  const router = useRouter()
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(creatIssueSchema)
  })
  const [error, setError] = useState('')

  return (
    <div className='max-w-xl'>
      {error &&
        <Callout.Root color='red' className='mb-5'>
          <Callout.Icon>
            <FiAlertTriangle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      }
      <form
        className='space-y-3'
        onSubmit={handleSubmit(async (data) => {

          try {
            await axios.post('/api/issues', data)
            router.push('/issues')
          } catch (error) {
            setError('An unexpected error occured.')
          }

        })}>

        <TextField.Root>
          <TextField.Input placeholder='Title' {...register('title')} />
        </TextField.Root>
        {errors.title && <Text color='red' as='p'>{errors.title.message}</Text>}

        <Controller
          name='description'
          control={control}
          render={({ field }) => <SimpleMDE placeholder='Put the issue description here' {...field} />}
        />
        {errors.description && <Text color='red' as='p'>{errors.description.message}</Text>}

        <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default NewIssuePage