import { employeeModel } from '@/models'

import { useEntityMutation } from './use-entity-mutation'

export const useEmployeeMutation = () => {
  const {
    createItem: createEmployee,
    updateItem: updateEmployee,
    deleteItem: deleteEmployee
  } = useEntityMutation({
    queryKey: ['employees'],
    create: employeeModel.create,
    update: employeeModel.update,
    deleteUniqueById: employeeModel.deleteUniqueById,
    labels: {
      created: 'Funcionário criado com sucesso!',
      createError: 'Erro ao criar funcionário',
      updated: 'Funcionário atualizado com sucesso!',
      updateError: 'Erro ao atualizar funcionário',
      deleted: 'Funcionário excluído com sucesso!',
      deleteError: 'Erro ao excluir funcionário'
    }
  })

  return { createEmployee, updateEmployee, deleteEmployee }
}
