import { useState } from 'react'

import { Slider, InputNumber, Row, Col } from 'antd'

interface SliderBarProps {
  title?: string
  min?: number
  max?: number
  value?: number
  step?: number
  onChange?: (value: number) => void
}

const SliderBar = ({
  title = '',
  min = 0,
  max = 100,
  value = Number.parseInt(`${(min + max) / 2}`),
  step = 1,
  onChange = () => {},
}: SliderBarProps) => {
  const [inputValue, setInputValue] = useState(value)

  const wrapOnChange = (value) => {
    console.log(title, value)

    setInputValue(value)
    onChange(value)
  }

  return (
    <>
      <Row>
        <Col span={24}>{title}</Col>
      </Row>
      <Row>
        <Col span={12}>
          <Slider
            min={min}
            max={max}
            onChange={wrapOnChange}
            value={typeof inputValue === 'number' ? inputValue : 0}
            step={step}
          />
        </Col>
        <Col span={6}>
          <InputNumber
            min={min}
            max={max}
            style={{ margin: '0 0 0 16px', width: '100%' }}
            step={step}
            value={inputValue}
            onChange={wrapOnChange}
          />
        </Col>
      </Row>
    </>
  )
}
export default SliderBar
