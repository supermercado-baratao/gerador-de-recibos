import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { companyDefaultValues, companySchema } from '@/components'
import { useAppStore } from '@/stores'
import { omitMetadata } from '@/utils'

export const useFormHandler = () => {
  const { company, updateCompany } = useAppStore()

  const methods = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: company ? omitMetadata(company) : companyDefaultValues
  })

  const onSubmit = methods.handleSubmit((data) => {
    updateCompany(data, {
      onSuccess: (company) => methods.reset(omitMetadata(company))
    })
  })

  return { methods, onSubmit }
}
