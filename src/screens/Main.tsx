import React, {useEffect, useState} from 'react';
import {Box, Heading, Button, Text, Input, HStack, Fab} from 'native-base';
import {VirtualizedList} from 'react-native';
import {uniqBy} from 'lodash';
import Item from '../components/Item';
import {db} from '../App';
import {useNavigation} from '@react-navigation/native';

export type ListType = {
  id: string | number;
  listName: string;
  product?: string;
  amount?: number;
  price?: number;
  isBought?: boolean;
};

const getItem = (_data: ListType[], index: number): ListType => ({
  id: _data[index]?.id,
  listName: _data[index]?.listName,
});

const getItemCount = (_data: ListType[]) => _data?.length || 0;

const Main = () => {
  const [lists, setLists] = useState<ListType[] | undefined>();
  const [newListName, setListName] = useState<string | undefined>();
  const {navigate} = useNavigation();

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'create table IF NOT EXISTS ' +
          'lists ' +
          '(id integer PRIMARY KEY, listName text, product text, price float, amount int, isBought boolean);',
      );
    });
  };

  const addList = async (listName: string) => {
    await db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lists ' + '(listName) ' + `VALUES ("${listName}");`,
      );
    });
  };

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT id,listName FROM lists', [], (tx, resultSet) => {
        const len = resultSet.rows.length;
        const result = [];

        if (!len) {
          return;
        }

        for (let i = 0; i < len; i++) {
          result.push(resultSet.rows.item(i));
        }

        setLists(result);
      });
    });
  };

  useEffect(() => {
    createTable();
  }, []);

  useEffect(() => {
    getData();
  });

  return (
    <Box flex={1} justifyContent="center">
      <Heading alignSelf="center" mt={30} fontSize={20} fontWeight="bold" p={4}>
        Listonic Clone
      </Heading>
      <HStack space={2}>
        <Input
          ml={2}
          width="70%"
          onChangeText={v => setListName(v)}
          value={newListName}
          placeholder="List Name"
        />
        <Button
          onPress={async () => {
            if (!newListName) return;
            await addList(newListName);
            setListName(undefined);
          }}>
          Create List
        </Button>
      </HStack>

      <VirtualizedList
        data={uniqBy(lists, 'listName')}
        renderItem={({item}: {item: ListType}) => <Item {...item} />}
        getItemCount={getItemCount}
        getItem={getItem}
      />
      <Fab
        position="absolute"
        size="sm"
        onPress={() => navigate('Settings')}
        icon={<Text>Settings</Text>}
      />
    </Box>
  );
};

export default Main;
