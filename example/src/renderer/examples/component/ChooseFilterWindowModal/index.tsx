import { useState, useImperativeHandle } from 'react'
import { Divider, Modal, Checkbox } from 'antd'

const CheckboxGroup = Checkbox.Group
let resultResolve
let finishCallBack
const ChooseFilterWindowModal = ({ cRef }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [windows, setWindows] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const dismissModal = (result: boolean) => {
    if (resultResolve) {
      resultResolve(result)
    }

    setIsModalVisible(false)
  }

  const showModal = (_windows, _finishCallBack) => {
    setWindows(_windows.map((id) => `${id}`) || [])

    setIsModalVisible(true)
    return new Promise<boolean>((resolve) => {
      finishCallBack = _finishCallBack
      resultResolve = resolve
    })
  }

  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    showModal,
  }))

  const handleOk = () => {
    finishCallBack(checkedList)
    dismissModal(true)
  }

  const handleCancel = () => {
    dismissModal(false)
  }
  const onChange = (list) => {
    setCheckedList(list)
    setIndeterminate(!!list.length && list.length < windows.length)
    setCheckAll(list.length === windows.length)
  }

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? windows : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  return (
    <>
      <Modal
        title='Choose Exclude Window'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <Divider />
        <CheckboxGroup
          options={windows}
          value={checkedList}
          onChange={onChange}
        />
      </Modal>
    </>
  )
}

export default ChooseFilterWindowModal
