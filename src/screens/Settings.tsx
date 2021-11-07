import React, {useEffect, useState} from 'react';
import {Box, HStack, Select, Text, VStack, Center} from 'native-base';
const SharedPreferences = require('react-native-shared-preferences');

const Settings = () => {
  const [color, setColor] = useState<string>('');
  const [width, setWidth] = useState<string>('');

  useEffect(() => {
    SharedPreferences.getItem('color', (value: string) => {
      if (!value) return;
      setColor(value);
    });

    SharedPreferences.getItem('width', (value: string) => {
      if (!value) return;
      setWidth(value);
    });
  }, []);

  return (
    <Box flex={1} justifyContent="flex-start" mt={10}>
      <VStack space={4}>
        <Center>
          <HStack space={2} direction="column" width="70%">
            <Text>Choose list color</Text>
            <Select
              selectedValue={color}
              minWidth="200"
              accessibilityLabel="Choose Color"
              placeholder="Choose Color"
              _selectedItem={{
                bg: 'teal.600',
              }}
              mt={1}
              onValueChange={itemValue => {
                SharedPreferences.setItem('color', itemValue);
                setColor(itemValue);
              }}>
              <Select.Item label="Default" value="light.200" />
              <Select.Item label="Blue" value="primary.400" />
              <Select.Item label="Pink" value="secondary.400" />
              <Select.Item label="Green" value="tertiary.400" />
            </Select>
            <Box mt={10} />
            <Text>List Width</Text>
            <Select
              selectedValue={width}
              minWidth="200"
              accessibilityLabel="Choose Width"
              placeholder="Choose Width"
              _selectedItem={{
                bg: 'teal.600',
              }}
              mt={1}
              onValueChange={itemValue => {
                SharedPreferences.setItem('width', itemValue);
                setWidth(itemValue);
              }}>
              <Select.Item label="Default" value="80%" />
              <Select.Item label="Extra Small" value="50%" />
              <Select.Item label="Small" value="60%" />
              <Select.Item label="Medium" value="70%" />
            </Select>
          </HStack>
        </Center>
      </VStack>
    </Box>
  );
};
export default Settings;
