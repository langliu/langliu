import CodeBlock from './CodeBlock'
import ConsCard from './ConsCard'
import HighlightText from './HighlightText'
import ProsCard from './ProsCard'
import Step from './Step'
import StepCheck from './StepCheck'
import TOC from './TOC'
import Image from 'next/image'

const mdxComponents = {
  pre: CodeBlock,
  img: Image,
  ProsCard,
  ConsCard,
  Step,
  StepCheck,
  TOC,
  HighlightText,
}

export default mdxComponents
