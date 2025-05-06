import React, { useState, useEffect } from 'react'
import {View, Text, TextInput, Button, FlatList, Pressable, Image, StyleSheet, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createTable, fetchUsers, insertUser, updateUser, deleteUser} from './db'

const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjNEpqL84e_ygvB5wn3CRSfr5G7kMc-iPDEw&s'
const Stack = createStackNavigator()

function UsersScreen({ navigation }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [users, setUsers] = useState([])

    const loadUsers = async () => {
        const all = await fetchUsers()
        setUsers(all || [])
    }

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        loadUsers()

        const unsubscribe = navigation.addListener('focus', () => {
            loadUsers()
        })

        return unsubscribe
    }, [navigation])


    const onAdd = async () => {
        if (!firstName.trim() || !lastName.trim()) return
        await insertUser({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            avatar: DEFAULT_AVATAR
        })


        setFirstName('')
        setLastName('')
        setPhone('')
        loadUsers()
    }


    const onDelete = async (id) => {
        await deleteUser(id)
        loadUsers()
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <Pressable
                style={styles.wrapper}
                onPress={() => navigation.navigate('Details', { user: item })}
            >

                <View style={styles.card}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.text}>
                        <Text style={styles.name}>
                            {item.firstName} {item.lastName}
                        </Text>

                    </View>
                </View>
            </Pressable>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
        </View>
    )








    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <Button title="Add User" onPress={onAdd} />
            <FlatList
                data={users}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                style={{ width: '100%' }}
            />
        </View>
    )
}








function DetailsScreen({ route, navigation }) {
    const { user } = route.params
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [phone, setPhone] = useState(user.phone)

    const onSave = async () => {
        await updateUser(
            {
                firstName,
                lastName,
                phone,
                avatar: user.avatar
            },
            user.id
        )
        navigation.goBack()
    }



    return (
        <View style={[styles.container, styles.details]}>
            <Image source={{ uri: user.avatar }} style={styles.largeAvatar} />
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <Button title="Save" onPress={onSave} />
        </View>
    )
}





export default function App() {
    useEffect(() => {
        createTable()
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator id="root">
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}













const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginVertical: 4,
        borderRadius: 6,
    },
    itemRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    wrapper: {
        flex: 1,
        marginRight: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    text: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    phone: {
        color: '#888',
        fontSize: 14,
    },
    deleteButton: {
        color: 'red',
    },
    details: {
        alignItems: 'center',
        paddingTop: 24,
    },
    largeAvatar: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#bcbcbc',
        marginBottom: 16,
    },
});

