import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  ButtonProps,
  Card,
  CardProps,
  Divider,
  DividerProps,
  Dropdown,
  DropdownProps,
  Image,
  ImageProps,
  Input,
  InputProps,
  List,
  ListProps,
  Menu,
  Slider,
  SliderSingleProps,
  Switch,
  SwitchProps,
} from 'antd';
import { ListItemProps } from 'antd/lib/list';
import React, { useEffect, useState } from 'react';

import css from './public.scss';

export const AgoraView = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  return (
    <>
      <div {...props} />
    </>
  );
};

export const AgoraText = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  return (
    <>
      <div {...props} />
    </>
  );
};

export const AgoraButton = (
  props: Omit<ButtonProps, 'onClick'> & {
    onPress?: React.MouseEventHandler<HTMLElement>;
  }
) => {
  const { title, onPress, ...others } = props;
  return (
    <>
      <Button
        type={'primary'}
        style={{ marginTop: 10, marginBottom: 10 }}
        {...others}
        onClick={onPress}
      >
        {title}
      </Button>
    </>
  );
};

export const AgoraDivider = (props: DividerProps) => {
  return (
    <>
      <Divider {...props} />
    </>
  );
};

export const AgoraTextInput = (
  props: InputProps & {
    numberKeyboard?: boolean;
    editable?: boolean;
    onChangeText?: (text: string) => void;
  }
) => {
  const { value, numberKeyboard, editable, onChangeText, ...others } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <>
      <Input
        style={{ marginTop: 10, marginBottom: 10 }}
        disabled={editable === undefined ? false : !editable}
        type={numberKeyboard ? 'number' : 'text'}
        {...others}
        onChange={({ target: { value: text } }) => {
          setValue(text);
          onChangeText?.call(this, text);
        }}
        value={_value}
      />
    </>
  );
};

export const AgoraSlider = (
  props: Omit<SliderSingleProps, 'min' | 'max' | 'onAfterChange'> & {
    title?: string;
    minimumValue: number;
    maximumValue: number;
    onValueChange?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
  }
) => {
  const {
    value,
    title,
    minimumValue,
    maximumValue,
    onValueChange,
    onSlidingComplete,
    ...others
  } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <>
      <AgoraText children={title} />
      <Slider
        {...others}
        min={minimumValue}
        max={maximumValue}
        value={_value}
        onChange={(v) => {
          setValue(v);
          onValueChange?.call(this, v);
        }}
        onAfterChange={onSlidingComplete}
      />
    </>
  );
};

export const AgoraSwitch = (
  props: Omit<SwitchProps, 'checked'> & {
    title?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  }
) => {
  const { value, title, onValueChange, ...others } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <AgoraView>
      <AgoraText children={title} />
      <Switch
        {...others}
        checked={_value}
        onChange={(checked, event) => {
          setValue(checked);
          onValueChange?.call(this, checked);
        }}
      />
    </AgoraView>
  );
};

export const AgoraImage = (
  props: Omit<ImageProps, 'src'> & { source?: string }
) => {
  const { source, ...others } = props;
  return (
    <>
      <Image {...others} src={source} />
    </>
  );
};

export const AgoraListItem = (props: ListItemProps) => {
  return <List.Item {...props} />;
};

export function AgoraList<T>(
  props: Omit<ListProps<T>, 'dataSource'> & { data: T[] }
) {
  const { data, renderItem, ...others } = props;
  return (
    <List
      style={{ width: '100%' }}
      grid={{ column: 2 }}
      {...others}
      dataSource={data}
      renderItem={(item: T, index: number) => {
        return (
          <AgoraListItem>
            {renderItem ? renderItem(item, index) : undefined}
          </AgoraListItem>
        );
      }}
    />
  );
}

export const AgoraCard = (props: CardProps) => {
  return <Card {...props} />;
};

export interface AgoraDropdownItem {
  label: string;
  value: any;
}

export const AgoraDropdown = (
  props: Omit<DropdownProps, 'overlay' | 'disabled'> & {
    enabled?: boolean;
    title?: string;
    onValueChange?: (value: any, index: number) => void;
    items?: AgoraDropdownItem[];
    value?: any | any[];
  }
) => {
  const { items, value, enabled, title, onValueChange, ...others } = props;

  const [_items, setItems] = useState(items);
  const [_value, setValue] = useState(value);

  useEffect(() => {
    setItems(items);
    setValue(value);
  }, [items, value]);

  return (
    <AgoraView>
      <AgoraText children={title} />
      <Dropdown
        {...others}
        overlayStyle={{ overflow: 'scroll', maxHeight: window.innerHeight }}
        disabled={enabled === undefined ? false : !enabled}
        overlay={
          <Menu
            selectable={true}
            items={_items?.map(({ label, value }) => ({
              label,
              key: value,
            }))}
            selectedKeys={
              _value?.map
                ? _value.map((v) => v.toString())
                : [_value?.toString()]
            }
            onSelect={(info) => {
              let key;
              if (typeof _value === 'number') {
                key = +info.key;
              } else {
                key = info.key;
              }
              const index = _items?.findIndex(({ value }) => {
                return value === key;
              });
              setValue(key);
              props.onValueChange?.call(this, key, index ?? -1);
            }}
            onDeselect={(info) => {
              let key;
              if (typeof _value === 'number') {
                key = +info.key;
              } else {
                key = info.key;
              }
              const index = _items?.findIndex(({ value }) => {
                return value === key;
              });
              setValue(key);
              props.onValueChange?.call(this, key, index ?? -1);
            }}
          />
        }
      >
        <Button>
          {_value?.map
            ? _value
                ?.map(
                  (v) =>
                    _items?.find((item) => {
                      return v === item.value;
                    })?.label
                )
                ?.toString()
            : _items?.find((item) => {
                return _value === item.value;
              })?.label}
          <DownOutlined />
        </Button>
      </Dropdown>
    </AgoraView>
  );
};

export const AgoraStyle = css;
