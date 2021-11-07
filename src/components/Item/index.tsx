import {Button, List, Pressable} from 'native-base';
import {Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ListType} from '../../screens/Main';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../App';
const SharedPreferences = require('react-native-shared-preferences');

const Item = ({id, listName}: ListType) => {
  const {navigate} = useNavigation();
  const [color, setColor] = useState('light.200');
  const [width, setWidth] = useState('80%');

  useEffect(() => {
    SharedPreferences.getItem('color', (value: string) => {
      if (!value) {
        return;
      }
      setColor(value);
    });

    SharedPreferences.getItem('width', (value: string) => {
      if (!value) {
        return;
      }
      setWidth(value);
    });
  });

  const removeList = async (listName: string) => {
    await db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM lists ' + `WHERE listName LIKE '%${listName}%';`,
        );
      },
      error => console.log('error', error),
      () => console.log('success'),
    );
  };

  return (
    <Pressable
      onPress={() => navigate('List', {id, listName})}
      flexDirection="row"
      justifyContent="space-around">
      <List.Item
        alignSelf="center"
        mt={5}
        bg={color}
        borderRadius="md"
        borderColor="muted.800"
        justifyContent="center"
        width={width}
        _text={{fontSize: '2xl'}}
        px={4}
        py={3}
        my={2}>
        <Text>{listName}</Text>
      </List.Item>
      <Button px={4} py={2} my={2} mt={5} onPress={() => removeList(listName)}>
        -
      </Button>
    </Pressable>
  );
};

export default Item;
