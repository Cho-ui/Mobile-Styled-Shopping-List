import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Button, Icon, Input, ListItem } from 'react-native-elements';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists items (id integer primary key not null, amount text, name text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into items (amount, name) values (?, ?);', [amount, name]);
    }, null, updateList);
    console.log(shoppingList);
  };

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from items;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from items where id = ?;', [id]);
    }, null, updateList);
  };

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
        <View>
          <ListItem.Content>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '90%'}}>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
              </View>
              <Icon type='material' name='delete' color={'red'} onPress={() => deleteItem(item.id)} />
            </View>
          </ListItem.Content>
        </View>
    </ListItem>
  )

  return (
    <View style={styles.container}>
      <Header centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }} />
      <StatusBar style="auto" />
      <View style={styles.inputContainer}>
        <Input style={styles.input} placeholder='Item' label='ITEM' onChangeText={(name) => setName(name)} value={name} />
        <Input style={styles.input} placeholder='Amount' label='AMOUNT' onChangeText={(amount) => setAmount(amount)} value={amount} />
      </View>
      <View style={styles.button}>
        <Button raised icon={{ name: 'save', color: 'white' }} onPress={saveItem} title="SAVE" />
      </View>
      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    paddingTop: 50,
    width: '90%'
  },
  input: {
    width: 200
  },
  button: {
    marginBottom: 30
  }  
});