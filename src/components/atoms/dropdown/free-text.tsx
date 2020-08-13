import React, {FC, useState, useEffect} from 'react';
import {TextInput} from 'react-native';

import {BasicItem} from 'providers/settings';

import {Spacing} from 'components/atoms/layout';
import {Dropdown, DropdownProps} from 'components/atoms/dropdown';

import {inputStyle} from 'theme';

interface FreeTextDropdownProps
  extends Omit<DropdownProps, 'value' | 'onValueChange'> {
  value: [string, string];
  onValueChange: (value: [string, string]) => void;
}

const freeTextInputStyle = inputStyle();

export const FreeTextDropdown: FC<FreeTextDropdownProps> = ({
  items,
  value,
  onValueChange,
  ...dropdownProps
}) => {
  const [selectedItem, setSelectedItem] = useState<BasicItem>();

  const onDropdownValueChange = (selectedValue: string) => {
    if (selectedValue !== value[0]) {
      onValueChange([selectedValue, '']);
    }
  };

  useEffect(() => {
    const ddItem = items.find((i) => i.value === value[0]);
    setSelectedItem(ddItem);
  }, [items, value]);

  return (
    <>
      <Dropdown
        items={items}
        value={value[0]}
        onValueChange={onDropdownValueChange}
        {...dropdownProps}
      />
      {selectedItem && selectedItem.freeText && (
        <>
          <Spacing s={12} />
          <TextInput
            style={freeTextInputStyle}
            returnKeyType="done"
            onChangeText={(text) => onValueChange([selectedItem.value, text])}
            value={value[1]}
          />
        </>
      )}
    </>
  );
};
