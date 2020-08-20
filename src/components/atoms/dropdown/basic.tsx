import React, {useState} from 'react';
import {Text, View, TouchableWithoutFeedback, StyleSheet} from 'react-native';

import {BasicItem} from 'providers/settings';

import {Spacing} from 'components/atoms/spacing';
import {DropdownModal} from './modal';

import {text, colors} from 'theme';
import {AppIcons} from 'assets/icons';

export interface DropdownProps {
  label?: string;
  placeholder: string;
  title?: string;
  items: BasicItem[];
  value: string;
  onValueChange: (value: string) => void;
  search?: {
    placeholder: string;
    term: string;
    onChange: (value: string) => void;
    noResults: string;
  };
  itemRenderer?: (item: BasicItem) => React.ReactNode;
  display?: (item: BasicItem) => string;
  forceDisplay?: () => string;
  instructions?: () => React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
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

  let displayValue = placeholder;
  if (forceDisplay) {
    displayValue = forceDisplay();
  } else if (selectedItem) {
    displayValue = (display && display(selectedItem)) || selectedItem.label;
  }

  return (
    <>
      <TouchableWithoutFeedback
        accessibilityTraits={['button']}
        accessibilityComponentType="button"
        onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <View style={styles.content}>
            {label && (
              <>
                <Text style={[text.default, {color: colors.text}]}>
                  {label}
                </Text>
                <Spacing s={8} />
              </>
            )}
            <Text numberOfLines={1} style={styles.displayValue}>
              {displayValue}
            </Text>
          </View>
          <AppIcons.ArrowRight width={18} height={18} color={colors.purple} />
        </View>
      </TouchableWithoutFeedback>
      {isModalVisible && (
        <DropdownModal
          title={title || placeholder}
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
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  displayValue: {
    ...text.largeBold,
    color: colors.purple
  }
});
