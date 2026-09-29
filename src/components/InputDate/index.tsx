import 'dayjs/locale/pt-br'

import { FormControl } from '@mui/material'
import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

dayjs.locale('pt-br')

type TInputDateProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
  value: string
  onChange: (value: Dayjs) => void
}

export const InputDate = ({ value, onChange, ...rest }: TInputDateProps) => (
  <FormControl fullWidth>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DatePicker
        {...rest}
        value={dayjs(value)}
        onChange={(date) => {
          if (date?.isValid()) onChange(date)
        }}
      />
    </LocalizationProvider>
  </FormControl>
)
