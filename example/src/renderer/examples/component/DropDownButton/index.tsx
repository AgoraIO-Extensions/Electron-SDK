import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Popover } from 'antd';

interface OptionProps {
  dropId: string | number | any;
  dropText: string;
}

interface DropDownButtonProps {
  onPress?: (res: OptionProps) => void;
  options?: OptionProps[];
  defaultIndex?: number;
  title?: string;
  PopContent?: (dropId: any) => React.ReactNode;
  PopContentTitle?: string;
}

const DropDownButton = ({
  onPress = () => {},
  options = [],
  defaultIndex = 0,
  title = '',
  PopContent = undefined,
  PopContentTitle = '',
}: DropDownButtonProps) => {
  const [selectIndex, setSelectIndex] = useState(defaultIndex);

  const warpOnPress = ({ key }) => {
    const value = options[key];
    if (value) {
      setSelectIndex(key);
      console.log(
        `DropDownButton title:   ${title} \nclick:                  ${value.dropText}\nvalue:`,
        value
      );
      onPress(value);
    }
  };
  const { dropText: currentText } = options[selectIndex] || {};
  useEffect(() => {
    warpOnPress({ key: selectIndex });
  }, [options.length]);
  return (
    <div>
      {title && (
        <p style={{ color: 'black', display: 'block', marginBottom: 0 }}>
          {`${title}: `}
        </p>
      )}
      <Dropdown
        overlay={
          <Menu onClick={warpOnPress}>
            {options.map(({ dropId, dropText }, index) => (
              <Menu.Item key={index}>
                {PopContent ? (
                  <Popover
                    placement="left"
                    content={() => PopContent(dropId)}
                    title={PopContentTitle}
                  >
                    <div>{dropText}</div>
                  </Popover>
                ) : (
                  dropText
                )}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button>
          {currentText} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default DropDownButton;
