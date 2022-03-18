import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { DefaultUserType, useChatContext } from "stream-chat-expo";
import UserListItem from "../components/UserListItem";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const UserList = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState<DefaultUserType[]>([]);
  const { userId } = useAuthContext();
  const navigation = useNavigation();

  const fetchUsers = async () => {
    const response = await client.queryUsers({});
    console.log(response);
    setUsers(response.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createChannel = async (user) => {
    const channel = client.channel("messaging", {
      members: [userId, user.id],
    });
    await channel.create();

    navigation.navigate("ChannelScreen", { channel });
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserListItem user={item} onPress={createChannel} />
      )}
    />
  );
};

export default UserList;
