import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface LanguageSelectProps {
  /** 是否允许自动检测 */
  allowAuto?: boolean
  defaultValue?: string
  onValueChange?: (value: string) => void
}
export function LanguageSelect({
  defaultValue,
  onValueChange,
  allowAuto = false,
}: LanguageSelectProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger className={'w-[180px]'}>
          <SelectValue placeholder='Select a verified email to display' />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {allowAuto && <SelectItem value='auto'>自动检测</SelectItem>}
        <SelectItem value='en'>英语</SelectItem>
        <SelectItem value='zh-CHS'>简体中文</SelectItem>
        <SelectItem value='ar'>阿拉伯语</SelectItem>
        <SelectItem value='de'>德语</SelectItem>
        <SelectItem value='es'>西班牙语</SelectItem>
        <SelectItem value='fr'>法语</SelectItem>
        <SelectItem value='hi'>印地语</SelectItem>
        <SelectItem value='id'>印度尼西亚语</SelectItem>
        <SelectItem value='ru'>俄语</SelectItem>
        <SelectItem value='it'>意大利语</SelectItem>
        <SelectItem value='ja'>日语</SelectItem>
        <SelectItem value='ko'>韩语</SelectItem>
        <SelectItem value='nl'>荷兰语</SelectItem>
        <SelectItem value='pt'>葡萄牙语</SelectItem>
        <SelectItem value='th'>泰语</SelectItem>
        <SelectItem value='vi'>越南语</SelectItem>
        <SelectItem value='zh-CHT'>繁体中文</SelectItem>
      </SelectContent>
    </Select>
  )
}
