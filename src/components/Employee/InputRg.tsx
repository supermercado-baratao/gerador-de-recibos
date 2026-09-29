import { TextField, TextFieldProps } from '@mui/material'
import { NumberFormatBase } from 'react-number-format'

import { formatRg, onlyDigits } from './format-rg'

type TInputRgProps = Omit<TextFieldProps, 'type' | 'defaultValue'> & {
  value?: string
}

export const InputRg = ({ ref, ...props }: TInputRgProps) => (
  <NumberFormatBase
    {...props}
    getInputRef={ref}
    format={formatRg}
    removeFormatting={onlyDigits}
    getCaretBoundary={(value) =>
      Array.from({ length: value.length + 1 }, () => true)
    }
    customInput={TextField}
  />
)
