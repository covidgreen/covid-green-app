import React, {useState} from 'react';
import {Text, View, TouchableWithoutFeedback, StyleSheet} from 'react-native';

import {AppIcons} from 'assets/icons';
import {BasicItem} from 'providers/settings';
import {DropdownModal} from './modal';
import {text, scale} from 'theme';

export interface DropdownProps {
  label?: string;
  modalPlaceholder: string;
  title?: string;
  items: BasicItem[];
  value: string;
  onValueChange: (value: string) => void;
  search?: {
    placeholder: string;
    term: string;
    onChange: (value: string) => void;
    noResults: string;
    accessibilityLabel?: (selectedItem?: string) => string;
  };
  itemRenderer?: (item: BasicItem) => React.ReactNode;
  display?: (item: BasicItem) => string;
  forceDisplay?: () => string;
  instructions?: () => React.ReactNode;
}

export const SelectorDropdown: React.FC<DropdownProps> = ({
  modalPlaceholder,
  title,
  items,
  value,
  onValueChange,
  search,
  itemRenderer,
  display,
  forceDisplay,
  instructions
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const onItemSelected = (newValue: string) => {
    setModalVisible(false);
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const selectedItem = (value && items.find((i) => i.value === value)) || null;

  let displayValue = modalPlaceholder;
  if (forceDisplay) {
    displayValue = forceDisplay();
  } else if (selectedItem) {
    displayValue = (display && display(selectedItem)) || selectedItem.label;
  }

  return (
    <>
      <TouchableWithoutFeedback
        accessibilityRole="button"
        accessibilityLabel={
          search && search.accessibilityLabel
            ? selectedItem
              ? search.accessibilityLabel(selectedItem.label)
              : search.accessibilityLabel(displayValue)
            : displayValue
        }
        onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text numberOfLines={1} style={text.defaultBold}>
              {displayValue}
            </Text>
          </View>
          <AppIcons.Filter width={24} height={24} />
        </View>
      </TouchableWithoutFeedback>
      {isModalVisible && (
        <DropdownModal
          close
          title={title || modalPlaceholder}
          items={items}
          selectedValue={value}
          onSelect={onItemSelected}
          onClose={() => setModalVisible(false)}
          search={search}
          itemRenderer={itemRenderer}
          instructions={instructions}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(48),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ded8e3',
    borderStyle: 'solid',
    backgroundColor: '#f3f3f8',
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 16
  },
  content: {
    flex: 1
  }
});
