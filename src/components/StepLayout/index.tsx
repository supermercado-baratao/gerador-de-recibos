import { Box, Button, Step, StepButton, Stepper } from '@mui/material'
import { FormEvent, ReactNode } from 'react'

import * as GS from '@/styles'

import * as S from './styles'

const STEPS = ['Funcionário', 'Recibo']

type TStepLayoutProps = {
  activeStep: number
  children: ReactNode
  setStep(step: number): void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export const StepLayout = ({
  activeStep,
  children,
  setStep,
  handleSubmit
}: TStepLayoutProps) => {
  const isLastStep = activeStep === STEPS.length - 1

  return (
    <Box sx={GS.Page}>
      <Stepper activeStep={activeStep} sx={S.Stepper}>
        {STEPS.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => setStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit} noValidate>
        {children}
        <Box sx={S.ButtonGroup}>
          <Button
            onClick={() => setStep(activeStep - 1)}
            disabled={activeStep === 0}
          >
            Voltar
          </Button>
          <Button type="submit">
            {isLastStep ? 'Gerar Recibo' : 'Próximo'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
