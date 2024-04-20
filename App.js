import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null); // State to track the currently edited item ID
  const [editedValue, setEditedValue] = useState(''); // State to track the edited value

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('data');
        if (savedData !== null) {
          setData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading data: ', error);
      }
    };
    loadData();
  }, []);

  const addBtn = async () => {
    try {
      const newData = [...data, { id: data.length + 1, first: firstName }];
      setData(newData);
      await AsyncStorage.setItem('data', JSON.stringify(newData));
      setFirstName('');
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      await AsyncStorage.setItem('data', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  const editItem = async (id, newValue) => {
    try {
      const updatedData = data.map(item =>
        item.id === id ? { ...item, first: newValue } : item
      );
      setData(updatedData);
      await AsyncStorage.setItem('data', JSON.stringify(updatedData));
      setEditItemId(null); // Exit edit mode
    } catch (error) {
      console.error('Error editing item: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>ID: {item.id}</Text>
        {editItemId === item.id ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={editedValue}
              onChangeText={text => setEditedValue(text)}
            />
            <Button title='Done' onPress={() => editItem(item.id, editedValue)} />
          </View>
        ) : (
          <Text style={[styles.title, styles.longText]} numberOfLines={2}>
            First Name: {item.first}
          </Text>
        )}
      </View>
      <View>
        <Button title='Delete' onPress={() => deleteItem(item.id)} />
        <Button
          title={editItemId === item.id ? 'Cancel' : 'Edit'}
          onPress={() => {
            if (editItemId === item.id) {
              setEditItemId(null);
            } else {
              setEditItemId(item.id);
              setEditedValue(item.first);
            }
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter first name'
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <Button title='Add' onPress={addBtn} />
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20
  },
  item: {
    width: '90%',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center'
  },
  textContainer: {
    flex: 1, // Occupy remaining space
  },
  title: {
    fontSize: 16,
  },
  longText: {
    width: '100%', // Ensure long text wraps onto the next line
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%', 
  },
});