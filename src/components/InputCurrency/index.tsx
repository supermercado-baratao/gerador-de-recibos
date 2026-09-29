import { Lock, LockOpen } from '@mui/icons-material'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps
} from '@mui/material'
import { useId } from 'react'
import { NumericFormat } from 'react-number-format'

export type TInputCurrencyProps = Omit<
  OutlinedInputProps,
  'defaultValue' | 'type'
> & {
  isLocked?: boolean
  handleLockClick?: () => void
}

export const InputCurrency = (props: TInputCurrencyProps) => {
  const { value, isLocked, handleLockClick, ...rest } = props
  const generatedId = useId()
  const id = rest.id ?? generatedId

  return (
    <FormControl fullWidth className="InputCurrency">
      <InputLabel htmlFor={id}>{rest.label}</InputLabel>
      <NumericFormat
        {...rest}
        id={id}
        value={Number(value) || 0}
        customInput={OutlinedInput}
        prefix="R$ "
        thousandSeparator="."
        decimalSeparator=","
        fixedDecimalScale
        decimalScale={2}
        endAdornment={
          isLocked !== undefined && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleLockClick}
                edge="end"
                aria-label={isLocked ? 'Destravar valor' : 'Travar valor'}
              >
                {!isLocked ? <LockOpen /> : <Lock />}
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </FormControl>
  )
}
